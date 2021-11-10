import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import Diseases from "../model/diseases";

const convert = (disease, type) => {
    try {
        if (type === 'one')
            return new Diseases(disease.pk_disease, disease.name, disease.status);
        else {
            // eslint-disable-next-line no-array-constructor
            const diseases = Array();
            disease.map(async (d) => {
                diseases.push(await new Diseases(
                    d.pk_disease,
                    d.name,
                    d.status,
                ));
            });
            return diseases;
        }
    } catch (error) {
        throw error;
    }
};

export const save = async (name) => {
    try {
        let disease = await PgSingleton.findOne(`SELECT d.* FROM diseases d WHERE d.name = '${name}'`);
        if(disease){
            disease = await PgSingleton.update(
                `UPDATE diseases SET status = ${EStatus.ACTIVE} WHERE pk_disease = ${disease.pk_disease}`,
                `SELECT d.* FROM diseases d WHERE d.pk_disease = ${disease.pk_disease} AND d.status = ${EStatus.ACTIVE}`
            );
            return await convert(disease, 'one');
        }

        const result = await PgSingleton.save(
            `INSERT INTO diseases (name, status) VALUES ('${name}', ${EStatus.ACTIVE})`,
            `SELECT d.* FROM diseases d WHERE d.name = '${name}'`);
        if (!result)
            throw new ResponseError("Error!", "Not Inserted");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getAll = async () => {
    try {
        const result = await PgSingleton.find(`SELECT d.* FROM diseases d WHERE d.status = ${EStatus.ACTIVE}`);
        if(!result)
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getByID = async (id) => {
    try {
        const result = await PgSingleton.findOne(`SELECT d.* FROM diseases d WHERE d.status = ${EStatus.ACTIVE} AND d.pk_disease = ${id}`);
        if(!result)
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getByName = async (name) => {
    try {
        const result = await PgSingleton.findOne(`SELECT d.* FROM diseases d WHERE d.status = ${EStatus.ACTIVE} AND d.name = '${name}'`);
        if(!result)
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getByriskFactor = async (riskFactor) => {
    try {
        const result = await PgSingleton.find(`SELECT d.* FROM diseases d INNER JOIN risksfordisease rdf ON d.pk_disease = rdf.fk_disease WHERE d.status = ${EStatus.ACTIVE} AND rdf.fk_riskfactor = ${riskFactor}`);
        if(!result)
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getBySymptom = async (symptom) => {
    try {
        const result = await PgSingleton.find(`
            SELECT distinct d.*
            FROM diseases d 
            INNER JOIN symptomsfordesease sfd ON d.pk_disease = sfd.fk_disease 
            WHERE sfd.fk_symptom = ${symptom} AND d.status = ${EStatus.ACTIVE}
        `);
        if(!result)
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const update = async (disease) => {
    try {
        let diseases = await PgSingleton.findOne(`SELECT d.* FROM diseases d WHERE d.name = '${disease.name}'`);
        if(diseases)
            throw new ResponseError("Error!", "There is already a disease with that name");

        const result = await PgSingleton.update(
            `UPDATE diseases SET name = '${disease.name}' WHERE pk_disease = ${disease.id}`,
            `SELECT d.* FROM diseases d WHERE d.pk_disease = ${disease.id}`
        );
        if(!result)
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const delet = async (disease) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE diseases SET status = ${EStatus.INACTIVE} WHERE pk_disease = ${disease.id}`,
            `SELECT d.* FROM diseases d WHERE d.pk_disease = ${disease.id} AND d.status = ${EStatus.INACTIVE}`
        );
        if(!result)
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};