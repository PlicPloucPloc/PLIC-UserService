import { Elysia, t } from "elysia";
import { createUser } from "../services/authentication_service";

const userRoutes = new Elysia({prefix: "/user"})
    .get("/", () => "Get all users")
    .post("/register", ({ body }) => createUser(body.email,body.password), {
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

export default userRoutes;
