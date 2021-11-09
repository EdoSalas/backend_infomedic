import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import * as reports from "../controller/reports.controller";

const jsonParser = bodyParser.json();
const router = Router();

router.post('/diseasesForUser', jsonParser, async (req, res) => {
    try {
        const { user } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Reports",
                "Diseases For User",
                await reports.diseasesForUser(user)
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

export default router;