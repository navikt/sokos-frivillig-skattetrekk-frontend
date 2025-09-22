import express, { Request, Response } from "express";
import expressStaticGzip from "express-static-gzip";
import path from "path";
import { getOboToken } from "./token";

const basePath = "/utbetalinger/frivillig-skattetrekk";
const buildPath = path.resolve(__dirname, "../dist");
const server = express();

server.use(basePath, express.static(buildPath, { index: false }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(
  basePath,
  expressStaticGzip(buildPath, {
    enableBrotli: true,
    orderPreference: ["br"],
  })
);

server.get(/^\/utbetaling\/skattetrekk(.*)$/, (req: Request, res: Response) => {
  const newPath = req.originalUrl.replace(
    "/utbetaling/skattetrekk",
    "/utbetalinger/frivillig-skattetrekk"
  );
  res.redirect(301, newPath);
});

server.get(basePath + "/api/skattetrekk", async (req: Request, res: Response) => {
  try {
    const oboToken = await getOboToken(req);
    const response = await fetch(
      process.env.SKATTETREKK_BACKEND_URL + "/api/skattetrekk",
      {
        method: req.method,
        headers: {
          'Authorization': 'Bearer ' + oboToken,
          'Content-Type': 'application/json',
        }
      }
    );
    res.status(response.status).send(response.body);
  } catch (err: unknown) {
    const error = err as Error;
    console.log(error);
    console.log(error.message);
    res.status(500).send({
      message: error.message,
    });
  }
});

server.post(basePath + "/api/skattetrekk", async (req: Request, res: Response) => {
  try {
    const oboToken = await getOboToken(req);
    const response = await fetch(
      process.env.SKATTETREKK_BACKEND_URL + "/api/skattetrekk",
      {
        method: req.method,
        headers: {
          'Authorization': 'Bearer ' + oboToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );

    res.status(response.status).send();
  } catch (err: unknown) {
    const error = err as Error;
    console.log(error);
    console.log(error.message);
    res.status(500).send({
      message: error.message,
    });
  }
});

server.get(`${basePath}/internal/isAlive`, (_req: Request, res: Response) => {
  res.sendStatus(200);
});

server.get(`${basePath}/internal/isReady`, (_req: Request, res: Response) => {
  res.sendStatus(200);
});

server.listen(8080, () => console.log("Server listening on port 8080"));
