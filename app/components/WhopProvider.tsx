/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';


import { createWhopAPI } from "@whop-sdk/embedded";
import { useEffect, useState } from "react";

export function WhopProvider({ children }: { children: React.ReactNode }) {
  const [whop, setWhop] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeWhop = async () => {
      try {
        // Initialize Whop SDK
        const whopAPI = createWhopAPI({
          appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
        });
        
        setWhop(whopAPI);

        // Get user context
        const userContext = await whopAPI.userContext();
        setUser(userContext);

        setLoading(false);
      } catch (error) {
        console.error("Failed to initialize Whop:", error);
        setLoading(false);
      }
    };

    initializeWhop();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading Whop App...</div>
      </div>
    );
  }

  return (
    <div className="whop-embedded-app">
      {children}
    </div>
  );
}