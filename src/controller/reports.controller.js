import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import DiseasesForUser from "../model/reports/diseasesForUser.reports";
import DiseasesForRegion from "../model/reports/diseasesForRegion.reports";
import * as userCtrl from "./users.controller";
import * as diseasesCtrl from "./diseases.controller";
import * as symptomCtrl from "./symptoms.controller";
import * as cantonCtrl from "./cantons.controller";
import * as provinceCtrl from "./provinces.controller";
import * as regionCtrl from "./regions.controller";

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
                    WHERE u.id = '${user.idNumber}' AND u.status = ${EStatus.ACTIVE} AND d.pk_disease = ${d.id}
                `);
                if (amountUserSymptoms.symptoms > 0) {
                    const percentage = (amountUserSymptoms.symptoms * 100) / amount.symptoms;
                    if (percentage >= 75) {
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

export const diseasesForUserReport = async (id, initDate, finalDate) => {
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
                    if (percentage >= 75) {
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
                const r = await diseasesForUserReport(u.idNumber, initDate, finalDate);
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
        if (!symptoms)
            throw new ResponseError("Error!", "Not symptoms founded");
        return symptoms;
    } catch (error) {
        throw error;
    }
};

export const diseaseForSymptoms = async (symptom) => {
    try {
        const diseases = await diseasesCtrl.getBySymptom(symptom);
        if (!diseases)
            throw new ResponseError("Error!", "Not symptoms founded");
        return diseases;
    } catch (error) {
        throw error;
    }
};

export const cantonWithMoreSymptoms = async (initDate, finalDate) => {
    try {
        const cantons = await cantonCtrl.getAll();
        // eslint-disable-next-line no-array-constructor
        const canton = new Array();
        await Promise.all(
            cantons.map(async (c) => {
                const amountByCanton = await PgSingleton.findOne(`
                    SELECT COUNT(distinct s.fk_symptom) as amount
                    FROM cantons c 
                    INNER JOIN users u ON c.pk_canton = u.fk_canton 
                    INNER JOIN symptomsforuser s ON u.pk_user = s.fk_user 
                    WHERE c.pk_canton = ${c.id} AND s.date BETWEEN '${initDate}' AND '${finalDate}'
                `);
                c['amount'] = amountByCanton.amount;
                canton.push(c);
            })
        );
        canton.sort((a, b) => b.amount - a.amount);
        return canton;
    } catch (error) {
        throw error;
    }
};

export const provinceWithMoreSymptoms = async (initDate, finalDate) => {
    try {
        const provinces = await provinceCtrl.getAll();
        // eslint-disable-next-line no-array-constructor
        const province = new Array();
        await Promise.all(
            provinces.map(async (p) => {
                const amountByProvince = await PgSingleton.findOne(`
                    SELECT COUNT(distinct s.fk_symptom) as amount
                    FROM provinces p 
                    INNER JOIN cantons c ON p.pk_province = c.fk_province 
                    INNER JOIN users u ON c.pk_canton = u.fk_canton 
                    INNER JOIN symptomsforuser s ON u.pk_user = s.fk_user 
                    WHERE p.pk_province = ${p.id} AND s.date BETWEEN '${initDate}' AND '${finalDate}'
                `);
                p['amount'] = amountByProvince.amount;
                province.push(p);
            })
        );
        province.sort((a, b) => b.amount - a.amount);
        return province;
    } catch (error) {
        throw error;
    }
};

export const regionsWithMoreSymptoms = async (initDate, finalDate) => {
    try {
        const regions = await regionCtrl.getAll();
        // eslint-disable-next-line no-array-constructor
        const region = new Array();
        await Promise.all(
            regions.map(async (r) => {
                const amountByRegion = await PgSingleton.findOne(`
                    SELECT COUNT(distinct s.fk_symptom) as amount
                    FROM regions r 
                    INNER JOIN cantons c ON r.pk_region = c.fk_region 
                    INNER JOIN users u ON c.pk_canton = u.fk_canton 
                    INNER JOIN symptomsforuser s ON u.pk_user = s.fk_user 
                    WHERE r.pk_region = ${r.id} AND s.date BETWEEN '${initDate}' AND '${finalDate}'
                `);
                r['amount'] = amountByRegion.amount;
                region.push(r);
            })
        );
        region.sort((a, b) => b.amount - a.amount);
        return region;
    } catch (error) {
        throw error;
    }
};

export const cantonWithRiskFactor = async (riskFactor) => {
    try {
        const cantons = await cantonCtrl.getByRiskFactor(riskFactor);
        if (!cantons)
            throw new ResponseError("Error!", "Not founded");
        return cantons;
    } catch (error) {
        throw error;
    }
};

export const provinceWithRiskFactor = async (riskFactor) => {
    try {
        const provinces = await provinceCtrl.getByRiskFactor(riskFactor);
        if (!provinces)
            throw new ResponseError("Error!", "Not founded");
        return provinces;
    } catch (error) {
        throw error;
    }
};

export const regionWithRiskFactor = async (riskFactor) => {
    try {
        const regions = await regionCtrl.getByRiskFactor(riskFactor);
        if (!regions)
            throw new ResponseError("Error!", "Not founded");
        return regions;
    } catch (error) {
        throw error;
    }
};

export const genderWithMoreSymptoms = async (region, initDate, finalDate) => {
    try {
        const masc = await PgSingleton.findOne(`
            SELECT COUNT(DISTINCT sfu.fk_symptom) as amount
            FROM users u 
            INNER JOIN symptomsforuser sfu ON u.pk_user = sfu.fk_user 
            INNER JOIN cantons c ON u.fk_canton = c.pk_canton 
            INNER JOIN regions r ON c.fk_region = r.pk_region 
            WHERE u.gender = 'M' AND u.status = ${EStatus.ACTIVE} AND r.pk_region = ${region} AND sfu."date" between '${initDate}' AND '${finalDate}'
        `);
        if (!masc)
            throw new ResponseError("Error!", "Not found");
        const fem = await PgSingleton.findOne(`
            SELECT COUNT(DISTINCT sfu.fk_symptom) as amount
            FROM users u 
            INNER JOIN symptomsforuser sfu ON u.pk_user = sfu.fk_user 
            INNER JOIN cantons c ON u.fk_canton = c.pk_canton 
            INNER JOIN regions r ON c.fk_region = r.pk_region 
            WHERE u.gender = 'F' AND u.status = ${EStatus.ACTIVE} AND r.pk_region = ${region} AND sfu."date" between '${initDate}' AND '${finalDate}'
        `);
        if (!fem)
            throw new ResponseError("Error!", "Not found");
        const payload = {
            "Masculino": masc.amount,
            "Femenino": fem.amount
        };
        return payload;
    } catch (error) {
        throw error;
    }
};

export const ageMostAffected = async (initDate, finalDate) => {
    try {
        let minDate = await PgSingleton.findOne(`SELECT u.dateofbirth AS date FROM users u WHERE u.status = ${EStatus.ACTIVE} ORDER BY u.dateofbirth ASC LIMIT 1`);
        if (!minDate)
            throw new ResponseError("Error!", "Date not founded");
        minDate = +minDate.date.toString().substr(11, 4);
        let maxDate = await PgSingleton.findOne(`SELECT u.dateofbirth AS date FROM users u WHERE u.status = ${EStatus.ACTIVE} ORDER BY u.dateofbirth DESC LIMIT 1`);
        if (!maxDate)
            throw new ResponseError("Error!", "Date not founded");
        maxDate = +maxDate.date.toString().substr(11, 4);
        // eslint-disable-next-line no-array-constructor
        const ageAffected = new Array();
        let result = await PgSingleton.findOne(`
            SELECT COUNT(DISTINCT s.fk_symptom) AS amount
            FROM users u 
            INNER JOIN symptomsforuser s ON u.pk_user = s.fk_user 
            WHERE u.dateofbirth BETWEEN '${minDate}-01-01' AND '${minDate + 5}-12-31' AND s.date BETWEEN '${initDate}' AND '${finalDate}'
        `);
        ageAffected.push({ "Age": `${minDate} - ${minDate + 5}`, "Affected": result.amount });
        while (minDate < maxDate) {
            minDate += 6;
            let result = await PgSingleton.findOne(`
                SELECT COUNT(DISTINCT s.fk_symptom) AS amount
                FROM users u 
                INNER JOIN symptomsforuser s ON u.pk_user = s.fk_user 
                WHERE u.dateofbirth BETWEEN '${minDate}-01-01' AND '${minDate + 5}-12-31' AND s.date BETWEEN '${initDate}' AND '${finalDate}'
            `);
            ageAffected.push({ "Age": `${minDate} - ${minDate + 5}`, "Affected": result.amount });
        }
        return ageAffected;
    } catch (error) {
        throw error;
    }
};