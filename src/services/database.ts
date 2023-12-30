import { dbs } from "../repositories/Db";

const TSDB = process.env.TSDB;

/**
 * Saves the data to the configured database.
 *
 * @param {String[]} name - Array of point ids
 * @param {Number[]|String[]} value - Array of point values
 * @param {Number=} ts - Timestamp of points in seconds
 *
 */
export async function save(name: string[], value: number[] | string[], ts?: number) {
    await dbs.get(TSDB).save(name, value, ts);
}
