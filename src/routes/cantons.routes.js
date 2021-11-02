import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import Cantons from "../model/cantons";
import * as cantonsCtrl from "../controller/cantons.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.get('/', async (req, res) => {
    try {
        return res.status(200).json(
            new BaseResponse(
                "Cantons",
                "Cantons obtained",
                await cantonsCtrl.getAll()
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Cantons",
                "Error in cantons.routes.js exec router.get('/')"
            )
        );
    }
});

router.get('/:canton/id', async (req, res) => {
    try {
        const { canton } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Cantons",
                "Cantons obtained",
                await cantonsCtrl.getByID(canton)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Cantons",
                "Error in cantons.routes.js exec router.get('/:canton/id')"
            )
        );
    }
});

router.get('/:province/province', async (req, res) => {
    try {
        const { province } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Cantons",
                "Cantons obtained",
                await cantonsCtrl.getByProvince(province)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Cantons",
                "Error in cantons.routes.js exec router.get('/:province/province')"
            )
        );
    }
});

router.get('/:region/region', async (req, res) => {
    try {
        const { region } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Cantons",
                "Cantons obtained",
                await cantonsCtrl.getByRegion(region)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Cantons",
                "Error in cantons.routes.js exec router.get('/:province/province')"
            )
        );
    }
});

export default router;