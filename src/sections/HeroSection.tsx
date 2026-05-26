import { useState, useRef } from 'react';
import { Plus, ArrowLeftRight, Sparkles, Diamond, Download, ImageIcon } from 'lucide-react';

const creationTabs = [
  { id: 'video', label: 'Create Video' },
  { id: 'image', label: 'Create Image' },
  { id: 'agent', label: 'AI Agent' },
];

const HF_API_KEY = "YOUR_API_KEY_HERE";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('video');
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
    if (!prompt.trim()) {
      setError('Pehle kuch describe karo!');
      return;
    }
    setLoading(true);
    setError(null);
    setImageUrl(null);
    setStatus('AI model load ho raha hai...');

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              num_inference_steps: 30,
              guidance_scale: 7.5,
            }
          }),
        }
      );

      if (response.status === 503) {
        setStatus('Model warm up ho raha hai... 30 seconds wait karo');
        await new Promise(r => setTimeout(r, 30000));
        const retry = await fetch(
          "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${HF_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
          }
        );
        if (!retry.ok) {
          const err = await retry.json();
          throw new Error(err.error || "Generation failed");
        }
        const blob = await retry.blob();
        setImageUrl(URL.createObjectURL(blob));
      } else if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Generation failed");
      } else {
        setStatus('Image render ho rahi hai...');
        const blob = await response.blob();
        setImageUrl(URL.createObjectURL(blob));
      }
    } catch (err: any) {
      setError(err.message || "Kuch error aayi, dobara try karo");
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <section className="max-w-[800px] mx-auto px-4 md:px-0 pt-6 pb-8">
      {/* Creation Mode Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ backgroundColor: '#F5F5F0' }}>
        {creationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 relative py-3.5 px-6 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: activeTab === tab.id ? '#7C5CFC' : 'transparent',
              color: activeTab === tab.id ? '#FFFFFF' : '#4A4A5A',
            }}
          >
            {tab.label}
            {activeTab === tab.id && tab.id === 'video' && (
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="hidden sm:inline">
                <rect x="2" y="4" width="16" height="12" rx="2" fill="white" fillOpacity="0.3" />
                <circle cx="10" cy="10" r="4" fill="white" fillOpacity="0.5" />
                <rect x="14" y="2" width="4" height="3" rx="1" fill="white" fillOpacity="0.4" />
                <rect x="6" y="2" width="4" height="3" rx="1" fill="white" fillOpacity="0.4" />
                <path d="M18 8L22 10L18 12V8Z" fill="white" fillOpacity="0.6" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Headline */}
      <h1 className="font-display text-4xl md:text-[42px] leading-tight mt-8 mb-6" style={{ color: '#1A1A2E' }}>
        Turn your ideas into{' '}
        <em className="not-italic" style={{ color: '#7C5CFC', fontStyle: 'italic' }}>
          visual masterpieces
        </em>
      </h1>

      {/* Prompt Input Card */}
      <div
        className="rounded-2xl p-5 shadow-prompt"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E8F0' }}
      >
        <div className="flex gap-4">
          {/* Upload Zones */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-purple-primary"
              style={{ borderColor: '#E8E8F0' }}
            >
              <Plus size={18} style={{ color: '#8A8A9A' }} />
              <span className="text-[10px] font-medium mt-0.5" style={{ color: '#8A8A9A' }}>First</span>
            </div>
            <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeftRight size={14} style={{ color: '#8A8A9A' }} />
            </button>
            <div
              className="w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-purple-primary"
              style={{ borderColor: '#E8E8F0' }}
            >
              <Plus size={18} style={{ color: '#8A8A9A' }} />
              <span className="text-[10px] font-medium mt-0.5" style={{ color: '#8A8A9A' }}>Last</span>
            </div>
          </div>

          {/* Prompt Textarea */}
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Describe the image you want to create, e.g., 'A child flying a kite in a park, golden sunlight, cinematic style'"
            className="flex-1 resize-none outline-none text-[15px] leading-relaxed min-h-[60px] py-2"
            style={{ color: '#1A1A2E' }}
          />
        </div>

        {/* Settings Bar */}
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid #E8E8F0' }}>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium" style={{ backgroundColor: '#F5F5F0', color: '#4A4A5A' }}>
              <ImageIcon size={12} />
              SDXL 1.0
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium" style={{ backgroundColor: '#F5F5F0', color: '#4A4A5A' }}>
              <ArrowLeftRight size={12} />
              First/Last
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium" style={{ backgroundColor: '#F5F5F0', color: '#4A4A5A' }}>
              768p
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[13px]" style={{ color: '#8A8A9A' }}>
              <Diamond size={12} />
              <span>Free</span>
            </div>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-2 px-7 py-2.5 rounded-full text-[15px] font-medium text-white transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{ backgroundColor: loading ? '#A89AFC' : '#7C5CFC', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <Sparkles size={16} />
              {loading ? 'Generating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-6 flex flex-col items-center gap-4 py-8 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E8F0' }}>
          <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-[#7C5CFC] animate-spin" style={{ borderTopColor: '#7C5CFC', borderColor: '#E8E8F0' }} />
          <p className="text-sm font-medium" style={{ color: '#7C5CFC' }}>{status || 'Image generate ho rahi hai...'}</p>
          <p className="text-xs" style={{ color: '#8A8A9A' }}>Thoda wait karo — AI kaam kar rahi hai ✨</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 rounded-xl text-sm flex items-start gap-3" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
          <span>⚠️</span>
          <div>
            <p className="font-medium">Kuch error aayi</p>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        </div>
      )}

      {/* Generated Image Result */}
      {imageUrl && (
        <div className="mt-6 rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E8F0', backgroundColor: '#FFFFFF' }}>
          <div className="relative">
            <img src={imageUrl} alt="AI Generated" className="w-full object-cover rounded-t-2xl" />
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#7C5CFC' }}>
                ✨ AI Generated
              </span>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between" style={{ borderTop: '1px solid #E8E8F0' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: '#1A1A2E' }}>Image ready hai!</p>
              <p className="text-xs mt-0.5" style={{ color: '#8A8A9A' }}>Stable Diffusion XL se generate hua</p>
            </div>
            <a
              href={imageUrl}
              download="ai-generated-image.png"
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: '#7C5CFC' }}
            >
              <Download size={14} />
              Download
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
