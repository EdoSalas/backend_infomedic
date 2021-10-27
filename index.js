//Imports
import config from './src/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

//Routes
import regions from './src/routes/regions.routes';
import users from "./src/routes/users.routes";

//Settings
const app = express();
app.set('port', process.env.port || config.BACKEND_PORT);

//Middlewares
app.use(morgan('dev'));
app.use(cors());

//Routers
const port = app.get('port');
app.listen(port);
app.use('/api/regions', regions);
app.use('/api/users', users);

//Init
console.log("Server listen on port ", port);
app.get('/', (req, res) => {
    res.json({
        message: "Backend is Ready!",
        description: `Listening in port: ${port}`
    });
});