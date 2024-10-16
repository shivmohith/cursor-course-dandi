import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Query the database to check if the API key exists
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // This error code indicates no rows were returned
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
      throw error;
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
