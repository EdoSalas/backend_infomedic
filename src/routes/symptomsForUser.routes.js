import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import * as symptomsUserCtrl from "../controller/symptomsForUser.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/', jsonParser, async (req, res) => {
    try {
        const { user, date, symptom } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "SymptomsForUser",
                "SymptomsForUser inserted",
                await symptomsUserCtrl.save(user, date, symptom)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "SymptomsForUser",
                "Error in symptomsForUser.routes.js exec router.post('/')"
            )
        );
    }
});

router.get('/:user/user', async (req, res) => {
    try {
        const { user } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "SymptomsForUser",
                "SymptomsForUser founded",
                await symptomsUserCtrl.getUserSymptoms(user)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "SymptomsForUser",
                "Error in symptomsForUser.routes.js exec router.get('/:user/user')"
            )
        );
    }
});

router.get('/:symptomsForUser/id', async (req, res) => {
    try {
        const { symptomsForUser } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "SymptomsForUser",
                "SymptomsForUser founded",
                await symptomsUserCtrl.getByID(symptomsForUser)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "SymptomsForUser",
                "Error in symptomsForUser.routes.js exec router.get('/:symptomsForUser/id')"
            )
        );
    }
});

router.put('/', jsonParser, async (req, res) => {
    try {
        const { id, symptom } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "SymptomsForUser",
                "SymptomsForUser updated",
                await symptomsUserCtrl.update(id, symptom)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "SymptomsForUser",
                "Error in symptomsForUser.routes.js exec router.put('/')"
            )
        );
    }
});

router.put('/delete', jsonParser, async (req, res) => {
    try {
        const { id } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "SymptomsForUser",
                "SymptomsForUser deleted",
                await symptomsUserCtrl.delet(id)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "SymptomsForUser",
                "Error in symptomsForUser.routes.js exec router.put('/delete')"
            )
        );
    }
});

export default router;