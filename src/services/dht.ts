import { isPi } from "../utils/detect-rpi";
import dht from "node-dht-sensor";
import logger from "../utils/logger";
import { delay } from "../utils/delay";

const MAX_TRIES = 3;
const DELAY_MS = 2000;
const DEFAULT_SENSOR_TYPE = 22;
const DEFAULT_SENSOR_PIN = 4;

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

export async function getTemperature(
        model: dht.SensorType = DEFAULT_SENSOR_TYPE, 
        pin: number = DEFAULT_SENSOR_PIN): Promise<DhtData> {
    const res = await getSensorData(model, pin);
    if (res === undefined) {
        return undefined;
    }
    return { 
        temperature: res.temperature,
        humidity: res.humidity,
    };
}

async function getSensorData(model: dht.SensorType, pin: number): Promise<DhtData> {
    let tries = 0;
    let data = undefined;
    while (data === undefined && tries < MAX_TRIES) {
        const delay_ms = tries === 0 ? 0 : DELAY_MS;
        await delay(delay_ms);
        tries++;
        try {
            data = await sensor.read(model, pin);
        } catch(e) {
            logger.error(`Error reading sensor data - ${tries}`);
        }
    }
    return data;
}
