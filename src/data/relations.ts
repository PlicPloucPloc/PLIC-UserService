import { HttpError } from 'elysia-http-error';
import { getLogger } from '../services/logger';
import { Logger } from 'winston';

const logger: Logger = getLogger('relationData');

export async function createUserNode(bearer: string): Promise<void> {
    const userUrl = (process.env.LIKE_URL || 'http://localhost:3000') + '/userNode';
    const request = new Request(userUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearer,
        },
    });
    try {
        await fetch(request);
    } catch (error) {
        logger.error(`Error creating user node: ${error}`);
        throw new HttpError('Error creating user node', 500);
    }
}

export async function fetchRecommendedCollocs(bearer: string): Promise<{userIds: string[]}> {
    const userUrl = (process.env.LIKE_URL || 'http://localhost:3000') + '/recommendedColloc';
    const request = new Request(userUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearer,
        },
    });
    try {
        return await (await fetch(request)).json();
    } catch (error) {
        logger.error(`Error getting recommended Collocs: ${error}`);
        throw new HttpError('Error getting recommended Collocs', 500);
    }
}
