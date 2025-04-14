import { Elysia, t } from "elysia";
import { createUser, loginUser } from "../services/authentication_service";

const userRoutes = new Elysia({prefix: "/user"});

userRoutes.get("/", () => "Get all users");

userRoutes.post("/register", ({ body }) => createUser(body.email,body.password), {
        body : t.Object({
            firstName: t.String(),
            lastName: t.String(),
            email: t.String(),
            password: t.String()
        }),
        afterHandle: (body) => {
            console.log("Registering user:",body);
        }
    });

userRoutes.post("/login", async ({ body }) => {
        var resp = await loginUser(body.email,body.password);
        return new Response( JSON.stringify(resp), {status: 200, headers: { "Content-Type": "application/json" } });
    }, {
        body : t.Object({
            email: t.String(),
            password: t.String()
        }),
        afterHandle: (body) => {
            console.log("Registering user:",body);
        }
    });

export default userRoutes;
