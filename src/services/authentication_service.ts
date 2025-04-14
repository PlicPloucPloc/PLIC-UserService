import { supabase } from "../libs/supabase";
import LoginResponse from "../routes/responses/login";

async function createUser(email: string, password: string){
    const { data,error } = await supabase.auth.signUp({
        email: email,
        password: password
    });
    console.log("Creating user:", email);
    if (error) {
        console.error("Error creating user:", error);
        return null;
    }
    return data.user;
}

async function loginUser(email: string, password: string) : Promise<LoginResponse>{
    const { data,error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    console.log("Logging in user:", email);
    if (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
    var response = new LoginResponse(data.session.access_token, data.session.refresh_token, data.session.expires_at);
    return response;
}

export { createUser, loginUser };
