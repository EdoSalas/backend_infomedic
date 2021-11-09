import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import SymptomsForDisease from "../model/symptomsForDisease";
import * as diseaseCtrl from "./diseases.controller";
import * as symptomCtrl from "./symptoms.controller";

const convert = (symptomsfordesease, type) => {
    try {
        if (type === 'one')
            return new SymptomsForDisease(
                symptomsfordesease.pk_symptomfordesease,
                symptomsfordesease.fk_disease,
                symptomsfordesease.fk_symptom,
                symptomsfordesease.status,
                symptomsfordesease.diseaseInfo,
                symptomsfordesease.symptomInfo
            );
        else if (type === 'all') {
            const symptom = new SymptomsForDisease();
            symptom.diseaseInfo = symptomsfordesease.diseaseInfo;
            symptom.symptomInfo = symptomsfordesease.symptomInfo;
            return symptom;
        }
        else {
            // eslint-disable-next-line no-array-constructor
            const symptomsfordesease = Array();
            symptomsfordesease.map(async (sfd) => {
                symptomsfordesease.push(await new SymptomsForDisease(
                    sfd.pk_symptomfordesease,
                    sfd.fk_disease,
                    sfd.fk_symptom,
                    sfd.status,
                    sfd.diseaseInfo,
                    sfd.symptomInfo
                ));
            });
            return symptomsfordesease;
        }
    } catch (error) {
        throw error;
    }
};

export const save = async (disease, symptoms) => {
    try {
        const result = await PgSingleton.save(
            `INSERT INTO symptomsfordesease (fk_disease, fk_symptom, status) VALUES (${disease}, ${symptoms}, ${EStatus.ACTIVE})`,
            `SELECT sfd.* FROM symptomsfordesease sfd WHERE sfd.fk_disease = ${disease} AND sfd.fk_symptom = ${symptoms}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not inserted");
        result['diseaseInfo'] = await diseaseCtrl.getByID(result.fk_disease);
        result['symptomInfo'] = await symptomCtrl.getByID(result.fk_symptom);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getDiseaseSymptoms = async (disease) => {
    try {
        const result = await PgSingleton.find(`SELECT sfd.* FROM symptomsfordesease sfd WHERE sfd.status = ${EStatus.ACTIVE} AND sfd.fk_disease = ${disease}`);
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['diseaseInfo'] = await diseaseCtrl.getByID(result[0].fk_disease);
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
        const result = await PgSingleton.findOne(`SELECT sfd.* FROM symptomsfordesease sfd WHERE sfd.pk_symptomfordesease = ${id} AND sfd.status = ${EStatus.ACTIVE}`);
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['diseaseInfo'] = await diseaseCtrl.getByID(result.fk_disease);
        result['symptomInfo'] = await symptomCtrl.getByID(result.fk_symptom);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const update = async (id, symptoms) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE symptomsfordesease SET fk_symptom = ${symptoms} WHERE pk_symptomfordesease = ${id}`,
            `SELECT sfd.* FROM symptomsfordesease sfd WHERE sfd.pk_symptomfordesease = ${id} AND sfd.status = ${EStatus.ACTIVE}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['diseaseInfo'] = await diseaseCtrl.getByID(result.fk_disease);
        result['symptomInfo'] = await symptomCtrl.getByID(result.fk_symptom);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const delet = async (id) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE symptomsfordesease SET status = ${EStatus.INACTIVE} WHERE pk_symptomfordesease = ${id}`,
            `SELECT sfd.* FROM symptomsfordesease sfd WHERE sfd.pk_symptomfordesease = ${id} AND sfd.status = ${EStatus.INACTIVE}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['diseaseInfo'] = await diseaseCtrl.getByID(result.fk_disease);
        result['symptomInfo'] = await symptomCtrl.getByID(result.fk_symptom);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const deleted = async (symptom, disease) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE symptomsfordesease SET status = ${EStatus.INACTIVE} WHERE fk_disease = ${disease} AND fk_symptom = ${symptom}`,
            `SELECT sfd.* FROM symptomsfordesease sfd WHERE sfd.fk_disease = ${disease} AND sfd.fk_symptom = ${symptom} AND sfd.status = ${EStatus.INACTIVE}`
        );
        if (!result)
            throw new ResponseError("Error!", "Not founded");
        result['diseaseInfo'] = await diseaseCtrl.getByID(result.fk_disease);
        result['symptomInfo'] = await symptomCtrl.getByID(result.fk_symptom);
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};