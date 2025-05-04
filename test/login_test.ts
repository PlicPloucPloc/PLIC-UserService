import { describe, expect, it } from "bun:test";
import userRoutes from "../src/routes";
import LoginRequest from "../src/routes/requests/login";

const PORT = process.env.PORT || 3000;

describe("Login", () => {
    it('Should login', async () => {
        const req = new LoginRequest("john.doe@lorem.ipsum","Lor3m_Ipsum");

        const response = await fetch(new URL("/user/login","http://localhost:"+PORT), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        });

        console.log(response);

        expect(response.status).toBe(400);
    }),
    it('Should fail', async () => {
        const req = new LoginRequest("do.not@exist.ipsum","Lorm_Ipsum");

        const response = await fetch(new URL("/user/login","http://localhost:"+PORT), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        });
        expect(response.status).toBe(400);
    })
})

describe("Recover", () => {
    it('Should send a recovery email', async () => {
        const response = await fetch(new URL("/user/forgotPassword/john.doe@lorem.ipsum","http://localhost:"+PORT), {
            method: "GET",
        });
        expect(response.status).toBe(200);
    })
})
