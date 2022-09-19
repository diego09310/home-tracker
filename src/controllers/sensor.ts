import * as core from "express-serve-static-core";
import { Request, Response } from "express";
import { save } from "../services/database";

export const register = (router: core.Router) => {
    router.post("/api/sensor", postSensor);
};

/**
 * @route POST /api/sensor
 */
const postSensor = (req: Request, res: Response) => {
    save([`${req.body.name}.temp`, `${req.body.name}.humidity`], [req.body.temp, req.body.humidity]);
    res.json({"result": "success?"});
};
