import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import * as reports from "../controller/reports.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/diseasesForUser', jsonParser, async (req, res) => {
    try {
        const { user, initDate, finalDate } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Possible diseases of the user",
                await reports.diseasesForUser(user, initDate, finalDate)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/diseasesForUser')"
            )
        );
    }
});

router.post('/diseasesForRegion', jsonParser, async (req, res) => {
    try {
        const { region, initDate, finalDate } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Possible diseases of the region",
                await reports.diseasesForRegion(region, initDate, finalDate)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/diseasesForRegion')"
            )
        );
    }
});

router.post('/symptomsForDisease', jsonParser, async (req, res) => {
    try {
        const { disease } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Symptoms for Disease",
                await reports.symptomsForDisease(disease)
            )
        ); 
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/symptomsForDisease')"
            )
        );
    }
});

router.post('/diseaseForSymptoms', jsonParser, async (req, res) => {
    try {
        const { symptom } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Diseases for Symptom",
                await reports.diseaseForSymptoms(symptom)
            )
        ); 
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/diseaseForSymptoms')"
            )
        );
    }
});

export default router;