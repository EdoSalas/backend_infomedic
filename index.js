//Imports
import config from './src/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

//Routes
import regions from './src/routes/regions.routes';
import users from "./src/routes/users.routes";
import medicalRecomendations from "./src/routes/medicalRecomendations.routes";
import symptoms from "./src/routes/symptoms.routes";
import provinces from "./src/routes/provinces.routes";
import cantons from "./src/routes/cantons.routes";
import diseases from "./src/routes/diseases.routes";
import riskFactor from "./src/routes/riskFactors.routes";
import riskFactorForUser from "./src/routes/riskFactorsForUser.routes";
import riskFactorForDisease from "./src/routes/riskFactorsForDisease.routes";
import symptomsForUser from "./src/routes/symptomsForUser.routes";
import symptomsForDisease from "./src/routes/symptomsForDisease.routes";
import reports from "./src/routes/reports.routes";

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
app.use('/api/medical', medicalRecomendations);
app.use('/api/symptoms', symptoms);
app.use('/api/provinces', provinces);
app.use('/api/cantons', cantons);
app.use('/api/diseases', diseases);
app.use('/api/riskFactor', riskFactor);
app.use('/api/riskFactorForUser', riskFactorForUser);
app.use('/api/riskFactorForDisease', riskFactorForDisease);
app.use('/api/symptomsForUser', symptomsForUser);
app.use('/api/symptomsForDisease', symptomsForDisease);
app.use('/api/reports', reports);

//Init
console.log("Server listen on port ", port);
app.get('/', (req, res) => {
    res.json({
        message: "Backend is Ready!",
        description: `Listening in port: ${port}`
    });
});