'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function ProtectedPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateApiKey = async () => {
      const apiKey = localStorage.getItem('apiKey');
      if (!apiKey) {
        router.push('/api-playground');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('api_keys')
          .select('*')
          .eq('key', apiKey)
          .single();

        if (error) throw error;

        if (data) {
          setIsAuthenticated(true);
        } else {
          router.push('/api-playground');
        }
      } catch (error) {
        console.error('Error validating API key:', error);
        router.push('/api-playground');
      } finally {
        setIsLoading(false);
      }
    };

    validateApiKey();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // This will prevent any flash of content before redirect
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      <p>This is a protected page. You can only see this content if you have a valid API key.</p>
    </div>
  );
}
