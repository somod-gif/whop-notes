// app/backend/lib/whopClient.ts
import WhopAPI from '@whop/sdk';

export const whopClient = new WhopAPI({
  apiKey: process.env.WHOP_API_KEY!,
});

// Add this helper function to fetch the current user from Whop
export async function getWhopUser(token: string) {
  try {
    const res = await whopClient.users.me({ token }); // Adjust based on Whop SDK
    return res;
  } catch (err) {
    console.error('Failed to fetch Whop user:', err);
    return null;
  }
}
