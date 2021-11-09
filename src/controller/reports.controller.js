import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import DiseasesForUser from "../model/reports/diseasesForUser.reports";
import * as userCtrl from "./users.controller";

export const diseasesForUser = async (id) => {
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