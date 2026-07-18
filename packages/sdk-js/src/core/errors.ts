export class PromptOSError extends Error {
  constructor(
    message?: string,
    public status?: number
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends PromptOSError {}

export class ValidationError extends PromptOSError {}

export class RateLimitError extends PromptOSError {}

export class TimeoutError extends PromptOSError {}

export class ServerError extends PromptOSError {}

export class NetworkError extends PromptOSError {}
