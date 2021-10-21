import { Router } from "express";
import BaseResponse from "../Reponse/BaseResponse";
import ResponseError from "../Reponse/ResponseError";

//Controllers
import * as regionsCtrl from "../controller/regions.controller";

//Middlewares

//Routers
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
                "Error in test.routes.js exec router.get('/')"
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
                "Regions obtained",
                data
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Regions",
                "Error in test.routes.js exec router.get('/:region/id')"
            )
        );
    }
});

router.post('/:region/name', async (req, res) => {
    try {
        const data = await regionsCtrl.save(req.params.region);
        return res.status(200).json(
            new BaseResponse(
                "Regions",
                "Regions inserted",
                data
            )
        );
    } catch (error) {
        return res.status(400).json(
            new ResponseError(
                "Regions",
                "Error in test.routes.js exec router.post('/:region/name')"
            )
        );
    }
});

router.put('/:region/:id/update', async (req, res) => {
    try {
        const { region, id } = req.params;
        const data = await regionsCtrl.update(region, id);
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
                "Error in test.routes.js exec router.put('/:region/:id/update')"
            )
        );
    }
});

router.put('/:id/delete', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await regionsCtrl.delet(id);
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
                "Error in test.routes.js exec router.put('/:id/delete')"
            )
        );
    }
});

export default router;