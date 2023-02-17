const logger = {
    info: console.log,
    error: console.log
}

export class APILogger {
    info(message: string, data?) {
        logger.info(`${message} ${data != undefined ? JSON.stringify(data) : ''}`);
    }

    error(message: string) {
        logger.error(message);
    }
}
