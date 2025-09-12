import { HttpError } from "elysia-http-error";

async function createUserNode(bearer: string): Promise<void> {
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
    }
    catch (error) {
        console.error('Error creating user node:', error);
        throw new HttpError('Error creating user node', 500);
    }
}

export { createUserNode };
