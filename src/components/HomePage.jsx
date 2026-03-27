import { useState } from 'react'
import { TOPICS, GAME_MODES } from '../data/constants'
import { TopicIcon, ModeIcon, IconChevronDown } from './Icons'

// ─── Topic Card ───────────────────────────────────────────────────────────────

function TopicCard({ topic, onClick }) {
  return (
    <button
      onClick={() => onClick(topic)}
      className="group w-full text-left bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a84b]"
    >
      {/* Icon badge */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3.5"
        style={{ background: topic.bg, color: topic.color }}
      >
        <TopicIcon id={topic.icon} className="w-5 h-5" />
      </div>

      {/* Label */}
      <p className="font-serif text-[15px] font-semibold text-[#0f1f3d] leading-snug mb-1.5 group-hover:text-[#1a3a6e] transition-colors">
        {topic.label}
      </p>

      {/* Description */}
      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
        {topic.description}
      </p>

      {/* Arrow on hover */}
      <div className="mt-3 flex items-center gap-1 text-[11px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: topic.color }}>
        <span>EXPLORE</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}

// ─── Game Mode Card ───────────────────────────────────────────────────────────

function GameModeCard({ mode, onPlay }) {
  const [scope, setScope] = useState('all')

  const scopeLabel = scope === 'all'
    ? 'Entire Curriculum'
    : TOPICS.find(t => t.id === scope)?.label ?? scope

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: mode.bg, color: mode.color }}
        >
          <ModeIcon id={mode.icon} className="w-5 h-5" />
        </div>
        <span
          className="text-[10px] tracking-widest px-2 py-1 rounded-full font-medium"
          style={{ background: mode.bg, color: mode.color }}
        >
          {mode.badge}
        </span>
      </div>

      <p className="font-serif text-[15px] font-semibold text-[#0f1f3d] mb-1.5">{mode.label}</p>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-4 flex-1">{mode.description}</p>

      {/* Scope selector */}
      <div className="mb-3">
        <label className="text-[10px] tracking-widest text-slate-400 mb-1.5 block">SCOPE</label>
        <div className="relative">
          <select
            value={scope}
            onChange={e => setScope(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-[#0f1f3d] pr-8 focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/40 focus:border-[#c8a84b] transition-colors cursor-pointer"
          >
            <option value="all">Entire CFA Curriculum</option>
            <optgroup label="Specific Topic">
              {TOPICS.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </optgroup>
          </select>
          {/* Custom chevron */}
          <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Play button */}
      <button
        onClick={() => onPlay(mode, scope)}
        className="w-full py-2.5 rounded-lg text-[12px] tracking-widest font-medium transition-all duration-150 hover:opacity-90 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{
          background: `linear-gradient(135deg, ${mode.color}, ${mode.color}cc)`,
          color: '#fff',
        }}
      >
        PLAY
      </button>
    </div>
  )
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export default function HomePage({ onTopicClick, onModePlay }) {
  return (
    <div className="min-h-screen" style={{ background: '#faf8f3' }}>

      {/* ── Header ── */}
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #c8a84b, #a07830)' }}
            >
              <span className="text-[9px] font-bold text-white tracking-tighter leading-none select-none text-center">
                CFA<br/>II
              </span>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.22em] text-[#c8a84b] leading-none mb-0.5">CFA LEVEL II</p>
              <p className="font-serif text-[15px] text-[#0f1f3d] leading-none font-semibold">Study Hub</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            AI-powered
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Hero ── */}
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.3em] text-[#c8a84b] mb-3">CFA LEVEL II · STUDY HUB</p>
          <h1 className="font-serif text-4xl font-bold text-[#0f1f3d] mb-3 leading-tight">
            Master the CFA Level II<br className="hidden sm:block" /> Curriculum
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
            Choose a topic to study, or jump directly into a game mode across the full curriculum. AI-generated questions refresh each session.
          </p>
        </div>

        {/* ── Topics ── */}
        <section className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-serif text-xl font-semibold text-[#0f1f3d]">Topics</h2>
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] tracking-widest text-slate-400">10 AREAS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TOPICS.map(topic => (
              <TopicCard key={topic.id} topic={topic} onClick={onTopicClick} />
            ))}
          </div>
        </section>

        {/* ── Game Modes ── */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-serif text-xl font-semibold text-[#0f1f3d]">Game Modes</h2>
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] tracking-widest text-slate-400">4 MODES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GAME_MODES.map(mode => (
              <GameModeCard key={mode.id} mode={mode} onPlay={onModePlay} />
            ))}
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <p className="text-[11px] text-slate-300 tracking-widest">CFA LEVEL II STUDY HUB</p>
          <p className="text-[11px] text-slate-300">Powered by Claude</p>
        </div>
      </footer>

    </div>
  )
}
