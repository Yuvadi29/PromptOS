export interface RetryOptions {
  retries: number;
  delay: number;
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i <= options.retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (i === options.retries) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, options.delay * (i + 1)));
    }
  }

  throw lastError;
}
