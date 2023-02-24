/** Provides a pre-formatted selection of methods for logging to the console. */
class ApiLogger {

  /** Prints a formatted log message to the console. */
  static logWithColour = (msg: string, colourCode: string, msgType: string) => {
    const date = new Date(Date.now());
    const datestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const timestamp = `${datestamp} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    console.log(`${colourCode}[${timestamp} / ${msgType}]: ${msg}\x1b[0m`);
  };

  /**
   * Prints an informational log message to the console.
   * Enabled/disabled via the .env file.
   * 
   **/
  static info = (msg: string) => {
    if (!process.env.API_DEBUG || !process.env.API_LOGGER) return;
    ApiLogger.logWithColour(msg, '\x1b[37m', 'INFO');
  };

  /** Prints a warning log message to the console. */
  static warn = (msg: string) => {
    if (!process.env.API_LOGGER) return;
    ApiLogger.logWithColour(msg, '\x1b[33m', 'WARNING');
  };

  /** Prints an error log message to the console. */
  static error = (msg: string) => {
    if (!process.env.API_LOGGER) return;
    ApiLogger.logWithColour(msg, '\x1b[31m', 'ERROR');
  };

  /** Prints an error log message to the console. */
  static success = (msg: string) => {
    if (!process.env.API_LOGGER) return;
    ApiLogger.logWithColour(msg, '\x1b[32m', 'SUCCESS');
  };

}

export default ApiLogger;
