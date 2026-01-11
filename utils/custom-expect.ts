import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';


let apiLogger: APILogger;

export const setCustomExpectLogger = (logger: APILogger) => {
    apiLogger = logger;
}

declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T> {
            shouldEqual(expected: T): R
            shouldBeLessThanOrEqual(expected: T): R
        }
    }
}


export const expect = baseExpect.extend({

    shouldEqual(recieved: any, expected: any) {
        let pass: boolean; // result will be assigned

        let logs: string = '';

        try {
            baseExpect(recieved).toEqual(expected);
            pass = true;
            if(this.isNot) {
                logs = apiLogger.getRecentLogs();
            }
        }
        catch (err: any) {

            pass = false;
            logs = apiLogger.getRecentLogs();
        }

        const hint = this.isNot ? "not" : "";
        const message = this.utils.matcherHint("shouldEqual", undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(recieved)} \n\n  ` +
            `Recent API Activity: \n ${logs}`;

        return {
            message: () => message,
            pass
        };


    },

    shouldBeLessThanOrEqual(recieved: any, expected: any) {
        let pass: boolean; // result will be assigned

        let logs: string = '';

        try {
            baseExpect(recieved).toBeLessThanOrEqual(expected);
            pass = true;
            if(this.isNot) {
                logs = apiLogger.getRecentLogs();
            }
        }
        catch (err: any) {

            pass = false;
            logs = apiLogger.getRecentLogs();
        }

        const hint = this.isNot ? "not" : "";
        const message = this.utils.matcherHint("shouldEqual", undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(recieved)} \n\n  ` +
            `Recent API Activity: \n ${logs}`;

        return {
            message: () => message,
            pass
        };


    },


})