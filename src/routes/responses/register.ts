class RegisterResponse {
    path: string;
    token: string;

    constructor(path: string, token: string) {
        this.path = path;
        this.token = token;
    }
}

export default RegisterResponse;
