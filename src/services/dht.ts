import { isPi } from "../util/detect-rpi";
import dht from "node-dht-sensor";

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
                humidity: 60
            }
        }
    });
}

export async function getTemperature (model: dht.SensorType, pin: number): Promise<DhtData> {
    try {
        const res = await sensor.read(model, pin);
        return { 
            temperature: res.temperature,
            humidity: res.humidity,
        };
    } catch (err) {
        console.error("Failed to read sensor data:", err); // TODO: If fails, what to return?
    }
}

