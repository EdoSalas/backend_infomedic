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
                EType.USER,
                user.password,
                EStatus.ACTIVE,
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
                    EType.USER,
                    u.password,
                    EStatus.ACTIVE,
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
        const result = await PgSingleton.save(
            `INSERT INTO users (id, name, lastnames, dateofbirth, email, type, status, fk_canton, password) VALUES ('${user.idNumber}', '${user.name}', '${user.lastname}', '${user.dateOfBirth}', '${user.email}', ${EType.USER}, ${EStatus.ACTIVE}, ${user.canton}, '${user.password}')`,
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
            INNER JOIN regions r ON c.fk_region = r.pk_region WHERE u.type = ${EType.USER} AND u.status = ${EStatus.ACTIVE}`);
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
            `UPDATE users SET name = '${user.name}', lastnames = '${user.lastname}', email = '${user.email}', fk_canton = ${user.canton} WHERE id = '${user.idNumber}'`,
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