import WhopAPI from '@whop/sdk';

export const whopClient = new WhopAPI({
  apiKey: process.env.WHOP_API_KEY,
});
