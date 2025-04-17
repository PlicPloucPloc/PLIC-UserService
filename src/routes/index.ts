import { Elysia, t } from "elysia";
import { register, login } from "../services/authentication_service";

const userRoutes = new Elysia({prefix: "/user"});

userRoutes.get("/", () => "Get all users");

userRoutes.post("/register", async ({ body }) => {
        var resp = await register(body);
        if (resp instanceof Error) {
            return new Response( resp.message, {status: 400, headers: { "Content-Type": "text/plain" } });
        }
        else {
            return new Response( "OK", {status: 200, headers: { "Content-Type": "text/plain" } });
        }
    }, {
        body : t.Object({
            firstName: t.String(),
            lastName: t.String(),
            email: t.String(),
            password: t.String(),
            age: t.Number(),
        })
    });

userRoutes.post("/login", async ({ body }) => {
        var resp = await login(body.email,body.password);
        return new Response( JSON.stringify(resp), {status: 200, headers: { "Content-Type": "application/json" } });
    }, {
        body : t.Object({
            email: t.String(),
            password: t.String()
        })
    });

export default userRoutes;
