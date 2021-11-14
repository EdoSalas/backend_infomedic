//Imports
import { PgSingleton } from "../singleton/pgSingleton";
import EStatus from "../model/enums/EStatus";
import Regions from "../model/regions";

export const save = async (name) => {
    try {
        const result = await PgSingleton.save(
            `INSERT INTO regions (name, status) VALUES ('${name}', ${EStatus.ACTIVE})`,
            `SELECT r.* FROM regions r WHERE r.status = ${EStatus.ACTIVE} AND r.name = '${name}'`
        );
        if (!result)
            throw new Error("Not inserted");
        return new Regions(result.pk_region, result.name, EStatus.ACTIVE);
    } catch (error) {
        throw error;
    }
};

export const getAll = async () => {
    try {
        const result = await PgSingleton.find(`SELECT r.* FROM regions r WHERE r.status = ${EStatus.ACTIVE}`);
        if (!result)
            throw new Error("Not Found");
        // eslint-disable-next-line no-array-constructor
        const regions = new Array();
        result.map(async (r) => {
            regions.push(new Regions(
                r.pk_region,
                r.name,
                EStatus.ACTIVE
            ));
        });
        return regions;
    } catch (error) {
        throw error;
    }
};

export const getByID = async (id) => {
    try {
        const result = await PgSingleton.findOne(`SELECT r.* FROM regions r WHERE r.status = ${EStatus.ACTIVE} AND r.pk_region = ${id}`);
        if (!result)
            throw new Error("Not Found");
        return new Regions(result.pk_region, result.name, EStatus.ACTIVE);
    } catch (error) {
        throw error;
    }
}

export const getByName = async (name) => {
    try {
        const result = await PgSingleton.findOne(`SELECT r.* FROM regions r WHERE r.status = ${EStatus.ACTIVE} AND r.name = ${name}`);
        if (!result)
            throw new Error("Not Found");
        return new Regions(result.pk_region, result.name, EStatus.ACTIVE);
    } catch (error) {
        throw error;
    }
};

export const getByRiskFactor = async (riskFactor) => {
    try {
        const result = await PgSingleton.find(`
            SELECT r.*
            FROM regions r 
            INNER JOIN cantons c ON r.pk_region = c.fk_region 
            INNER JOIN users u ON c.pk_canton = u.fk_canton 
            INNER JOIN riskforusers rfu ON rfu.fk_user = u.pk_user 
            WHERE rfu.fk_riskfactor = ${riskFactor}
            ORDER BY r."name" 
        `);
        if (!result)
            throw new Error("Not Found");
        // eslint-disable-next-line no-array-constructor
        const regions = new Array();
        result.map(async (r) => {
            regions.push(new Regions(
                r.pk_region,
                r.name,
                EStatus.ACTIVE
            ));
        });
        return regions;
    } catch (error) {
        throw error;
    }
};

export const update = async (id, name) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE regions SET name = '${name}' WHERE pk_region = ${id} AND status = ${EStatus.ACTIVE}`,
            `SELECT r.* FROM regions r WHERE r.status = ${EStatus.ACTIVE} AND r.pk_region = ${id}`
        );
        if (!result)
            throw new Error("Not update");
        return new Regions(result.pk_region, result.name, EStatus.ACTIVE);
    } catch (error) {
        throw error;
    }
};

export const delet = async (id) => {
    try {
        const result = await PgSingleton.delete(
            `UPDATE regions SET status = ${EStatus.INACTIVE} WHERE pk_region = ${id} AND status = ${EStatus.ACTIVE}`,
            `SELECT r.* FROM regions r WHERE r.status = ${EStatus.INACTIVE} AND r.pk_region = ${id}`
        );
        if (!result)
            throw new Error("Not update");
        return new Regions(result.pk_region, result.name, EStatus.ACTIVE);
    } catch (error) {
        throw error;
    }
};