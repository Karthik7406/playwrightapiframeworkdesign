// import {  expect } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import {test} from "../utils/fixtures";

test("first test", async ({ api}) => {

    // const api = new RequestHandler();

    api
        .url("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0")
        .path("/articles")
        .params({ limit: 10, offset: 0 })
        .headers({ Authorization: "authToken" })
        .body({ user: { email: "pwapiuser" } });

    console.log("executing after test ");

    
})