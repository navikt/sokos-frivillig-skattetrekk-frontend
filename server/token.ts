import { getToken, requestOboToken, validateToken } from '@navikt/oasis';
import { Request } from "express";
import { IncomingHttpHeaders } from 'http';

async function getRequiredToken(req: Request): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      resolve('mock-token')
    }

    const token = getToken(req)
    if (!token) {
      return reject('Missing wonderwall cookie')
    }
    const validatedToken = await validateToken(token)
    if (!validatedToken.ok) {
      return reject(`Validation failed: ${validatedToken.error}`)
    }

    const audience = process.env.SKATTETREKK_BACKEND_AUDIENCE;
    if (!audience) {
      return reject('Missing SKATTETREKK_BACKEND_AUDIENCE environment variable')
    }

    const oboToken = await requestOboToken(token, audience)

    if (!oboToken.ok) {
      return reject(`Token exchange failed: ${oboToken.error}`)
    }

    resolve(oboToken.token)
  })
}

export async function getOboToken(
  req: Request
): Promise<IncomingHttpHeaders> {
  if (!req.headers.authorization) {
    throw new Error("Authorization header is missing");
  }

  const oboToken = getRequiredToken(req);

  let newHeaders = req.headers;
  newHeaders["authorization"] = "Bearer " + oboToken;

  return newHeaders;
}