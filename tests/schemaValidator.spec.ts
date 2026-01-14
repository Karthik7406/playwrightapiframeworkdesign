import {  expect } from "@playwright/test";
import { RequestHandler } from "../utils/request-handler";
import { test } from "../utils/fixtures";
import { validateSchema } from "../utils/schema-validator";




test("get the test tags", async({api}) => {
    const response = await api
                                .path("/tags")
                                .getRequest(200);

    //await validateSchema("tags", "GET_tags", response);


    expect(response).shouldMatchSchema("tags", "GET_tags");
   
   expect(response.tags).toContain("Git");
   expect(response.tags.length).toBeLessThanOrEqual(10);
})