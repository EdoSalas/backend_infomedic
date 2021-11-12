import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import * as symptomCtr from "../controller/symptoms.controller";
import EStatus from "../model/enums/EStatus";
import Symptoms from "../model/symptoms";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/', jsonParser, async (req, res) => {
    try {
        const { name, description } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Symptoms",
                "Symptoms inserted",
                await symptomCtr.save(new Symptoms("", name, description, EStatus.ACTIVE))
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
                "Symptoms",
                "Error in symptoms.routes.js exec router.post('/')"
            )
        );
    }
});

router.get('/', async (req, res) => {
    try {
        return res.status(200).json(
            new BaseResponse(
                "Symptoms",
                "Symptoms obtained",
                await symptomCtr.getAll()
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
                "Symptoms",
                "Error in symptoms.routes.js exec router.get('/')"
            )
        );
    }
});

router.get('/:symptom', async (req, res) => {
    try {
        const { symptom } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Symptoms",
                "Symptoms obtained",
                await symptomCtr.getByID(symptom)
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
                "Symptoms",
                "Error in symptoms.routes.js exec router.get('/:symptom')"
            )
        );
    }
});

router.put('/', jsonParser, async (req, res) => {
    try {
        const { id, name, description } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Symptoms",
                "Symptoms updated",
                await symptomCtr.update(new Symptoms(id, name, description, EStatus.ACTIVE))
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
                "Symptoms",
                "Error in symptoms.routes.js exec router.put('/')"
            )
        );
    }
});

router.put('/delete', jsonParser, async (req, res) => {
    try {
        const { id } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Symptoms",
                "Symptoms deleted",
                await symptomCtr.delet(id)
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
                "Symptoms",
                "Error in symptoms.routes.js exec router.put('/delete')"
            )
        );
    }
});

export default router;