import dotenv from "dotenv";
import express, { Request, Response } from "express";
import expressStaticGzip from "express-static-gzip";
import path from "path";
import { fileURLToPath } from "url";
import { IncomingHttpHeaders } from "http";
import tokenx from "./tokenx.js";

const basePath = "/utbetalinger/frivillig-skattetrekk";

const app = express();

const PORT = process.env.PORT || 8080;

dotenv.config();

const client = await tokenx.client();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.resolve(__dirname, "../");
app.use(basePath, express.static(buildPath, { index: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(/^\/utbetaling\/skattetrekk(.*)$/, (req: Request, res: Response) => {
  const newPath = req.originalUrl.replace(
    "/utbetaling/skattetrekk",
    "/utbetalinger/frivillig-skattetrekk"
  );
  res.redirect(301, newPath);
});

app.get(basePath + "/api/skattetrekk", async (req: Request, res: Response) => {
  try {
    const newHeaders = await updateHeaders(req.headers);
    const response = await fetch(
      process.env.SKATTETREKK_BACKEND_URL + "/api/skattetrekk",
      {
        method: req.method,
        headers: newHeaders,
      }
    );

    const body = await response.json();
    const statuskode = response.status;
    res.status(statuskode).send(body);
  } catch (err: unknown) {
    const error = err as Error;
    console.log(error);
    console.log(error.message);
    res.status(500).send({
      message: error.message,
    });
  }
});

app.post(basePath + "/api/skattetrekk", async (req: Request, res: Response) => {
  try {
    const newHeaders = await updateHeaders(req.headers);

    const response = await fetch(
      process.env.SKATTETREKK_BACKEND_URL + "/api/skattetrekk",
      {
        method: req.method,
        headers: newHeaders,
        body: JSON.stringify(req.body),
      }
    );

    const statuskode = response.status;
    res.status(statuskode).send();
  } catch (err: unknown) {
    const error = err as Error;
    console.log(error);
    console.log(error.message);
    res.status(500).send({
      message: error.message,
    });
  }
});

async function updateHeaders(
  requestHeaders: IncomingHttpHeaders
): Promise<Record<string, string>> {
  if (!requestHeaders.authorization) {
    throw new Error("Authorization header is missing");
  }

  const idToken = requestHeaders.authorization.replace("Bearer", "").trim();
  const accessToken = await getTokenValue(idToken);

  const newHeaders: Record<string, string> = {};
  Object.entries(requestHeaders).forEach(([key, value]) => {
    if (typeof value === "string") {
      newHeaders[key] = value;
    } else if (Array.isArray(value)) {
      newHeaders[key] = value.join(", ");
    }
  });

  newHeaders["authorization"] = "Bearer " + accessToken; // Override authorization header with new token
  return newHeaders;
}

async function getTokenValue(idToken: string): Promise<string> {
  return await tokenx.getTokenExchangeAccessToken(
    client,
    idToken,
    process.env.SKATTETREKK_BACKEND_AUDIENCE!
  );
}

app.get(`${basePath}/internal/isAlive`, (_req: Request, res: Response) => {
  res.sendStatus(200);
});

app.get(`${basePath}/internal/isReady`, (_req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use(
  basePath,
  expressStaticGzip(buildPath, {
    enableBrotli: true,
    orderPreference: ["br"],
  })
);

app.listen(PORT, () => console.log("Server started"));
