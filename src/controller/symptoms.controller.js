import { PgSingleton } from "../singleton/pgSingleton";
import EStatus from "../model/enums/EStatus";
import Symptoms from "../model/symptoms";
import ResponseError from "../response/ResponseError";

const convert = async (symptom, type) => {
    try {
        if (type === 'one')
            return await new Symptoms(symptom.pk_symptom, symptom.name, symptom.description, symptom.status);
        else {
            // eslint-disable-next-line no-array-constructor
            const symptoms = new Array();
            symptom.map(async (s) => {
                symptoms.push(await new Symptoms(
                    s.pk_symptom,
                    s.name,
                    s.description,
                    s.status
                ));
            });
            return symptoms;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const save = async (symptom) => {
    try {
        const symptoms = await PgSingleton.findOne(`SELECT s.* FROM symptoms s WHERE s.name = '${symptom.name}' AND s.description = '${symptom.description}'`);
        if (symptoms) {
            if (symptom.status === EStatus.ACTIVE)
                throw new ResponseError("Error!", "Already exist!");
            const result = await PgSingleton.update(
                `UPDATE symptoms SET status = ${EStatus.ACTIVE} WHERE pk_symptom = ${symptoms.pk_symptom}`,
                `SELECT s.* FROM symptoms s WHERE s.pk_symptom = ${symptoms.pk_symptom} AND s.status = ${EStatus.ACTIVE}`
            )
            if (!result)
                throw new ResponseError("Error", "Not updated");
            return await convert(result, 'one');
        }
        const result = await PgSingleton.save(
            `INSERT INTO symptoms (name, description, status) VALUES ('${symptom.name}', '${symptom.description}', ${EStatus.ACTIVE})`,
            `SELECT s.* FROM symptoms s WHERE s.name = '${symptom.name}' AND s.description = '${symptom.description}' AND s.status = ${EStatus.ACTIVE}`);
        if (!result)
            throw new ResponseError("Error", "Not inserted");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getAll = async () => {
    try {
        const result = await PgSingleton.find(`SELECT s.* FROM symptoms s WHERE s.status = ${EStatus.ACTIVE} ORDER BY s.name`);
        if (!result)
            throw new ResponseError("Error", "Not found");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getByID = async (id) => {
    try {
        const result = await PgSingleton.findOne(`SELECT s.* FROM symptoms s WHERE s.status = ${EStatus.ACTIVE} AND s.pk_symptom = ${id}`);
        if (!result)
            throw new ResponseError("Error", "Not found");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getByDisease = async (disease) => {
    try {
        const result = await PgSingleton.find(`
            SELECT distinct s.*
            FROM symptoms s
            INNER JOIN symptomsfordesease sfd ON s.pk_symptom = sfd.fk_symptom 
            WHERE sfd.fk_disease = ${disease} AND s.status = ${EStatus.ACTIVE}
            ORDER BY s.name
        `);
        if (!result)
            throw new ResponseError("Error", "Not found");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const update = async (symptom) => {
    try {
        const symptoms = await PgSingleton.findOne(`SELECT s.* FROM symptoms s WHERE s.name = '${symptom.name}' AND s.description = '${symptom.description}'`);
        if (symptoms)
            throw new ResponseError("Error!", "Already exist!");
        const result = await PgSingleton.update(
            `UPDATE symptoms SET name = '${symptom.name}', description = '${symptom.description}' WHERE pk_symptom = ${symptom.id}`,
            `SELECT s.* FROM symptoms s WHERE s.pk_symptom = ${symptom.id} AND s.status = ${EStatus.ACTIVE}`
        )
        if (!result)
            throw new ResponseError("Error", "Not updated");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const delet = async (id) => {
    try {
        const result = await PgSingleton.delete(
            `UPDATE symptoms SET status = '${EStatus.INACTIVE}' WHERE pk_symptom = ${id}`,
            `SELECT s.* FROM symptoms s WHERE s.pk_symptom = ${id} AND s.status = ${EStatus.INACTIVE}`
        )
        if (!result)
            throw new ResponseError("Error", "Not updated");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};