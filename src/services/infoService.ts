import { Logger } from 'winston';
import { fetchRecommendedCollocs } from '../data/relations';
import { getUserById, getAllUsers, emailExist } from '../data/user';
import User from '../models/user';
import { getLogger } from './logger';
import { handleResponse } from './responseService';

const logger: Logger = getLogger('Information')

export async function userById(id: string): Promise<Response> {
    
    var user: User = await getUserById(id);
    return handleResponse(JSON.stringify(user), 200);
}

export async function allUsers(): Promise<Response> {
    return handleResponse(JSON.stringify(await getAllUsers()), 200);
}

export async function getRecommendedCollocs(bearer: string): Promise<Response> {
    var userIds : string[] = await fetchRecommendedCollocs(bearer);
    var users: User[] = [];
    for (const id of userIds) {
        users.push(await getUserById(id));
    }
    return handleResponse(JSON.stringify(users), 200);
}

export async function checkEmailExist(email: string): Promise<Response> {
    return handleResponse(`{"emailExist": ${(await emailExist(email))}}`,200);
}
