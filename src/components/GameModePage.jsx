import { useState, useEffect, useRef } from 'react'
import { TOPICS } from '../data/constants'
import { QUESTION_BANK } from '../data/questions'
import { ModeIcon, IconBack } from './Icons'

// ─── Vignette selection ────────────────────────────────────────────────────────

function buildVignetteList(scope) {
  if (scope === 'all') {
    const keys = Object.keys(QUESTION_BANK).filter(k => QUESTION_BANK[k].vignettes?.length)
    const shuffled = [...keys].sort(() => Math.random() - 0.5)
    return [shuffled[0], shuffled[1]].map(topicId => {
      const vigs = QUESTION_BANK[topicId].vignettes
      const vig = vigs[Math.floor(Math.random() * vigs.length)]
      const topicMeta = TOPICS.find(t => t.id === topicId)
      return { ...vig, topicId, topicLabel: topicMeta?.label ?? topicId, topicColor: topicMeta?.color ?? '#0f1f3d', topicBg: topicMeta?.bg ?? '#f5f5f5' }
    })
  }
  const vigs = QUESTION_BANK[scope]?.vignettes ?? []
  const topicMeta = TOPICS.find(t => t.id === scope)
  return vigs.map(vig => ({
    ...vig,
    topicId: scope,
    topicLabel: topicMeta?.label ?? scope,
    topicColor: topicMeta?.color ?? '#0f1f3d',
    topicBg: topicMeta?.bg ?? '#f5f5f5',
  }))
}

// ─── Option label helper ───────────────────────────────────────────────────────

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

// ─── Vignette Exam ─────────────────────────────────────────────────────────────

function VignetteExam({ scope, onHome }) {
  const [vignettes]        = useState(() => buildVignetteList(scope))
  // answers[vigIdx][qIdx] = selected option index | null
  const [answers, setAnswers] = useState(() =>
    vignettes.map(v => new Array(v.questions.length).fill(null))
  )
  const [currentVig, setCurrentVig] = useState(0)
  // phase: 'exam' | 'results' | 'review'
  const [phase, setPhase] = useState('exam')

  const totalQuestions = vignettes.reduce((s, v) => s + v.questions.length, 0)
  const totalCorrect   = vignettes.reduce((sum, vig, vi) =>
    sum + vig.questions.reduce((s, q, qi) => s + (answers[vi][qi] === q.correctAnswer ? 1 : 0), 0), 0
  )

  function selectAnswer(vigIdx, qIdx, optIdx) {
    setAnswers(prev => {
      const next = prev.map(row => [...row])
      next[vigIdx][qIdx] = optIdx
      return next
    })
  }

  const currentAnswers    = answers[currentVig]
  const currentVig_data   = vignettes[currentVig]
  const allAnsweredCurrent = currentAnswers.every(a => a !== null)
  const isLastVig          = currentVig === vignettes.length - 1

  function handleAdvance() {
    if (isLastVig) {
      setPhase('results')
    } else {
      setCurrentVig(v => v + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ── RESULTS SCREEN ──────────────────────────────────────────────────────────
  if (phase === 'results') {
    const pct = Math.round((totalCorrect / totalQuestions) * 100)
    const grade =
      pct >= 70 ? { label: 'Pass', color: '#059669', bg: '#ecfaf5' }
                : { label: 'Review Needed', color: '#dc2626', bg: '#fff0f0' }

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Score card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
          <div className="px-8 pt-8 pb-6 text-center border-b border-slate-100">
            <span
              className="inline-block text-[10px] tracking-widest font-semibold px-3 py-1 rounded-full mb-4"
              style={{ background: grade.bg, color: grade.color }}
            >
              {grade.label}
            </span>
            <div className="font-serif text-6xl font-bold text-[#0f1f3d] mb-1">
              {pct}<span className="text-3xl text-slate-400">%</span>
            </div>
            <p className="text-slate-500 text-sm">
              {totalCorrect} of {totalQuestions} questions correct
            </p>
          </div>

          {/* Per-vignette breakdown */}
          <div className="px-8 py-5 space-y-3">
            {vignettes.map((vig, vi) => {
              const correct = vig.questions.reduce(
                (s, q, qi) => s + (answers[vi][qi] === q.correctAnswer ? 1 : 0), 0
              )
              const vigPct = Math.round((correct / vig.questions.length) * 100)
              return (
                <div key={vig.id} className="flex items-center gap-4">
                  <span
                    className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: vig.topicBg, color: vig.topicColor }}
                  >
                    {vig.topicLabel}
                  </span>
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${vigPct}%`,
                          background: vigPct >= 70 ? '#059669' : vigPct >= 50 ? '#c8a84b' : '#dc2626',
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-[#0f1f3d] shrink-0 tabular-nums">
                    {correct}/{vig.questions.length}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setPhase('review')}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}
          >
            Review Answers
          </button>
          <button
            onClick={onHome}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-sm text-[#0f1f3d] bg-white border border-slate-200 hover:border-slate-300 transition-all active:scale-[0.98]"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // ── REVIEW SCREEN ───────────────────────────────────────────────────────────
  if (phase === 'review') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#0f1f3d]">Answer Review</h2>
          <span className="text-sm text-slate-500 font-medium">
            {totalCorrect}/{totalQuestions} correct
          </span>
        </div>

        {vignettes.map((vig, vi) => (
          <div key={vig.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Vignette header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: vig.topicBg, color: vig.topicColor }}
                >
                  {vig.topicLabel}
                </span>
                <span className="text-[10px] tracking-wider text-slate-400 font-medium">
                  VIGNETTE {vi + 1}
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#0f1f3d] mb-3">{vig.title}</h3>
              <p className="text-[13px] leading-relaxed text-slate-600">{vig.caseText}</p>
            </div>

            {/* Questions */}
            <div className="divide-y divide-slate-100">
              {vig.questions.map((q, qi) => {
                const selected = answers[vi][qi]
                const correct  = q.correctAnswer
                const isRight  = selected === correct

                return (
                  <div key={qi} className="px-6 py-5">
                    <p className="text-[13px] font-semibold text-[#0f1f3d] mb-3">
                      <span className="text-slate-400 font-normal mr-1">Q{qi + 1}.</span>
                      {q.text}
                    </p>

                    <div className="space-y-2 mb-4">
                      {q.options.map((opt, oi) => {
                        const isSelected = oi === selected
                        const isCorrect  = oi === correct

                        let borderColor = 'border-slate-200'
                        let bgColor     = 'bg-white'
                        let textColor   = 'text-slate-600'
                        let letterBg    = 'bg-slate-100'
                        let letterColor = 'text-slate-500'

                        if (isCorrect) {
                          borderColor = 'border-green-400'
                          bgColor     = 'bg-green-50'
                          textColor   = 'text-green-800'
                          letterBg    = 'bg-green-100'
                          letterColor = 'text-green-700'
                        } else if (isSelected && !isRight) {
                          borderColor = 'border-red-400'
                          bgColor     = 'bg-red-50'
                          textColor   = 'text-red-800'
                          letterBg    = 'bg-red-100'
                          letterColor = 'text-red-600'
                        }

                        return (
                          <div
                            key={oi}
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border ${borderColor} ${bgColor}`}
                          >
                            <span className={`shrink-0 w-5 h-5 rounded text-[11px] font-bold flex items-center justify-center mt-0.5 ${letterBg} ${letterColor}`}>
                              {OPTION_LETTERS[oi]}
                            </span>
                            <span className={`text-[13px] leading-snug ${textColor}`}>{opt}</span>
                            {isCorrect && (
                              <svg className="shrink-0 w-4 h-4 ml-auto mt-0.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {isSelected && !isRight && (
                              <svg className="shrink-0 w-4 h-4 ml-auto mt-0.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="flex gap-2.5 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                      <svg className="shrink-0 w-4 h-4 mt-0.5 text-[#c8a84b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                      </svg>
                      <p className="text-[12px] leading-relaxed text-slate-600">{q.explanation}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <button
          onClick={onHome}
          className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-[#0f1f3d] bg-white border border-slate-200 hover:border-slate-300 transition-all active:scale-[0.98]"
        >
          Back to Home
        </button>
      </div>
    )
  }

  // ── EXAM SCREEN ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {vignettes.map((_, vi) => (
            <div
              key={vi}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: vi === currentVig ? '2rem' : '0.75rem',
                background: vi < currentVig
                  ? '#059669'
                  : vi === currentVig
                    ? '#2563eb'
                    : '#e2e8f0',
              }}
            />
          ))}
        </div>
        <span className="text-[11px] text-slate-400 tracking-wider font-medium">
          VIGNETTE {currentVig + 1} OF {vignettes.length}
        </span>
      </div>

      {/* Vignette card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">

        {/* Case header */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: currentVig_data.topicBg, color: currentVig_data.topicColor }}
            >
              {currentVig_data.topicLabel}
            </span>
            <span className="text-[10px] tracking-wider text-slate-400 font-medium">ITEM SET</span>
          </div>
          <h2 className="font-serif text-lg font-bold text-[#0f1f3d] mb-4">
            {currentVig_data.title}
          </h2>

          {/* Case text */}
          <div className="relative pl-4">
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
              style={{ background: currentVig_data.topicColor, opacity: 0.4 }}
            />
            <p className="text-[13px] leading-relaxed text-slate-700">
              {currentVig_data.caseText}
            </p>
          </div>
        </div>

        {/* Questions */}
        <div className="divide-y divide-slate-100">
          {currentVig_data.questions.map((q, qi) => {
            const selected = currentAnswers[qi]

            return (
              <div key={qi} className="px-6 py-5">
                <p className="text-[13px] font-semibold text-[#0f1f3d] mb-3 leading-snug">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#eff4ff] text-[#2563eb] text-[10px] font-bold mr-2 shrink-0 align-middle">
                    {qi + 1}
                  </span>
                  {q.text}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = oi === selected
                    return (
                      <button
                        key={oi}
                        onClick={() => selectAnswer(currentVig, qi, oi)}
                        className={[
                          'w-full flex items-start gap-3 px-3 py-2.5 rounded-lg border text-left transition-all duration-150 active:scale-[0.99]',
                          isSelected
                            ? 'border-[#2563eb] bg-[#eff4ff]'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'shrink-0 w-5 h-5 rounded text-[11px] font-bold flex items-center justify-center mt-0.5',
                            isSelected
                              ? 'bg-[#2563eb] text-white'
                              : 'bg-slate-100 text-slate-500',
                          ].join(' ')}
                        >
                          {OPTION_LETTERS[oi]}
                        </span>
                        <span
                          className={[
                            'text-[13px] leading-snug',
                            isSelected ? 'text-[#1d4ed8] font-medium' : 'text-slate-600',
                          ].join(' ')}
                        >
                          {opt}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Answered count + advance button */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-slate-400">
          {currentAnswers.filter(a => a !== null).length} of {currentVig_data.questions.length} answered
        </span>

        <button
          onClick={handleAdvance}
          disabled={!allAnsweredCurrent}
          className={[
            'py-2.5 px-6 rounded-xl font-semibold text-sm transition-all duration-150',
            allAnsweredCurrent
              ? 'text-white active:scale-[0.98] shadow-sm'
              : 'text-slate-400 bg-slate-100 cursor-not-allowed',
          ].join(' ')}
          style={allAnsweredCurrent ? { background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' } : {}}
        >
          {isLastVig ? 'Submit Exam' : 'Next Vignette →'}
        </button>
      </div>
    </div>
  )
}

// ─── Sudden Death ──────────────────────────────────────────────────────────────

function buildSuddenDeathQuestions(scope) {
  if (scope === 'all') {
    const pool = Object.entries(QUESTION_BANK).flatMap(([topicId, data]) => {
      const topicMeta = TOPICS.find(t => t.id === topicId)
      return (data.suddenDeath ?? []).map(q => ({
        ...q,
        topicId,
        topicLabel: topicMeta?.label ?? topicId,
        topicColor: topicMeta?.color ?? '#0f1f3d',
        topicBg:    topicMeta?.bg    ?? '#f5f5f5',
      }))
    })
    return [...pool].sort(() => Math.random() - 0.5)
  }
  const topicMeta = TOPICS.find(t => t.id === scope)
  return [...(QUESTION_BANK[scope]?.suddenDeath ?? [])]
    .sort(() => Math.random() - 0.5)
    .map(q => ({
      ...q,
      topicId:    scope,
      topicLabel: topicMeta?.label ?? scope,
      topicColor: topicMeta?.color ?? '#0f1f3d',
      topicBg:    topicMeta?.bg    ?? '#f5f5f5',
    }))
}

const STREAK_MILESTONES = [
  { min: 15, label: 'LEGENDARY', color: '#c8a84b', glow: '0 0 24px rgba(200,168,75,0.55)' },
  { min: 10, label: 'ON FIRE',   color: '#c8a84b', glow: '0 0 16px rgba(200,168,75,0.35)' },
  { min:  5, label: 'HOT',       color: '#e76f51', glow: null },
]

function getStreakStyle(streak) {
  return STREAK_MILESTONES.find(m => streak >= m.min) ?? { color: '#0f1f3d', glow: null, label: null }
}

function SuddenDeath({ scope, onHome }) {
  const initQuestions = () => buildSuddenDeathQuestions(scope)

  const [questions, setQuestions] = useState(initQuestions)
  const [qIndex,    setQIndex]    = useState(0)
  const [streak,    setStreak]    = useState(0)
  const [phase,     setPhase]     = useState('playing') // 'playing' | 'gameover'
  const [selected,  setSelected]  = useState(null)      // option index clicked
  const [feedback,  setFeedback]  = useState(null)      // null | 'correct' | 'wrong'
  const [wrongQ,    setWrongQ]    = useState(null)
  const [bump,      setBump]      = useState(false)

  const timerRef = useRef(null)

  // Clean up any pending timer on unmount
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const currentQ = questions[qIndex % questions.length]
  const streakStyle = getStreakStyle(streak)

  function handleSelect(optIdx) {
    if (selected !== null || feedback !== null) return
    setSelected(optIdx)

    if (optIdx === currentQ.correctAnswer) {
      setFeedback('correct')
      timerRef.current = setTimeout(() => {
        setStreak(s => s + 1)
        setBump(true)
        setTimeout(() => setBump(false), 350)
        setSelected(null)
        setFeedback(null)
        setQIndex(i => i + 1)
      }, 550)
    } else {
      setFeedback('wrong')
      setWrongQ(currentQ)
      timerRef.current = setTimeout(() => setPhase('gameover'), 900)
    }
  }

  function restart() {
    clearTimeout(timerRef.current)
    setQuestions(buildSuddenDeathQuestions(scope))
    setQIndex(0)
    setStreak(0)
    setPhase('playing')
    setSelected(null)
    setFeedback(null)
    setWrongQ(null)
    setBump(false)
  }

  // ── GAME OVER ───────────────────────────────────────────────────────────────
  if (phase === 'gameover') {
    const q = wrongQ
    const topStyle = getStreakStyle(streak)

    return (
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Game over header */}
        <div className="text-center mb-8">
          <p className="text-3xl mb-3">💀</p>
          <h2 className="font-serif text-3xl font-bold text-[#0f1f3d] mb-2">Game Over</h2>
          <p className="text-slate-500 text-sm">Your streak ended here</p>
        </div>

        {/* Final streak */}
        <div
          className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-6 text-center mb-6"
          style={topStyle.glow ? { boxShadow: `0 1px 3px rgba(0,0,0,0.06), ${topStyle.glow}` } : {}}
        >
          {topStyle.label && (
            <span
              className="inline-block text-[9px] tracking-widest font-bold px-2.5 py-0.5 rounded-full mb-3"
              style={{ background: '#fdf8ec', color: topStyle.color }}
            >
              {topStyle.label}
            </span>
          )}
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">🔥</span>
            <span
              className="font-serif text-7xl font-bold tabular-nums"
              style={{ color: topStyle.color }}
            >
              {streak}
            </span>
          </div>
          <p className="text-slate-400 text-xs tracking-wider mt-2 uppercase">
            {streak === 1 ? '1 question correct' : `${streak} questions correct`}
          </p>
        </div>

        {/* The fatal question */}
        {q && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
            <div className="px-5 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: q.topicBg, color: q.topicColor }}
                >
                  {q.topicLabel}
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider">ENDED YOUR RUN</span>
              </div>
              <p className="text-[13px] font-semibold text-[#0f1f3d] leading-snug">{q.text}</p>
            </div>

            <div className="px-5 py-4 space-y-2">
              {q.options.map((opt, oi) => {
                const isCorrect  = oi === q.correctAnswer
                const isSelected = oi === selected

                let border = 'border-slate-200'
                let bg     = 'bg-white'
                let text   = 'text-slate-600'
                let lBg    = 'bg-slate-100'
                let lColor = 'text-slate-500'
                let icon   = null

                if (isCorrect) {
                  border = 'border-green-400'; bg = 'bg-green-50'
                  text   = 'text-green-800';   lBg = 'bg-green-100'; lColor = 'text-green-700'
                  icon   = (
                    <svg className="shrink-0 w-4 h-4 ml-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )
                } else if (isSelected) {
                  border = 'border-red-400'; bg = 'bg-red-50'
                  text   = 'text-red-800';   lBg = 'bg-red-100'; lColor = 'text-red-600'
                  icon   = (
                    <svg className="shrink-0 w-4 h-4 ml-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )
                }

                return (
                  <div key={oi} className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border ${border} ${bg}`}>
                    <span className={`shrink-0 w-5 h-5 rounded text-[11px] font-bold flex items-center justify-center mt-0.5 ${lBg} ${lColor}`}>
                      {OPTION_LETTERS[oi]}
                    </span>
                    <span className={`text-[13px] leading-snug ${text}`}>{opt}</span>
                    {icon}
                  </div>
                )
              })}
            </div>

            {/* Explanation */}
            <div className="mx-5 mb-5">
              <div className="flex gap-2.5 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                <svg className="shrink-0 w-4 h-4 mt-0.5 text-[#c8a84b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                </svg>
                <p className="text-[12px] leading-relaxed text-slate-600">{q.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={restart}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.98] shadow-sm"
            style={{ background: 'linear-gradient(135deg, #b91c1c, #dc2626)' }}
          >
            Try Again
          </button>
          <button
            onClick={onHome}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-sm text-[#0f1f3d] bg-white border border-slate-200 hover:border-slate-300 transition-all active:scale-[0.98]"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // ── PLAYING ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto px-4 py-6">

      {/* Streak counter */}
      <div className="text-center mb-7">
        <p className="text-[10px] tracking-widest text-slate-400 font-medium uppercase mb-2">Streak</p>
        <div className="flex items-center justify-center gap-2">
          <span
            className="text-3xl leading-none"
            style={{
              filter: streak >= 10
                ? 'drop-shadow(0 0 8px rgba(200,168,75,0.7))'
                : streak >= 5
                  ? 'drop-shadow(0 0 4px rgba(231,111,81,0.5))'
                  : 'none',
              fontSize: streak >= 10 ? '2.2rem' : streak >= 5 ? '2rem' : '1.75rem',
              transition: 'font-size 0.3s ease',
            }}
          >
            🔥
          </span>
          <span
            className="font-serif font-bold tabular-nums leading-none"
            style={{
              fontSize: streak >= 10 ? '5rem' : streak >= 5 ? '4.5rem' : '4rem',
              color: streakStyle.color,
              textShadow: streakStyle.glow ?? 'none',
              transform: bump ? 'scale(1.35)' : 'scale(1)',
              display: 'inline-block',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.4s ease, font-size 0.3s ease',
            }}
          >
            {streak}
          </span>
        </div>

        {/* Milestone badge */}
        {streakStyle.label && (
          <span
            className="inline-block mt-2 text-[9px] tracking-widest font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: '#fdf8ec', color: streakStyle.color }}
          >
            {streakStyle.label}
          </span>
        )}
      </div>

      {/* Question card */}
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300"
        style={{
          borderColor: feedback === 'correct'
            ? '#4ade80'
            : feedback === 'wrong'
              ? '#f87171'
              : '#f1f5f9',
          boxShadow: feedback === 'correct'
            ? '0 0 0 3px rgba(74,222,128,0.15), 0 1px 3px rgba(0,0,0,0.06)'
            : feedback === 'wrong'
              ? '0 0 0 3px rgba(248,113,113,0.15), 0 1px 3px rgba(0,0,0,0.06)'
              : '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        {/* Question header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: currentQ.topicBg, color: currentQ.topicColor }}
            >
              {currentQ.topicLabel}
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider font-medium">
              Q{qIndex + 1}
            </span>
          </div>
          <p className="text-[14px] font-semibold text-[#0f1f3d] leading-snug">{currentQ.text}</p>
        </div>

        {/* Options */}
        <div className="px-5 py-4 space-y-2">
          {currentQ.options.map((opt, oi) => {
            const isSelected = oi === selected
            const isCorrect  = oi === currentQ.correctAnswer

            // Determine visual state
            let border  = 'border-slate-200'
            let bg      = 'bg-white hover:bg-slate-50 hover:border-slate-300'
            let textCls = 'text-slate-600'
            let lBg     = 'bg-slate-100'
            let lColor  = 'text-slate-500'
            let icon    = null
            const clickable = selected === null

            if (feedback === 'correct' && isSelected) {
              border = 'border-green-400'; bg = 'bg-green-50'
              textCls = 'text-green-800';  lBg = 'bg-green-100'; lColor = 'text-green-700'
              icon = (
                <svg className="shrink-0 w-4 h-4 ml-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )
            } else if (feedback === 'wrong' && isSelected) {
              border = 'border-red-400'; bg = 'bg-red-50'
              textCls = 'text-red-800';  lBg = 'bg-red-100'; lColor = 'text-red-600'
              icon = (
                <svg className="shrink-0 w-4 h-4 ml-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )
            } else if (feedback === 'wrong' && isCorrect) {
              border = 'border-green-400'; bg = 'bg-green-50'
              textCls = 'text-green-800';  lBg = 'bg-green-100'; lColor = 'text-green-700'
              icon = (
                <svg className="shrink-0 w-4 h-4 ml-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )
            }

            return (
              <button
                key={oi}
                onClick={() => clickable && handleSelect(oi)}
                disabled={!clickable}
                className={[
                  'w-full flex items-start gap-3 px-3 py-2.5 rounded-lg border text-left transition-all duration-150',
                  clickable ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default',
                  border,
                  bg,
                ].join(' ')}
              >
                <span className={`shrink-0 w-5 h-5 rounded text-[11px] font-bold flex items-center justify-center mt-0.5 transition-colors ${lBg} ${lColor}`}>
                  {OPTION_LETTERS[oi]}
                </span>
                <span className={`text-[13px] leading-snug transition-colors ${textCls}`}>{opt}</span>
                {icon}
              </button>
            )
          })}
        </div>
      </div>

      {/* Subtle hint text while waiting */}
      {selected === null && (
        <p className="text-center text-[11px] text-slate-400 mt-4 tracking-wide">
          One wrong answer ends your streak
        </p>
      )}
    </div>
  )
}

// ─── Flashcard Match ───────────────────────────────────────────────────────────

function buildFlashcards(scope) {
  if (scope === 'all') {
    const pool = Object.entries(QUESTION_BANK).flatMap(([topicId, data]) => {
      const meta = TOPICS.find(t => t.id === topicId)
      return (data.flashcards ?? []).map(card => ({
        ...card,
        topicId,
        topicLabel: meta?.label ?? topicId,
        topicColor: meta?.color ?? '#0f1f3d',
        topicBg:    meta?.bg    ?? '#f5f5f5',
      }))
    })
    return [...pool].sort(() => Math.random() - 0.5)
  }
  const meta = TOPICS.find(t => t.id === scope)
  return (QUESTION_BANK[scope]?.flashcards ?? []).map(card => ({
    ...card,
    topicId:    scope,
    topicLabel: meta?.label ?? scope,
    topicColor: meta?.color ?? '#0f1f3d',
    topicBg:    meta?.bg    ?? '#f5f5f5',
  }))
}

function FlashcardMatch({ scope, onHome }) {
  const [cards,   setCards]   = useState(() => buildFlashcards(scope))
  const [index,   setIndex]   = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState([])           // 'known' | 'unknown' per card
  const [phase,   setPhase]   = useState('playing')    // 'playing' | 'done'
  const backFaceRef = useRef(null)

  useEffect(() => {
    if (flipped && backFaceRef.current && window.renderMathInElement) {
      window.renderMathInElement(backFaceRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$',  right: '$',  display: false },
        ],
      })
    }
  }, [flipped, index])

  const current   = cards[index]
  const knownCount   = results.filter(r => r === 'known').length
  const unknownCount = results.filter(r => r === 'unknown').length
  const showDots  = cards.length <= 24

  function mark(status) {
    const newResults = [...results, status]
    setResults(newResults)
    setFlipped(false)
    if (index + 1 >= cards.length) {
      setPhase('done')
    } else {
      setIndex(i => i + 1)
    }
  }

  function reviewUnknown() {
    const unknownCards = cards.filter((_, i) => results[i] === 'unknown')
    setCards(unknownCards)
    setIndex(0)
    setResults([])
    setFlipped(false)
    setPhase('playing')
  }

  function restartAll() {
    setCards(buildFlashcards(scope))
    setIndex(0)
    setResults([])
    setFlipped(false)
    setPhase('playing')
  }

  // ── DONE SCREEN ─────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const pct      = Math.round((knownCount / cards.length) * 100)
    const unknownCards = cards.filter((_, i) => results[i] === 'unknown')

    return (
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Score */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
          <div className="px-8 pt-8 pb-6 text-center border-b border-slate-100">
            <span className="text-3xl mb-3 block">
              {pct === 100 ? '🎉' : pct >= 70 ? '✅' : '📚'}
            </span>
            <div className="font-serif text-5xl font-bold text-[#0f1f3d] mb-1 tabular-nums">
              {knownCount}
              <span className="text-2xl text-slate-400 font-normal"> / {cards.length}</span>
            </div>
            <p className="text-slate-500 text-sm">
              {pct === 100
                ? 'Perfect — you know them all!'
                : `${pct}% mastered`}
            </p>
          </div>

          {/* Known / unknown tally */}
          <div className="flex divide-x divide-slate-100">
            <div className="flex-1 py-4 text-center">
              <p className="font-bold text-green-600 text-xl tabular-nums">{knownCount}</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Known</p>
            </div>
            <div className="flex-1 py-4 text-center">
              <p className="font-bold text-amber-500 text-xl tabular-nums">{unknownCount}</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Review</p>
            </div>
          </div>
        </div>

        {/* Unknown terms list */}
        {unknownCards.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
              <span className="text-amber-500 text-sm">↺</span>
              <p className="text-[12px] font-semibold text-[#0f1f3d] tracking-wider uppercase">
                Terms to review ({unknownCards.length})
              </p>
            </div>
            <div className="divide-y divide-slate-50">
              {unknownCards.map((card, i) => (
                <div key={i} className="px-5 py-3 flex items-start gap-3">
                  <span
                    className="shrink-0 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full mt-0.5"
                    style={{ background: card.topicBg, color: card.topicColor }}
                  >
                    {card.topicLabel}
                  </span>
                  <p className="text-[13px] text-[#0f1f3d] font-medium leading-snug">{card.term}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {unknownCards.length > 0 && (
            <button
              onClick={reviewUnknown}
              className="flex-1 py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.98] shadow-sm"
              style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}
            >
              Review Unknown ({unknownCards.length})
            </button>
          )}
          <button
            onClick={restartAll}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-sm text-[#0f1f3d] bg-white border border-slate-200 hover:border-slate-300 transition-all active:scale-[0.98]"
          >
            Restart All
          </button>
          <button
            onClick={onHome}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-sm text-[#0f1f3d] bg-white border border-slate-200 hover:border-slate-300 transition-all active:scale-[0.98]"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // ── PLAYING ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto px-4 py-6">

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">
            Card {index + 1} of {cards.length}
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            {knownCount > 0 && (
              <span className="flex items-center gap-1 text-green-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                {knownCount}
              </span>
            )}
            {unknownCount > 0 && (
              <span className="flex items-center gap-1 text-amber-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                {unknownCount}
              </span>
            )}
          </div>
        </div>

        {/* Progress track */}
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(results.length / cards.length) * 100}%`,
              background: 'linear-gradient(to right, #059669, #10b981)',
            }}
          />
        </div>
      </div>

      {/* Dot indicators (topic-specific / small decks) */}
      {showDots && (
        <div className="flex items-center justify-center gap-1.5 mb-5 flex-wrap">
          {cards.map((_, i) => {
            if (i < results.length) {
              return (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-colors duration-300"
                  style={{ background: results[i] === 'known' ? '#22c55e' : '#fbbf24' }}
                />
              )
            }
            if (i === index) {
              return (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border-2 border-[#0f1f3d] transition-all"
                />
              )
            }
            return <div key={i} className="w-2 h-2 rounded-full bg-slate-200" />
          })}
        </div>
      )}

      {/* ── Flashcard ── */}
      {/* Perspective wrapper */}
      <div style={{ perspective: '1200px' }} className="mb-5">
        {/*
          Inner card: two absolutely-positioned faces.
          The outer div needs an explicit height so the absolute children have
          something to fill. We set it via inline style so it's always 300px.
        */}
        <div
          className="relative w-full rounded-2xl cursor-pointer select-none"
          style={{
            height: '300px',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
          onClick={() => setFlipped(f => !f)}
          role="button"
          aria-label={flipped ? 'Click to flip back' : 'Click to reveal definition'}
        >

          {/* ── FRONT FACE ── */}
          <div
            className="absolute inset-0 rounded-2xl border border-slate-200 bg-white flex flex-col items-center justify-between p-7"
            style={{
              backfaceVisibility: 'hidden',
              boxShadow: '0 8px 32px rgba(15,31,61,0.08), 0 1px 4px rgba(15,31,61,0.04)',
            }}
          >
            {/* Topic badge */}
            <span
              className="self-start text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full"
              style={{ background: current.topicBg, color: current.topicColor }}
            >
              {current.topicLabel}
            </span>

            {/* Term */}
            <div className="flex-1 flex items-center justify-center px-2 text-center">
              <h2
                className="font-serif font-bold text-[#0f1f3d] leading-tight"
                style={{ fontSize: current.term.length > 40 ? '1.25rem' : current.term.length > 25 ? '1.5rem' : '1.75rem' }}
              >
                {current.term}
              </h2>
            </div>

            {/* Flip hint */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[11px] tracking-wide">Click to reveal</span>
            </div>
          </div>

          {/* ── BACK FACE ── */}
          <div
            ref={backFaceRef}
            className="absolute inset-0 rounded-2xl border bg-white flex flex-col"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderColor: current.topicColor,
              borderWidth: '1.5px',
              boxShadow: `0 8px 32px rgba(15,31,61,0.1), 0 1px 4px rgba(15,31,61,0.06), 0 0 0 3px ${current.topicBg}`,
              padding: '1.5rem',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <span
                className="text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: current.topicBg, color: current.topicColor }}
              >
                {current.topicLabel}
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-medium uppercase">Definition</span>
            </div>

            {/* Term label on back */}
            <p
              className="shrink-0 mb-3 leading-snug"
              style={{ fontSize: '13px', color: '#94a3b8', fontFamily: 'inherit', fontWeight: 500 }}
            >
              {current.term}
            </p>

            {/* Definition — scrollable if long */}
            <div className="flex-1 overflow-y-auto">
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: '#0f1f3d',
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 400,
                  whiteSpace: 'pre-line',
                }}
              >
                {current.definition}
              </p>
            </div>

            {/* Flip back hint */}
            <p className="text-[10px] text-slate-400 text-right mt-3 shrink-0 tracking-wide">
              Click to flip back
            </p>
          </div>

        </div>
      </div>

      {/* ── Grade buttons ── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => mark('unknown')}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.97]"
          style={{
            background: '#fffbeb',
            border: '1.5px solid #fcd34d',
            color: '#92400e',
          }}
        >
          <span className="text-base">↺</span>
          Review again
        </button>
        <button
          onClick={() => mark('known')}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.97]"
          style={{
            background: '#f0fdf4',
            border: '1.5px solid #86efac',
            color: '#14532d',
          }}
        >
          <span className="text-base">✓</span>
          Got it
        </button>
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-4 tracking-wide">
        {flipped ? 'Mark your confidence below' : 'Flip to see the definition, then mark your confidence'}
      </p>
    </div>
  )
}

// ─── Crossword ─────────────────────────────────────────────────────────────────

const CW_SIZE = 20

function buildCrosswordClues(scope) {
  if (scope === 'all') {
    const pool = Object.values(QUESTION_BANK).flatMap(t => t.crossword ?? [])
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 15)
  }
  return [...(QUESTION_BANK[scope]?.crossword ?? [])].sort(() => Math.random() - 0.5)
}

function cwCanPlace(answer, row, col, dir, grid) {
  const len = answer.length
  if (dir === 'across') {
    if (col < 0 || col + len > CW_SIZE || row < 0 || row >= CW_SIZE) return false
    if (col > 0 && grid[row][col - 1] !== null) return false
    if (col + len < CW_SIZE && grid[row][col + len] !== null) return false
  } else {
    if (row < 0 || row + len > CW_SIZE || col < 0 || col >= CW_SIZE) return false
    if (row > 0 && grid[row - 1][col] !== null) return false
    if (row + len < CW_SIZE && grid[row + len][col] !== null) return false
  }
  for (let i = 0; i < len; i++) {
    const r = dir === 'across' ? row : row + i
    const c = dir === 'across' ? col + i : col
    const existing = grid[r][c]
    if (existing !== null && existing !== answer[i]) return false
    if (existing === null) {
      if (dir === 'across') {
        if (r > 0 && grid[r - 1][c] !== null) return false
        if (r < CW_SIZE - 1 && grid[r + 1][c] !== null) return false
      } else {
        if (c > 0 && grid[r][c - 1] !== null) return false
        if (c < CW_SIZE - 1 && grid[r][c + 1] !== null) return false
      }
    }
  }
  return true
}

function cwScore(answer, row, col, dir, grid) {
  let s = 0
  for (let i = 0; i < answer.length; i++) {
    const r = dir === 'across' ? row : row + i
    const c = dir === 'across' ? col + i : col
    if (grid[r][c] === answer[i]) s++
  }
  return s
}

function generateCrossword(clues) {
  const grid = Array(CW_SIZE).fill(null).map(() => Array(CW_SIZE).fill(null))
  const placed = []
  const sorted = [...clues].sort((a, b) => b.answer.length - a.answer.length)
  const MID = 9

  const first = sorted[0]
  const c0 = Math.max(0, Math.floor((CW_SIZE - first.answer.length) / 2))
  for (let i = 0; i < first.answer.length; i++) grid[MID][c0 + i] = first.answer[i]
  placed.push({ ...first, row: MID, col: c0, dir: 'across' })

  for (let wi = 1; wi < sorted.length && placed.length < 15; wi++) {
    const word = sorted[wi]
    const ans = word.answer
    let best = null, bestScore = -1
    const preferDir = placed.length % 2 === 1 ? 'down' : 'across'
    const dirs = [preferDir, preferDir === 'down' ? 'across' : 'down']

    for (const dir of dirs) {
      for (let li = 0; li < ans.length; li++) {
        for (const pw of placed) {
          if (pw.dir === dir) continue
          for (let pi = 0; pi < pw.answer.length; pi++) {
            if (pw.answer[pi] !== ans[li]) continue
            const row = dir === 'across' ? pw.row + pi : pw.row - li
            const col = dir === 'across' ? pw.col - li : pw.col + pi
            if (!cwCanPlace(ans, row, col, dir, grid)) continue
            const sc = cwScore(ans, row, col, dir, grid)
            if (sc > bestScore) { bestScore = sc; best = { row, col, dir } }
          }
        }
      }
    }

    if (best) {
      const { row, col, dir } = best
      for (let i = 0; i < ans.length; i++) {
        const r = dir === 'across' ? row : row + i
        const c = dir === 'across' ? col + i : col
        grid[r][c] = ans[i]
      }
      placed.push({ ...word, row, col, dir })
    }
  }

  // Number by reading order
  const startMap = new Map()
  for (const w of placed) {
    const k = `${w.row},${w.col}`
    if (!startMap.has(k)) startMap.set(k, [])
    startMap.get(k).push(w)
  }
  const sortedKeys = [...startMap.keys()].sort((a, b) => {
    const [ar, ac] = a.split(',').map(Number)
    const [br, bc] = b.split(',').map(Number)
    return ar !== br ? ar - br : ac - bc
  })
  let num = 1
  const np = placed.map(w => ({ ...w }))
  for (const key of sortedKeys) {
    for (const w of startMap.get(key)) {
      const idx = np.findIndex(nw => nw.row === w.row && nw.col === w.col && nw.dir === w.dir)
      if (idx >= 0) np[idx].number = num
    }
    num++
  }

  // Bounds with padding
  let minRow = CW_SIZE, maxRow = 0, minCol = CW_SIZE, maxCol = 0
  for (const w of np) {
    const er = w.dir === 'across' ? w.row : w.row + w.answer.length - 1
    const ec = w.dir === 'across' ? w.col + w.answer.length - 1 : w.col
    minRow = Math.min(minRow, w.row); maxRow = Math.max(maxRow, er)
    minCol = Math.min(minCol, w.col); maxCol = Math.max(maxCol, ec)
  }
  minRow = Math.max(0, minRow - 1); maxRow = Math.min(CW_SIZE - 1, maxRow + 1)
  minCol = Math.max(0, minCol - 1); maxCol = Math.min(CW_SIZE - 1, maxCol + 1)

  const acrossWords = np.filter(w => w.dir === 'across').sort((a, b) => a.number - b.number)
  const downWords   = np.filter(w => w.dir === 'down').sort((a, b) => a.number - b.number)
  return { grid, placed: np, acrossWords, downWords, bounds: { minRow, maxRow, minCol, maxCol } }
}

function cwCells(word) {
  return Array.from({ length: word.answer.length }, (_, i) => ({
    row: word.dir === 'across' ? word.row : word.row + i,
    col: word.dir === 'across' ? word.col + i : word.col,
  }))
}

function cwWordsAt(row, col, placed) {
  return placed.filter(w => cwCells(w).some(c => c.row === row && c.col === col))
}

function CrosswordPuzzle({ scope, onHome }) {
  const [phase, setPhase]               = useState('start')
  const [puzzle, setPuzzle]             = useState(null)
  const [userInput, setUserInput]       = useState({})
  const [feedback, setFeedback]         = useState({})
  const [activeWord, setActiveWord]     = useState(null)
  const [activeCell, setActiveCell]     = useState(null)
  const [seconds, setSeconds]           = useState(0)
  const [running, setRunning]           = useState(false)
  const [wordsRevealed, setWordsRevealed] = useState(0)
  const [revealedSet, setRevealedSet]   = useState(new Set())
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cfa_crossword_history') || '[]') } catch { return [] }
  })
  const gridRef  = useRef(null)
  const secRef   = useRef(0)
  const revRef   = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => { revRef.current = wordsRevealed }, [wordsRevealed])

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds(s => { const n = s + 1; secRef.current = n; return n })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [running])

  // Completion detection
  useEffect(() => {
    if (phase !== 'playing' || !puzzle) return
    const done = puzzle.placed.every(w =>
      cwCells(w).every((c, i) => {
        const k = `${c.row},${c.col}`
        const fb = feedback[k]
        return fb === 'revealed' || fb === 'correct' || (userInput[k] || '') === w.answer[i]
      })
    )
    if (!done) return
    setRunning(false)
    const scopeLabel = scope === 'all' ? 'All Topics' : (TOPICS.find(t => t.id === scope)?.label ?? scope)
    const score = Math.max(0, 100 - revRef.current * 10)
    const attempt = {
      date: new Date().toLocaleDateString(),
      topic: scopeLabel,
      time: fmtTime(secRef.current),
      timeSeconds: secRef.current,
      score,
      wordsRevealed: revRef.current,
    }
    setHistory(prev => {
      const next = [attempt, ...prev].slice(0, 50)
      localStorage.setItem('cfa_crossword_history', JSON.stringify(next))
      return next
    })
    setPhase('complete')
  }, [userInput, feedback]) // eslint-disable-line react-hooks/exhaustive-deps

  function fmtTime(s) {
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  }

  function startPuzzle() {
    const clues = buildCrosswordClues(scope)
    const result = generateCrossword(clues)
    if (result.placed.length < 5) { startPuzzle(); return }
    setPuzzle(result)
    setUserInput({}); setFeedback({})
    setActiveWord(result.acrossWords[0] ?? result.downWords[0] ?? null)
    setActiveCell(result.acrossWords[0]
      ? { row: result.acrossWords[0].row, col: result.acrossWords[0].col }
      : null)
    secRef.current = 0; setSeconds(0)
    revRef.current = 0; setWordsRevealed(0)
    setRevealedSet(new Set())
    setRunning(true)
    setPhase('playing')
    setTimeout(() => gridRef.current?.focus(), 100)
  }

  function selectCell(row, col) {
    const words = cwWordsAt(row, col, puzzle.placed)
    if (!words.length) return
    let chosen
    if (words.length === 1) {
      chosen = words[0]
    } else if (activeWord && words.includes(activeWord)) {
      chosen = words.find(w => w !== activeWord) ?? words[0]
    } else {
      chosen = words.find(w => w.dir === 'across') ?? words[0]
    }
    setActiveWord(chosen)
    setActiveCell({ row, col })
    gridRef.current?.focus()
  }

  function moveCaret(word, row, col, delta) {
    const cells = cwCells(word)
    const idx = cells.findIndex(c => c.row === row && c.col === col)
    const next = cells[Math.max(0, Math.min(cells.length - 1, idx + delta))]
    setActiveCell({ row: next.row, col: next.col })
  }

  function handleKeyDown(e) {
    if (!activeWord || !activeCell) return
    const { row, col } = activeCell
    const k = `${row},${col}`
    const up = e.key.toUpperCase()

    if (e.key === 'Tab') {
      e.preventDefault()
      const all = [...(puzzle.acrossWords), ...(puzzle.downWords)].sort((a, b) => a.number - b.number)
      const idx = all.findIndex(w => w === activeWord)
      const next = all[(idx + 1) % all.length]
      setActiveWord(next); setActiveCell({ row: next.row, col: next.col })
      return
    }
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (feedback[k] === 'revealed') { moveCaret(activeWord, row, col, -1); return }
      if (userInput[k]) {
        setUserInput(prev => { const n = { ...prev }; delete n[k]; return n })
        setFeedback(prev => { const n = { ...prev }; delete n[k]; return n })
      } else {
        moveCaret(activeWord, row, col, -1)
      }
      return
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  { e.preventDefault(); moveCaret(activeWord, row, col,  1); return }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    { e.preventDefault(); moveCaret(activeWord, row, col, -1); return }

    if (/^[A-Za-z]$/.test(e.key)) {
      e.preventDefault()
      if (feedback[k] === 'revealed') { moveCaret(activeWord, row, col, 1); return }
      setUserInput(prev => ({ ...prev, [k]: up }))
      setFeedback(prev => { const n = { ...prev }; delete n[k]; return n })
      moveCaret(activeWord, row, col, 1)
    }
  }

  function checkAnswers() {
    if (!puzzle) return
    const newInput = { ...userInput }
    const newFb    = { ...feedback }
    for (const w of puzzle.placed) {
      cwCells(w).forEach((c, i) => {
        const k = `${c.row},${c.col}`
        if (newFb[k] === 'revealed') return
        const typed = newInput[k] || ''
        if (!typed) return
        if (typed === w.answer[i]) { newFb[k] = 'correct' }
        else { delete newInput[k]; delete newFb[k] }
      })
    }
    setUserInput(newInput); setFeedback(newFb)
  }

  function revealWord() {
    if (!activeWord) return
    const wKey = `${activeWord.dir}-${activeWord.number}`
    const newInput = { ...userInput }
    const newFb    = { ...feedback }
    cwCells(activeWord).forEach((c, i) => {
      const k = `${c.row},${c.col}`
      if (newFb[k] !== 'revealed') { newInput[k] = activeWord.answer[i]; newFb[k] = 'revealed' }
    })
    setUserInput(newInput); setFeedback(newFb)
    if (!revealedSet.has(wKey)) {
      setRevealedSet(prev => new Set([...prev, wKey]))
      const next = revRef.current + 1
      revRef.current = next; setWordsRevealed(next)
    }
  }

  function revealAll() {
    if (!puzzle) return
    const newInput = {}, newFb = {}
    let newly = 0
    for (const w of puzzle.placed) {
      const wKey = `${w.dir}-${w.number}`
      cwCells(w).forEach((c, i) => {
        const k = `${c.row},${c.col}`
        newInput[k] = w.answer[i]; newFb[k] = 'revealed'
      })
      if (!revealedSet.has(wKey)) newly++
    }
    const total = revRef.current + newly
    revRef.current = total; setWordsRevealed(total)
    setUserInput(newInput); setFeedback(newFb)
    setRunning(false)
  }

  function isWordDone(word) {
    return cwCells(word).every((c, i) => {
      const k = `${c.row},${c.col}`
      const fb = feedback[k]
      return fb === 'revealed' || fb === 'correct' || (userInput[k] || '') === word.answer[i]
    })
  }

  function cellBg(row, col) {
    const k = `${row},${col}`
    const fb = feedback[k]
    const isActive = activeCell?.row === row && activeCell?.col === col
    const inWord   = activeWord && cwCells(activeWord).some(c => c.row === row && c.col === col)
    if (fb === 'correct')  return '#bbf7d0'
    if (fb === 'revealed') return '#bfdbfe'
    if (isActive)          return '#c8a84b'
    if (inWord)            return '#dbeafe'
    return '#faf8f3'
  }

  // ── START SCREEN ────────────────────────────────────────────────────────────
  if (phase === 'start') {
    const best = history.length > 0 ? {
      time:  history.reduce((b, h) => (h.timeSeconds ?? 9999) < (b.timeSeconds ?? 9999) ? h : b),
      score: history.reduce((b, h) => h.score > b.score ? h : b),
    } : null
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#fef3c7' }}>✏️</div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#0f1f3d]">CFA Crossword</h2>
                <p className="text-xs text-slate-400 tracking-wide">Fill the grid using CFA concepts</p>
              </div>
            </div>
            {best && (
              <div className="flex gap-4 mb-6">
                <div className="flex-1 rounded-xl p-4 text-center" style={{ background: '#faf8f3', border: '1px solid #e8e0cc' }}>
                  <p className="text-[10px] tracking-widest text-slate-400 mb-1 font-semibold">BEST TIME</p>
                  <p className="font-mono text-xl font-bold" style={{ color: '#c8a84b' }}>{best.time.time}</p>
                </div>
                <div className="flex-1 rounded-xl p-4 text-center" style={{ background: '#faf8f3', border: '1px solid #e8e0cc' }}>
                  <p className="text-[10px] tracking-widest text-slate-400 mb-1 font-semibold">BEST SCORE</p>
                  <p className="font-mono text-xl font-bold" style={{ color: '#c8a84b' }}>{best.score.score}%</p>
                </div>
              </div>
            )}
            <button
              onClick={startPuzzle}
              className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #c8a84b, #a07830)' }}
            >
              Generate Puzzle
            </button>
          </div>
        </div>

        {history.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-[#0f1f3d]">Past Attempts</h3>
              <button
                onClick={() => { setHistory([]); localStorage.removeItem('cfa_crossword_history') }}
                className="text-[11px] text-slate-400 hover:text-red-400 transition-colors"
              >Clear History</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Date', 'Topic', 'Time', 'Score'].map(h => (
                      <th key={h} className="text-left px-5 py-2 text-slate-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-2.5 text-slate-500">{h.date}</td>
                      <td className="px-5 py-2.5 text-slate-600 font-medium">{h.topic}</td>
                      <td className="px-5 py-2.5 font-mono text-[#0f1f3d]">{h.time}</td>
                      <td className="px-5 py-2.5 font-semibold" style={{ color: h.score >= 80 ? '#059669' : h.score >= 50 ? '#c8a84b' : '#dc2626' }}>
                        {h.score}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── COMPLETE SCREEN ─────────────────────────────────────────────────────────
  if (phase === 'complete') {
    const finalScore = Math.max(0, 100 - wordsRevealed * 10)
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-serif text-3xl font-bold text-[#0f1f3d] mb-2">Puzzle Complete!</h2>
        <p className="text-slate-400 text-sm mb-8">You filled in the entire grid</p>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'TIME',     value: fmtTime(seconds) },
            { label: 'SCORE',    value: `${finalScore}%` },
            { label: 'REVEALED', value: String(wordsRevealed) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-[9px] tracking-widest text-slate-400 mb-1 font-semibold">{label}</p>
              <p className="font-mono text-xl font-bold text-[#0f1f3d]">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={startPuzzle}
            className="flex-1 py-3.5 rounded-xl font-bold text-white text-sm transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #c8a84b, #a07830)' }}>
            New Puzzle
          </button>
          <button onClick={onHome}
            className="flex-1 py-3.5 rounded-xl font-semibold text-sm text-[#0f1f3d] bg-white border border-slate-200">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // ── PLAYING SCREEN ──────────────────────────────────────────────────────────
  if (!puzzle) return null
  const { placed, acrossWords, downWords, bounds, grid } = puzzle
  const { minRow, maxRow, minCol, maxCol } = bounds
  const CELL = 34
  const gridH = (maxRow - minRow + 1) * CELL
  const cellNum = (r, c) => placed.find(w => w.row === r && w.col === c)?.number

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '20px 16px' }}>
      {/* Timer + Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 26, fontWeight: 700, color: '#c8a84b', letterSpacing: 1 }}>
          {fmtTime(seconds)}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Check Answers', action: checkAnswers, dark: false },
            { label: 'Reveal Word',   action: revealWord,   dark: false },
            { label: 'Reveal All',    action: revealAll,    dark: true  },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: btn.dark ? '#0f1f3d' : '#ffffff',
              border: btn.dark ? '1.5px solid #0f1f3d' : '1.5px solid #cbd5e1',
              color: btn.dark ? '#fff' : '#334155',
            }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid + Clues */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Grid */}
        <div
          ref={gridRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ outline: 'none', flexShrink: 0, lineHeight: 0, border: '2px solid #0f1f3d', display: 'inline-block' }}
        >
          {Array.from({ length: maxRow - minRow + 1 }, (_, ri) => {
            const row = minRow + ri
            return (
              <div key={row} style={{ display: 'flex' }}>
                {Array.from({ length: maxCol - minCol + 1 }, (_, ci) => {
                  const col = minCol + ci
                  const isWhite = grid[row][col] !== null
                  const num = isWhite ? cellNum(row, col) : null
                  const letter = isWhite ? (userInput[`${row},${col}`] || '') : ''
                  const bg = isWhite ? cellBg(row, col) : '#0f1f3d'
                  return (
                    <div key={col} onClick={() => isWhite && selectCell(row, col)} style={{
                      width: CELL, height: CELL, background: bg, position: 'relative',
                      borderRight: '1px solid ' + (isWhite ? '#94a3b8' : '#0f1f3d'),
                      borderBottom: '1px solid ' + (isWhite ? '#94a3b8' : '#0f1f3d'),
                      cursor: isWhite ? 'pointer' : 'default',
                      boxSizing: 'border-box', userSelect: 'none',
                    }}>
                      {num != null && (
                        <span style={{ position: 'absolute', top: 1, left: 2, fontSize: 7, fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>
                          {num}
                        </span>
                      )}
                      {letter && (
                        <span style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 700, color: '#0f1f3d', fontFamily: 'Georgia, serif',
                        }}>
                          {letter}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Clues panel */}
        <div style={{ flex: 1, minWidth: 0, maxHeight: gridH + 4, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'ACROSS', words: acrossWords, prefix: 'a' },
            { label: 'DOWN',   words: downWords,   prefix: 'd' },
          ].map(({ label, words, prefix }) => (
            <div key={label}>
              <p style={{ fontSize: 10, letterSpacing: '0.1em', fontWeight: 700, color: '#0f1f3d', marginBottom: 6 }}>{label}</p>
              {words.map(w => {
                const done   = isWordDone(w)
                const isAct  = activeWord === w
                return (
                  <button key={`${prefix}${w.number}`}
                    onClick={() => { setActiveWord(w); setActiveCell({ row: w.row, col: w.col }); gridRef.current?.focus() }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                      padding: '4px 8px', borderRadius: 6, marginBottom: 2,
                      background: isAct ? '#fef3c7' : 'transparent',
                      border: isAct ? '1px solid #c8a84b' : '1px solid transparent',
                    }}
                  >
                    <span style={{ fontSize: 11, color: isAct ? '#92400e' : '#475569', lineHeight: 1.4 }}>
                      <strong>{w.number}.</strong>{' '}
                      <span style={{ textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.4 : 1 }}>
                        {w.clue}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main GameModePage ─────────────────────────────────────────────────────────

export default function GameModePage({ mode, scope, topic, onBack }) {
  const scopeName = topic
    ? topic.label
    : scope === 'all'
      ? 'Entire Curriculum'
      : TOPICS.find(t => t.id === scope)?.label ?? scope

  function goHome() {
    onBack()
  }

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
              CFA<br />II
            </span>
          </div>
          <p className="font-serif text-[14px] text-[#0f1f3d] font-semibold leading-none">Study Hub</p>
          <div className="ml-auto hidden sm:flex items-center gap-2 text-[11px] text-slate-400 tracking-wider">
            <span>{scopeName}</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#0f1f3d]">{mode.label}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {mode.id === 'vignette' ? (
          <VignetteExam scope={scope} onHome={goHome} />
        ) : mode.id === 'sudden' ? (
          <SuddenDeath scope={scope} onHome={goHome} />
        ) : mode.id === 'flashcard' ? (
          <FlashcardMatch scope={scope} onHome={goHome} />
        ) : mode.id === 'crossword' ? (
          <CrosswordPuzzle scope={scope} onHome={goHome} />
        ) : (
          /* ── Placeholder for other modes ── */
          <div className="flex flex-col items-center text-center py-8">
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

            <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-sm p-10">
              <p className="font-serif text-lg text-[#0f1f3d] mb-2">Coming in Phase 2</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Full question banks and AI-generated content will be wired up here.
                The scope selector, streak counter, and results screen will all live in this panel.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
