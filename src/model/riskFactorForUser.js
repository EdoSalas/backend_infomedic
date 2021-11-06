export default class RiskFactorsForUser {
    constructor(id, user, riskFactor, status, userInfo, riskInfo) {
        this.id = id;
        this.user = user;
        this.riskFactor = riskFactor;
        this.status = status;
        this.userInfo = userInfo;
        this.riskInfo = riskInfo;
    }
}