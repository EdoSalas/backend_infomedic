import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import RiskFactorsForDisease from "../model/riskFactorForDisease";
import * as diseaseCtrl from "./diseases.controller";
import * as riskCtrl from "./riskFactor.controller";

const convert = (riskFactorForDisease, type) => {
    try {
        if (type === 'one')
            return new RiskFactorsForDisease(
                riskFactorForDisease.pk_riskfordiseases,
                riskFactorForDisease.fk_disease,
                riskFactorForDisease.fk_riskfactor,
                riskFactorForDisease.status,
                riskFactorForDisease.diseaseInfo,
                riskFactorForDisease.riskInfo
            );
        else if (type === 'all') {
            const risk = new RiskFactorsForDisease();
            risk.diseaseInfo = riskFactorForDisease.diseaseInfo;
            risk.riskInfo = riskFactorForDisease.riskInfo;
            return risk;
        }
        else {
            // eslint-disable-next-line no-array-constructor
            const riskFactorsFordisease = Array();
            riskFactorForDisease.map(async (rfd) => {
                riskFactorsFordisease.push(await new RiskFactorsForDisease(
                    rfd.pk_riskfordiseases,
                    rfd.fk_disease,
                    rfd.fk_riskfactor,
                    rfd.status,
                    rfd.diseaseInfo,
                    rfd.riskInfo
                ));
            });
            return riskFactorsFordisease;
        }
    } catch (error) {
        throw error;
    }
};

export const save = async (disease, riskFactor) => {
    try {
        const result = await PgSingleton.save(
            `INSERT INTO risksfordisease (fk_disease, fk_riskfactor, status) VALUES (${disease}, ${riskFactor}, ${EStatus.ACTIVE})`,
            `SELECT rfd.* FROM risksfordisease rfd WHERE rfd.fk_disease = ${disease} AND rfd.fk_riskfactor = ${riskFactor}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not inserted");
        result['diseaseInfo'] = await diseaseCtrl.getByID(result.fk_disease);
        result['riskInfo'] = await riskCtrl.getByID(result.fk_riskfactor);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getDiseaseRiskFactors = async (disease) => {
    try {
        const result = await PgSingleton.find(`SELECT rfd.* FROM risksfordisease rfd WHERE rfd.status = ${EStatus.ACTIVE} AND rfd.fk_disease = ${disease}`);
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['diseaseInfo'] = await diseaseCtrl.getByID(result[0].fk_disease);
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
        const result = await PgSingleton.findOne(`SELECT rfd.* FROM risksfordisease rfd WHERE rfd.pk_risksfordisease = ${id} AND rfd.status = ${EStatus.ACTIVE}`);
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['diseaseInfo'] = await diseaseCtrl.getByID(result.fk_disease);
        result['riskInfo'] = await riskCtrl.getByID(result.fk_riskfactor);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const update = async (id, riskFactor) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE risksfordisease SET fk_riskfactor = ${riskFactor} WHERE pk_risksfordisease = ${id}`,
            `SELECT rfd.* FROM risksfordisease rfd WHERE rfd.pk_risksfordisease = ${id} AND rfd.status = ${EStatus.ACTIVE}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['diseaseInfo'] = await diseaseCtrl.getByID(result.fk_disease);
        result['riskInfo'] = await riskCtrl.getByID(result.fk_riskfactor);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const delet = async (id) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE risksfordisease SET status = ${EStatus.INACTIVE} WHERE pk_risksfordisease = ${id}`,
            `SELECT rfd.* FROM risksfordisease rfd WHERE rfd.pk_risksfordisease = ${id} AND rfd.status = ${EStatus.INACTIVE}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['diseaseInfo'] = await diseaseCtrl.getByID(result.fk_disease);
        result['riskInfo'] = await riskCtrl.getByID(result.fk_riskfactor);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};