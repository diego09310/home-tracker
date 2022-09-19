import axios from "axios";
import logger from "../util/logger";
import * as util from "util";
import { Db } from "./Db";

const TICKTOCK_URL = process.env.TICKTOCK_URL + "/api/put";
const HOST = process.env.HOST;

axios.interceptors.request.use(request => {
    logger.debug(`Request: ${JSON.stringify(request, null, 2)}`);
    return request;
});

axios.interceptors.response.use(response => {
    logger.debug(`Response: ${util.inspect(response)}`);
    return response;
});

export class Ticktock implements Db {
    async save(name: string[], value: number[] | string[], ts?: number) {
        ts = ts ?? Date.now();
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
            console.log(`Fake writing to ${TICKTOCK_URL} - ${JSON.stringify(data, null, 2)}`);
            return;
        }
        
        axios.post(TICKTOCK_URL, data)
            .catch((error) => {
                logger.error("Error saving data to ticktock: ", error.message);
            });
    }
}
