import dht from "node-dht-sensor";

const sensor = dht.promises;

// sensor.initialize(22, 17);

export const getTemperature = async () => {
    try {
        const res = await sensor.read(22, 4);
        console.log(
            `temp: ${res.temperature.toFixed(1)}°C, ` +
            `humidity: ${res.humidity.toFixed(1)}%`
        );
        } catch (err) {
            console.error("Failed to read sensor data:", err);
        }
};
