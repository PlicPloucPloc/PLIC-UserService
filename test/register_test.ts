import { describe, expect, it } from "bun:test";
import userRoutes from "../src/routes";
import RegisterRequest from "../src/routes/requests/register";

const PORT = process.env.PORT || 3000;

describe("Read", () => {
    it('Should read a file', async () => {
        const app = userRoutes;
        const req = new Request("http://localhost:" + PORT + "/user",{
            method: "GET",
        });

        const response = await app.handle(req);
        expect(response.status).toBe(200);
    })
})

describe("Register", () => {
    it('Should register a new user', async () => {
        const req = new RegisterRequest("John","Doe","john.doe@lorem.ipsum","Lor3m_Ipsum",42);

        const response = await fetch(new URL("/user/register","http://localhost:"+PORT), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        });

        console.log(response);

        expect(response.status).toBe(200);
    }),
    it('Should fail wrong password', async () => {
        const req = new RegisterRequest("John","Doe","john.doe@lorem.ipsum","Lorm_Ipsum",42);

        const response = await fetch(new URL("/user/register","http://localhost:"+PORT), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        });
        expect(response.status).toBe(400);
    })
})

describe("Resend", () => {
    it('Should resend a verification email', async () => {
        const response = await fetch(new URL("/user/resend","http://localhost:"+PORT), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: "{\"email\":\"john.doe@lorem.ipsum\"}",
        });
        expect(response.status).toBe(200);
    })
})
