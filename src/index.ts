import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import userRoutes from "./routes";

const app = new Elysia();
const { PORT } = process.env;
console.log("Port:", PORT);

app
    .group("", (app) => app.use(userRoutes))
    .use(swagger())
    .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
