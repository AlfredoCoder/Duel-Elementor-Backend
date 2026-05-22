import express, { type Express } from "express";
import type { Request, Response } from "express";
import cors from "cors";
import * as pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

const pino = (pinoHttp as unknown as any).default ?? (pinoHttp as any);

app.use(
  pino({
    logger,
    serializers: {
      req(req: Request & { id?: string }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: Response) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
