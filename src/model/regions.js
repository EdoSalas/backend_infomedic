export default class Regions {
    constructor(id, name, status) {
        this.id = id;
        this.name = name;
        this.status = status;
    }

    toString() {
        return `ID: ${this.id} | Name: ${this.name} | Status: ${this.status}`;
    }
}