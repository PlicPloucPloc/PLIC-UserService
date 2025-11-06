import {
    authenticateUser,
    checkUser,
    createprofilePictureSignedUploadUrl,
    createUser,
    loginUser,
    refreshUser,
    resendEmail,
    sendResetPassword,
} from '../data/user';
import RegisterRequest from '../routes/requests/register';
import LoginResponse from '../routes/responses/login';
import User from '../models/user';
import { HttpError } from 'elysia-http-error';
import { Session } from '@supabase/supabase-js';
import { createUserNode } from '../data/relations';
import { getLogger } from './logger';
import { Logger } from 'winston';
import { handleResponse } from './responseService';

const logger: Logger = getLogger('Authentication');


export async function register(request: RegisterRequest): Promise<Response> {
    passwordCheck(request.password);
    logger.info(`Creating user: ${request.email}`);
    var id: string = await authenticateUser(request.email, request.password);
    logger.info(`Successfully authenticater user: ${id}`);
    await createUser(new User(id, request.firstName, request.lastName, request.birthdate));
    const registerResponse = await createprofilePictureSignedUploadUrl(id);
    return handleResponse(JSON.stringify(registerResponse), 200);
}

export async function login(email: string, password: string): Promise<Response> {
    logger.info(`Login in user: ${email}`);
    var session = await loginUser(email, password);
    await createUserNode(session.access_token);
    var response = new LoginResponse(session);
    logger.info(`Response: ${response}`);
    return handleResponse(JSON.stringify(response), 200);
}

export async function resendVerification(email: string): Promise<Response> {
    logger.info(`Resending verification email to: ${email}`);
    await resendEmail(email);
    return handleResponse('{"status": "OK"}', 200);
}

function passwordCheck(password: string): Response {
    if (password.length < 8) {
        throw HttpError.BadRequest('Password must be at least 8 characters long.', { status: 400 });
    }
    var regex = /^(.*[0-9].*)$/;
    if (!regex.test(password)) {
        throw HttpError.BadRequest('Password must contain at least one number.', { status: 400 });
    }
    var regex = /^(.*[-!@#$%_^&*].*)$/;
    if (!regex.test(password)) {
        throw HttpError.BadRequest('Password must contain at least special character.', {
            status: 400,
        });
    }
    return handleResponse('{"status": "OK"}', 200);
}

export async function resetPassword(email: string): Promise<Response> {
    return handleResponse(JSON.stringify(await sendResetPassword(email)), 200);
}


export async function verifyUser(bearer: string): Promise<string> {
    const id: string = await checkUser(bearer);
    if (!id) {
        throw HttpError.Unauthorized('Unauthorized', { status: 401 });
    }
    return id;
}

export async function getNewSession(bearer: string): Promise<Response> {
    const ret: Session | null = await refreshUser(bearer);
    if (!ret) {
        throw HttpError.Unauthorized('Unauthorized', { status: 401 });
    }
    return handleResponse(JSON.stringify(ret),200);
}

