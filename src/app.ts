import "./config";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import lusca from "lusca";
import * as controller from "./controllers";
import { scheduleJobs } from "./services/scheduler";

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

scheduleJobs();

export default app;
