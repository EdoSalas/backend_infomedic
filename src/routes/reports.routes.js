import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import * as reports from "../controller/reports.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/diseasesForUser', jsonParser, async (req, res) => {
    try {
        const { user, type } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Possible diseases of the user",
                await reports.diseasesForUser(user, type)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/diseasesForUser')"
            )
        );
    }
});

router.post('/diseasesForRegion', jsonParser, async (req, res) => {
    try {
        const { region, type } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Possible diseases of the region",
                await reports.diseasesForRegion(region, type)
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Reports",
                "Error in reports.routes.js exec router.post('/diseasesForRegion')"
            )
        );
    }
});

export default router;