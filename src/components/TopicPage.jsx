import { useState } from 'react'
import { GAME_MODES } from '../data/constants'
import { TopicIcon, ModeIcon, IconBack } from './Icons'
import CheatSheet from './CheatSheet'

// ─── Mode Card ────────────────────────────────────────────────────────────────

function TopicModeCard({ mode, topic, onClick }) {
  return (
    <button
      onClick={() => onClick(mode, topic)}
      className="group w-full text-left bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a84b]"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
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

      <p className="font-serif text-lg font-semibold text-[#0f1f3d] mb-2">{mode.label}</p>
      <p className="text-[12px] text-slate-400 leading-relaxed mb-5">{mode.description}</p>

      {/* CTA row */}
      <div
        className="flex items-center justify-between text-[11px] tracking-widest font-medium pt-4 border-t border-slate-100"
        style={{ color: mode.color }}
      >
        <span>LAUNCH</span>
        <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}

// ─── TopicPage ────────────────────────────────────────────────────────────────

const TOPIC_PDF = {
  ethics: 'Ethics.pdf',
  quant: 'Quantitative%20Methods.pdf',
  economics: 'Economics.pdf',
  fsa: 'Financial%20Statement%20Analysis.pdf',
  corporate: 'Corporate%20Issuers.pdf',
  equity: 'Equity%20Valuation.pdf',
  fixed: 'Fixed%20Income.pdf',
  derivatives: 'Derivatives.pdf',
  alts: 'Alternative%20Investments.pdf',
  portfolio: 'Portfolio%20Management.pdf',
}

export default function TopicPage({ topic, onBack, onModePlay }) {
  // Limit to the 3 standard topic modes (not crossword on topic page)
  const modes = GAME_MODES.filter(m => m.id !== 'crossword')
  const [showCheatSheet, setShowCheatSheet] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [pdfExists, setPdfExists] = useState(null) // null = checking, true, false
  const hasCheatSheet = topic.id === 'alts'
  const notesPdf = `/notes/${TOPIC_PDF[topic.id]}`

  function openNotes() {
    setPdfExists(null)
    setShowNotes(true)
    fetch(notesPdf, { method: 'HEAD' })
      .then(r => setPdfExists(r.ok))
      .catch(() => setPdfExists(false))
  }

  return (
    <div className="min-h-screen" style={{ background: '#faf8f3' }}>

      {/* ── Header ── */}
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[12px] tracking-wider text-slate-500 hover:text-[#0f1f3d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a84b] rounded px-1"
          >
            <IconBack className="w-4 h-4" />
            Back
          </button>

          <div className="w-px h-5 bg-slate-200" />

          {/* Wordmark */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #c8a84b, #a07830)' }}
            >
              <span className="text-[8px] font-bold text-white tracking-tighter leading-none select-none text-center">
                CFA<br/>II
              </span>
            </div>
            <p className="font-serif text-[14px] text-[#0f1f3d] font-semibold leading-none">Study Hub</p>
          </div>

          {/* Breadcrumb */}
          <div className="ml-auto hidden sm:flex items-center gap-2 text-[11px] text-slate-400 tracking-wider">
            <span>Topics</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            <span className="text-[#0f1f3d]">{topic.label}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Topic hero ── */}
        <div className="mb-10">
          {/* Icon + label */}
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ background: topic.bg, color: topic.color }}
            >
              <TopicIcon id={topic.icon} className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] mb-1" style={{ color: topic.color }}>CFA LEVEL II</p>
              <h1 className="font-serif text-3xl font-bold text-[#0f1f3d] leading-tight">{topic.full}</h1>
            </div>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed max-w-xl">{topic.description}</p>

          {/* Accent line */}
          <div className="mt-6 h-px w-full bg-gradient-to-r from-slate-200 to-transparent" />
        </div>

        {/* ── Mode cards ── */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-serif text-xl font-semibold text-[#0f1f3d]">Choose a Mode</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {modes.map(mode => (
              <TopicModeCard
                key={mode.id}
                mode={mode}
                topic={topic}
                onClick={onModePlay}
              />
            ))}
          </div>
        </div>

        {/* ── Resources ── */}
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-serif text-xl font-semibold text-[#0f1f3d]">Resources</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="flex flex-wrap gap-3">
            {hasCheatSheet ? (
              <button
                onClick={() => setShowCheatSheet(true)}
                className="flex items-center gap-3 bg-white border border-[#c8a84b]/40 rounded-xl px-5 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a84b]"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#fdf6e3' }}>
                  <svg className="w-4 h-4" style={{ color: '#c8a84b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#0f1f3d]">Cheat Sheet</p>
                  <p className="text-[11px] text-slate-400">One-page printable reference</p>
                </div>
                <span className="ml-2 text-[10px] tracking-widest px-2 py-0.5 rounded-full font-medium" style={{ background: '#fdf6e3', color: '#c8a84b' }}>
                  NEW
                </span>
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 opacity-50 cursor-not-allowed"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-400">Cheat Sheet</p>
                  <p className="text-[11px] text-slate-300">Coming Soon</p>
                </div>
              </button>
            )}

            {/* My Notes button */}
            <button
              onClick={openNotes}
              className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2"
              style={{ border: `1px solid ${topic.color}40`, focusVisibleRingColor: topic.color }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: topic.bg }}>
                <svg className="w-4 h-4" style={{ color: topic.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#0f1f3d]">My Notes</p>
                <p className="text-[11px] text-slate-400">Personal study notes</p>
              </div>
            </button>
          </div>
        </div>

        {/* ── At-a-glance stats ── */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            { label: 'Vignettes', value: '2', sub: 'pre-written + AI' },
            { label: 'Sudden Death Qs', value: '10', sub: 'per session' },
            { label: 'Flashcards', value: '10', sub: 'in deck' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-100 text-center shadow-sm">
              <p className="font-serif text-2xl font-bold text-[#0f1f3d] mb-0.5">{stat.value}</p>
              <p className="text-[11px] tracking-wider text-slate-500">{stat.label}</p>
              <p className="text-[10px] text-slate-300 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

      </main>

      {/* ── Notes PDF Modal ── */}
      {showNotes && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,31,61,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowNotes(false) }}
        >
          <div
            className="relative rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ width: '90vw', height: '90vh', background: '#1a1a2e' }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10" style={{ background: topic.color }}>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-sm font-semibold text-white">My Notes — {topic.label}</span>
              </div>
              <button
                onClick={() => setShowNotes(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* PDF content */}
            <div className="flex-1 overflow-hidden">
              {pdfExists === null ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                </div>
              ) : pdfExists ? (
                <iframe
                  src={notesPdf}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: topic.bg }}>
                    <svg className="w-8 h-8" style={{ color: topic.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Notes not uploaded yet.</p>
                    <p className="text-slate-400 text-sm">Add <code className="text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">{decodeURIComponent(TOPIC_PDF[topic.id])}</code> to the <code className="text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">public/notes/</code> folder.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Cheat Sheet Modal ── */}
      {showCheatSheet && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(15,31,61,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCheatSheet(false) }}
        >
          <div
            className="relative w-full rounded-2xl shadow-2xl overflow-hidden my-4"
            style={{ maxWidth: 1100, background: '#faf8f3' }}
          >
            <CheatSheet onClose={() => setShowCheatSheet(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
