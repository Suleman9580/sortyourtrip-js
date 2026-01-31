export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise
      .then(res => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function runWithRetry<T>(
  fn: () => Promise<T>,
  retries = 1
): Promise<{ result: T; attempts: number }> {
  let attempt = 0;
  let lastErr: any;

  while (attempt <= retries) {
    try {
      const result = await fn();
      return { result, attempts: attempt + 1 };
    } catch (err) {
      lastErr = err;
      attempt++;
    }
  }

  throw lastErr;
}
