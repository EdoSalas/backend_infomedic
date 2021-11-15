import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import RiskFactorsForUser from "../model/riskFactors";
import * as riskFactorUserCtrl from "../controller/riskFactorsForUser.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/', jsonParser, async (req, res) => {
    try {
        const { user, riskFactor } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactorsForUser",
                "RiskFactorsForUser inserted",
                await riskFactorUserCtrl.save(user, riskFactor)
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
                "RiskFactorsForUser",
                "Error in riskFactorsForUser.routes.js exec router.post('/')"
            )
        );
    }
});

router.get('/:user/user', async (req, res) => {
    try {
        const { user } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactorsForUser",
                "RiskFactorsForUser founded",
                await riskFactorUserCtrl.getUserRiskFactors(user)
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
                "RiskFactorsForUser",
                "Error in riskFactorsForUser.routes.js exec router.get('/:user/user')"
            )
        );
    }
});

router.get('/:riskFactorForUser/id', async (req, res) => {
    try {
        const { riskFactorForUser } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactorsForUser",
                "RiskFactorsForUser founded",
                await riskFactorUserCtrl.getByID(riskFactorForUser)
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
                "RiskFactorsForUser",
                "Error in riskFactorsForUser.routes.js exec router.get('/:riskFactorForUser/id')"
            )
        );
    }
});

router.put('/', jsonParser, async (req, res) => {
    try {
        const { id, riskFactor } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactorsForUser",
                "RiskFactorsForUser updated",
                await riskFactorUserCtrl.update(id, riskFactor)
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
                "RiskFactorsForUser",
                "Error in riskFactorsForUser.routes.js exec router.put('/')"
            )
        );
    }
});

router.put('/delete', jsonParser, async (req, res) => {
    try {
        const { id } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "RiskFactorsForUser",
                "RiskFactorsForUser deleted",
                await riskFactorUserCtrl.delet(id)
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
                "RiskFactorsForUser",
                "Error in riskFactorsForUser.routes.js exec router.put('/delete')"
            )
        );
    }
});

export default router;