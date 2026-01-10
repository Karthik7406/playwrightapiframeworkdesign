export class RequestHandler {

    private baseUrl: string=""
    private apiPath: string = ""
    private queryParams: object = {}
    private apiHeaders: object = {}
    private apiBody : object = {}


    url(url: string) {
        console.log("executing setting of url");
        this.baseUrl = url;
        return this; // by returning this, we provide the instance to have access to other instance methods in the same class -> fluent interface design
        // by returning this we would be able to chain the methods with . notation
    }

    path(path: string) {
        this.apiPath  = path;
        return this
    }

    params (params: object) {
        this.queryParams = params;
        return this;
    }

    headers(headers:object) {
        this.apiHeaders = headers;
        console.log(this.apiHeaders);
        return this;
    }

    body(body:object) {
        this.apiBody = body
        return this;
    }
}