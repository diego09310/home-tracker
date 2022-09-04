import axios from "axios";
import logger from "../util/logger";
import * as util from "util";

const TICKTOCK_URL = process.env.TICKTOCK_URL + "/api/put";

axios.interceptors.request.use(request => {
    logger.debug(`Starting Request: ${JSON.stringify(request, null, 2)}`);
    return request;
});

axios.interceptors.response.use(response => {
    logger.debug(`Response: ${util.inspect(response)}`);
    return response;
});

export async function save(name: string[], value: number[] | string[], ts?: number) {
    ts = ts ?? Date.now();
    const data = [];
    for (let i = 0; i < name.length; i++) {
        data.push({
            "metric": name[i],
            "value": value[i],
            "timestamp": ts,
            "tags": {
                "host": "ben",
            },
        });
    }

    axios.post(TICKTOCK_URL, data)
        .catch((error) => {
            logger.error("Error saving data to ticktock: ", error.message);
        });
}
