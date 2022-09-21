import winston, {format} from "winston";

const { splat, combine, timestamp, json, printf } = format;

const yellow = "\x1b[33m";
const red = "\x1b[31m";
const resetColor = "\x1b[0m";

const colors = new Map([
    ["warn", yellow],
    ["error", red],
]);

const nonLocalEnvs = ["development", "production"];

const consoleFormat = printf( ({ level, message, timestamp }) => {
    const color = colors.has(level) ? colors.get(level) : "";
    return `${color}[${timestamp}] ${level.toUpperCase()}: ${message}${resetColor}`;
});

const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            level: nonLocalEnvs.includes(process.env.NODE_ENV) ? "error" : "debug",
            format: combine(
                splat(),
                timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                consoleFormat,
            ),
        }),
        new winston.transports.File({
            filename: "debug.log",
            level: "info",
            format: combine(
                splat(),
                timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                json(),
            ),
        }),
    ],
};

const logger = winston.createLogger(options);

logger.debug("Logging initialized at %s level", logger.level);

export default logger;
