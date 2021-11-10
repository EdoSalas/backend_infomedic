import { Router } from "express";
import bodyParser from "body-parser";
import BaseResponse from "../response/BaseResponse";
import ResponseError from "../response/ResponseError";
import * as usersCtrl from "../controller/users.controller";
import EStatus from "../model/enums/EStatus";
import EType from "../model/enums/EType";
import Users from "../model/users";

const jsonParser = bodyParser.json();
const router = Router();

router.get('/', async (req, res) => {
    try {
        return res.status(200).json(
            new BaseResponse(
                "Users",
                "Users obtained",
                await usersCtrl.getAll()
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
                "Users",
                "Error in users.routes.js exec router.get('/')"
            )
        );
    }
});

router.get('/:user/id', async (req, res) => {
    try {
        const { user } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Users",
                "User obtained",
                await usersCtrl.getByID(user)
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
                "Users",
                "Error in users.routes.js exec router.get('/:user/id')"
            )
        );
    }
});

router.get('/:user/genero', async (req, res) => {
    try {
        const { user } = req.params;
        return res.status(200).json(
            new BaseResponse(
                "Users",
                "User obtained",
                await usersCtrl.getByGender(user)
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
                "Users",
                "Error in users.routes.js exec router.get('/:user/id')"
            )
        );
    }
});

router.post('/', jsonParser, async (req, res) => {
    try {
        const { id, name, lastname, dateOfBirth, genero, email, password, canton } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Users",
                "User inserted",
                await usersCtrl.save(new Users("", id, name, lastname, dateOfBirth, genero, email, EType.USER, password, EStatus.ACTIVE, canton, ""))
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
                "Users",
                "Error in users.routes.js exec router.post('/')"
            )
        );
    }
});

router.post('/credenciales', jsonParser, async (req, res) => {
    try {
        const { id, password } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Users",
                "User founded",
                await usersCtrl.getByCredential(new Users("", id, "", "", "", "", "", EType.USER, password, EStatus.ACTIVE, "", ""))
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
                "Users",
                "Error in users.routes.js exec router.post('/')"
            )
        );
    }
});

router.put('/', jsonParser, async (req, res) => {
    try {
        const { id, name, lastname, email, canton, dateOfBirth } = req.body;
        const user = new Users("", id, name, lastname, dateOfBirth, "", email, EType.USER, "", EStatus.ACTIVE, canton, "")
        return res.status(200).json(
            new BaseResponse(
                "Users",
                "User updated",
                await usersCtrl.update(user)
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
                "Users",
                "Error in users.routes.js exec router.put('/')"
            )
        );
    }
});

router.put('/password', jsonParser, async (req, res) => {
    try {
        const { id, password } = req.body;
        const user = new Users("", id, "", "", "", "", "", "", password, "", "", "");
        return res.status(200).json(
            new BaseResponse(
                "Users",
                "User updated",
                await usersCtrl.changePassword(user)
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
                "Users",
                "Error in users.routes.js exec router.put('/password')"
            )
        );
    }
});

router.put('/delete', jsonParser, async (req, res) => {
    try {
        const { id } = req.body;
        return res.status(200).json(
            new BaseResponse(
                "Users",
                "User deleted",
                await usersCtrl.delet(id)
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
                "Users",
                "Error in users.routes.js exec router.put('/')"
            )
        );
    }
});

export default router;