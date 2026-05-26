export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt } = req.body;
  const HF_API_KEY = process.env.VITE_HF_API_KEY;
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${HF_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { num_inference_steps: 4 } }),
    });
    if (!response.ok) { const err = await response.json(); return res.status(500).json({ error: err.error || 'Failed' }); }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return res.status(200).json({ image: `data:image/jpeg;base64,${base64}` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}