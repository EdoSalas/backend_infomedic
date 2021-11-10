import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import RiskFactorsForDisease from "../model/riskFactorForDisease";
import * as riskFactorDiseaseCtrl from "../controller/riskFactorsForDisease.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/', jsonParser, async (req, res) => {
    try {
        const { disease, riskFactor } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactorsForDisease",
                "RiskFactorsForDisease inserted",
                await riskFactorDiseaseCtrl.save(disease, riskFactor)
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
                "RiskFactorsForDisease",
                "Error in RiskFactorsForDisease.routes.js exec router.post('/')"
            )
        );
    }
});

router.get('/:disease/disease', async (req, res) => {
    try {
        const { disease } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactorsForDisease",
                "RiskFactorsForDisease founded",
                await riskFactorDiseaseCtrl.getDiseaseRiskFactors(disease)
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
                "RiskFactorsForDisease",
                "Error in RiskFactorsForDisease.routes.js exec router.get('/:disease/disease')"
            )
        );
    }
});

router.get('/:riskFactorFordisease/id', async (req, res) => {
    try {
        const { riskFactorFordisease } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactorsForDisease",
                "RiskFactorsForDisease founded",
                await riskFactorDiseaseCtrl.getByID(riskFactorFordisease)
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
                "RiskFactorsForDisease",
                "Error in RiskFactorsForDisease.routes.js exec router.get('/:riskFactorFordisease/id')"
            )
        );
    }
});

router.put('/', jsonParser, async (req, res) => {
    try {
        const { id, riskFactor } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactorsForDisease",
                "RiskFactorsForDisease updated",
                await riskFactorDiseaseCtrl.update(id, riskFactor)
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
                "RiskFactorsForDisease",
                "Error in RiskFactorsForDisease.routes.js exec router.put('/')"
            )
        );
    }
});

router.put('/delete', jsonParser, async (req, res) => {
    try {
        const { id } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactorsForDisease",
                "RiskFactorsForDisease deleted",
                await riskFactorDiseaseCtrl.delet(id)
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
                "RiskFactorsForDisease",
                "Error in RiskFactorsForDisease.routes.js exec router.put('/delete')"
            )
        );
    }
});

router.put('/delete/riskFactorDisease', jsonParser, async (req, res) => {
    try {
        const { riskfactor, disease } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactorsForDisease",
                "RiskFactorsForDisease deleted",
                await riskFactorDiseaseCtrl.deleted(riskfactor, disease)
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
                "RiskFactorsForDisease",
                "Error in RiskFactorsForDisease.routes.js exec router.put('/delete/riskFactorDisease')"
            )
        );
    }
});

export default router;