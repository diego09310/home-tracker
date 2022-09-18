import * as core from "express-serve-static-core";

import * as homeController from "./home";
import * as sensor from "./sensor";

export const register = (router: core.Router) => {
    homeController.register(router);
    sensor.register(router);
};
