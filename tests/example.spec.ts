import { test, expect } from '@playwright/test';

let authToken: string;


test.beforeAll("before all hook", async ({ request }) => {

  console.log("****** this is executed before all tests ************");

  const tokenResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        "user": {
          "email": "pwapiuser12@gmail.com",
          "password": "pwapiuser@12"
        }
      }
    });

  const tokenResponseJSON = await tokenResponse.json();

  authToken = `Token ` + tokenResponseJSON.user.token;

})

test.afterAll("after all hook", async ({ }) => {
  console.log("***** this is executed after all tests ******** ");
})


test.beforeEach("executing before each block ", async ({ }) => {
  console.log("============== this is executed before each block ===============");
})

test.afterEach("executing after each block", async ({ }) => {
  console.log("============== this is executed after each block ===============");
})


test('get test tags', async ({ request }) => {

  // for api we use request fixture instead of page fixture

  const tagsResponse = await request.get("https://conduit-api.bondaracademy.com/api/tags");

  // playwright will wait upto 30s for the command to be executed -> default timeout

  // timeout on server side, if api has not responded within specified time, it will return us a timeout 

  // getting the response body from api

  const tagsResponseJson = await tagsResponse.json();

  // adding assertions

  expect(tagsResponse.status()).toEqual(201);

  expect(tagsResponseJson.tags[0]).toEqual("Test");

  expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10);


});



test("get all the articles", async ({ request }) => {

  const articles = await request.get("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0");
  const articlesResponseJSON = await articles.json();

  expect(articles.status()).toEqual(200);
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseJSON.articlesCount).toEqual(10);
})



test("post request - creating and deleting a article", async ({ request }) => {

  // step 2 creating the article

  console.log("creating the article");

  const newArticleResponse = await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
    data: {
      "article": {
        "title": "test article 2",
        "description": "test article 2",
        "body": "this is test article from API",
        "tagList": [
          "tag2"
        ]
      }
    },
    headers: {
      Authorization: authToken
    }
  });

  const newArticleResponseJSON = await newArticleResponse.json();


  expect(newArticleResponse.status()).toEqual(201);
  expect(newArticleResponseJSON.article.title).toEqual("test article 2");

  const slugID = newArticleResponseJSON.article.slug;

  const articles = await request.get("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0", {
    headers: {
      Authorization: authToken
    }
  });
  const articlesResponseJSON = await articles.json();

  expect(articles.status()).toEqual(200);

  expect(articlesResponseJSON.articles[0].title).toEqual("test article 2");


  // save the slug id which we get during create


  // updating the article

  console.log("updating the article");

  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`, {
    data: {
      "article": {
        "title": "apiarticle1modify",
        "description": "updated description from API",
        "body": "ui is created this article, api modify",
        "tagList": []
      }
    },
    headers: {
      Authorization: authToken
    }
  })

  const updateArticleResponseJSON = await updateArticleResponse.json();
  expect(updateArticleResponse.status()).toEqual(200);
  expect(updateArticleResponseJSON.article.title).toEqual("apiarticle1modify");


  const newSlugID = updateArticleResponseJSON.article.slug;
  // getting the details of the updated article
  const articleResponse = await request.get(`https://conduit-api.bondaracademy.com/api/articles/${newSlugID}`, {
    headers: {
      Authorization: authToken
    }
  });

  const articleResponseJSON = await articleResponse.json();

  expect(articleResponse.status()).toEqual(200);
  expect(articleResponseJSON.article.title).toEqual("apiarticle1modify");

 
  // deleting the article
  console.log("deleting the article");
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlugID}`, {
    headers: {
      Authorization: authToken
    }
  });

  expect(deleteArticleResponse.status()).toEqual(204);

})
