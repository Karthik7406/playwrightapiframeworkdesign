import { APILogger } from "../utils/logger";
import { RequestHandler } from "../utils/request-handler";
import { request } from "@playwright/test";
import { config } from "../api-test.config";



export default async function createToken( email: string, password: string) {
    const context = await request.newContext();
    const logger = new APILogger();
    const api = new RequestHandler(context, config.apiUrl, logger );

    try {
        const tokenResponse = await api
        .path("/users/login")
        .body({
            "user": {
                "email": email,
                "password": password
            }
        })
        .postRequest(200);
        return`Token ` + tokenResponse.user.token;
    }
    catch(err) {
        Error.captureStackTrace(new Error("Token creation failed"), createToken);
        throw err;
    }
    finally {
        await context.dispose();
    }

}