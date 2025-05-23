import { Elysia, t } from "elysia";
import { register, login, resendVerification, resetPassword} from "../services/authentication_service";
import { HttpError } from "elysia-http-error";
import { checkEmailExist } from "../services/authentication_service";

const userRoutes = new Elysia({prefix: "/user"});

userRoutes.get("/", () => "Get all users");

userRoutes.post("/register", async ({ body }) => {
        var resp = await register(body);
        if (resp instanceof HttpError) {
            return new Response( resp.message, {status: resp.statusCode, headers: { "Content-Type": "text/plain" } });
        }
        else {
            return new Response( "OK", {status: 200, headers: { "Content-Type": "text/plain" } });
        }
    }, {
        body : t.Object({
            firstName: t.String({
                minLength: 1,
                maxLength: 100
            }),
            lastName: t.String({
                minLength: 1,
                maxLength: 100
            }),
            email: t.String({
                "format": "email"
            }),
            password: t.String(),
            birthdate: t.Date(),
        })
    });

userRoutes.post("/resend", async ({ body }) => {

        var resp = await resendVerification(body.email); 
        if (resp instanceof HttpError) {
            return new Response( resp.message, {status: resp.statusCode, headers: { "Content-Type": "text/plain" } });
        }
        else {
            return new Response( "OK", {status: 200, headers: { "Content-Type": "text/plain" } });
        }
        },
        {
            body : t.Object({
                email: t.String({
                    format: "email"
                })
            })
        }
);

userRoutes.post("/login", async ({ body }) => {
        var resp = await login(body.email,body.password);
        return new Response( JSON.stringify(resp), {status: 200, headers: { "Content-Type": "application/json" } });
    }, {
        body : t.Object({
            email: t.String({
                format: "email"
            }),
            password: t.String()
        })
    });

userRoutes.get("/forgotPassword/:email", async ({ params }) => {
        const resp = await resetPassword(params.email);
        if (resp instanceof HttpError) {
            return new Response( resp.message, {status: resp.statusCode, headers: { "Content-Type": "text/plain" } });
        }
        else {
            return new Response( "OK", {status: 200, headers: { "Content-Type": "text/plain" } });
        }
    },
    {
        params: t.Object({
            email: t.String()
    })
    })

userRoutes.get("/checkEmail/:email", async ({ params }) => {
    return await checkEmailExist(params.email);
})

export default userRoutes;
