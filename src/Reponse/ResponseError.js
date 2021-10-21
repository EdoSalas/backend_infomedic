export default class ResponseError {
    constructor(message, description) {
        this.success = false;
        this.message = message;
        this.description = description;
    }
}