import { Elysia, t } from "elysia";
import { allUsers, userById } from "../services/info_service";
import { register, login, resendVerification, resetPassword, checkEmailExist, verifyUser, getNewSession} from "../services/authentication_service";
import { HttpError } from "elysia-http-error";
import bearer from "@elysiajs/bearer";
import { AuthApiError } from "@supabase/supabase-js";

const userRoutes = new Elysia({prefix: "/user"});

// This route should not be exposed out of the app
userRoutes.get("/", async () => {
    return await allUsers();
});

// This route should not be exposed out of the app
userRoutes.get("/:id", async ({params}) => {
    return await userById(params.id);
}, {
    params: t.Object({
        id: t.String()
    })
});

userRoutes.use(bearer()).get('/id', async ({ bearer }) => {
    try {
        const id : string = await verifyUser(bearer); 
        return new Response( JSON.stringify({id: id}), {status: 200, headers: {"Content-Type": "application/json"}});
    }
    catch(error) {
        if (error instanceof HttpError){
            return error;
        }
        throw error;
    }
}, {
    beforeHandle({ bearer, set }) {
        if (!bearer) {
            set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error="invalid_request"`
            return HttpError.Unauthorized("Bearer not found or invalid");
        }
    }
});

userRoutes.use(bearer()).get('/refresh', async ({ bearer }) => {
    try {
        return await getNewSession(bearer); 
    }
    catch (error){
        if (error instanceof HttpError.Unauthorized){
            return error;
        }
        throw error;
    }
}, {
    beforeHandle({ bearer, set }) {
        if (!bearer) {
            set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error="invalid_request"`
            return HttpError.Unauthorized("Bearer not found or invalid");
        }
    }
});


userRoutes.post("/register", async ({ body }) => {
        var resp = await register(body);
        if (resp instanceof HttpError) {
            return resp;
        }
        else {
            return new Response( "{\"status\":\"OK\"}", {status: 201, headers: { "Content-Type": "application/json" } });
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
        return resp;
    }
    else {
        return new Response( "{\"status\":\"OK\"}", {status: 200, headers: { "Content-Type": "application/json" } });
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
    try {
       var resp = await login(body.email,body.password);
       if (resp instanceof AuthApiError){
           return HttpError.Unauthorized(resp.message);
       }
       return resp;
    }
    catch(error){
        if (error instanceof HttpError){
            return error;
        }
        throw error;
    }

}, {
   body : t.Object({
       email: t.String({
           format: "email"
       }),
       password: t.String()
   })
});

userRoutes.get("/forgotPassword/:email", async ({ params }) => {
        try {
            await resetPassword(params.email);
            return new Response( "{\"status\":\"OK\"}", {status: 200, headers: { "Content-Type": "application/json" } });
        } catch(error) {
            if (error instanceof HttpError){
                return error;
            }
            throw error;
        }
    },
    {
        params: t.Object({
            email: t.String({
                format: "email"
            })
    })
    })

userRoutes.get("/checkEmail/:email", async ({ params }) => {
    const resp = await checkEmailExist(params.email);
    return new Response(JSON.stringify({emailTaken: resp}), {status: 200, headers: { "Content-Type": "application/json" } });
})

export default userRoutes;
