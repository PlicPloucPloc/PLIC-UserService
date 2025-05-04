import { Elysia, t } from "elysia";
import { register, login, resendVerification, resetPassword} from "../services/authenticationService";
import { allUsers, userById } from "../services/infoService";
import { HttpError } from "elysia-http-error";

const userRoutes = new Elysia({prefix: "/user"});

userRoutes.get("/", async () => {
    var resp = await allUsers();
    if (resp instanceof HttpError) {
        return new Response( resp.message, {status: resp.statusCode, headers: { "Content-Type": "text/plain" } });
    }
    else {
        return resp;
    }
});
userRoutes.get("/:id", async ({params}) => {
    var resp = await userById(params.id);
    if (resp instanceof HttpError) {
        return new Response( resp.message, {status: resp.statusCode, headers: { "Content-Type": "text/plain" } });
    }
    else {
        return resp;
    }
}, {
    params: t.Object({
        id: t.String()
    })
});

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
        age: t.Number({
            minimum: 10,
            maximum: 120
        }),
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
});
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
   console.log(params);
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

export default userRoutes;
