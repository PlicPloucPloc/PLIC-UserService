import { Elysia } from "elysia";

const userRoutes = new Elysia({prefix: "/user"})
    .get("/", () => "Get all users")
    .post("/register", () => "Register");

export default userRoutes;
