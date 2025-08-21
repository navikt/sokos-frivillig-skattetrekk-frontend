import dotenv from "dotenv";
import express from "express";
import expressStaticGzip from "express-static-gzip";
import path from "path";
import { fileURLToPath } from "url";
import tokenx from "./tokenx.js";

const basePath = "/utbetaling/skattetrekk";

const app = express();

const PORT = process.env.PORT || 8080;

dotenv.config();

let client = await tokenx.client();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.resolve(__dirname, "../dist");
app.use(basePath, express.static(buildPath, { index: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(basePath + "/api/skattetrekk", async (req, res) => {
  const newHeaders = await updateHeaders(req.headers);

  const response = await fetch(
    process.env.SKATTETREKK_BACKEND_URL + "/api/skattetrekk",
    {
      method: req.method,
      headers: newHeaders,
    }
  ).catch((err) => {
    console.log(err);
    console.log(err.message);
    res.status(500).send({
      message: err.message,
    });
  });

  const body = await response.json();

  const statuskode = response.status;
  res.status(statuskode).send(body);
});

app.post(basePath + "/api/skattetrekk", async (req, res) => {
  const newHeaders = await updateHeaders(req.headers);

  const response = await fetch(
    process.env.SKATTETREKK_BACKEND_URL + "/api/skattetrekk",
    {
      method: req.method,
      headers: newHeaders,
      body: JSON.stringify(req.body),
    }
  ).catch((err) => {
    console.log(err);
    console.log(err.message);
    res.status(500).send({
      message: err.message,
    });
  });

  const statuskode = response.status;
  res.status(statuskode).send();
});

async function updateHeaders(requestHeaders) {
  const idToken = requestHeaders["authorization"].replace("Bearer", "").trim();
  let accessToken = await getTokenValue(idToken);
  let newHeaders = requestHeaders;
  newHeaders["authorization"] = "Bearer " + accessToken; // Override authorization header with new token
  return newHeaders;
}

async function getTokenValue(idToken) {
  return await tokenx.getTokenExchangeAccessToken(
    client,
    idToken,
    process.env.SKATTETREKK_BACKEND_AUDIENCE
  );
}

app.get(`${basePath}/internal/isAlive`, (_req, res) => {
  res.sendStatus(200);
});

app.get(`${basePath}/internal/isReady`, (_req, res) => {
  res.sendStatus(200);
});

server.use(
  basePath,
  expressStaticGzip(buildPath, {
    enableBrotli: true,
    orderPreference: ["br"],
  })
);

app.listen(PORT, () => console.log("Server started"));
