import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import RiskFactors from "../model/riskFactors";
import * as riskFactorCtrl from "../controller/riskFactor.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/', jsonParser, async (req, res) => {
    try {
        const { name } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactors",
                "RiskFactor inserted",
                await riskFactorCtrl.save(name)
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
                "RiskFactors",
                "Error in riskFactors.routes.js exec router.post('/')"
            )
        );
    }
});

router.get('/', async (req, res) => {
    try {
        return res.status(200).json(
            new BaseResponse(
                "RiskFactors",
                "RiskFactor founded",
                await riskFactorCtrl.getAll()
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
                "RiskFactors",
                "Error in riskFactors.routes.js exec router.post('/')"
            )
        );
    }
});

router.get('/:riskFactor/id', async (req, res) => {
    try {
        const { riskFactor } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactors",
                "RiskFactor founded",
                await riskFactorCtrl.getByID(riskFactor)
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
                "RiskFactors",
                "Error in riskFactors.routes.js exec router.post('/:riskFactor/id')"
            )
        );
    }
});

router.get('/:riskFactor/name', async (req, res) => {
    try {
        const { riskFactor } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactors",
                "RiskFactor founded",
                await riskFactorCtrl.getByName(riskFactor)
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
                "RiskFactors",
                "Error in riskFactors.routes.js exec router.post('/:riskFactor/name')"
            )
        );
    }
});

router.put('/', jsonParser, async (req, res) => {
    try {
        const { id, name } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactors",
                "RiskFactor updated",
                await riskFactorCtrl.update(new RiskFactors(id, name, EStatus.ACTIVE))
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
                "RiskFactors",
                "Error in riskFactors.routes.js exec router.put('/')"
            )
        );
    }
});

router.put('/delete', jsonParser, async (req, res) => {
    try {
        const { id } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactors",
                "RiskFactor deleted",
                await riskFactorCtrl.delet(new RiskFactors(id, "", EStatus.ACTIVE))
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
                "RiskFactors",
                "Error in riskFactors.routes.js exec router.put('/delete')"
            )
        );
    }
});

export default router;