// src/core/config.ts
var DEFAULT_CONFIG = {
  BASE_URL: "https://promptos.in/api/v1",
  TIMEOUT: 3e4,
  RETRIES: 2,
  RETRY_DELAY: 300
};

// src/core/errors.ts
var PromptOSError = class extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
  status;
};
var AuthenticationError = class extends PromptOSError {
};
var ValidationError = class extends PromptOSError {
};
var RateLimitError = class extends PromptOSError {
};
var TimeoutError = class extends PromptOSError {
};
var ServerError = class extends PromptOSError {
};
var NetworkError = class extends PromptOSError {
};

// src/core/retry.ts
async function retry(fn, options) {
  let lastError;
  for (let i = 0; i <= options.retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i === options.retries) {
        break;
      }
      await new Promise(
        (resolve) => setTimeout(resolve, options.delay * (i + 1))
      );
    }
  }
  throw lastError;
}

// src/core/http.ts
var HttpClient = class {
  apiKey;
  baseURL;
  timeout;
  retries;
  retryDelay;
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseUrl ?? DEFAULT_CONFIG.BASE_URL;
    this.timeout = config.timeout ?? DEFAULT_CONFIG.TIMEOUT;
    this.retries = config.retries ?? DEFAULT_CONFIG.RETRIES;
    this.retryDelay = config.retryDelay ?? DEFAULT_CONFIG.RETRY_DELAY;
  }
  async post(endpoint, body) {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, this.timeout);
    try {
      return await retry(
        async () => {
          const response = await fetch(
            `${this.baseURL}${endpoint}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body),
              signal: controller.signal
            }
          );
          const text = await response.text();
          let json;
          try {
            json = JSON.parse(text);
          } catch (e) {
          }
          if (!response.ok) {
            throw new PromptOSError(
              json?.error?.message ?? `API Error: ${response.status} ${response.statusText}`,
              response.status
            );
          }
          if (!json) {
            throw new PromptOSError("Invalid JSON response from server");
          }
          return json;
        },
        {
          retries: this.retries,
          delay: this.retryDelay
        }
      );
    } catch (err) {
      if (err instanceof PromptOSError) {
        throw err;
      }
      if (err instanceof Error && err.name === "AbortError") {
        throw new PromptOSError(
          "Request timed out."
        );
      }
      throw new PromptOSError(
        "Network request failed."
      );
    } finally {
      clearTimeout(timeout);
    }
  }
};

// src/core/client.ts
var SDKClient = class {
  http;
  constructor(config) {
    this.http = new HttpClient(config);
  }
};

// src/resources/prompts/enhance.ts
var EnhanceResource = class {
  constructor(client) {
    this.client = client;
  }
  client;
  async create(request) {
    return this.client.http.post("/prompts/enhance", request);
  }
};

// src/resources/prompts/classify.ts
var ClassifyResource = class {
  constructor(client) {
    this.client = client;
  }
  client;
  async create(request) {
    return this.client.http.post("/prompts/classify", request);
  }
};

// src/resources/prompts/index.ts
var PromptResource = class {
  enhance;
  classify;
  constructor(client) {
    this.enhance = new EnhanceResource(client);
    this.classify = new ClassifyResource(client);
  }
};

// src/PromptOS.ts
var PromptOS = class {
  prompts;
  constructor(config) {
    const client = new SDKClient(config);
    this.prompts = new PromptResource(client);
  }
};

export { AuthenticationError, NetworkError, PromptOS, PromptOSError, RateLimitError, ServerError, TimeoutError, ValidationError };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map