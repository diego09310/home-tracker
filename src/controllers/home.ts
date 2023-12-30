import * as core from "express-serve-static-core";
import { Request, Response } from "express";
import { getTemperature } from "../services/dht";

export const register = (router: core.Router) => {
    router.get("/temp", temp);
};

const temp = async (req: Request, res: Response) => {
    const sensorData = await getTemperature();
    res.json({
        "temperature": sensorData.temperature,
        "humidity": sensorData.humidity,
    });
};
