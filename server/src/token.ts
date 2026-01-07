import { getToken, requestOboToken, validateToken } from "@navikt/oasis";
import type { Request } from "express";
import { logger } from "./logger";

async function getRequiredToken(req: Request): Promise<string> {
	if (process.env.NODE_ENV !== "production") {
		return "mock-token";
	}

	const initialToken = getToken(req);
	if (!initialToken) {
		logger.error("Missing wonderwall cookie");
		throw new Error("Missing wonderwall cookie");
	}

	const tokenValidationResult = await validateToken(initialToken);
	if (!tokenValidationResult.ok) {
		logger.error(
			{ error: tokenValidationResult.error },
			"Token validation failed",
		);
		throw new Error(`Token validation failed: ${tokenValidationResult.error}`);
	}

	const backendAudience = process.env.SKATTETREKK_BACKEND_AUDIENCE;
	if (!backendAudience) {
		logger.error("Missing SKATTETREKK_BACKEND_AUDIENCE environment variable");
		throw new Error(
			"Missing SKATTETREKK_BACKEND_AUDIENCE environment variable",
		);
	}

	const oboTokenResult = await requestOboToken(initialToken, backendAudience);
	if (!oboTokenResult.ok) {
		logger.error({ error: oboTokenResult.error }, "Token exchange failed");
		throw new Error(`Token exchange failed: ${oboTokenResult.error}`);
	}

	return oboTokenResult.token;
}

export async function getOboToken(req: Request): Promise<string> {
	if (!req.headers.authorization) {
		logger.error("Authorization header is missing");
		throw new Error("Authorization header is missing");
	}

	return await getRequiredToken(req);
}
