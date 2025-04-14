
class LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: number | undefined;

    constructor(accessToken: string, refreshToken: string, expiresAt: number | undefined) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
    }
}

export {LoginResponse};
