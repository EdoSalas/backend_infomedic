import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import DiseasesForUser from "../model/reports/diseasesForUser.reports";
import * as riskFactorForUser from "./riskFactorsForUser.controller";
import * as riskFactorForDisease from "./riskFactorsForDisease.controller";
import * as userCtrl from "./users.controller";

export const diseasesForUser = async (id) => {
    try {
        const user = await userCtrl.getByID(id);

        const riskFactors = await PgSingleton.find(`
            SELECT rf.*
            FROM riskforusers rfu
            INNER JOIN users u ON rfu.fk_user = u.pk_user 
            INNER JOIN riskfactors rf ON rfu.fk_riskfactor = rf.pk_riskfactor 
            WHERE u.pk_user = ${user.id} AND u.status = ${EStatus.ACTIVE} AND rfu.status = ${EStatus.ACTIVE}
        `);

        const diseases = await Promise.all(
            riskFactors.map(async (rf) => {
                return await PgSingleton.findOne(`
                    SELECT d.*
                    FROM risksfordisease rfd
                    INNER JOIN diseases d ON rfd.fk_disease = d.pk_disease 
                    INNER JOIN riskfactors rf ON rfd.fk_riskfactor = rf.pk_riskfactor 
                    WHERE rf.pk_riskfactor = ${rf.pk_riskfactor} AND rfd.status = ${EStatus.ACTIVE}
                `);
            })
        );
        return new DiseasesForUser(user, diseases);
    } catch (error) {
        throw error;
    }
};