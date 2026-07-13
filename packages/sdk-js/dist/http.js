export class HttpClient {
    config;
    constructor(config) {
        this.config = config;
    }
    async post(path, body) {
        const response = await fetch(`${this.config.baseUrl}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return response.json();
    }
}
