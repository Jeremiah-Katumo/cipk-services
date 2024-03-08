import express from 'express';
import { readdirSync } from 'fs';
import cookieParser from 'cookie-parser';
import env from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './server/db/db.js';

env.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Dynamic route setup
const routePath = './server/routes';

const server = () => {
    // db connection
    db();
    app.listen(port, () => {
        console.log(`Express is listening on: http://localhost:${port}` +
            '\n' + 'Press Ctrl + C to terminate');
    }).on('error', (err) => {
        console.log(err);
    });
};

const loadRoutes = async () => {
    const files = readdirSync(routePath);

    for (const file of files) {
        try {
            const module = await import(`${routePath}/${file}`);
            app.use('/api/v1', module.default);
        } catch (error) {
            console.error(`Error loading route from file ${file}:`, error);
        }
    }

    // Start the server after all routes have been loaded
    server();
};

// mongoose connection, if needed, should be placed here

// Start loading routes
loadRoutes();
