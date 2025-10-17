import { fetchRecommendedCollocs } from '../data/relations';
import { getUserById, getAllUsers } from '../data/user';
import User from '../models/user';

export async function userById(id: string): Promise<User> {
    return await getUserById(id);
}

export async function allUsers(): Promise<User[]> {
    return await getAllUsers();
}

export async function getRecommendedCollocs(bearer: string): Promise<{users: User[]}> {
    try {
        var userIds : string[] = (await fetchRecommendedCollocs(bearer)).userIds;
        var users: User[] = [];
        userIds.forEach(async (id) => {
            users.push(await getUserById(id));
        })
        return {users: users};
    } catch (error) {
        console.error('Error getting recommended Collocs:', error);
        throw new Error('Error getting recommended Collocs');
    }
}
