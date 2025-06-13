import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import userRoutes from "./routes";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";

const app = new Elysia();
const { PORT, JAEGER_URL } = process.env;

console.log("Port:", PORT);

app
    .group("", (app) => app.use(userRoutes))
    .use(swagger())
    .use(opentelemetry({
            spanProcessors: [
               new BatchSpanProcessor(
                   new OTLPTraceExporter({
                             url: JAEGER_URL,
                   })
               )
           ]}))
    .listen(process.env.PORT || 3000);

console.log(
`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
