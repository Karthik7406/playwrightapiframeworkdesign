import { expect } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { test } from "../utils/fixtures";
import { validateSchema } from "../utils/schema-validator";

import { faker } from '@faker-js/faker';




test("get the test tags", async ({ api }) => {
    const response = await api
        .path("/tags")
        .getRequest(200);

    //await validateSchema("tags", "GET_tags", response);


    await expect(response).shouldMatchSchema("tags", "GET_tags", true);
    expect(response.tags).toContain("Git");
    expect(response.tags.length).toBeLessThanOrEqual(10);
})


// generating schema for articles

test("Optimised: get all the articles ", async ({ api }) => {
    const response = await api
        .path("/articles")
        .params({ limit: 10, offset: 0 })
        .clearAuth()
        .getRequest(200);

    await expect(response).shouldMatchSchema("articles", "GET_articles");
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
})


test("optimised: CRUD operations on all articles", async ({ api }) => {

    let articleTitle = faker.lorem.sentence(5);
    
    const response = await api
        .path("/articles")
        .body({
            "article": {
                "title": articleTitle,
                "description": "test article 23",
                "body": "this is test article from API",
                "tagList": [
                    "tag2"
                ]
            }
        })
        .postRequest(201);

    await expect(response).shouldMatchSchema("articles", "POST_article", true);
    expect(response.article.title).shouldEqual(articleTitle);

    const slugID = response.article.slug;

    const articlesResponse = await api
        .path("/articles")
        .params({ limit: 10, offset: 0 })
        .getRequest(200);

    await expect(articlesResponse).shouldMatchSchema("articles", "GET_articles", true);
    expect(articlesResponse.articles[0].title).shouldEqual(articleTitle);

    let modifiedName = faker.lorem.sentence(10);

    // updating the article
    console.log("********** update operation ************* ");
    const updateArticleResponse = await api
        .path(`/articles/${slugID}`)
        .body({
            "article": {
                "title": modifiedName,
                "description": "updated description from API",
                "body": "ui is created this article, api modify",
                "tagList": []
            }
        })
        .putRequest(200);

    console.log("update article response ", updateArticleResponse);
    await expect(updateArticleResponse).shouldMatchSchema("articles", "PUT_article");
    expect(updateArticleResponse.article.title).shouldEqual(modifiedName);

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

