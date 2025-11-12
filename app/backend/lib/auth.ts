export async function validateWhopToken(token: string) {
  try {
    const res = await fetch('https://api.whop.com/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
