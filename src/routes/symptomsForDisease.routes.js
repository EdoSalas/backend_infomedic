import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import * as symptomsDiseaseCtrl from "../controller/symptomsForDisease.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/', jsonParser, async (req, res) => {
    try {
        const { disease, symptom } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "SymptomsForDisease",
                "SymptomsForDisease inserted",
                await symptomsDiseaseCtrl.save(disease, symptom)
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
                "SymptomsForDisease",
                "Error in SymptomsForDisease.routes.js exec router.post('/')"
            )
        );
    }
});

router.get('/:disease/disease', async (req, res) => {
    try {
        const { disease } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "SymptomsForDisease",
                "SymptomsForDisease founded",
                await symptomsDiseaseCtrl.getDiseaseSymptoms(disease)
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
                "SymptomsForDisease",
                "Error in SymptomsForDisease.routes.js exec router.get('/:disease/disease')"
            )
        );
    }
});

router.get('/:SymptomsForDisease/id', async (req, res) => {
    try {
        const { SymptomsForDisease } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "SymptomsForDisease",
                "SymptomsForDisease founded",
                await symptomsDiseaseCtrl.getByID(SymptomsForDisease)
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
                "SymptomsForDisease",
                "Error in SymptomsForDisease.routes.js exec router.get('/:SymptomsForDisease/id')"
            )
        );
    }
});

router.put('/', jsonParser, async (req, res) => {
    try {
        const { id, symptom } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "SymptomsForDisease",
                "SymptomsForDisease updated",
                await symptomsDiseaseCtrl.update(id, symptom)
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
                "SymptomsForDisease",
                "Error in SymptomsForDisease.routes.js exec router.put('/')"
            )
        );
    }
});

router.put('/delete', jsonParser, async (req, res) => {
    try {
        const { id } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "SymptomsForDisease",
                "SymptomsForDisease deleted",
                await symptomsDiseaseCtrl.delet(id)
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
                "SymptomsForDisease",
                "Error in SymptomsForDisease.routes.js exec router.put('/delete')"
            )
        );
    }
});

router.put('/delete/symptomDisease', jsonParser, async (req, res) => {
    try {
        const { symptom, disease } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "SymptomsForDisease",
                "SymptomsForDisease deleted",
                await symptomsDiseaseCtrl.deleted(symptom, disease)
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
                "SymptomsForDisease",
                "Error in SymptomsForDisease.routes.js exec router.put('/delete/symptomDisease')"
            )
        );
    }
});

export default router;