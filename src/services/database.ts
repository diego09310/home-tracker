import { dbs } from "../repositories/Db";

const TSDB = process.env.TSDB;

export async function save(name: string[], value: number[] | string[], ts?: number) {
    dbs.get(TSDB).save(name, value, ts);
}
