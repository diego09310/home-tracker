import * as core from "express-serve-static-core";
import { Request, Response } from "express";
import * as dht from "../services/dht";

export const register = (router: core.Router) => {
    router.get("/", index);
    router.get("/temp", temp);
};

/**
 * Home page.
 * @route GET /
 */
const index = (req: Request, res: Response) => {
    res.json({"page": "Home"});
};

const temp = async (req: Request, res: Response) => {
    await dht.getTemperature();
    res.json({"status": "Done"});
};