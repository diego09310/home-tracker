import { InfluxDB, Point, WriteApi } from "@influxdata/influxdb-client";
import { Db } from "./Db";
import logger from "../utils/logger";

const HOST = process.env.HOST;
const S_TO_NS = 1e9;

export class InfluxDbClient implements Db {

    private static _instance: InfluxDbClient;
    
    private influxDB: InfluxDB;

    private constructor() {
        this.influxDB = new InfluxDB({ url: process.env.INFLUXDB_URL, token: process.env.INFLUXDB_TOKEN });
    }

    public static getInstance(): InfluxDbClient {
        return this._instance ?? (this._instance = new this());
    }

    private getWriteApi(): WriteApi {
        return this.influxDB.getWriteApi(process.env.INFLUXDB_ORGANIZATION, process.env.INFLUXDB_BUCKET);
    }

    async save(name: string[], value: number[] | string[], ts?: number) {
        let point = new Point("sensor")
                .tag("host", HOST);
        for (let i = 0; i < name.length; i++) {
            point = point.floatField(name[i], value[i]);
        }

        if (ts) {
            point = point.timestamp(ts * S_TO_NS);
        }

        if (process.env.WRITE_TO_DB !== "true") {
            logger.debug(`Fake writing to ${process.env.INFLUXDB_URL} - ${JSON.stringify(point, null, 2)}`);
            return;
        }

        const writeApi = this.getWriteApi();
        writeApi.writePoint(point);
        try {
            await writeApi.close();
        } catch (err) {
            throw new Error(`InfluxDB error: ${err.message}`);
        }
    }
}
