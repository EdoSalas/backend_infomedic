import { PgSingleton } from "../singleton/pgSingleton";
import EStatus from "../model/enums/EStatus";
import Provinces from "../model/provinces";
import ResponseError from "../response/ResponseError";

const convert = async (province, type) => {
    try {
        if (type === 'one')
            return new Provinces(province.pk_province, province.name, province.status);
        else {
            // eslint-disable-next-line no-array-constructor
            const provinces = new Array();
            province.map(async (p) => {
                provinces.push(await new Provinces(
                    p.pk_province,
                    p.name,
                    p.status
                ));
            });
            return provinces;
        }
    } catch (error) {
        throw error;
    }
};

export const getAll = async () => {
    try {
        const result = await PgSingleton.find(`SELECT p.* FROM provinces p WHERE p.status = ${EStatus.ACTIVE}`);
        if (!result)
            throw new ResponseError("Error", "Not founded");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getByID = async (id) => {
    try {
        const result = await PgSingleton.findOne(`SELECT p.* FROM provinces p WHERE p.status = ${EStatus.ACTIVE} AND p.pk_province = ${id}`);
        if (!result)
            throw new ResponseError("Error", "Not founded");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getByName = async (name) => {
    try {
        const result = await PgSingleton.findOne(`SELECT p.* FROM provinces p WHERE p.status = ${EStatus.ACTIVE} AND p.name = '${name}'`);
        if (!result)
            throw new ResponseError("Error", "Not founded");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getByRiskFactor = async (riskFactor) => {
    try {
        const result = await PgSingleton.find(`
            SELECT DISTINCT p.*
            FROM provinces p 
            INNER JOIN cantons c ON p.pk_province = c.fk_province 
            INNER JOIN users u ON c.pk_canton = u.fk_canton 
            INNER JOIN riskforusers rfu ON rfu.fk_user = u.pk_user 
            WHERE rfu.fk_riskfactor = ${riskFactor}
            ORDER BY p."name" 
        `);
        if (!result)
            throw new ResponseError("Error", "Not founded");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};