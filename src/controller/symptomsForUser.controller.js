import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import SymptomsForUser from "../model/symptomsForUser";
import * as userCtrl from "./users.controller";
import * as symptomCtrl from "./symptoms.controller";

const convert = (symptomsForUser, type) => {
    try {
        if (type === 'one')
            return new SymptomsForUser(
                symptomsForUser.pk_symptomforuser,
                symptomsForUser.date,
                symptomsForUser.fk_user,
                symptomsForUser.fk_symptom,
                symptomsForUser.status,
                symptomsForUser.userInfo,
                symptomsForUser.symptomInfo
            );
        else if (type === 'all') {
            const symptom = new SymptomsForUser();
            symptom.userInfo = symptomsForUser.userInfo;
            symptom.symptomInfo = symptomsForUser.symptomInfo;
            return symptom;
        }
        else {
            // eslint-disable-next-line no-array-constructor
            const symptomsForUser = Array();
            symptomsForUser.map(async (sfu) => {
                symptomsForUser.push(await new SymptomsForUser(
                    sfu.pk_symptomforuser,
                    sfu.date,
                    sfu.fk_user,
                    sfu.fk_symptom,
                    sfu.status,
                    sfu.userInfo,
                    sfu.symptomInfo
                ));
            });
            return symptomsForUser;
        }
    } catch (error) {
        throw error;
    }
};

export const save = async (user, date, symptoms) => {
    try {
        const sfu = await PgSingleton.findOne(`SELECT sfu.* FROM symptomsforuser sfu WHERE sfu.fk_user = ${user} AND sfu.date = '${date}' AND sfu.fk_symptom = ${symptoms}`);
        if (sfu) {
            if (sfu.status === EStatus.ACTIVE)
                throw new ResponseError("Error!", "Already exist");
            const result = await PgSingleton.update(
                `UPDATE symptomsforuser SET status = ${EStatus.ACTIVE} WHERE pk_symptomforuser = ${sfu.pk_symptomforuser}`,
                `SELECT sfu.* FROM symptomsforuser sfu WHERE sfu.pk_symptomforuser = ${sfu.pk_symptomforuser}`
            );
            result['userInfo'] = await userCtrl.getByPK(result.fk_user);
            result['symptomInfo'] = await symptomCtrl.getByID(result.fk_symptom);
            return await convert(result, 'one');
        }
        const result = await PgSingleton.save(
            `INSERT INTO symptomsforuser (fk_user, date, fk_symptom, status) VALUES (${user}, '${date}', ${symptoms}, ${EStatus.ACTIVE})`,
            `SELECT sfu.* FROM symptomsforuser sfu WHERE sfu.fk_user = ${user} AND sfu.fk_symptom = ${symptoms}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not inserted");
        result['userInfo'] = await userCtrl.getByPK(result.fk_user);
        result['symptomInfo'] = await symptomCtrl.getByID(result.fk_symptom);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getUserSymptoms = async (user) => {
    try {
        const result = await PgSingleton.find(`
            SELECT sfu.* 
            FROM symptomsforuser sfu 
            INNER JOIN symptoms s ON sfu.fk_symptom = s.pk_symptom 
            WHERE sfu.status = ${EStatus.ACTIVE} AND sfu.fk_user = ${user}
            ORDER BY s.name
        `);
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['userInfo'] = await userCtrl.getByPK(result[0].fk_user);
        result['symptomInfo'] = await Promise.all(
            result.map(async (s) => {
                return await symptomCtrl.getByID(s.fk_symptom)
            })
        );
        return convert(result, 'all');
    } catch (error) {
        throw error;
    }
};

export const getByID = async (id) => {
    try {
        const result = await PgSingleton.findOne(`SELECT sfu.* FROM symptomsforuser sfu WHERE sfu.pk_symptomforuser = ${id} AND sfu.status = ${EStatus.ACTIVE}`);
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['userInfo'] = await userCtrl.getByPK(result.fk_user);
        result['symptomInfo'] = await symptomCtrl.getByID(result.fk_symptom);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const update = async (id, symptoms) => {
    try {
        const sfu = await PgSingleton.findOne(`SELECT sfu.* FROM symptomsforuser sfu WHERE sfu.pk_symptomforuser = ${id}`);
        if (!sfu)
            throw new ResponseError("Error!", "Not exist!");
        const exist = await PgSingleton.findOne(`SELECT sfu.* FROM symptomsforuser sfu WHERE sfu.fk_symptom = ${symptoms} AND sfu.fk_user = ${sfu.fk_user}`);
        if (exist)
            throw new ResponseError("Error!", "Already exist");
        const result = await PgSingleton.update(
            `UPDATE symptomsforuser SET fk_symptom = ${symptoms} WHERE pk_symptomforuser = ${id}`,
            `SELECT sfu.* FROM symptomsforuser sfu WHERE sfu.pk_symptomforuser = ${id} AND sfu.status = ${EStatus.ACTIVE}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['userInfo'] = await userCtrl.getByPK(result.fk_user);
        result['symptomInfo'] = await symptomCtrl.getByID(result.fk_symptom);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const delet = async (user, symptom) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE symptomsforuser SET status = ${EStatus.INACTIVE} WHERE fk_user = ${user} AND fk_symptom = ${symptom}`,
            `SELECT sfu.* FROM symptomsforuser sfu WHERE sfu.fk_user = ${user} AND sfu.fk_symptom = ${symptom} AND sfu.status = ${EStatus.INACTIVE}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['userInfo'] = await userCtrl.getByPK(result.fk_user);
        result['symptomInfo'] = await symptomCtrl.getByID(result.fk_symptom);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};