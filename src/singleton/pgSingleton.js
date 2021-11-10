import pgPromise from "pg-promise";
import config from "../config";

export class PgSingleton {
    static instance;
    db;

    static async getInstance() {
        if (!PgSingleton.instance) {
            PgSingleton.instance = new PgSingleton();
            const pgb = pgPromise({
                promiseLib: Promise
            });
            this.db = pgb({
                connectionString: config.PG_URI,
                ssl: { rejectUnauthorized: false }
            });
        }
        return PgSingleton.instance;
    };

    static async save(insert, find) {
        console.log(`Execute:\n${insert}`);
        await this.getInstance();
        try {
            await this.db.none(insert);
            const result = await this.findOne(find);
            return result;
        } catch (error) {
            throw error;
        }
    };

    static async find(query) {
        console.log(`Execute:\n${query}`);
        await this.getInstance();
        try {
            const result = await this.db.manyOrNone(query);
            return result;
        } catch (error) {
            throw error;
        }
    };

    static async findOne(query) {
        console.log(`Execute:\n${query}`);
        await this.getInstance();
        try {
            const result = await this.db.oneOrNone(query);
            return result;
        } catch (error) {
            throw error;
        }
    };

    static async update(update, find) {
        console.log(`Execute:\n${update}`);
        await this.getInstance();
        try {
            await this.db.none(update);
            const result = await this.findOne(find);
            return result;
        } catch (error) {
            throw error;
        }
    };

    static async delete(del, find) {
        console.log(`Execute:\n${del}`);
        await this.getInstance();
        try {
            await this.db.none(del);
            const result = await this.findOne(find);
            return result;
        } catch (error) {
            throw error;
        }
    };
}