import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import DiseasesForUser from "../model/reports/diseasesForUser.reports";
import DiseasesForRegion from "../model/reports/diseasesForRegion.reports";
import * as userCtrl from "./users.controller";
import * as diseasesCtrl from "./diseases.controller";
import * as symptomCtrl from "./symptoms.controller";

export const diseasesForUser = async (id, initDate, finalDate) => {
    try {
        const user = await userCtrl.getByID(id);
        if (!user)
            throw new ResponseError("Error!", "Not user founded");

        const allDiseases = await diseasesCtrl.getAll();
        if (!allDiseases)
            throw new ResponseError("Error!", "Not diseases founded");

        // eslint-disable-next-line no-array-constructor
        const diseases = new Array();
        await Promise.all(
            allDiseases.map(async (d) => {
                const amount = await PgSingleton.findOne(`
                    SELECT COUNT(DISTINCT sfd.fk_symptom) AS symptoms
                    FROM diseases d
                    INNER JOIN symptomsfordesease sfd ON sfd.fk_disease = d.pk_disease 
                    WHERE d.pk_disease = ${d.id}
                `);
                const amountUserSymptoms = await PgSingleton.findOne(`
                    SELECT COUNT(DISTINCT sfu.fk_symptom) AS symptoms
                    FROM diseases d 
                    INNER JOIN symptomsfordesease sfd ON d.pk_disease = sfd.fk_disease 
                    INNER JOIN symptomsforuser sfu ON sfd.fk_symptom = sfu.fk_symptom 
                    INNER JOIN users u ON sfu.fk_user = u.pk_user 
                    WHERE u.id = '${user.idNumber}' AND u.status = ${EStatus.ACTIVE} AND d.pk_disease = ${d.id} AND sfu.date BETWEEN '${initDate}' AND '${finalDate}'
                `);
                if (amountUserSymptoms.symptoms > 0) {
                    const percentage = (amountUserSymptoms.symptoms * 100) / amount.symptoms;
                    if (percentage >= 50) {
                        d['percentage'] = percentage;
                        diseases.push(d);
                    }
                }
            })
        );

        return new DiseasesForUser(user, diseases);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const diseasesForRegion = async (id, initDate, finalDate) => {
    try {
        const region = await PgSingleton.findOne(`SELECT r.* FROM regions r WHERE r.pk_region = ${id}`);
        if (!region)
            throw new ResponseError("Error!", "Not Region founded");
        const users = await userCtrl.getByRegion(id);
        if (!users)
            throw new ResponseError("Error!", "Not users founded");
        // eslint-disable-next-line no-array-constructor
        let diseases = new Array();
        await Promise.all(
            users.map(async (u) => {
                const r = await diseasesForUser(u.idNumber, initDate, finalDate);
                if (r.diseases.length > 0)
                    return await Promise.all(
                        r.diseases.map(async (d) => {
                            if (!JSON.stringify(diseases).includes(JSON.stringify(d)))
                                diseases.push(d);
                        })
                    );
            })
        );
        if (!diseases)
            throw new ResponseError("Error!", "Not diseases founded");
        return new DiseasesForRegion(region, diseases);
    } catch (error) {
        throw error;
    }
};

export const symptomsForDisease = async (disease) => {
    try {
        const symptoms = await symptomCtrl.getByDisease(disease);
        if(!symptoms)
            throw new ResponseError("Error!", "Not symptoms founded");
        return symptoms;
    } catch (error) {
        throw error;
    }
};

export const diseaseForSymptoms = async (symptom) => {
    try {
        const diseases = await diseasesCtrl.getBySymptom(symptom);
        if(!diseases)
            throw new ResponseError("Error!", "Not symptoms founded");
        return diseases;
    } catch (error) {
        throw error;
    }
};