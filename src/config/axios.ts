import axios from "axios";
import logger from "../utils/logger";
import * as util from "util";

axios.interceptors.request.use(request => {
    logger.debug(`Request: ${JSON.stringify(request, null, 2)}`);
    return request;
});

axios.interceptors.response.use(response => {
    logger.debug(`Response: ${util.inspect(response)}`);
    return response;
});
