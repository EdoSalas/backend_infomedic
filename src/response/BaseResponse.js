export default class BaseResponse {
    constructor(message, description, data) {
        this.success = true;
        this.message = message;
        this.description = description;
        this.data = data;
    }
}