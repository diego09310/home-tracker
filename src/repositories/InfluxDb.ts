import logger from "../utils/logger";
import { Db } from "./Db";

export class InfluxDb implements Db {
    async save(name: string[], value: number[] | string[], ts?: number) {
        logger.error("Not implemented");
    }
}
