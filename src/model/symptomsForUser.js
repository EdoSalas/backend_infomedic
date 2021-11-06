export default class SymptomsForUser {
    constructor(id, date, user, symptoms, status, userInfo, symptomsInfo) {
        this.id = id;
        this.date = date;
        this.user = user;
        this.symptoms = symptoms;
        this.status = status;
        this.userInfo = userInfo;
        this.symptomsInfo = symptomsInfo;
    }
}