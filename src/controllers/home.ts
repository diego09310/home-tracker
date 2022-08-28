import * as core from "express-serve-static-core";
import { Request, Response } from "express";

export const register = (router: core.Router) => {
    router.get("/", index);
};

/**
 * Home page.
 * @route GET /
 */
const index = (req: Request, res: Response) => {
    res.json({"page": "Home"});
};
