import { supabase } from "../libs/supabase";

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

export { createUser };
