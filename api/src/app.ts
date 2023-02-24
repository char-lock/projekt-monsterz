import * as https from 'https';               // Provides interfacing using HTTPS.
import * as fs from 'fs';                     // Allows access to the local filesystem.
import * as path from 'path';                 // Provides resources for system-agnostic file referencing.
import * as dotenv from 'dotenv';             // Allows access to configuration via the parent .env file.
import express from 'express';                // Provides methods for responding to HTTP endpoint requests.
import * as bodyParser from 'body-parser';    // Provides middleware parsers for Express, including JSON.
import helmet from 'helmet';                  // Provides header security middleware for Express.
import cors from 'cors';                      // Enables cross-origin requests.

import { parseBoolean } from './common/config.parser';
import ApiLogger from './common/logger';
import routes from './routes';

// Load the .env file into memory.
dotenv.config({ path: path.resolve(__dirname, `..${path.sep}..${path.sep}.env`)});

try {
  // Create a new instance of an Express application.
  const app = express();
  // Initialise external middlewares as part of the application.
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());
  // Use the routes provided by the root routes.ts file.
  app.use('/', routes);
  // Launch application to listen on the configured port.
  if (parseBoolean(process.env.API_ENABLE_HTTP)) {
    ApiLogger.info('Starting API server using HTTP ...');
    app.listen(process.env.API_PORT_HTTP, () => {
      ApiLogger.success(`API server (HTTP) for Projekt Monsterz started and listening on port ${process.env.API_PORT_HTTP}`);
    });
  }
  if (!parseBoolean(process.env.API_DISABLE_HTTPS)) {
    const httpsKeyLoc = path.resolve(__dirname, 
      `..${path.sep}..${path.sep}certs${path.sep}api${path.sep}key.pem`);
    const httpsCertLoc = path.resolve(__dirname,
      `..${path.sep}..${path.sep}certs${path.sep}api${path.sep}cert.pem`);
    ApiLogger.info('Starting API server using HTTPS ...');
    https.createServer({ 
      key: fs.readFileSync(httpsKeyLoc),
      cert: fs.readFileSync(httpsCertLoc)
    }, app).listen(process.env.API_PORT_HTTPS, () => {
      ApiLogger.success(`API server (HTTPS) for Projekt Monsterz started and listening on port ${process.env.API_PORT_HTTPS}`);
    });
  }
} catch (error) {
  ApiLogger.error(`Unable to launch API server; exitting ...\n${error}`);
}
