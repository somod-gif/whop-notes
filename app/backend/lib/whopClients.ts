/* eslint-disable @typescript-eslint/no-explicit-any */
import WhopAPI from '@whop/sdk';

export const whopClient = new WhopAPI({
  apiKey: process.env.WHOP_API_KEY!,
});

// Fetch user profile using access token
export async function getWhopUser(token: string) {
  try {
    const user = await (whopClient.users as any).getCurrentUser({ accessToken: token });
    return user;
  } catch (err) {
    console.error('Whop user fetch failed:', err);
    return null;
  }
}
