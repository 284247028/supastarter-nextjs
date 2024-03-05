export async function callLemonsqueezyApi(
  endpoint: string,
  options?: RequestInit,
) {
  const url = `https://api.lemonsqueezy.com/v1${endpoint}`;

  const response = await fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    }),
    ...options,
    cache: "no-cache",
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(`Request failed: ${response.status} ${response.statusText}`);
}
