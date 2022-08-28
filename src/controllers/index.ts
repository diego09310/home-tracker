import * as core from "express-serve-static-core";

import * as homeController from "./home";

export const register = (router: core.Router) => {
    homeController.register(router);
};
