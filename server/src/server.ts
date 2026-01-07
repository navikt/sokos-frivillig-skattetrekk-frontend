import path from "node:path";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import expressStaticGzip from "express-static-gzip";
import { logger } from "./logger";
import { proxyRoutes } from "./proxy";

const BASE_PATH = "/utbetalinger/frivillig-skattetrekk";
const BUILD_PATH = path.resolve(__dirname, "../dist");
const PORT = process.env.PORT || 8080;
const SOKOS_FRIVILLIG_SKATTETREKK_BACKEND = process.env.SKATTETREKK_BACKEND_URL;

const server = express();

server.use(BASE_PATH, express.static(BUILD_PATH, { index: false }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(
	BASE_PATH,
	expressStaticGzip(BUILD_PATH, {
		enableBrotli: true,
		orderPreference: ["br"],
	}),
);

// AsyncHandler - wraps async functions and catches errors automatically
function asyncHandler(
	fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

// Using asyncHandler - no more try/catch needed!
server.get(
	`${BASE_PATH}/api/skattetrekk`,
	asyncHandler(async (req: Request, res: Response) => {
		await proxyRoutes(
			req,
			res,
			`${SOKOS_FRIVILLIG_SKATTETREKK_BACKEND}/api/skattetrekk`,
		);
	}),
);

server.post(
	`${BASE_PATH}/api/skattetrekk`,
	asyncHandler(async (req: Request, res: Response) => {
		await proxyRoutes(
			req,
			res,
			`${SOKOS_FRIVILLIG_SKATTETREKK_BACKEND}/api/skattetrekk`,
		);
	}),
);

server.get(`${BASE_PATH}/internal/isAlive`, (_req: Request, res: Response) => {
	res.sendStatus(200);
});

server.get(`${BASE_PATH}/internal/isReady`, (_req: Request, res: Response) => {
	res.sendStatus(200);
});

// Global error handler
server.use((err: Error, _req: Request, res: Response) => {
	logger.error({ err }, "Request error occurred");

	res.status(500).json({
		message: err.message,
		// Only include stack trace in development
		...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
	});
});

server.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));
