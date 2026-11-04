
export async function apiClient<T>(
  url: string,
  signal?: AbortSignal
): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    let message = `Unable to load data. Please try again.`;

    try {
      const body: unknown = await response.json();

      if (
        typeof body === "object" &&
        body !== null &&
        "error" in body &&
        typeof body.error === "string"
      ) {
        message = body.error;
      }
    } catch {
      // Use the default HTTP error message.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}
