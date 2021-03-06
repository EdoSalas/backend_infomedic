import { PgSingleton } from "../singleton/pgSingleton";
import EStatus from "../model/enums/EStatus";
import MedicalRecomendations from "../model/medicalRecomendations";
import ResponseError from "../response/ResponseError";

const convert = async (medRecomendation, type) => {
    try {
        if (type === 'one')
            return new MedicalRecomendations(medRecomendation.pk_medrecomendation, medRecomendation.title, medRecomendation.description, medRecomendation.status, medRecomendation.fk_user);
        else {
            // eslint-disable-next-line no-array-constructor
            const medicalRecomendations = new Array();
            medRecomendation.map(async (md) => {
                medicalRecomendations.push(await new MedicalRecomendations(
                    md.pk_medrecomendation,
                    md.title,
                    md.description,
                    md.status,
                    md.fk_user
                ));
            });
            return medicalRecomendations;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const save = async (md) => {
    try {
        const medicalRecomendation = await PgSingleton.findOne(`SELECT m.* FROM medicalrecomendations m WHERE m.title = '${md.title}' AND m.description = '${md.description}'`);
        if (medicalRecomendation) {
            if (medicalRecomendation.status === EStatus.ACTIVE)
                throw new ResponseError("Error!", "Already exist!");
            const result = await PgSingleton.update(
                `UPDATE medicalrecomendations SET status = ${EStatus.ACTIVE} WHERE pk_medrecomendation = ${medicalRecomendation.pk_medrecomendation}`,
                `SELECT m.* FROM medicalrecomendations m WHERE m.pk_medrecomendation = ${medicalRecomendation.pk_medrecomendation}`);
            return await convert(result, 'one');
        }

        const result = await PgSingleton.save(
            `INSERT INTO medicalrecomendations (title, description, status, fk_user) VALUES ('${md.title}', '${md.description}', ${EStatus.ACTIVE}, ${md.user})`,
            `SELECT m.* FROM medicalrecomendations m WHERE m.title = '${md.title}' AND m.description = '${md.description}' AND m.status = ${EStatus.ACTIVE}`
        );
        if (!result)
            throw new ResponseError("Error", "Not inserted");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getAll = async () => {
    try {
        const result = await PgSingleton.find(`SELECT m.* FROM medicalrecomendations m WHERE m.status = ${EStatus.ACTIVE} ORDER BY m.title`);
        if (!result)
            throw new ResponseError("Error", "Not found");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getByID = async (id) => {
    try {
        const result = await PgSingleton.findOne(`SELECT m.* FROM medicalrecomendations m WHERE m.status = ${EStatus.ACTIVE} AND m.pk_medrecomendation = ${id}`);
        if (!result)
            throw new ResponseError("Error", "Not found");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const update = async (medicalRecomendations) => {
    try {
        const medicalRecomendation = await PgSingleton.findOne(`SELECT m.* FROM medicalrecomendations m WHERE m.title = '${medicalRecomendations.title}' AND m.description = '${medicalRecomendations.description}'`)
        if(medicalRecomendation)
            throw new ResponseError("Error!", "There is already a medicalRecomendation");
        const result = await PgSingleton.update(
            `UPDATE medicalrecomendations SET title = '${medicalRecomendations.title}', description = '${medicalRecomendations.description}' WHERE pk_medrecomendation = ${medicalRecomendations.id}`,
            `SELECT m.* FROM medicalrecomendations m WHERE m.pk_medrecomendation = ${medicalRecomendations.id}`);
        if (!result)
            throw new ResponseError("Error", "Not Updated");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const delet = async (id) => {
    try {
        const result = await PgSingleton.delete(
            `UPDATE medicalrecomendations SET status = ${EStatus.INACTIVE} WHERE pk_medrecomendation = ${id}`,
            `SELECT m.* FROM medicalrecomendations m WHERE m.pk_medrecomendation = ${id} AND m.status = ${EStatus.INACTIVE}`);
        if (!result)
            throw new ResponseError("Error", "Not Deleted");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};