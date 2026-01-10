import {test as base} from '@playwright/test';
import { RequestHandler } from './request-handler';

export type TestOptions = {
    api: RequestHandler
}

export const test = base.extend<TestOptions>({
    api: async ({}, use) => {
        // first parameter is the dependency 
        // second parameter is the use function

        const requestHandler = new RequestHandler();

        console.log("executing before fixture");

        // whatever you put before the use line is executed as a precondition

        await use(requestHandler);

        console.log("executing after the fixture");

        // whatever you put after the use line is executed as post condition
    }
})