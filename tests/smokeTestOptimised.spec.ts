import { test } from "../utils/fixtures";
// import { expect } from "@playwright/test"
import { APILogger } from "../utils/logger";

import { expect } from "../utils/custom-expect";

let authToken: string;

test.beforeAll("Get Token", async ({ api }) => {
    const tokenResponse = await api
        .path("/users/login")
        .body({
            "user": {
                "email": "pwapiuser12@gmail.com",
                "password": "pwapiuser@12"
            }
        })
        .postRequest(200);

    authToken = `Token ` + tokenResponse.user.token;
    console.log("authentication token ", authToken);
})

test("Optimised: get the test tags", async ({ api }) => {

    const tagsResponse = await api
                                .path("/tags")
                                .getRequest(200);


    expect(tagsResponse.tags[0]).shouldEqual("Test");
    expect(tagsResponse.tags.length).shouldBeLessThanOrEqual(10);
})

test("Optimised: get all the articles ", async ({ api }) => {
    const response = await api
                            .path("/articles")
                            .params({ limit: 10, offset: 0 })
                            .getRequest(200);

    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);

})


test("optimised: CRUD operations on all articles", async ({ api }) => {
    console.log("********** create operation ************* ");

    const response = await api
                            .path("/articles")
                            .body({
                                "article": {
                                    "title": "test article 2",
                                    "description": "test article 2",
                                    "body": "this is test article from API",
                                    "tagList": [
                                        "tag2"
                                    ]
                                }
                            })
                            .headers({
                                Authorization: authToken
                            })
                            .postRequest(201);


    expect(response.article.title).shouldEqual("test article 2");

    const slugID = response.article.slug;
    
    const articlesResponse = await api
                                    .path("/articles")
                                    .params({ limit: 10, offset: 0 })
                                    .headers({Authorization: authToken})
                                    .getRequest(200);


    expect(articlesResponse.articles[0].title).shouldEqual("test article 2");

    // updating the article
    console.log("********** update operation ************* ");
    const updateArticleResponse = await api
                                        .path(`/articles/${slugID}`)
                                        .body({
                                            "article": {
                                                "title": "apiarticle1modify",
                                                "description": "updated description from API",
                                                "body": "ui is created this article, api modify",
                                                "tagList": []
                                            }
                                        })
                                        .headers({
                                            Authorization: authToken
                                        })
                                        .putRequest(200);

    console.log("update article response ", updateArticleResponse);

    expect(updateArticleResponse.article.title).shouldEqual("apiarticle1modify");

    const newSlugID = updateArticleResponse.article.slug;
    console.log("********** delete operation ************* ");
    const deleteArticleResponse = await api
                                        .path(`/articles/${newSlugID}`)
                                        .headers({
                                            Authorization: authToken 
                                        })
                                        .deleteRequest(204);

    const articlesResponseFinal = await api
                                    .path("/articles")
                                    .headers({Authorization: authToken})
                                    .params({ limit: 10, offset: 0 })
                                    .getRequest(200);
    expect(articlesResponseFinal.articles[0].title).not.shouldEqual("test article 2");

})



test("test logger", () => {
    const logger = new APILogger();
    logger.logRequest("POST", "https://test.com/api", {Authorization: "auth-token"}, {foo: "bar"});
    logger.logResponse(200, {foo:"bar", status:"created"});

    const logs = logger.getRecentLogs();
    console.log(logs);
})



test("Optimised: get all the articles logger test ", async ({ api }) => {
    const response = await api
                            .path("/articles")
                            .params({ limit: 10, offset: 0 })
                            .getRequest(200);

    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
})

