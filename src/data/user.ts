import { Session } from "@supabase/supabase-js";
import { supabase } from "../libs/supabase";
import User from "../models/user";

async function authenticateUser(email: string, password: string) : Promise<string>{
    const { data,error } = await supabase.auth.signUp({
        email: email,
        password: password
    });
    if (error) {
        console.error("authenticateUse: Error creating user:", error);
        throw error;
    }
    return data.user!.id;
}

async function refreshUser(bearer: string) : Promise<Session | null>{
    const { data, error } = await supabase.auth.refreshSession({refresh_token: bearer});
    if (error) {
        console.error("Error refreshing user session:", error);
        throw error;
    }
    return data.session;
}

async function loginUser(email: string, password: string) : Promise<Session>{
    const { data,error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
    return data.session;
}

async function createUser(user: User) : Promise<void>{
    console.log("Creating user: ", user);
    const { error } = await supabase.from("users").insert([user]) ;
    if (error) {
        console.error("creatingUser: Error creating user:", error);
        throw error;
    }
}

async function resendEmail(email: string) : Promise<void>{
    const { error } = await supabase.auth.resend({
        email: email,
        type: "signup"
    });
    if (error) {
        console.error("Error resending verification email:", error);
        throw error;
    }
}

async function sendResetPassword(email: string) : Promise<void>{
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
}

async function getUserById(id: string) : Promise<User>{
    const { data, error } = await supabase.from("users").select("*").eq("id", id);
    if (error) {
        console.error("Error getting user:", error);
        throw error;
    }
    return data[0]
}

async function getAllUsers() : Promise<User[]>{
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
        console.error("Error getting all users:", error);
        throw error;
    }
    return data;
}

async function checkUser(bearer: string) : Promise<string> {
    const { data, error } = await supabase.auth.getUser(bearer);
    if (error) {
        console.error("Error checking user:", error);
        throw error;
    }
    return data.user.id;
}

async function emailExist(email: string) : Promise<boolean> {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
        console.error("Error checking user:", error);
        throw error;
    }

    return users.some(user => user.email === email);
}

export { authenticateUser, refreshUser,loginUser,createUser,resendEmail,sendResetPassword, emailExist,getAllUsers, getUserById, checkUser };
