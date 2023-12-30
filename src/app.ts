import "./config";
import express, { Request, Response, NextFunction } from "express";
import compression from "compression";
import bodyParser from "body-parser";
import lusca from "lusca";
import * as controller from "./controllers";
import { scheduleJobs } from "./services/scheduler";
import logger from "./utils/logger";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

const router = express.Router();
controller.register(router);
app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${err.message}`);
    res.status(500).json({status: "Error"});
});

scheduleJobs();

export default app;
