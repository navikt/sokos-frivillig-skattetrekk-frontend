import { Request, Response } from "express";
import { logger } from "./logger";
import { getOboToken } from "./token";

export async function proxyRoutes(
  req: Request,
  res: Response,
  proxyUrl: string,
) {
  const oboToken = await getOboToken(req);
  logger.info(
    {
      method: req.method,
      url: proxyUrl,
      proxyFrom: req.originalUrl,
      proxyTo: proxyUrl,
    },
    "Reverse Proxy HTTP Request",
  );

  const response = await fetch(proxyUrl, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${oboToken}`,
      "Content-Type": "application/json",
    },
    ...(req.method === "POST" && { body: JSON.stringify(req.body) }),
  });

  logger.info(
    {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
    },
    "Reverse Proxy HTTP Response",
  );

  const responseData = await response.text();
  res.status(response.status);

  if (responseData) {
    res.send(responseData);
  } else {
    res.end();
  }
}
