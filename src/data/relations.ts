async function createUserNode(bearer: string): Promise<void> {
    const userUrl = (process.env.LIKE_URL || 'http://localhost:3000') + '/userNode';
    const request = new Request(userUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearer,
        },
    });
    const aptID = (await (await fetch(request)).json()).apartment_id;
    return aptID;
}

export { createUserNode };
