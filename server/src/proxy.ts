import { Request, Response } from "express";
import { getOboToken } from "./token";

export async function proxyRoutes(req: Request, res: Response, proxyUrl: string) {
  const oboToken = await getOboToken(req);
  const response = await fetch(proxyUrl, {
    method: req.method,
    headers: {
      'Authorization': `Bearer ${oboToken}`,
      'Content-Type': 'application/json',
    },
    ...(req.method === 'POST' && { body: JSON.stringify(req.body) }),
  });

  const responseData = await response.text();
  res.status(response.status);

  if (responseData) {
    res.send(responseData);
  } else {
    res.end();
  }
}