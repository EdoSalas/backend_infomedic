import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import Provinces from "../model/provinces";
import * as provincesCtrl from "../controller/provinces.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.get('/', async (req, res) => {
    try {
        return res.status(200).json(
            new BaseResponse(
                "Provinces",
                "Provinces obtained",
                await provincesCtrl.getAll()
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Provinces",
                "Error in provinces.routes.js exec router.get('/')"
            )
        );
    }
});

router.get('/:province/id', async (req, res) => {
    try {
        const { province } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Provinces",
                "Provinces obtained",
                await provincesCtrl.getByID(province)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Provinces",
                "Error in provinces.routes.js exec router.get('/:province/id')"
            )
        );
    }
});

router.get('/:province/name', async (req, res) => {
    try {
        const { province } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Provinces",
                "Provinces obtained",
                await provincesCtrl.getByName(province)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Provinces",
                "Error in provinces.routes.js exec router.get('/:province/name')"
            )
        );
    }
});

export default router;