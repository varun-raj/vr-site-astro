import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let data;
  try {
    data = await request.json();
  } catch (e) {
    console.error('Failed to parse request JSON:', e);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { name, category, achievement, target } = data;

  const apiKey = import.meta.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured');
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const prompt = `
    You are an expert BNI (Business Network International) coach. 
    Generate a high-impact, professional 30-second weekly presentation script.
    
    Inputs:
    - Name: ${name}
    - Category: ${category}
    - Achievement This Week: ${achievement}
    - Looking For (Target): ${target}

    Constraints:
    1. Start exactly with "I'm ${name}, from the ${category} category."
    2. Focus on the achievement to build credibility.
    3. End with a punchy sign-off and clear call to action regarding the target.
    4. Total length must be readable within 30 seconds (approx 50-70 words).
    5. Do not include any meta-talk or pleasantries like "Hi everyone" or "Good morning".
    6. Return ONLY the script text, no intro/outro.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      throw new Error(`Gemini API failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log(result)
    const pitch = result.candidates[0].content.parts[0].text.trim();

    console.log(pitch)
    return new Response(JSON.stringify({ pitch }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Pitch generation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate pitch' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
