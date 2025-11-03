import { Session } from '@supabase/supabase-js';
import { supabase } from '../libs/supabase';
import User from '../models/user';
import RegisterResponse from '../routes/responses/register';
import { getLogger } from '../services/logger';
import { Logger } from 'winston';

const logger: Logger = getLogger('UserData')

export async function authenticateUser(email: string, password: string): Promise<string> {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (error) {
        logger.error(`authenticateUse: Error creating user: ${error}`);
        throw error;
    }
    return data.user!.id;
}

export async function refreshUser(bearer: string): Promise<Session | null> {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: bearer });
    if (error) {
        logger.error(`Error refreshing user session: ${error}`);
        throw error;
    }
    return data.session;
}

export async function loginUser(email: string, password: string): Promise<Session> {
    logger.info(`Loggin in user: ${email}`);
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) {
        logger.error(`Error logging in user: ${error}`);
        throw error;
    }
    logger.info(`Login data: ${data}`);
    return data.session;
}

export async function createUser(user: User): Promise<void> {
    logger.info(`Creating user: ${user}`);
    const { error } = await supabase.from('users').insert([user]);
    if (error) {
        logger.error(`Error creating user: ${error}`);
        throw error;
    }
}

export async function createprofilePictureSignedUploadUrl(userId: string): Promise<RegisterResponse> {
    const { data, error } = await supabase.storage
        .from('user-pictures')
        .createSignedUploadUrl(`${userId}.png`);

    if (error) {
        logger.error(`creatingUser: Error creating user: ${error}`);
        throw error;
    }

    return new RegisterResponse(data.path, data.token);
}

export async function resendEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({
        email: email,
        type: 'signup',
    });
    if (error) {
        logger.error(`Error resending verification email: ${error}`);
        throw error;
    }
}

export async function sendResetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
        logger.error(`Error sending password reset email: ${error}`);
        throw error;
    }
}

export async function getUserById(id: string): Promise<User> {
    const { data, error } = await supabase.from('users').select('*').eq('id', id);
    if (error) {
        logger.error(`Error getting user: ${error}`);
        throw error;
    }
    return data[0];
}

export async function getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
        logger.error(`Error getting all users: ${error}`);
        throw error;
    }
    return data;
}

export async function checkUser(bearer: string): Promise<string> {
    const { data, error } = await supabase.auth.getUser(bearer);
    if (error) {
        logger.error(`Error checking user: ${error}`);
        throw error;
    }
    return data.user.id;
}

export async function emailExist(email: string): Promise<boolean> {
    const {
        data: { users },
        error,
    } = await supabase.auth.admin.listUsers();
    if (error) {
        logger.error(`Error checking user: ${error}`);
        throw error;
    }

    return users.some((user) => user.email === email);
}
