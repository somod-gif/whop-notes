'use client';

import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SignInPage() {
  useEffect(() => {
    signIn("whop", { callbackUrl: "/" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Signing in with Whop</h2>
          <p className="mt-2 text-gray-600">Redirecting to Whop OAuth...</p>
        </div>
      </div>
    </div>
  );
}