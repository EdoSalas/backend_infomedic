import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import Cantons from "../model/cantons";

const convert = (canton, type) => {
    try {
        if(type === 'one')
            return new Cantons(canton.pk_canton, canton.name, canton.fk_province, canton.fk_region, canton.status, canton.province, canton.region);
        else {
            // eslint-disable-next-line no-array-constructor
            const cantons = Array();
            canton.map(async (c) => {
                cantons.push(await new Cantons(
                    c.pk_canton,
                    c.name,
                    c.fk_province,
                    c.fk_region,
                    c.status,
                    c.province,
                    c.region
                ));
            });
            return cantons;
        }
    } catch (error) {
        throw error;
    }
};

export const getAll = async () => {
    try {
        const result = await PgSingleton.find(`SELECT c.*, p.name as province, r.name as region 
                                                FROM cantons c
                                                INNER JOIN provinces p on c.fk_province = p.pk_province
                                                INNER JOIN regions r on c.fk_region = r.pk_region 
                                                WHERE c.status = ${EStatus.ACTIVE}
                                                ORDER BY r.pk_region, p.pk_province, c.pk_canton`);
        if(!result)
            throw new ResponseError("Error", "Not founded");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getByID = async (id) => {
    try {
        const result = await PgSingleton.findOne(`SELECT c.*, p.name as province, r.name as region 
                                                FROM cantons c
                                                INNER JOIN provinces p on c.fk_province = p.pk_province
                                                INNER JOIN regions r on c.fk_region = r.pk_region 
                                                WHERE c.status = ${EStatus.ACTIVE} AND c.pk_canton = ${id}
                                                ORDER BY r.pk_region, p.pk_province, c.pk_canton`);
        if(!result)
            throw new ResponseError("Error", "Not founded");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getByProvince = async (province) => {
    try {
        const result = await PgSingleton.find(`SELECT c.*, p.name as province, r.name as region 
                                                FROM cantons c
                                                INNER JOIN provinces p on c.fk_province = p.pk_province
                                                INNER JOIN regions r on c.fk_region = r.pk_region
                                                WHERE c.status = ${EStatus.ACTIVE} AND c.fk_province = '${province}'
                                                ORDER BY r.pk_region, p.pk_province, c.pk_canton`);
        if(!result)
            throw new ResponseError("Error", "Not founded");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getByRegion = async (region) => {
    try {
        const result = await PgSingleton.find(`SELECT c.*, p.name as province, r.name as region 
                                                FROM cantons c
                                                INNER JOIN provinces p on c.fk_province = p.pk_province
                                                INNER JOIN regions r on c.fk_region = r.pk_region
                                                WHERE c.status = ${EStatus.ACTIVE} AND r.name = '${region}'
                                                ORDER BY r.pk_region, p.pk_province, c.pk_canton`);
        if(!result)
            throw new ResponseError("Error", "Not founded");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getByRiskFactor = async (riskFactor) => {
    try {
        const result = await PgSingleton.find(`
            SELECT DISTINCT c.*
            FROM cantons c 
            INNER JOIN users u ON c.pk_canton = u.fk_canton 
            INNER JOIN riskforusers rfu ON rfu.fk_user = u.pk_user 
            WHERE rfu.fk_riskfactor = ${riskFactor}
            ORDER BY c.name
        `);
        if(!result)
            throw new ResponseError("Error", "Not founded");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};