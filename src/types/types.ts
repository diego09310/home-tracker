import { SensorType } from "node-dht-sensor";

export type Schedule = {
    name: string,
    id: string,
    type: string,
    attributes: {
        model: string, // TODO: Review
        version: SensorType,
        pin: number,
    },
    period: number,
}
