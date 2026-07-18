export async function withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  const controller = new AbortController();

  const id = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await promise;
  } finally {
    clearTimeout(id);
  }
}
