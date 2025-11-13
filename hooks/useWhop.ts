/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';

interface WhopUser {
  id: string;
  username: string;
  email: string;
}

interface WhopContext {
  user: WhopUser;
  company: any;
  experience: any;
  accessToken: string;
}

export function useWhop() {
  const [context, setContext] = useState<WhopContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeWhop = async () => {
      try {
        // Get Whop context from URL parameters (embedded app standard)
        const urlParams = new URLSearchParams(window.location.search);
        const whopContext = urlParams.get('context');
        
        if (whopContext) {
          // Parse the context from Whop
          const parsedContext = JSON.parse(decodeURIComponent(whopContext));
          setContext(parsedContext);
          setLoading(false);
        } else {
          // Listen for postMessage from Whop
          const receiveMessage = (event: MessageEvent) => {
            if (event.data?.type === 'WHOP_CONTEXT' && event.data.context) {
              setContext(event.data.context);
              setLoading(false);
            }
          };

          window.addEventListener('message', receiveMessage);

          // Request context from parent Whop window
          if (window.parent !== window) {
            window.parent.postMessage({ type: 'GET_WHOP_CONTEXT' }, '*');
          }

          // Fallback timeout - only show access denied in production
          const timeout = setTimeout(() => {
            if (loading) {
              if (process.env.NODE_ENV === 'development') {
                // Development fallback
                console.warn('No Whop context received, using development mode');
                setContext({
                  user: {
                    id: 'dev-user-123',
                    username: 'developer',
                    email: 'dev@example.com'
                  },
                  company: { id: 'dev-company' },
                  experience: { id: 'dev-experience' },
                  accessToken: 'dev-token'
                });
              } else {
                // Production - no access
                setError('Please access this app through Whop with proper authentication');
              }
              setLoading(false);
            }
          }, 3000);

          return () => {
            window.removeEventListener('message', receiveMessage);
            clearTimeout(timeout);
          };
        }
      } catch (err) {
        console.error('Failed to initialize Whop:', err);
        setError('Authentication failed. Please access through Whop.');
        setLoading(false);
      }
    };

    initializeWhop();
  }, [loading]);

  return { context, loading, error };
}