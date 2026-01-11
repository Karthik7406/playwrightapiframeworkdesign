import { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";

export class RequestHandler {

    private request: APIRequestContext
    private baseUrl: string | undefined;
    private apiPath: string = "";
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}

    private defaultBaseUrl: string = "";


    constructor(request: APIRequestContext, apiBaseUrl: string) {
        
        this.request = request;
        this.defaultBaseUrl = apiBaseUrl;

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
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        });

        expect(response.status()).toEqual(statusCode);

        const responseJSON = await response.json();
        return responseJSON;

    }

    async postRequest(statusCode: number) {

        const url = this.getUrl();
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });

        expect(response.status()).toEqual(statusCode);
        const responseJSON = await response.json();
        return responseJSON;

    }

    async putRequest(statusCode: number) {
        const url = this.getUrl();
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        });
        expect(response.status()).toEqual(statusCode);
        const responseJSON = await response.json();
        return responseJSON;
    }

    async deleteRequest(statusCode: number) {
        const url = this.getUrl();
        const response = await this.request.delete(url, {
            headers: this.apiHeaders
        });

        expect(response.status()).toEqual(statusCode);
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


}