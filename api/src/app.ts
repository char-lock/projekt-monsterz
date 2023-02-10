import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ "body": "200 OK" });
});

app.listen(process.env.API_PORT || 8080, () => {
    return console.log(`Express is listening at http://localhost:${process.env.API_PORT || 8080}`);
});
