import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import DiseasesForUser from "../model/reports/diseasesForUser.reports";
import * as userCtrl from "./users.controller";

const diseasesForUserByRiskFactors = async (id) => {
    try {
        const user = await userCtrl.getByID(id);
        if(!user)
            throw new ResponseError("Error!", "Not user founded");

        const diseases = await PgSingleton.find(`
            SELECT DISTINCT d.*
            FROM users u 
            INNER JOIN riskforusers rfu ON u.pk_user = rfu.fk_user
            INNER JOIN risksfordisease rfd ON rfu.fk_riskfactor = rfd.fk_riskfactor 
            INNER JOIN diseases d ON rfd.fk_disease = d.pk_disease 
            WHERE u.id = '${user.idNumber}' AND u.status = ${EStatus.ACTIVE}
        `);

        if(!diseases)
            throw new ResponseError("Error!", "Not diseases founded");

        return new DiseasesForUser(user, diseases);
    } catch (error) {
        throw error;
    }
};

const diseasesForUserBySymptoms = async (id) => {
    try {
        const user = await userCtrl.getByID(id);
        if(!user)
            throw new ResponseError("Error!", "Not user founded");

        const diseases = await PgSingleton.find(`
            SELECT DISTINCT d.*
            FROM users u 
            INNER JOIN symptomsforuser sfu ON u.pk_user = sfu.fk_user
            INNER JOIN symptomsfordesease sfd ON sfu.fk_symptom = sfd.fk_symptom 
            INNER JOIN diseases d ON sfd.fk_disease = d.pk_disease 
            WHERE u.id = '${user.idNumber}' AND u.status = ${EStatus.ACTIVE}
        `);

        if(!diseases)
            throw new ResponseError("Error!", "Not diseases founded");

        return new DiseasesForUser(user, diseases);
    } catch (error) {
        throw error;
    }
};


export const diseasesForUser = async (user, type) => {
    try {
        if(type === 'symptom')
            return await diseasesForUserBySymptoms(user);
        else if (type === 'riskFactor')
            return await diseasesForUserByRiskFactors(user);
        else
            throw new ResponseError("Error!", "Not valid option");
    } catch (error) {
        throw error;
    }
}