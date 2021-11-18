import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import * as reports from "../controller/reports.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/diseasesForUser', jsonParser, async (req, res) => {
    try {
        const { user } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Possible diseases of the user",
                await reports.diseasesForUser(user)
            )
        );
    } catch (error) {
        if (error instanceof ResponseError) {
            return res.status(400).json(Object.assign(error));
        }
        if (error instanceof Error) {
            return res.status(400).json(Object.assign(error));
        }
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
        if (error instanceof ResponseError) {
            return res.status(400).json(Object.assign(error));
        }
        if (error instanceof Error) {
            return res.status(400).json(Object.assign(error));
        }
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
        if (error instanceof ResponseError) {
            return res.status(400).json(Object.assign(error));
        }
        if (error instanceof Error) {
            return res.status(400).json(Object.assign(error));
        }
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
        if (error instanceof ResponseError) {
            return res.status(400).json(Object.assign(error));
        }
        if (error instanceof Error) {
            return res.status(400).json(Object.assign(error));
        }
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/diseaseForSymptoms')"
            )
        );
    }
});

router.post('/cantonWithMoreSymptoms', jsonParser, async (req, res) => {
    try {
        const { initDate, finalDate } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Canton with more symptoms",
                await reports.cantonWithMoreSymptoms(initDate, finalDate)
            )
        );
    } catch (error) {
        if (error instanceof ResponseError)
            return res.status(400).json(Object.assign(error));
        if (error instanceof Error)
            return res.status(400).json(Object.assign(error));
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/cantonWithMoreSymptoms')"
            )
        );
    }
});

router.post('/provinceWithMoreSymptoms', jsonParser, async (req, res) => {
    try {
        const { initDate, finalDate } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Province with more symptoms",
                await reports.provinceWithMoreSymptoms(initDate, finalDate)
            )
        );
    } catch (error) {
        if (error instanceof ResponseError)
            return res.status(400).json(Object.assign(error));
        if (error instanceof Error)
            return res.status(400).json(Object.assign(error));
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/provinceWithMoreSymptoms')"
            )
        );
    }
});

router.post('/regionsWithMoreSymptoms', jsonParser, async (req, res) => {
    try {
        const { initDate, finalDate } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Region with more symptoms",
                await reports.regionsWithMoreSymptoms(initDate, finalDate)
            )
        );
    } catch (error) {
        if (error instanceof ResponseError)
            return res.status(400).json(Object.assign(error));
        if (error instanceof Error)
            return res.status(400).json(Object.assign(error));
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/regionsWithMoreSymptoms')"
            )
        );
    }
});

router.post('/cantonWithRiskFactor', jsonParser, async (req, res) => {
    try {
        const { riskFactor } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Cantons with risk factor",
                await reports.cantonWithRiskFactor(riskFactor)
            )
        );
    } catch (error) {
        if (error instanceof ResponseError)
            return res.status(400).json(Object.assign(error));
        if (error instanceof Error)
            return res.status(400).json(Object.assign(error));
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/cantonWithRiskFactor')"
            )
        );
    }
});

router.post('/provinceWithRiskFactor', jsonParser, async (req, res) => {
    try {
        const { riskFactor } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Provinces with risk factor",
                await reports.provinceWithRiskFactor(riskFactor)
            )
        );
    } catch (error) {
        if (error instanceof ResponseError)
            return res.status(400).json(Object.assign(error));
        if (error instanceof Error)
            return res.status(400).json(Object.assign(error));
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/provinceWithRiskFactor')"
            )
        );
    }
});

router.post('/regionWithRiskFactor', jsonParser, async (req, res) => {
    try {
        const { riskFactor } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Regions with risk factor",
                await reports.regionWithRiskFactor(riskFactor)
            )
        );
    } catch (error) {
        if (error instanceof ResponseError)
            return res.status(400).json(Object.assign(error));
        if (error instanceof Error)
            return res.status(400).json(Object.assign(error));
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/regionWithRiskFactor')"
            )
        );
    }
});

router.post('/genderWithMoreSymptoms', jsonParser, async (req, res) => {
    try {
        const { region, initDate, finalDate } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Gender With More Symptoms",
                await reports.genderWithMoreSymptoms(region, initDate, finalDate)
            )
        );
    } catch (error) {
        if (error instanceof ResponseError)
            return res.status(400).json(Object.assign(error));
        if (error instanceof Error)
            return res.status(400).json(Object.assign(error));
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/genderWithMoreSymptoms')"
            )
        );
    }
});

router.post('/ageMostAffected', jsonParser, async (req, res) => {
    try {
        const { initDate, finalDate } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Age Most Affected",
                await reports.ageMostAffected(initDate, finalDate)
            )
        );
    } catch (error) {
        if (error instanceof ResponseError)
            return res.status(400).json(Object.assign(error));
        if (error instanceof Error)
            return res.status(400).json(Object.assign(error));
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/genderWithMoreSymptoms')"
            )
        );
    }
});

export default router;