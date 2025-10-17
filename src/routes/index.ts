import { Elysia, t } from 'elysia';
import { allUsers, getRecommendedCollocs, userById } from '../services/info_service';
import {
    register,
    login,
    resendVerification,
    resetPassword,
    checkEmailExist,
    verifyUser,
    getNewSession,
} from '../services/authentication_service';
import { HttpError } from 'elysia-http-error';
import bearer from '@elysiajs/bearer';
import { AuthApiError } from '@supabase/supabase-js';

const userRoutes = new Elysia();

// This route should not be exposed out of the app
userRoutes.get('/', async () => {
    return await allUsers();
});

userRoutes.use(bearer()).get(
    '/:id',
    async ({ bearer, params }) => {
        try {
            await verifyUser(bearer);
            return await userById(params.id);
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{message: ${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;
                return new Response(`{message: \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
        params: t.Object({
            id: t.String(),
        }),
    },
);

userRoutes.use(bearer()).get(
    '/id',
    async ({ bearer }) => {
        try {
            const id: string = await verifyUser(bearer);
            return await userById(id);
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{message: ${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;
                return new Response(`{message: \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
    },
);

userRoutes.use(bearer()).get(
    '/refresh',
    async ({ bearer }) => {
        try {
            return await getNewSession(bearer);
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{message: ${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;
                return new Response(`{message: \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
    },
);

userRoutes.post(
    '/register',
    async ({ body }) => {
        var resp = await register(body);
        if (resp instanceof HttpError) {
            return new Response(`{message: ${resp.message}}`, {
                status: resp.statusCode,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return resp;
    },
    {
        body: t.Object({
            firstName: t.String({
                minLength: 1,
                maxLength: 100,
            }),
            lastName: t.String({
                minLength: 1,
                maxLength: 100,
            }),
            email: t.String({
                format: 'email',
            }),
            password: t.String(),
            birthdate: t.Date(),
        }),
    },
);

userRoutes.post(
    '/resend',
    async ({ body }) => {
        var resp = await resendVerification(body.email);
        if (resp instanceof HttpError) {
            return new Response(`{message: ${resp.message}}`, {
                status: resp.statusCode,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response('{"status":"OK"}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    },
    {
        body: t.Object({
            email: t.String({
                format: 'email',
            }),
        }),
    },
);
userRoutes.post(
    '/login',
    async ({ body }) => {
        try {
            var resp = await login(body.email, body.password);
            if (resp instanceof AuthApiError) {
                return HttpError.Unauthorized(resp.message);
            }
            return resp;
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{message: ${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
    },
    {
        body: t.Object({
            email: t.String({
                format: 'email',
            }),
            password: t.String(),
        }),
    },
);

userRoutes.get(
    '/forgotPassword/:email',
    async ({ params }) => {
        try {
            await resetPassword(params.email);
            return new Response('{"status":"OK"}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            if (error instanceof HttpError) {
                return new Response(`{message: ${error.message}}`, {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            throw error;
        }
    },
    {
        params: t.Object({
            email: t.String({
                format: 'email',
            }),
        }),
    },
);

userRoutes.get('/checkEmail/:email', async ({ params }) => {
    const resp = await checkEmailExist(params.email);
    return new Response(JSON.stringify({ emailTaken: resp }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
});

userRoutes.use(bearer()).get('/recommendedColloc', async ({ bearer }) => {
        const id: string = await verifyUser(bearer);
        if (!id) {
            return new Response("User do not exist", { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        var ret = await getRecommendedCollocs(bearer);
        return new Response(JSON.stringify(ret), {status: 200, headers: { 'Content-Type': 'application/json' }});
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                set.headers['WWW-Authenticate'] = `Bearer realm='sign', error="invalid_request"`;
                return new Response(`{message: \"Bearer not found or invalid"}`, {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        },
    }
);

export default userRoutes;
