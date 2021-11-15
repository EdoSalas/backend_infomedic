import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import RiskFactorsForUser from "../model/riskFactorForUser";
import * as userCtrl from "./users.controller";
import * as riskCtrl from "./riskFactor.controller";

const convert = (riskFactorForUser, type) => {
    try {
        if (type === 'one')
            return new RiskFactorsForUser(
                riskFactorForUser.pk_riskforusers,
                riskFactorForUser.fk_user,
                riskFactorForUser.fk_riskfactor,
                riskFactorForUser.status,
                riskFactorForUser.userInfo,
                riskFactorForUser.riskInfo
            );
        else if (type === 'all') {
            const risk = new RiskFactorsForUser();
            risk.userInfo = riskFactorForUser.userInfo;
            risk.riskInfo = riskFactorForUser.riskInfo;
            return risk;
        }
        else {
            // eslint-disable-next-line no-array-constructor
            const riskFactorsForUser = Array();
            riskFactorForUser.map(async (rfu) => {
                riskFactorsForUser.push(await new RiskFactorsForUser(
                    rfu.pk_riskforusers,
                    rfu.fk_user,
                    rfu.fk_riskfactor,
                    rfu.status,
                    rfu.userInfo,
                    rfu.riskInfo
                ));
            });
            return riskFactorsForUser;
        }
    } catch (error) {
        throw error;
    }
};

export const save = async (user, riskFactor) => {
    try {
        const rfu = await PgSingleton.findOne(`SELECT rfu.* FROM riskforusers rfu WHERE rfu.fk_user = ${user} AND rfu.fk_riskfactor = ${riskFactor}`);
        if (rfu) {
            if (rfu.status === EStatus.ACTIVE)
                throw new ResponseError("Error!", "Already exist");
            const result = await PgSingleton.update(
                `UPDATE riskforusers SET status = ${EStatus.ACTIVE} WHERE pk_riskforusers = ${rfu.pk_riskforusers}`,
                `SELECT rfu.* FROM riskforusers rfu WHERE rfu.pk_riskforusers = ${rfu.pk_riskforusers}`
            );
            result['userInfo'] = await userCtrl.getByPK(result.fk_user);
            result['riskInfo'] = await riskCtrl.getByID(result.fk_riskfactor);
            result['riskInfo']['pk'] = result.pk_riskforusers;
            return await convert(result, 'one');
        }
        const result = await PgSingleton.save(
            `INSERT INTO riskforusers (fk_user, fk_riskfactor, status) VALUES (${user}, ${riskFactor}, ${EStatus.ACTIVE})`,
            `SELECT rfu.* FROM riskforusers rfu WHERE rfu.fk_user = ${user} AND rfu.fk_riskfactor = ${riskFactor}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not inserted");
        result['userInfo'] = await userCtrl.getByPK(result.fk_user);
        result['riskInfo'] = await riskCtrl.getByID(result.fk_riskfactor);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getUserRiskFactors = async (user) => {
    try {
        const result = await PgSingleton.find(`SELECT rfu.* FROM riskforusers rfu WHERE rfu.status = ${EStatus.ACTIVE} AND rfu.fk_user = ${user}`);
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['userInfo'] = await userCtrl.getByPK(result[0].fk_user);
        result['riskInfo'] = await Promise.all(
            result.map(async (r) => {
                return await riskCtrl.getByID(r.fk_riskfactor)
            })
        );
        return convert(result, 'all');
    } catch (error) {
        throw error;
    }
};

export const getByID = async (id) => {
    try {
        const result = await PgSingleton.findOne(`SELECT rfu.* FROM riskforusers rfu WHERE rfu.pk_riskforusers = ${id} AND rfu.status = ${EStatus.ACTIVE}`);
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['userInfo'] = await userCtrl.getByPK(result.fk_user);
        result['riskInfo'] = await riskCtrl.getByID(result.fk_riskfactor);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const update = async (id, riskFactor) => {
    try {
        const rfu = await PgSingleton.findOne(`SELECT rfu.* FROM riskforusers rfu WHERE rfu.pk_riskforusers = ${id}`);
        if (!rfu)
            throw new ResponseError("Error!", "Not exist");
        const exist = await PgSingleton.findOne(`SELECT rfu.* FROM riskforusers rfu WHERE rfu.fk_riskfactor = ${riskFactor} AND rfu.fk_user = ${rfu.fk_user}`);
        if (exist)
            throw new ResponseError("Error!", "Already exist");
        const result = await PgSingleton.update(
            `UPDATE riskforusers SET fk_riskfactor = ${riskFactor} WHERE pk_riskforusers = ${id}`,
            `SELECT rfu.* FROM riskforusers rfu WHERE rfu.pk_riskforusers = ${id} AND rfu.status = ${EStatus.ACTIVE}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['userInfo'] = await userCtrl.getByPK(result.fk_user);
        result['riskInfo'] = await riskCtrl.getByID(result.fk_riskfactor);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const delet = async (user, riskFactor) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE riskforusers SET status = ${EStatus.INACTIVE} WHERE fk_user = ${user} AND fk_riskfactor = ${riskFactor}`,
            `SELECT rfu.* FROM riskforusers rfu WHERE rfu.fk_user = ${user} AND rfu.fk_riskfactor = ${riskFactor} AND rfu.status = ${EStatus.INACTIVE}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['userInfo'] = await userCtrl.getByPK(result.fk_user);
        result['riskInfo'] = await riskCtrl.getByID(result.fk_riskfactor);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};