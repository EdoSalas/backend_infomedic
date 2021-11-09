import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import Diseases from "../model/diseases";
import * as diseasesCtrl from "../controller/diseases.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/', jsonParser, async (req, res) => {
    try {
        const { name } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Diseases",
                "Diseases inserted",
                await diseasesCtrl.save(name)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Diseases",
                "Error in diseases.routes.js exec router.post('/')"
            )
        );
    }
});

router.get('/', async (req, res) => {
    try {
        return res.status(200).json(
            new BaseResponse(
                "Diseases",
                "Diseases founded",
                await diseasesCtrl.getAll()
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Diseases",
                "Error in diseases.routes.js exec router.get('/')"
            )
        );
    }
});

router.get('/:disease/id', async (req, res) => {
    try {
        const { disease } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Diseases",
                "Diseases founded",
                await diseasesCtrl.getByID(disease)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Diseases",
                "Error in diseases.routes.js exec router.get('/:disease/id')"
            )
        );
    }
});

router.get('/:disease/name', async (req, res) => {
    try {
        const { disease } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Diseases",
                "Diseases founded",
                await diseasesCtrl.getByName(disease)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Diseases",
                "Error in diseases.routes.js exec router.get('/:disease/name')"
            )
        );
    }
});

router.get('/:symptom/symptom', async (req, res) => {
    try {
        const { symptom } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Diseases",
                "Diseases founded",
                await diseasesCtrl.getBySymptom(symptom)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Diseases",
                "Error in diseases.routes.js exec router.get('/:symptom/symptom')"
            )
        );
    }
});

router.put('/', jsonParser, async (req, res) => {
    try {
        const { id, name } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Diseases",
                "Diseases update",
                await diseasesCtrl.update(new Diseases(id, name, EStatus.ACTIVE))
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Diseases",
                "Error in diseases.routes.js exec router.put('/')"
            )
        );
    }
});

router.put('/delete', jsonParser, async (req, res) => {
    try {
        const { id } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Diseases",
                "Diseases deleted",
                await diseasesCtrl.delet(new Diseases(id, "", EStatus.INACTIVE))
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Diseases",
                "Error in diseases.routes.js exec router.put('/delete')"
            )
        );
    }
});

export default router;