// app/analyze/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, isLoaded } = useUser();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      checkAccess();
    }
  }, [isLoaded, sessionId]);

  const checkAccess = async () => {
    try {
      // If they have a session_id, verify the payment
      if (sessionId) {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await response.json();
        setHasAccess(data.hasAccess);
      } 
      // If they're signed in, check their credits
      else if (user) {
        const response = await fetch('/api/check-credits');
        const data = await response.json();
        setHasAccess(data.hasCredits);
      }
      // No session and no user = no access
      else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Access check failed:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return <div className="loading loading-spinner"></div>;
  }

  if (!hasAccess) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Payment Required</h2>
        <a href="/" className="btn btn-primary">View Pricing</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Start Your Analysis</h1>
      {/* Your analysis component */}
    </div>
  );
}