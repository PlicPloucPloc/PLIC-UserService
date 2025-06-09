import {authenticateUser,checkUser,createUser,emailExist,loginUser,refreshUser,resendEmail,sendResetPassword} from "../data/user";
import RegisterRequest from "../routes/requests/register";
import LoginResponse from "../routes/responses/login";
import User from "../models/user";
import { HttpError } from "elysia-http-error";
import { AuthApiError } from "@supabase/supabase-js";

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
    await createUser(new User(id,request.firstName,request.lastName,request.birthdate));
}

async function login(email: string, password: string) {
    try {
        console.log("Login in user:", email);
        var session = await loginUser(email,password);
        var response = new LoginResponse(session);
        console.log("Response: " + response);
        return new Response( JSON.stringify(response), {status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        const catchedErrors = [
            "Invalid login credentials",
            "Email not confirmed",
        ]

        if (error instanceof AuthApiError && catchedErrors.includes(error.message)) {
            return new Response(JSON.stringify({ message: error.message}), {status: 401, headers: { "Content-Type": "application/json" } });
        }
        if (error instanceof HttpError) {
            return error;
        }
        throw error;
    }
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

async function checkEmailExist(email: string) : Promise<boolean> {
    return await emailExist(email);
}

async function verifyUser(bearer: string) {
    const user = await checkUser(bearer);
    if (!user) {
        throw HttpError.Unauthorized("Unauthorized", {status: 401});
    }
    return user.id;
}

async function getNewSession(bearer: string){
    const ret = await refreshUser(bearer);
    if (!ret) {
        throw HttpError.Unauthorized("Unauthorized", {status: 401});
    }
    return ret;
}

export { register, login,resendVerification , resetPassword, checkEmailExist, verifyUser, passwordCheck, getNewSession}; 
