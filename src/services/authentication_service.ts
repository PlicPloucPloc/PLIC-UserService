import {
    authenticateUser,
    checkUser,
    createUser,
    emailExist,
    loginUser,
    refreshUser,
    resendEmail,
    sendResetPassword,
} from '../data/user';
import RegisterRequest from '../routes/requests/register';
import LoginResponse from '../routes/responses/login';
import User from '../models/user';
import { HttpError } from 'elysia-http-error';
import { AuthApiError, Session } from '@supabase/supabase-js';

async function register(request: RegisterRequest): Promise<unknown> {
    try {
        passwordCheck(request.password);
    } catch (error) {
        console.log('Password check failed: ', error);
        return error;
    }
    console.log('Creating user:', request.email);
    var id: string = await authenticateUser(request.email, request.password);
    console.log('Successfully authenticater user: ', id);
    await createUser(new User(id, request.firstName, request.lastName, request.birthdate));
}

async function login(email: string, password: string): Promise<string | unknown> {
    try {
        console.log('Login in user:', email);
        var session = await loginUser(email, password);
        var response = new LoginResponse(session);
        console.log('Response: ' + response);
        return JSON.stringify(response);
    } catch (error) {
        const catchedErrors = ['Invalid login credentials', 'Email not confirmed'];

        if (error instanceof AuthApiError && catchedErrors.includes(error.message)) {
            return error;
        }
        throw error;
    }
}

async function resendVerification(email: string): Promise<unknown> {
    try {
        console.log('Resending verification email to: ', email);
        await resendEmail(email);
    } catch (error) {
        console.error('Error resending verification email:', error);
        return error;
    }
}

function passwordCheck(password: string): void {
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
}

async function resetPassword(email: string): Promise<unknown> {
    try {
        return await sendResetPassword(email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}

async function checkEmailExist(email: string): Promise<boolean> {
    return await emailExist(email);
}

async function verifyUser(bearer: string): Promise<string> {
    const id: string = await checkUser(bearer);
    if (!id) {
        throw HttpError.Unauthorized('Unauthorized', { status: 401 });
    }
    return id;
}

async function getNewSession(bearer: string): Promise<Session> {
    const ret: Session | null = await refreshUser(bearer);
    if (!ret) {
        throw HttpError.Unauthorized('Unauthorized', { status: 401 });
    }
    return ret;
}

export {
    register,
    login,
    resendVerification,
    resetPassword,
    checkEmailExist,
    verifyUser,
    passwordCheck,
    getNewSession,
};
