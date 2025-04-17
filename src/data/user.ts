import { supabase } from "../libs/supabase";
import User from "../models/user";

async function authenticateUser(email: string, password: string) : Promise<string>{
    const { data,error } = await supabase.auth.signUp({
        email: email,
        password: password
    });
    if (error) {
        console.error("Error creating user:", error);
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
    const { data,error } = await supabase.from("users").insert([user]) ;
    if (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

async function resendEmail(email: string){
    const {data,error } = await supabase.auth.resend({
        email: email,
        type: "signup"
    });
    if (error) {
        console.error("Error resending verification email:", error);
        throw error;
    }
}
export { authenticateUser, loginUser,createUser,resendEmail };
