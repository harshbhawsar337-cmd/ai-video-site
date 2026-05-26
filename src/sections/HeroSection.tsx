import { useState, useRef } from 'react';
import { Plus, ArrowLeftRight, Sparkles, Diamond, Download } from 'lucide-react';

const HF_TOKEN = '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'; // Hugging Face token

const creationTabs = [
  { id: 'video', label: 'Create Video' },
  { id: 'image', label: 'Create Image' },
  { id: 'agent', label: 'AI Agent' },
];

async function generateWithFlux(prompt: string): Promise<string> {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { num_inference_steps: 4 }
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  };

  const handleCreate = async () => {
    if (!prompt.trim()) { setError('Pehle kuch describe karo!'); return; }
    if (activeTab === 'video') { setError('Video coming soon! Abhi Image tab use karo 🎬'); return; }
    if (activeTab === 'agent') { setError('AI Agent coming soon! 🤖'); return; }

    setLoading(true);
    setError(null);
    setImageUrl(null);
    setStatus('FLUX model load ho raha hai...');

    try {
      setStatus('Image generate ho rahi hai — 20-30 sec lagenge...');
