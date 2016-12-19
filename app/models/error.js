// @flow
class Error {
    message: string;
    code: string;
    error: Object;
    constructor(message: string, code: string, stack: Object) {
        this.message = 'Sorry';
        this.code    = code;this
        this.error   = {
            status: message || 'Something went wrong, please try again later'
        }
    }
}

export default Error
