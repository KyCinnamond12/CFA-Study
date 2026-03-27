// All inline SVG icons used throughout the app

const props = { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IconEthics({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <path d="M3 6l9-3 9 3v6c0 5-4 8-9 9-5-1-9-4-9-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

export function IconQuant({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

export function IconEconomics({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8" />
      <path d="M12 3a14.5 14.5 0 010 18M12 3a14.5 14.5 0 000 18" />
    </svg>
  )
}

export function IconFSA({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </svg>
  )
}

export function IconCorporate({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <path d="M3 21h18M3 7l9-4 9 4v14" />
      <path d="M9 21V11h6v10" />
      <rect x="11" y="7" width="2" height="2" />
    </svg>
  )
}

export function IconEquity({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

export function IconFixed({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <path d="M3 17c3-3 4-7 9-7s6 4 9 7" />
      <path d="M12 10V3" />
      <path d="M9 5l3-2 3 2" />
    </svg>
  )
}

export function IconDerivatives({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
      <circle cx="7" cy="17" r="1.5" />
      <circle cx="17" cy="7" r="1.5" />
    </svg>
  )
}

export function IconAlts({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

export function IconPortfolio({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3" />
      <path d="M12 12L3.6 7.5" />
      <path d="M12 12V3" />
      <path d="M12 12l6.36-3.68" />
    </svg>
  )
}

// Game mode icons

export function IconVignette({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <path d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V18a2 2 0 01-2 2z" />
    </svg>
  )
}

export function IconSudden({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

export function IconFlashcard({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M12 10v6M9 13h6" />
    </svg>
  )
}

export function IconCrossword({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} {...props}>
      <rect x="3" y="3" width="4" height="4" rx="0.5" />
      <rect x="10" y="3" width="4" height="4" rx="0.5" />
      <rect x="17" y="3" width="4" height="4" rx="0.5" />
      <rect x="3" y="10" width="4" height="4" rx="0.5" />
      <rect x="17" y="10" width="4" height="4" rx="0.5" />
      <rect x="3" y="17" width="4" height="4" rx="0.5" />
      <rect x="10" y="17" width="4" height="4" rx="0.5" />
      <rect x="17" y="17" width="4" height="4" rx="0.5" />
    </svg>
  )
}

export function IconChevronDown({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function IconBack({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

// Map icon id → component
const TOPIC_ICONS = {
  ethics: IconEthics,
  quant: IconQuant,
  economics: IconEconomics,
  fsa: IconFSA,
  corporate: IconCorporate,
  equity: IconEquity,
  fixed: IconFixed,
  derivatives: IconDerivatives,
  alts: IconAlts,
  portfolio: IconPortfolio,
}
const MODE_ICONS = {
  vignette: IconVignette,
  sudden: IconSudden,
  flashcard: IconFlashcard,
  crossword: IconCrossword,
}

export function TopicIcon({ id, className }) {
  const C = TOPIC_ICONS[id] || IconPortfolio
  return <C className={className} />
}

export function ModeIcon({ id, className }) {
  const C = MODE_ICONS[id] || IconVignette
  return <C className={className} />
}
