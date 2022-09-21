import yaml from "js-yaml";
import fs from "fs";
import schedule from "node-schedule";
import { Schedule } from "types";
import { getTemperature } from "./dht";
import logger from "../utils/logger";
import { save } from "./database";

const MS_TO_S = 1/1000;

export function scheduleJobs() {
    const schedules = yaml.load(fs.readFileSync("schedules.yml", "utf-8")) as Schedule[];
    scheduleDht(schedules); // Invert?, go through it and call corresponding filter?
}

// TODO: Rename?
function scheduleDht(schedules: Schedule[]) {
    schedules.filter(sch => sch.attributes.model === "dht") // TODO: improve
            .forEach(sch => schedule.scheduleJob(`*/${sch.period} * * * * *`, async (fireDate: Date) => {
                const data = await getTemperature(sch.attributes.version, sch.attributes.pin);
                if (data === undefined) {
                    logger.warn("Couldn't get data from DHT sensor");
                    return;
                }
                save([`${sch.id}.temp`, `${sch.id}.humidity`], 
                                [data.temperature, data.humidity], 
                                fireDate.valueOf()*MS_TO_S);
            }));
}

