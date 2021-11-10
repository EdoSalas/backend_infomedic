import { PgSingleton } from "../singleton/pgSingleton";
import ResponseError from "../response/ResponseError";
import EStatus from "../model/enums/EStatus";
import RiskFactors from "../model/riskFactors";

const convert = (riskFactor, type) => {
    try {
        if (type === 'one')
            return new RiskFactors(riskFactor.pk_riskfactor, riskFactor.name, riskFactor.status);
        else {
            // eslint-disable-next-line no-array-constructor
            const riskFactors = Array();
            riskFactor.map(async (rf) => {
                riskFactors.push(await new RiskFactors(
                    rf.pk_riskfactor,
                    rf.name,
                    rf.status,
                ));
            });
            return riskFactors;
        }
    } catch (error) {
        throw error;
    }
};

export const save = async (name) => {
    try {
        let riskFactor = await PgSingleton.findOne(`SELECT rf.* FROM riskfactors rf WHERE rf.name = '${name}'`);
        if(riskFactor){
            if(riskFactor.status === EStatus.ACTIVE)
                throw new ResponseError("Error!", "Already exist!");
            
            riskFactor = await PgSingleton.update(
                `UPDATE riskfactors SET status = ${EStatus.ACTIVE} WHERE pk_riskfactor = ${riskFactor.pk_riskfactor}`,
                `SELECT rf.* FROM riskfactors rf WHERE rf.pk_riskfactor = ${riskFactor.pk_riskfactor} AND rf.status = ${EStatus.ACTIVE}`
            );
            return await convert(riskFactor, 'one');
        }
        const result = await PgSingleton.save(
            `INSERT INTO riskfactors (name, status) VALUES ('${name}', ${EStatus.ACTIVE})`,
            `SELECT rf.* FROM riskfactors rf WHERE rf.name = '${name}'`);
        if (!result)
            throw new ResponseError("Error!", "Not Inserted");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getAll = async () => {
    try {
        const result = await PgSingleton.find(`SELECT rf.* FROM riskfactors rf WHERE rf.status = ${EStatus.ACTIVE}`);
        if(!result) 
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'more');
    } catch (error) {
        throw error;
    }
};

export const getByID = async (id) => {
    try {
        const result = await PgSingleton.findOne(`SELECT rf.* FROM riskfactors rf WHERE rf.status = ${EStatus.ACTIVE} and rf.pk_riskfactor = ${id}`);
        if(!result)
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const getByName = async (name) => {
    try {
        const result = await PgSingleton.findOne(`SELECT rf.* FROM riskfactors rf WHERE rf.status = ${EStatus.ACTIVE} and rf.name = '${name}'`);
        if(!result)
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const update = async (riskfactor) => {
    try {
        const riskFactor = await PgSingleton.findOne(``);
        const result = await PgSingleton.update(
            `UPDATE riskfactors SET name = '${riskfactor.name}' WHERE pk_riskfactor = ${riskfactor.id}`,
            `SELECT rf.* FROM riskfactors rf WHERE rf.pk_riskfactor = ${riskfactor.id}`
        );
        if(!result)
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};

export const delet = async (riskfactor) => {
    try {
        const result = await PgSingleton.update(
            `UPDATE riskfactors SET status = '${EStatus.INACTIVE}' WHERE pk_riskfactor = ${riskfactor.id}`,
            `SELECT rf.* FROM riskfactors rf WHERE rf.pk_riskfactor = ${riskfactor.id} and rf.status = ${EStatus.INACTIVE}`
        );
        if(!result)
            throw new ResponseError("Error!", "Not founded");
        return await convert(result, 'one');
    } catch (error) {
        throw error;
    }
};