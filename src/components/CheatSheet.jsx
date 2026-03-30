import { useState } from 'react'

// ─── Print styles injected once ───────────────────────────────────────────────
const PRINT_CSS = `
@media print {
  body * { visibility: hidden; }
  #cheatsheet-root, #cheatsheet-root * { visibility: visible; }
  #cheatsheet-root { position: fixed; inset: 0; overflow: visible; }
  .no-print { display: none !important; }
  @page { margin: 0.4in; size: landscape; }
}
`

function injectPrintStyles() {
  if (document.getElementById('cheatsheet-print-css')) return
  const style = document.createElement('style')
  style.id = 'cheatsheet-print-css'
  style.textContent = PRINT_CSS
  document.head.appendChild(style)
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <div style={{
      background: '#0f1f3d',
      color: '#c8a84b',
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
      fontSize: '9px',
      letterSpacing: '0.15em',
      padding: '3px 8px',
      textTransform: 'uppercase',
      borderRadius: '3px 3px 0 0',
    }}>
      {children}
    </div>
  )
}

function FormulaBox({ children }) {
  return (
    <div style={{
      background: '#fdf6e3',
      border: '1px solid #c8a84b',
      borderRadius: 3,
      padding: '3px 6px',
      fontFamily: 'DM Mono, monospace',
      fontSize: '8px',
      color: '#0f1f3d',
      marginTop: 3,
      lineHeight: 1.5,
    }}>
      {children}
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 4,
      overflow: 'hidden',
      breakInside: 'avoid',
    }}>
      <SectionHeader>{title}</SectionHeader>
      <div style={{ padding: '5px 8px', fontSize: '8px', lineHeight: 1.55, color: '#1e3a5f' }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 2 }}>
      <span style={{ color: '#c8a84b', fontWeight: 700, minWidth: 'fit-content', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ color: '#334155' }}>{value}</span>
    </div>
  )
}

function Bullet({ children }) {
  return (
    <div style={{ display: 'flex', gap: 5, marginBottom: 2 }}>
      <span style={{ color: '#c8a84b', flexShrink: 0 }}>•</span>
      <span>{children}</span>
    </div>
  )
}

// ─── Main CheatSheet ───────────────────────────────────────────────────────────

export default function CheatSheet({ onClose }) {
  const [printing, setPrinting] = useState(false)

  function handlePrint() {
    injectPrintStyles()
    setPrinting(true)
    setTimeout(() => { window.print(); setPrinting(false) }, 50)
  }

  return (
    <div id="cheatsheet-root" style={{
      fontFamily: "'DM Mono', monospace",
      background: '#faf8f3',
      minHeight: '100%',
      padding: '12px',
      color: '#0f1f3d',
    }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: 18,
            color: '#0f1f3d',
            lineHeight: 1.1,
          }}>
            Alternative Investments
          </div>
          <div style={{ fontSize: 9, color: '#c8a84b', letterSpacing: '0.2em', marginTop: 2 }}>
            CFA LEVEL II — QUICK REFERENCE
          </div>
        </div>

        <div className="no-print" style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handlePrint}
            disabled={printing}
            style={{
              background: '#0f1f3d',
              color: '#c8a84b',
              border: 'none',
              borderRadius: 6,
              padding: '6px 14px',
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {printing ? 'PREPARING…' : 'PRINT'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                color: '#94a3b8',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                padding: '6px 14px',
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              CLOSE
            </button>
          )}
        </div>
      </div>

      <div style={{ height: 1, background: 'linear-gradient(to right, #c8a84b, transparent)', marginBottom: 10 }} />

      {/* ── Grid Layout ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 6,
      }}>

        {/* ── Col 1: Commodity Futures ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

          <Card title="Commodity Futures — Pricing">
            <Row label="Spot" value="Price paid today for immediate delivery" />
            <Row label="Futures" value="Price agreed today for future delivery" />
            <FormulaBox>Fp = Spot + Storage Costs + Financing − Convenience Yield</FormulaBox>
          </Card>

          <Card title="Contango vs Backwardation">
            <Bullet><strong>Contango:</strong> Futures &gt; Spot | upward-sloping curve</Bullet>
            <div style={{ paddingLeft: 12, fontSize: '7.5px', color: '#475569', marginBottom: 3 }}>
              Causes: high storage, low CY, excess supply → <strong style={{ color: '#dc2626' }}>NEGATIVE roll return</strong>
            </div>
            <Bullet><strong>Backwardation:</strong> Spot &gt; Futures | downward-sloping curve</Bullet>
            <div style={{ paddingLeft: 12, fontSize: '7.5px', color: '#475569' }}>
              Causes: low inventory, high demand, high CY → <strong style={{ color: '#16a34a' }}>POSITIVE roll return</strong>
            </div>
          </Card>

          <Card title="Total Commodity Return">
            <FormulaBox>
              Total = Price + Roll + Collateral{'\n'}
              Price = (Fnear,end − Fnear,start) / Fnear,start{'\n'}
              Roll = (Fnear,end − Fnext,end) / Fnear,end{'\n'}
              Collateral = risk-free rate × time
            </FormulaBox>
          </Card>

          <Card title="Theories of Futures Returns">
            <Bullet><strong>Insurance:</strong> Producers sell futures → speculators earn premium → backwardation likely</Bullet>
            <Bullet><strong>Hedging Pressure:</strong> Producers dominate → backwardation; Consumers dominate → contango</Bullet>
            <Bullet><strong>Theory of Storage:</strong> Low inventory → high CY → backwardation; High inventory → low CY → contango</Bullet>
            <div style={{ marginTop: 4, padding: '3px 6px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 3, fontSize: '7.5px' }}>
              <strong>Exam tip:</strong> Producer hedging / earned premium → Insurance · Dominant hedger side → Hedging Pressure · Inventory / CY / Storage → Theory of Storage
            </div>
          </Card>

          <Card title="Market Participants">
            <Bullet><strong>Hedgers</strong> — reduce price risk</Bullet>
            <Bullet><strong>Speculators</strong> — profit from price changes</Bullet>
            <Bullet><strong>Arbitrageurs</strong> — exploit mispricings risk-free</Bullet>
          </Card>
        </div>

        {/* ── Col 2: Real Estate ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

          <Card title="Real Estate — Key Formulas">
            <FormulaBox>
              GPI = total rent if 100% occupied{'\n'}
              EGI = GPI − Vacancies & nonpayments{'\n'}
              NOI = EGI − Operating Exp − Maintenance{'\n'}
              Value = NOI / Cap Rate{'\n'}
              Cap Rate = Required Return − Growth{'\n'}
              ↑ Cap Rate = ↓ Value
            </FormulaBox>
          </Card>

          <Card title="Leverage & Cash Flow Metrics">
            <FormulaBox>
              LTV = Debt / Property Value (↑ = ↑ risk){'\n'}
              DSCR = NOI / Debt Service{'\n'}
              {'  '}DSCR &gt; 1 = safe  |  DSCR &lt; 1 = dangerous{'\n'}
              Before-Tax CF = NOI − Debt Service{'\n'}
              Equity Div. Rate = Before-Tax CF / Equity
            </FormulaBox>
          </Card>

          <Card title="Property Types">
            <Bullet><strong>Core:</strong> low risk, stable income, bond-like returns</Bullet>
            <Bullet><strong>Opportunistic:</strong> high risk, development/distressed, equity-like returns</Bullet>
          </Card>

          <Card title="Real Estate Market Cycle">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              {[
                { phase: 'Recovery', noi: '↑', dscr: '↑', ltv: '↓', rates: 'begin↑', risk: '↓' },
                { phase: 'Expansion', noi: '↑', dscr: '↑', ltv: '↓', rates: '↑', risk: 'low' },
                { phase: 'Oversupply', noi: '↓', dscr: '↓', ltv: '↑', rates: 'peak/↓', risk: '↑' },
                { phase: 'Recession', noi: '↓', dscr: '↓', ltv: '↑', rates: 'low', risk: 'high' },
              ].map(p => (
                <div key={p.phase} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 3,
                  padding: '3px 5px',
                  fontSize: '7.5px',
                }}>
                  <div style={{ fontWeight: 700, color: '#0f1f3d', marginBottom: 2 }}>{p.phase}</div>
                  <div>NOI {p.noi} · DSCR {p.dscr} · LTV {p.ltv}</div>
                  <div>Rates {p.rates} · Risk {p.risk}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 4, fontSize: '7.5px', color: '#64748b' }}>
              ↓ Vacancy rate → oversupply or recession phase
            </div>
          </Card>

          <Card title="Index Types">
            <Bullet><strong>Appraisal-Based:</strong> estimate-driven, lags market, understates risk</Bullet>
            <Bullet><strong>Transaction-Based:</strong> actual sales, higher volatility, reflects market faster</Bullet>
            <Bullet><strong>Net lease:</strong> tenant pays operating expenses</Bullet>
          </Card>
        </div>

        {/* ── Col 3: REIT Securities ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

          <Card title="REIT Requirements">
            <Bullet>≥ 75% of <strong>assets</strong> = real estate</Bullet>
            <Bullet>≥ 75% of <strong>income</strong> from rents / mortgage interest</Bullet>
            <Bullet>≥ <strong>90%</strong> of income distributed → no corporate tax</Bullet>
          </Card>

          <Card title="REIT Types">
            <Row label="Equity REIT" value="own properties → rent + appreciation" />
            <Row label="Mortgage REIT" value="own loans/MBS → interest, rate-sensitive" />
            <Row label="REOC" value="taxable, retains earnings, growth-focused, for-sale dev" />
            <Row label="MBS" value="debt exposure only, NOT ownership; credit & prepayment risk" />
          </Card>

          <Card title="FFO & AFFO">
            <FormulaBox>
              FFO = NI + D&A − Gains on property sales{'\n'}
              AFFO = FFO − Noncash rents − Recurring Capex{'\n'}
              (Noncash rent = reported rent − cash rent)
            </FormulaBox>
            <div style={{ marginTop: 3, fontSize: '7.5px', color: '#475569' }}>
              P/FFO: easily computed · P/AFFO: better proxy, less standardized
            </div>
          </Card>

          <Card title="NAV Approach">
            <FormulaBox>
              Prop. Value = NOI(1+g) / Cap Rate{'\n'}
              NAVPS = (MV Assets − MV Liabilities) / Shares{'\n'}
              Price &gt; NAV → Premium / overvalued{'\n'}
              Price &lt; NAV → Discount / undervalued
            </FormulaBox>
          </Card>

          <Card title="Management & Accounting">
            <Bullet><strong>Internal mgmt:</strong> employed by REIT, better alignment ✓ preferred</Bullet>
            <Bullet><strong>External mgmt:</strong> third-party, fee conflicts, worse alignment</Bullet>
            <Bullet><strong>IFRS:</strong> Cost Model OR Fair Value Model (must pick one consistently)</Bullet>
            <Bullet><strong>US GAAP:</strong> Historical Cost only → understates value during inflation</Bullet>
          </Card>
        </div>

        {/* ── Col 4: Hedge Fund Strategies ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

          <Card title="Hedge Fund Strategies (9)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
              {[
                { name: '1. Equity Long/Short', exp: 'Net Long / +β', lev: 'Mod-High', liq: 'High', note: 'alpha + equity exposure' },
                { name: '2. Dedicated Short Bias', exp: 'Net Short / −β', lev: 'Low-Mod', liq: 'High', note: 'volatile, rarely used' },
                { name: '3. Equity Mkt Neutral', exp: 'β ≈ 0', lev: 'High', liq: 'High', note: 'pure alpha, low vol' },
                { name: '4. Merger Arbitrage', exp: 'Event-Driven', lev: 'Mod-High', liq: 'Mod', note: 'buy target / short acquirer' },
                { name: '5. Distressed', exp: 'Event-Driven', lev: 'Low-Mod', liq: 'Low ⚠', note: 'poor in recessions' },
                { name: '6. Fixed Income Arb', exp: 'Mkt Neutral', lev: 'Very High', liq: 'Mod', note: 'vulnerable in crises' },
                { name: '7. Convertible Arb', exp: 'Mkt Neutral', lev: 'High', liq: 'Mod', note: 'long convert / short stock' },
                { name: '8. Global Macro', exp: 'Directional', lev: 'High', liq: 'High', note: 'macro trends, flexible' },
                { name: '9. Managed Futures', exp: 'Directional', lev: 'High', liq: 'Very High ✓', note: 'BEST in crises, trend-follow' },
              ].map(s => (
                <div key={s.name} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.6fr 0.7fr 0.6fr 1fr',
                  gap: 2,
                  padding: '2px 4px',
                  background: s.name.includes('Managed') ? '#f0fdf4' : s.name.includes('Market Neutral') || s.name.includes('Mkt Neutral') ? '#fafafa' : '#fff',
                  border: '1px solid #f1f5f9',
                  borderRadius: 2,
                  fontSize: '7.5px',
                  alignItems: 'center',
                }}>
                  <span style={{ fontWeight: 600, color: '#0f1f3d' }}>{s.name}</span>
                  <span style={{ color: '#475569' }}>{s.exp}</span>
                  <span style={{ color: '#475569' }}>Lev: {s.lev}</span>
                  <span style={{ color: '#64748b', fontStyle: 'italic' }}>{s.note}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Key Exam Reminders">
            <div style={{ padding: '3px 6px', background: '#fdf6e3', border: '1px solid #c8a84b', borderRadius: 3 }}>
              <Bullet>Backwardation → <strong>POSITIVE</strong> roll return (sell high near, buy low next)</Bullet>
              <Bullet>Contango → <strong>NEGATIVE</strong> roll return (sell low near, buy high next)</Bullet>
              <Bullet>Managed Futures = <strong>BEST</strong> in crises (trend-following profits from dislocations)</Bullet>
              <Bullet>DSCR &lt; 1 = distressed; DSCR &gt; 1 = safe debt coverage</Bullet>
              <Bullet>Cap Rate ↓ → Property Value ↑ (inverse relationship)</Bullet>
              <Bullet>AFFO = true cash flow; FFO = accounting cash flow proxy</Bullet>
              <Bullet>REIT: 90% income distributed → pass-through, no corp tax</Bullet>
              <Bullet>Internal REIT mgmt preferred over external (alignment)</Bullet>
            </div>
          </Card>

        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        marginTop: 8,
        paddingTop: 6,
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '7px',
        color: '#94a3b8',
      }}>
        <span>CFA Level II — Alternative Investments Quick Reference</span>
        <span>Study Hub · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
      </div>

    </div>
  )
}
