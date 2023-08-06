import axios from "axios";
import logger from "../utils/logger";
import { Db } from "./Db";

const MS_TO_S = 1/1000;

const TICKTOCK_URL = process.env.TICKTOCK_URL + "/api/put";
const HOST = process.env.HOST;

export class Ticktock implements Db {
    private static _instance: Ticktock;

    private constructor() {}

    public static getInstance(): Ticktock {
        return this._instance || (this._instance = new this());
    }

    async save(name: string[], value: number[] | string[], ts?: number) {
        ts = (ts ?? Date.now()) * MS_TO_S;
        const data = [];
        for (let i = 0; i < name.length; i++) {
            data.push({
                "metric": name[i],
                "value": value[i],
                "timestamp": ts,
                "tags": {
                    "host": HOST,
                },
            });
        }
        
        if (process.env.WRITE_TO_DB !== "true") {
            logger.debug(`Fake writing to ${TICKTOCK_URL} - ${JSON.stringify(data, null, 2)}`);
            return;
        }
        
        axios.post(TICKTOCK_URL, data)
            .catch((error) => {
                logger.error("Error saving data to ticktock: ", error.message);
            });
    }

}
