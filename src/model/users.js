export default class Users {
    constructor(id, idNumber, name, lastname, dateOfBirth, email, type, password, status, canton, residence) {
        this.id = id;
        this.idNumber = idNumber;
        this.name = name;
        this.lastname = lastname;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.type = type;
        this.password = password;
        this.status = status;
        this.canton = canton;
        this.residence = residence;
    }
}