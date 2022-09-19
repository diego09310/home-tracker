import { InfluxDb } from "./InfluxDb";
import { Ticktock } from "./Ticktock";

export interface Db {
    save(name: string[], value: number[] | string[], ts?: number): Promise<void>;
}

export const dbs = new Map([
    ["ticktock", new Ticktock()],
    ["influxdb", new InfluxDb()]
]);
