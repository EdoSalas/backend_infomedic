import { PgSingleton } from "../singleton/pgSingleton";
import EStatus from "../model/enums/EStatus";
import EType from "../model/enums/EType";
import Users from "../model/users";
import { ResponseError } from "../response/ResponseError";

const convert = async (user, type) => {
    try {
        if (type === 'one') {
            return new Users(
                user.pk_user,
                user.id,
                user.name,
                user.lastnames,
                user.dateofbirth,
                user.gender,
                user.email,
                user.type,
                user.password,
                user.status,
                user.fk_canton,
                `${user.canton} - ${user.province} - Región ${user.region}`
            );
        }
        else {
            // eslint-disable-next-line no-array-constructor
            const users = new Array();
            user.map(async (u) => {
                users.push(await new Users(
                    u.pk_user,
                    u.id,
                    u.name,
                    u.lastnames,
                    u.dateofbirth,
                    u.gender,
                    u.email,
                    u.type,
                    u.password,
                    u.status,
                    u.fk_canton,
                    `${u.canton} - ${u.province} - Región ${u.region}`
                ));
            });
            return users;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const save = async (user) => {
    try {
        const u = await PgSingleton.findOne(`SELECT u.* FROM users u WHERE u.id = ${user.idNumber}`);
        if (u) {
            if (u.status === EStatus.ACTIVE)
                throw new ResponseError("Error!", "Already exist");
            const result = await PgSingleton.update(
                `UPDATE users SET status = ${EStatus.ACTIVE} WHERE id = '${user.idNumber}'`,
                `SELECT u.*, c."name" as canton, p."name" as province, r."name" as region
                    FROM users u 
                    INNER JOIN cantons c ON u.fk_canton = c.pk_canton 
                    INNER JOIN provinces p ON c.fk_province = p.pk_province 
                    INNER JOIN regions r ON c.fk_region = r.pk_region WHERE u.status = ${EStatus.ACTIVE} AND u.id = '${user.idNumber}'`);
            return await convert(result, 'one');
        }
        const result = await PgSingleton.save(
            `INSERT INTO users (id, name, lastnames, dateofbirth, email, type, status, fk_canton, password, gender) VALUES ('${user.idNumber}', '${user.name}', '${user.lastname}', '${user.dateOfBirth}', '${user.email}', ${EType.USER}, ${EStatus.ACTIVE}, ${user.canton}, '${user.password}', '${user.genero}')`,
            `SELECT u.*, c."name" as canton, p."name" as province, r."name" as region
             FROM users u 
             INNER JOIN cantons c ON u.fk_canton = c.pk_canton 
             INNER JOIN provinces p ON c.fk_province = p.pk_province 
             INNER JOIN regions r ON c.fk_region = r.pk_region 
             WHERE u.id = '${user.idNumber}'`);
        if (!result)
            throw new ResponseError("Error", "Not inserted");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getAll = async () => {
    try {
        const result = await PgSingleton.find(`SELECT u.*, c."name" as canton, p."name" as province, r."name" as region
            FROM users u 
            INNER JOIN cantons c ON u.fk_canton = c.pk_canton 
            INNER JOIN provinces p ON c.fk_province = p.pk_province 
            INNER JOIN regions r ON c.fk_region = r.pk_region WHERE u.status = ${EStatus.ACTIVE}`);
        if (!result)
            throw new ResponseError("Error", "Not result");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getByID = async (id) => {
    try {
        const result = await PgSingleton.findOne(`SELECT u.*, c."name" as canton, p."name" as province, r."name" as region
            FROM users u 
            INNER JOIN cantons c ON u.fk_canton = c.pk_canton 
            INNER JOIN provinces p ON c.fk_province = p.pk_province 
            INNER JOIN regions r ON c.fk_region = r.pk_region WHERE u.status = ${EStatus.ACTIVE} AND u.id = '${id}'`);
        if (!result)
            throw new ResponseError("Error", "Not result");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getByPK = async (id) => {
    try {
        const result = await PgSingleton.findOne(`SELECT u.*, c."name" as canton, p."name" as province, r."name" as region
            FROM users u 
            INNER JOIN cantons c ON u.fk_canton = c.pk_canton 
            INNER JOIN provinces p ON c.fk_province = p.pk_province 
            INNER JOIN regions r ON c.fk_region = r.pk_region WHERE u.status = ${EStatus.ACTIVE} AND u.pk_user = ${id}`);
        if (!result)
            throw new ResponseError("Error", "Not result");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getByRegion = async (region) => {
    try {
        const result = await PgSingleton.find(`
            SELECT u.*
            FROM regions r
            INNER JOIN cantons c ON r.pk_region = c.fk_region 
            INNER JOIN users u ON c.pk_canton = u.fk_canton 
            WHERE r.pk_region = ${region}
        `);
        if (!result)
            throw new ResponseError("Error", "Not result");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getByGender = async (gender) => {
    try {
        const result = await PgSingleton.find(`SELECT u.*, c."name" as canton, p."name" as province, r."name" as region
            FROM users u 
            INNER JOIN cantons c ON u.fk_canton = c.pk_canton 
            INNER JOIN provinces p ON c.fk_province = p.pk_province 
            INNER JOIN regions r ON c.fk_region = r.pk_region WHERE u.status = ${EStatus.ACTIVE} AND u.gender = '${gender}'`);
        if (!result)
            throw new ResponseError("Error", "Not result");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getByCredential = async (user) => {
    try {
        const result = await PgSingleton.findOne(`SELECT u.*, c."name" as canton, p."name" as province, r."name" as region
            FROM users u 
            INNER JOIN cantons c ON u.fk_canton = c.pk_canton 
            INNER JOIN provinces p ON c.fk_province = p.pk_province 
            INNER JOIN regions r ON c.fk_region = r.pk_region WHERE u.status = ${EStatus.ACTIVE} AND u.id = '${user.idNumber}' AND u.password = '${user.password}'`);
        if (!result)
            throw new ResponseError("Error", "Not result");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const update = async (user) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE users SET name = '${user.name}', lastnames = '${user.lastname}', email = '${user.email}', fk_canton = ${user.canton}, dateofbirth = '${user.dateOfBirth}' WHERE id = '${user.idNumber}'`,
            `SELECT u.*, c."name" as canton, p."name" as province, r."name" as region
            FROM users u 
            INNER JOIN cantons c ON u.fk_canton = c.pk_canton 
            INNER JOIN provinces p ON c.fk_province = p.pk_province 
            INNER JOIN regions r ON c.fk_region = r.pk_region WHERE u.status = ${EStatus.ACTIVE} AND u.id = '${user.idNumber}'`);
        if (!result)
            throw new ResponseError("Error", "Not updated");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const changePassword = async (user) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE users SET password = '${user.password}' WHERE id = '${user.idNumber}'`,
            `SELECT u.*, c."name" as canton, p."name" as province, r."name" as region
            FROM users u 
            INNER JOIN cantons c ON u.fk_canton = c.pk_canton 
            INNER JOIN provinces p ON c.fk_province = p.pk_province 
            INNER JOIN regions r ON c.fk_region = r.pk_region WHERE u.status = ${EStatus.ACTIVE} AND u.id = '${user.idNumber}'`);
        if (!result)
            throw new ResponseError("Error", "Not updated");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const delet = async (id) => {
    try {
        const result = await PgSingleton.delete(
            `UPDATE users SET status = ${EStatus.INACTIVE} WHERE id = '${id}'`,
            `SELECT u.* FROM users u WHERE u.status = ${EStatus.INACTIVE} AND u.id = '${id}'`);
        if (!result)
            throw new ResponseError("Error", "Not deleted");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};