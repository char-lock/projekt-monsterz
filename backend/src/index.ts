import ApiLogger from "./shared/logger";
import { config } from "./shared/config";
import app from "./app";

const fileLogger = new ApiLogger("index");

if (config.enableHttp) {
  fileLogger.debug("starting http server ...");
  app.listen(config.httpPort, () => {
    fileLogger.debug(`started http server on port ${config.httpPort}`);
  });
} else {
  fileLogger.debug("http disabled - skipped");
}
