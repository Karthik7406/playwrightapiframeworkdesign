import {  expect } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { test } from "../utils/fixtures";

test("first test", async ({ api }) => {

    // const api = new RequestHandler();

    api
        .url("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0")
        .path("/articles")
        .params({ limit: 10, offset: 0 })
        .headers({ Authorization: "authToken" })
        .body({ user: { email: "pwapiuser" } });

    console.log("executing after test ");


})


test("second test 2", async ({ api }) => {
    api
        .url("https://randomurl.com")
        .path("/articles")
        .params({ limit: 10, offset: 0, foo: "bar" })
        .headers({ Authorization: "authToken" })
        .body({ user: { email: "pwapiuser" } })
    // .getUrl();
})


test("second test 3", async ({ api }) => {

    const response = await api
                            .path("/articles")
                            .params({ limit: 10, offset: 0, foo: "bar" })
                            .getRequest(200);

    console.log("response ", response);

    expect(response.articles.length).toBeLessThanOrEqual(10);
    expect(response.articlesCount).toEqual(10);
})


test("get the test tags", async({api}) => {
    const response = await api
                                .path("/tags")
                                .getRequest(200);

   console.log("tags response ", response);
   expect(response.tags).toContain("Git");
   expect(response.tags.length).toBeLessThanOrEqual(10);
})
