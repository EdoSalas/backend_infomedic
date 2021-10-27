import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";

//Controllers
import * as regionsCtrl from "../controller/regions.controller";

//Middlewares

//Routers
const jsonParser = bodyParser.json();
const router = Router();
router.get('/', async (req, res) => {
    try {
        const data = await regionsCtrl.getAll();
        return res.status(200).json(
            new BaseResponse(
                "Regions",
                "Regions obtained",
                data
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Regions",
                "Error in regions.routes.js exec router.get('/')"
            )
        );
    }
});

router.get('/:region/id', async (req, res) => {
    try {
        const data = await regionsCtrl.getByID(req.params.region);
        return res.status(200).json(
            new BaseResponse(
                "Regions",
                "Region obtained",
                data
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Regions",
                "Error in regions.routes.js exec router.get('/:region/id')"
            )
        );
    }
});

router.get('/:region/name', async (req, res) => {
    try {
        const { region } = req.params;
        const data = await regionsCtrl.getByName(region);
        return res.status(200).json(
            new BaseResponse(
                "Regions",
                "Region obtained",
                data
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Regions",
                "Error in regions.routes.js exec router.get('/:region/name')"
            )
        );
    }
});

router.post('/', jsonParser, async (req, res) => {
    try {
        const { name } = req.body;
        const data = await regionsCtrl.save(name);
        return res.status(200).json(
            new BaseResponse(
                "Regions",
                "Region inserted",
                data
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Regions",
                "Error in regions.routes.js exec router.post('/')"
            )
        );
    }
});

router.put('/', jsonParser, async (req, res) => {
    try {
        const { pk_region, name } = req.body;
        const data = await regionsCtrl.update(pk_region, name);
        return res.status(200).json(
            new BaseResponse(
                "Regions",
                "Region updated",
                data
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Regions",
                "Error in regions.routes.js exec router.put('/')"
            )
        );
    }
});

router.put('/delete', jsonParser, async (req, res) => {
    try {
        const { pk_region } = req.body;
        const data = await regionsCtrl.delet(pk_region);
        return res.status(200).json(
            new BaseResponse(
                "Regions",
                "Region deleted",
                data
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Regions",
                "Error in regions.routes.js exec router.put('/')"
            )
        );
    }
});

export default router;