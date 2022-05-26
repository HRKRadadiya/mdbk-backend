export default class NotExistHandler {

    public message: string = 'Not Exist';
    public success: boolean = false;

    constructor(message: string, success: boolean = false) {
        this.message = message
        this.success = success
    }
}