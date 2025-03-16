import { save } from "../services/database";
import { isNumeric } from "../utils/utils";
import logger from "../utils/logger";
import mqtt from "mqtt";

const BROKER = process.env.MQTT_BROKER;
const TOPIC = process.env.MQTT_TOPIC;
const USERNAME = process.env.MQTT_USERNAME;
const PASSWORD = process.env.MQTT_PASSWORD;

const client = mqtt.connect(BROKER, {
    username: USERNAME,
    password: PASSWORD,
});

logger.info("Initializing MQTT");

client.on("connect", () => {
    client.subscribe(TOPIC, (err) => {
        if (!err) {
            logger.info(`Subscribed to topic "${TOPIC}" in ${BROKER}`);
        } else {
            logger.error(`Error trying to subscribe to topic "${TOPIC}" in ${BROKER}`);
        }
    });
});

client.on("message", async (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        logger.debug(`MQTT message from topic ${topic}: temp: ${data.temp}, humidity: ${data.humidity}, ts: ${data.ts}`);
        if (!isNumeric(data.temp) || !isNumeric(data.humidity)) {
            logger.warn(`Invalid sensor data: temp: ${data.temp}, humidity: ${data.humidity}, ts: ${data.ts}`);
            return;
        }
        await save([`${data.name}.temp`, `${data.name}.humidity`], [data.temp, data.humidity], data.ts);
    } catch (err) {
        logger.error(err);
    }
});

