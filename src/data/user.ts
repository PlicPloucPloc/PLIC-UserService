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

async function loginUser(email: string, password: string){
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

async function createUser(user: User){
    console.log("Creating user: ", user);
    const { error } = await supabase.from("users").insert([user]) ;
    if (error) {
        console.error("creatingUser: Error creating user:", error);
        throw error;
    }
}

async function resendEmail(email: string){
    const { error } = await supabase.auth.resend({
        email: email,
        type: "signup"
    });
    if (error) {
        console.error("Error resending verification email:", error);
        throw error;
    }
}

async function sendResetPassword(email: string){
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
    return data;    
}

async function emailExist(email: string) : Promise<boolean> {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email);
    if (error) {
        console.error("Error checking email existence:", error);
        throw error;
    }
    return data.length > 0;
}

export { authenticateUser, loginUser,createUser,resendEmail,sendResetPassword, emailExist };
