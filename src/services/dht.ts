import { isPi } from "../util/detect-rpi";
import dht from "node-dht-sensor";
import logger from "../util/logger";
import { delay } from "../util/delay";

const MAX_TRIES = 3;
const DELAY_MS = 2000;

export type DhtData = {
    temperature: number,
    humidity: number,
}

const sensor = dht.promises;

if (!isPi()) {
    sensor.initialize({
        test: {
            fake: {
                temperature: 21,
                humidity: 60,
            }
        }
    });
}

export async function getTemperature(model: dht.SensorType, pin: number): Promise<DhtData> {
    try {
        const res = await getSensorData(model, pin);
        if (res === undefined) {
            return undefined;
        }
        return { 
            temperature: res.temperature,
            humidity: res.humidity,
        };
    } catch (err) {
        logger.error("Failed to read sensor data:", err); // TODO: If fails, what to return?
    }
}

async function getSensorData(model: dht.SensorType, pin: number): Promise<DhtData> {
    let tries = 0;
    let data = undefined;
    while (data === undefined && tries < MAX_TRIES) {
        const delay_ms = tries === 0 ? 0 : DELAY_MS;
        await delay(delay_ms);
        tries++;
        data = sensor.read(model, pin);
    }
    return data;
}
