import * as core from "express-serve-static-core";
import { NextFunction, Request, Response } from "express";
import { save } from "../services/database";
import { isNumeric } from "../utils/utils";
import logger from "../utils/logger";

export const register = (router: core.Router) => {
    router.post("/api/sensor", postSensor);
};

/**
 * @route POST /api/sensor
 */
const postSensor = async (req: Request, res: Response, next: NextFunction) => {
    if (!isNumeric(req.body.temp) || !isNumeric(req.body.humidity)) {
        logger.warn(`Invalid sensor data: temp: ${req.body.temp}, humidity: ${req.body.humidity}, ts: ${req.body.ts}`);
        res.status(422);
        res.json({"error": "Invalid data"});
        return;
    }
    try {
        await save([`${req.body.name}.temp`, `${req.body.name}.humidity`], [req.body.temp, req.body.humidity], req.body.ts);
        res.json({result: "success"});
    } catch (err) {
        next(err);
    }
};
