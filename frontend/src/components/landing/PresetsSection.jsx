import { useState } from 'react';

export default function PresetsSection() {
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  const presetThemes = [
    {
      id: 'emerald',
      name: 'Emerald Luxe',
      bg: 'from-emerald-950 via-slate-900 to-emerald-900',
      textColor: 'text-emerald-300',
      buttonStyle: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100',
    },
    {
      id: 'glass',
      name: 'Glassmorphism',
      bg: 'from-slate-900 via-indigo-950 to-slate-900',
      textColor: 'text-indigo-300',
      buttonStyle: 'bg-white/10 backdrop-blur-md border-white/20 text-white',
    },
    {
      id: 'cyber',
      name: 'Cyber Neon',
      bg: 'from-black via-purple-950 to-pink-950',
      textColor: 'text-pink-400',
      buttonStyle: 'bg-pink-500/20 border-pink-500/40 text-pink-200',
    },
    {
      id: 'minimal',
      name: 'Clean White',
      bg: 'from-slate-100 via-white to-emerald-50',
      textColor: 'text-slate-900',
      buttonStyle: 'bg-white border-slate-200 text-slate-800 shadow-sm',
    },
  ];

  return (
    <section id="presets" className="w-full max-w-7xl mx-auto py-12 px-4">
      <div className="rounded-[36px] bg-slate-900 text-white p-8 sm:p-14 overflow-hidden relative shadow-2xl">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Interactive Presets
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white">
            Curated Theme Studio
          </h2>
          <p className="text-slate-400 text-sm">
            Click any theme below to preview how your profile will look in real-time.
          </p>
        </div>

        {/* Theme Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {presetThemes.map((preset, index) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActivePresetIndex(index)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                activePresetIndex === index
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Live Mobile Card Mockup */}
        <div className="max-w-sm mx-auto">
          <div className={`p-6 rounded-[32px] bg-gradient-to-b ${presetThemes[activePresetIndex].bg} border border-white/10 shadow-2xl transition-all duration-500 text-center space-y-5`}>
            
            {/* Profile Avatar */}
            <div className="w-20 h-20 rounded-full mx-auto p-1 bg-white/20 shadow-md">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-white">
                ✨
              </div>
            </div>

            {/* Name & Bio */}
            <div>
              <h4 className={`font-bold text-lg ${presetThemes[activePresetIndex].textColor}`}>
                Alex Rivers
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Creator & Full-Stack Developer
              </p>
            </div>

            {/* Sample Link Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className={`p-3 rounded-2xl border text-xs font-semibold transition-all ${presetThemes[activePresetIndex].buttonStyle}`}>
                🎵 Latest Single & Music Video
              </div>
              <div className={`p-3 rounded-2xl border text-xs font-semibold transition-all ${presetThemes[activePresetIndex].buttonStyle}`}>
                💼 Portfolio & Case Studies
              </div>
              <div className={`p-3 rounded-2xl border text-xs font-semibold transition-all ${presetThemes[activePresetIndex].buttonStyle}`}>
                📬 Subscribe to Newsletter
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
