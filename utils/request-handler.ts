import { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {

    private request: APIRequestContext
    private baseUrl: string | undefined;
    private apiPath: string = "";
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {};
    private logger: APILogger;

    private defaultBaseUrl: string = "";


    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger) {
        
        this.request = request;
        this.defaultBaseUrl = apiBaseUrl;
        this.logger = logger;

        console.log("API Base URL ", this.defaultBaseUrl);
    }


    url(url: string) {
        console.log("executing setting of url");
        this.baseUrl = url;
        return this; // by returning this, we provide the instance to have access to other instance methods in the same class -> fluent interface design
        // by returning this we would be able to chain the methods with . notation
    }

    path(path: string) {
        this.apiPath = path;
        return this
    }

    params(params: object) {
        this.queryParams = params;
        return this;
    }

    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        console.log(this.apiHeaders);
        return this;
    }

    body(body: object) {
        this.apiBody = body
        return this;
    }

    async getRequest(statusCode:number) {
        let url = this.getUrl();
        console.log("*** URL *** ", url);
        this.logger.logRequest("GET", url, this.apiHeaders, this.apiBody);

        const response = await this.request.get(url, {
            headers: this.apiHeaders
        });

        const actualStatus = response.status();
        const responseJSON = await response.json();

        this.logger.logResponse(actualStatus, responseJSON);

        //expect(actualStatus).toEqual(statusCode);
        this.statusCodeValidator(actualStatus, statusCode, this.getRequest);
        return responseJSON;
    }

    async postRequest(statusCode: number) {

        const url = this.getUrl();

        this.logger.logRequest("POST", url, this.apiHeaders, this.apiBody);
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });

        const actualStatus = response.status();
        const responseJSON = await response.json();

        this.logger.logResponse(actualStatus, responseJSON);
        this.statusCodeValidator(actualStatus, statusCode, this.postRequest);

        return responseJSON;

    }

    async putRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest("PUT", url, this.apiHeaders, this.apiBody);

        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });

        const actualStatus = response.status();
        const responseJSON = await response.json();

        this.logger.logResponse(actualStatus, responseJSON);

        //expect(actualStatus).toEqual(statusCode);
        this.statusCodeValidator(actualStatus, statusCode, this.putRequest);
        return responseJSON;
    }

    async deleteRequest(statusCode: number) {
        const url = this.getUrl();
        this.logger.logRequest("DELETE", url, this.apiHeaders);


        const response = await this.request.delete(url, {
            headers: this.apiHeaders
        });
        let actualStatus = response.status();
       

        this.logger.logResponse(actualStatus);
        //expect(actualStatus).toEqual(statusCode);
        this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)
        // for delete request , nothing to return, perform only status validaton
    }

    private getUrl() {
        // console.log("***** generating the url *******", this.defaultBaseUrl,  this.baseUrl, this.apiPath);
        //console.log("generated url ", `${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`);

        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`);

        // updating the query params
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value);
        }

        //console.log(url.toString());
        return url.toString();
    }

    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function) {
        if(actualStatus !== expectedStatus) {
            const logs = this.logger.getRecentLogs();
            const error = new Error(`Expected status ${expectedStatus} but got ${actualStatus} \n\n Recent API Activity \n ${logs}`);
            Error.captureStackTrace(error, callingMethod )
            throw error;
        }
    }


}