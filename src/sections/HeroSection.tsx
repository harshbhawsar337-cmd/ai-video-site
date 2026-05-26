import { useState, useRef } from 'react';
import { Plus, ArrowLeftRight, Sparkles, Diamond, Download, Wand2 } from 'lucide-react';

const GEMINI_API_KEY = 'AIzaSyAZtItfK2m1rZUXLThBeKxDDH7b10UYMY4'; // ← Sirf ye line change karo

const creationTabs = [
  { id: 'video', label: 'Create Video' },
  { id: 'image', label: 'Create Image' },
  { id: 'agent', label: 'AI Agent' },
];

async function enhancePromptWithGemini(userPrompt: string): Promise<string> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are an expert AI image prompt engineer. Enhance this simple prompt into a detailed, vivid, professional image generation prompt. Keep it under 100 words. Only return the enhanced prompt, nothing else.\n\nUser prompt: "${userPrompt}"` }] }],
        }),
      }
    );
    const data = await res.json();
    const enhanced = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return enhanced || userPrompt;
  } catch {
    return userPrompt;
  }
}

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setEnhancedPrompt(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  };

  const tryLoadImage = (url: string, timeout: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error('failed'));
      img.src = url;
      setTimeout(() => reject(new Error('timeout')), timeout);
    });
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) { setError('Pehle kuch likho!'); return; }
    setEnhancing(true);
    setError(null);
    const enhanced = await enhancePromptWithGemini(prompt);
    setEnhancedPrompt(enhanced);
    setPrompt(enhanced);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
    setEnhancing(false);
  };

  const handleCreate = async () => {
    if (!prompt.trim()) { setError('Pehle kuch describe karo!'); return; }
    if (activeTab === 'video') { setError('Video coming soon! Abhi Image tab use karo 🎬'); return; }
    if (activeTab === 'agent') { setError('AI Agent coming soon! 🤖'); return; }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 999999);
    const sources = [
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${seed}&nologo=true&model=flux`,
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${seed + 1}&nologo=true&model=turbo`,
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed + 2}&nologo=true`,
    ];

    let success = false;
    for (let i = 0; i < sources.length; i++) {
      try {
        setStatus(`Try ${i + 1}/3 — Image generate ho rahi hai...`);
        const url = await tryLoadImage(sources[i], 45000);
        setImageUrl(url);
        success = true;
        break;
      } catch { continue; }
    }

    if (!success) setError('Image generate nahi hui — dobara Create dabao!');
    setLoading(false);
    setStatus('');
  };

  return (
    <section className="max-w-[800px] mx-auto px-4 md:px-0 pt-6 pb-8">
      <div className="flex gap-1 p-1 rounded-2xl" style={{ backgroundColor: '#F5F5F0' }}>
        {creationTabs.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setError(null); setImageUrl(null); }}
            className="flex-1 relative py-3.5 px-6 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: activeTab === tab.id ? '#7C5CFC' : 'transparent', color: activeTab === tab.id ? '#FFFFFF' : '#4A4A5A' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <h1 className="font-display text-4xl md:text-[42px] leading-tight mt-8 mb-6" style={{ color: '#1A1A2E' }}>
        Turn your ideas into{' '}
        <em className="not-italic" style={{ color: '#7C5CFC', fontStyle: 'italic' }}>visual masterpieces</em>
      </h1>

      <div className="rounded-2xl p-5 shadow-prompt" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E8F0' }}>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer" style={{ borderColor: '#E8E8F0' }}>
              <Plus size={18} style={{ color: '#8A8A9A' }} />
              <span className="text-[10px] font-medium mt-0.5" style={{ color: '#8A8A9A' }}>First</span>
            </div>
            <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeftRight size={14} style={{ color: '#8A8A9A' }} />
            </button>
            <div className="w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer" style={{ borderColor: '#E8E8F0' }}>
              <Plus size={18} style={{ color: '#8A8A9A' }} />
              <span className="text-[10px] font-medium mt-0.5" style={{ color: '#8A8A9A' }}>Last</span>
            </div>
          </div>
          <textarea ref={textareaRef} value={prompt} onChange={handlePromptChange}
            placeholder="Describe the image you want to create..."
            className="flex-1 resize-none outline-none text-[15px] leading-relaxed min-h-[60px] py-2"
            style={{ color: '#1A1A2E' }} />
        </div>

        {enhancedPrompt && (
          <div className="mt-3 px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: '#F3EFFF', color: '#7C5CFC' }}>
            ✨ Gemini ne aapka prompt enhance kar diya!
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 flex-wrap gap-3" style={{ borderTop: '1px solid #E8E8F0' }}>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium" style={{ backgroundColor: '#F5F5F0', color: '#4A4A5A' }}>
              Pollinations AI
            </button>
            <button onClick={handleEnhancePrompt} disabled={enhancing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: enhancing ? '#E8E8F0' : '#F3EFFF', color: '#7C5CFC', border: '1px solid #D4CAFF' }}>
              <Wand2 size={12} />
              {enhancing ? 'Enhancing...' : 'Enhance with Gemini'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[13px]" style={{ color: '#8A8A9A' }}>
              <Diamond size={12} /><span>Free</span>
            </div>
            <button onClick={handleCreate} disabled={loading}
              className="flex items-center gap-2 px-7 py-2.5 rounded-full text-[15px] font-medium text-white transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{ backgroundColor: loading ? '#A89AFC' : '#7C5CFC', cursor: loading ? 'not-allowed' : 'pointer' }}>
              <Sparkles size={16} />
              {loading ? 'Generating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-6 flex flex-col items-center gap-4 py-8 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E8F0' }}>
          <div className="w-12 h-12 rounded-full border-4 animate-spin" style={{ borderColor: '#E8E8F0', borderTopColor: '#7C5CFC' }} />
          <p className="text-sm font-medium" style={{ color: '#7C5CFC' }}>{status || 'Image generate ho rahi hai...'}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 rounded-xl text-sm flex items-center justify-between" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
          <span>⚠️ {error}</span>
          {activeTab === 'image' && (
            <button onClick={handleCreate} className="ml-4 px-4 py-1.5 rounded-full text-sm font-medium text-white" style={{ backgroundColor: '#7C5CFC' }}>Retry</button>
          )}
        </div>
      )}

      {imageUrl && (
        <div className="mt-6 rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E8F0', backgroundColor: '#FFFFFF' }}>
          <img src={imageUrl} alt="AI Generated" className="w-full object-cover rounded-t-2xl" />
          <div className="p-4 flex items-center justify-between" style={{ borderTop: '1px solid #E8E8F0' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: '#1A1A2E' }}>✨ Image ready hai!</p>
              <p className="text-xs mt-0.5" style={{ color: '#8A8A9A' }}>Pollinations AI + Gemini enhanced</p>
            </div>
            <a href={imageUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: '#7C5CFC' }}>
              <Download size={14} /> Download
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
