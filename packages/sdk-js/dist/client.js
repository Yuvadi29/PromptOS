import { defaultConfig } from "./config";
import { HttpClient } from "./http";
import { EnhanceResource } from "./resources/enhance";
export class PromptOS {
    enhance;
    constructor(config) {
        const merged = {
            ...defaultConfig,
            ...config
        };
        const http = new HttpClient(merged);
        this.enhance = new EnhanceResource(http);
    }
}
