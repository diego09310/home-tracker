import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.error("No .env file, please create it.");
    process.exit(1);
}
export const ENVIRONMENT = process.env.NODE_ENV;

export const SESSION_SECRET = process.env["SESSION_SECRET"];

if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}
