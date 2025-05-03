import {authenticateUser,createUser,loginUser,resendEmail,sendResetPassword} from "../data/user";
import RegisterRequest from "../routes/requests/register";
import LoginResponse from "../routes/responses/login";
import User from "../models/user";
import { HttpError } from "elysia-http-error";

async function register(request: RegisterRequest){
    try {
        passwordCheck(request.password);
    }
    catch (error) {
        console.log("Password check failed: ", error);
        return error;
    }
    console.log("Creating user:", request.email);
    var id : string = await authenticateUser(request.email,request.password);
    console.log("Successfully authenticater user: ", id);
    await createUser(new User(id,request.firstName,request.lastName,request.age));
}

async function login(email: string, password: string) : Promise<LoginResponse>{
    console.log("Login in user:", email);
    var session = await loginUser(email,password);
    var response = new LoginResponse(session.access_token, session.refresh_token, session.expires_at);
    return response;
}

async function resendVerification(email: string){
    try {
        console.log("Resending verification email to: ", email);
        await resendEmail(email);
    } catch (error) {
        console.error("Error resending verification email:", error);
        return error;
    }
}

function passwordCheck(password: string){
    if (password.length < 8) {
        throw HttpError.BadRequest("Password must be at least 8 characters long.", {status: 400});
    }
    var regex = /^(.*[0-9].*)$/;
    if (!regex.test(password)) {
        throw HttpError.BadRequest("Password must contain at least one number.", {status: 400});
    }
    var regex = /^(.*[-!@#$%_^&*].*)$/;
    if (!regex.test(password)) {
        throw HttpError.BadRequest("Password must contain at least special character.", {status: 400});
    }
}

async function resetPassword(email: string){
    try {
        return await sendResetPassword(email);
    }
    catch (error) {
        console.error("Error sending password reset email:", error);
        return error;
    }
}


export { register, login,resendVerification , resetPassword };
