export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  try {
    const { prompt, action } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (action === 'enhance') {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are an expert AI image prompt engineer. Enhance this simple prompt into a detailed, vivid, professional image generation prompt. Keep it under 100 words. Only return the enhanced prompt, nothing else.\n\nUser prompt: "${prompt}"` }] }],
          }),
        }
      );
      const geminiData = await geminiRes.json();
      const enhanced = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || prompt;
      return new Response(JSON.stringify({ enhanced }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const seed = Math.floor(Math.random() * 999999);
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${seed}&nologo=true&model=flux`;

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error', details: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
