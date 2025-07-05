import { getUserById, getAllUsers } from '../data/user';
import User from '../models/user';

async function userById(id: string): Promise<User> {
    return await getUserById(id);
}

async function allUsers(): Promise<User[]> {
    return await getAllUsers();
}

export { userById, allUsers };
