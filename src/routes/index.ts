import { Elysia, t } from 'elysia';
import {
    register,
    login,
    resendVerification,
    resetPassword,
    verifyUser,
    getNewSession,
} from '../services/authenticationService';
import bearer from '@elysiajs/bearer';
import { checkEmailExist, getRecommendedCollocs, userById } from '../services/infoService';
import { handleError, handleMissingBearer } from '../services/responseService';

const userRoutes = new Elysia();

userRoutes.use(bearer()).get(
    '/',
    async ({ bearer, query }) => {
        try {
            await verifyUser(bearer);
            return await userById(query.id);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) handleMissingBearer(set);
        },
        query: t.Object({
            id: t.String(),
        }),
    },
);

userRoutes.use(bearer()).get(
    '/check',
    async ({ bearer }) => {
        try {
            const id: string = await verifyUser(bearer);
            return await userById(id);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) handleMissingBearer(set);
        },
    },
);

userRoutes.use(bearer()).get(
    '/refresh',
    async ({ bearer }) => {
        try {
            return await getNewSession(bearer);
        } catch (error) {
            return handleError(error);
        }
    },
    {
        beforeHandle({ bearer, set }) {
            if (!bearer) handleMissingBearer(set);
        },
    },
);

userRoutes.post(
    '/register',
    async ({ body }) => {
        try {
            return await register(body);
        } catch (error) {
            return handleError(error);
        }
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
        try{
            await resendVerification(body.email);
            return new Response('{"status":"OK"}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch(error) {
            return handleError(error);
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
            return await login(body.email, body.password);
        } catch (error) {
            return handleError(error);
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

userRoutes.post(
    '/forgotPassword/',
    async ({ body }) => {
        try {

            await resetPassword(body.email);
            return new Response('{"status":"OK"}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            return handleError(error);
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

userRoutes.get('/checkEmail', async ({ query }) => {
        return await checkEmailExist(query.email);
    },
    {
        query: t.Object({
            email: t.String({
                format: 'email',
            }),
        }),
    },
);

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
