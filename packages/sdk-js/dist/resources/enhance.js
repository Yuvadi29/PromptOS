export class EnhanceResource {
    http;
    constructor(http) {
        this.http = http;
    }
    async create(request) {
        return this.http.post("/enhance", request);
    }
    ;
}
