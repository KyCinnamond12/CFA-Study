import { TOPICS } from '../data/constants'
import { ModeIcon, IconBack } from './Icons'

export default function GameModePage({ mode, scope, topic, onBack }) {
  // scope: 'all' | topic.id; topic: topic object (if from topic page) or null
  const scopeName = topic
    ? topic.label
    : scope === 'all'
      ? 'Entire Curriculum'
      : TOPICS.find(t => t.id === scope)?.label ?? scope

  return (
    <div className="min-h-screen" style={{ background: '#faf8f3' }}>

      {/* ── Header ── */}
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[12px] tracking-wider text-slate-500 hover:text-[#0f1f3d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a84b] rounded px-1"
          >
            <IconBack className="w-4 h-4" />
            Back
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #c8a84b, #a07830)' }}
          >
            <span className="text-[8px] font-bold text-white tracking-tighter leading-none select-none text-center">
              CFA<br/>II
            </span>
          </div>
          <p className="font-serif text-[14px] text-[#0f1f3d] font-semibold leading-none">Study Hub</p>
          {/* Breadcrumb */}
          <div className="ml-auto hidden sm:flex items-center gap-2 text-[11px] text-slate-400 tracking-wider">
            <span>{scopeName}</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            <span className="text-[#0f1f3d]">{mode.label}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        {/* Mode badge */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
          style={{ background: mode.bg, color: mode.color }}
        >
          <ModeIcon id={mode.icon} className="w-8 h-8" />
        </div>

        <span
          className="text-[10px] tracking-widest px-3 py-1 rounded-full font-medium mb-4"
          style={{ background: mode.bg, color: mode.color }}
        >
          {mode.badge}
        </span>

        <h1 className="font-serif text-3xl font-bold text-[#0f1f3d] mb-2">{mode.label}</h1>
        <p className="text-slate-400 text-sm mb-2">
          Scope: <span className="text-[#0f1f3d] font-medium">{scopeName}</span>
        </p>
        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-10">{mode.description}</p>

        {/* Placeholder panel */}
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-sm p-10">
          <p className="font-serif text-lg text-[#0f1f3d] mb-2">Coming in Phase 2</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Full question banks and AI-generated content will be wired up here.
            The scope selector, streak counter, and results screen will all live in this panel.
          </p>
        </div>
      </main>
    </div>
  )
}
