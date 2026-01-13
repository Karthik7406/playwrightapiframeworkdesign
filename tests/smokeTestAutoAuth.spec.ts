import { test } from "../utils/fixtures";
// import { expect } from "@playwright/test"
import { APILogger } from "../utils/logger";

import { expect } from "../utils/custom-expect";
import createToken from "../helpers/createToken";


test("Optimised: get the test tags", async ({ api }) => {

    const tagsResponse = await api
        .path("/tags")
        .getRequest(200);


    expect(tagsResponse.tags[0]).shouldEqual("playwright");
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
                "title": "test article 23",
                "description": "test article 23",
                "body": "this is test article from API",
                "tagList": [
                    "tag2"
                ]
            }
        })
        .postRequest(201);


    expect(response.article.title).shouldEqual("test article 23");

    const slugID = response.article.slug;

    const articlesResponse = await api
        .path("/articles")
        .params({ limit: 10, offset: 0 })
        .getRequest(200);


    expect(articlesResponse.articles[0].title).shouldEqual("test article 23");

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
        .putRequest(200);

    console.log("update article response ", updateArticleResponse);

    expect(updateArticleResponse.article.title).shouldEqual("apiarticle1modify");

    const newSlugID = updateArticleResponse.article.slug;
    console.log("********** delete operation ************* ");
    const deleteArticleResponse = await api
        .path(`/articles/${newSlugID}`)
        .deleteRequest(204);

    const articlesResponseFinal = await api
        .path("/articles")
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articlesResponseFinal.articles[0].title).not.shouldEqual("test article 23");

})
