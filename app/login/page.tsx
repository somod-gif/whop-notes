'use client';

export default function LoginPage() {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID!;
    const redirectUri = process.env.NEXT_PUBLIC_WHOP_REDIRECT_URI!;
    const whopAuthUrl = `https://whop.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=openid%20profile%20email`;

    window.location.href = whopAuthUrl;
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Login with Whop</h1>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Continue with Whop
      </button>
    </div>
  );
}
