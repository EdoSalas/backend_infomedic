import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import * as medicalCtrl from "../controller/medicalRecomendations.controller";
import EStatus from "../model/enums/EStatus";
import MedicalRecomendations from "../model/medicalRecomendations";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/', jsonParser, async (req, res) => {
    try {
        const { title, description, user } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Medical Recomendations",
                "Medical Recomendation inserted",
                await medicalCtrl.save(new MedicalRecomendations("", title, description, EStatus.ACTIVE, user))
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
                "Medical Recomendations",
                "Error in medicalRecomendations.routes.js exec router.post('/')"
            )
        );
    }
});

router.get('/', async (req, res) => {
    try {
        return res.status(200).json(
            new BaseResponse(
                "Medical Recomendations",
                "Medical Recomendations obtained",
                await medicalCtrl.getAll()
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
                "Medical Recomendations",
                "Error in medicalRecomendations.routes.js exec router.get('/')"
            )
        );
    }
});

router.get('/:medicalRecomendation', async (req, res) => {
    try {
        const { medicalRecomendation } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Medical Recomendation",
                "Medical Recomendation obtained",
                await medicalCtrl.getByID(medicalRecomendation)
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
                "Medical Recomendations",
                "Error in medicalRecomendations.routes.js exec router.get('/:medicalRecomendation')"
            )
        );
    }
});

router.put('/', jsonParser, async (req, res) => {
    try {
        const { id, title, description } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Medical Recomendation",
                "Medical Recomendation obtained",
                await medicalCtrl.update(new MedicalRecomendations(id, title, description, EStatus.ACTIVE))
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
                "Medical Recomendations",
                "Error in medicalRecomendations.routes.js exec router.put('/')"
            )
        );
    }
});

router.put('/delete', jsonParser, async (req, res) => {
    try {
        const { id } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Medical Recomendation",
                "Medical Recomendation obtained",
                await medicalCtrl.delet(id)
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
                "Medical Recomendations",
                "Error in medicalRecomendations.routes.js exec router.put('/delete')"
            )
        );
    }
});

export default router;