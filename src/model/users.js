export default class Users {
    constructor(id, idNumber, name, lastname, dateOfBirth, genero, email, type, password, status, canton, residence) {
        this.id = id;
        this.idNumber = idNumber;
        this.name = name;
        this.lastname = lastname;
        this.dateOfBirth = dateOfBirth;
        this.genero = genero;
        this.email = email;
        this.type = type;
        this.password = password;
        this.status = status;
        this.canton = canton;
        this.residence = residence;
    }
}