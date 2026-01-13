import {test as base} from '@playwright/test';
import { RequestHandler } from './request-handler';
import { APILogger } from './logger';
import { setCustomExpectLogger } from './custom-expect';

import { config } from '../api-test.config';
import createToken from '../helpers/createToken';

export type TestOptions = {
    api: RequestHandler
    config: typeof config
}

export type WorkerFixture = {
    authToken: string
}

export const test = base.extend<TestOptions, WorkerFixture>({

    authToken: [ async ({}, use) => {
        const authToken = await createToken(config.userEmail, config.password);
        await use(authToken);

    }, {scope: "worker"}],


    api: async ({request, authToken}, use) => {
        // first parameter is the dependency 
        // second parameter is the use function

        //const baseUrl = "https://conduit-api.bondaracademy.com/api";
        const logger = new APILogger();

        setCustomExpectLogger(logger); // send the instance of logger to customExpect logger

        const requestHandler = new RequestHandler(request, config.apiUrl, logger, authToken);


        console.log("executing before fixture");
        // whatever you put before the use line is executed as a precondition
        await use(requestHandler);

        console.log("executing after the fixture");

        // whatever you put after the use line is executed as post condition
    },

    config: async({}, use) => {
        await use(config);
    }
})


