export async function callStripeApi(endpoint: string, options?: RequestInit) {
  const url = `https://api.stripe.com/v1${endpoint}`;

  const response = await fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    }),
    ...options,
    cache: "no-cache",
  });

  if (response.ok) {
    return response.json();
  }

  throw new Error(
    `Request failed: ${response.status} ${response.statusText} ${JSON.stringify(
      await response.json(),
    )}`,
  );
}
