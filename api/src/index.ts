import * as path from 'path';
import * as dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: path.resolve(__dirname, `..${path.sep}..${path.sep}.env`) });
const app = express();

app.all('/', (req, res) => {
    // TODO: Implement validation that a request is coming from the website.
    res.statusCode = 200;
    return res.send('200 OK');
});

app.listen(process.env.API_PORT, () => {
  console.log(`API service listening at http://localhost:${process.env.API_PORT}`);
});
