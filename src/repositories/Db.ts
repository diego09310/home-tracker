import { InfluxDbClient } from "./InfluxDbClient";
import { Ticktock } from "./Ticktock";

export interface Db {
    save(name: string[], value: number[] | string[], ts?: number): Promise<void>;
}

export const dbs = new Map([
    ["ticktock", Ticktock.getInstance()],
    ["influxdb", InfluxDbClient.getInstance()]
]);
