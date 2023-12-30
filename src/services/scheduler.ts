import yaml from "js-yaml";
import fs from "fs";
import schedule from "node-schedule";
import { Schedule } from "types";
import { getTemperature } from "./dht";
import logger from "../utils/logger";
import { save } from "./database";

const MS_TO_S = 1 / 1000;

export function scheduleJobs() {
    const schedules = yaml.load(fs.readFileSync("schedules.yml", "utf-8")) as Schedule[];
    schedules?.forEach(sch => {
        switch (sch.type) {
            case 'sensor':
                if (sch.attributes.model === 'dht') {
                    schedule.scheduleJob(`*/${sch.period} * * * * *`, async (fireDate: Date) => processDht(sch, fireDate));
                    break;
                }
            default:
                logger.warn(`Unknown schedule type: ${sch.type}`);
        }
    });
}

async function processDht(sch: Schedule, fireDate: Date) {
    const data = await getTemperature(sch.attributes.version, sch.attributes.pin);
    if (data === undefined) {
        logger.warn("Couldn't get data from DHT sensor");
        return;
    }
    try {
        await save([`${sch.id}.temp`, `${sch.id}.humidity`], 
            [data.temperature, data.humidity], 
            Math.floor(fireDate.valueOf() * MS_TO_S));
    } catch (err) {
        logger.error(err.message);
    }
}
