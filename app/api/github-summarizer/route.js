import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { summarizeReadme } from './chain';

export async function POST(request) {
  try {
    const { githubUrl } = await request.json();

    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    if (!githubUrl) {
      return NextResponse.json({ error: 'GitHub URL is required' }, { status: 400 });
    }

    // Validate the API key
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // This error code indicates no rows were returned
        return NextResponse.json({ error: 'Invalid API key' }, { status: 404 });
      }
      throw error;
    }


    const readme = await getGithubReadme(githubUrl);
    console.log('README:', readme);

    const summary = await summarizeReadme(readme);

    return NextResponse.json({ 
    message: 'GitHub summarization completed',
    url: githubUrl,
    summary: summary.summary,
    coolFacts: summary.cool_facts
    });

  } catch (error) {
    console.error('Error in GitHub summarizer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function getGithubReadme(url) {
  const owner = url.split('/')[3];
  const repo = url.split('/')[4];
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;

  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3.raw',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch README: ${response.statusText}`);
  }

  return await response.text();
}
