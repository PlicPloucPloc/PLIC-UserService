import {getUserById, getAllUsers} from "../data/user";

async function userById(id: string) {
    return (await getUserById(id)); ;
}

async function allUsers() {
    return await getAllUsers();
}

export {userById, allUsers};
