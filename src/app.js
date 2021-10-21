//Imports
import config from './config';
import express from 'express';
import regions from './routes/regions.routes';
import morgan from 'morgan';

//Settings
const app = express();
app.set('port', process.env.port || config.BACKEND_PORT);

//Middlewares
app.use(morgan('dev'));

//Routers
const port = app.get('port');
app.listen(port);
app.use('/api/regions', regions);

//Init
console.log("Server listen on port ", port);
app.get('/', (req, res) => {
    console.log("Hola");
    res.json({
        message: "Welcome!",
        description: `Listening in port: ${port}`
    });
});