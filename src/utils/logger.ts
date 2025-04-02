import winston, {format} from 'winston';

const { splat, combine, timestamp, json, printf } = format;

const NODE_ENV = process.env.NODE_ENV;

const yellow = '\x1b[33m';
const red = '\x1b[31m';
const resetColor = '\x1b[0m';

const colors = new Map([
    ['warn', yellow],
    ['error', red],
]);

const defaultLevel = new Map([
    ['local', 'debug'],
    ['development', 'info'],
    ['prod', 'error'],
]);

const consoleFormat = printf( ({ level, message, timestamp }) => {
    const color = NODE_ENV === 'local' && colors.has(level) ? colors.get(level) : '';
    return `${color}[${timestamp}] ${level.toUpperCase()}: ${message}${color ? resetColor : ''}`;
});

const level = process.env.LOG_LEVEL ?? defaultLevel.get(NODE_ENV) ?? 'debug';
const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            level,
            format: combine(
                splat(),
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                consoleFormat,
            ),
        }),
        new winston.transports.File({
            filename: 'debug.log',
            level,
            format: combine(
                splat(),
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                json(),
            ),
        }),
    ],
};

const logger = winston.createLogger(options);

logger.debug('Logging initialized at %s level', logger.level);

export default logger;
