/* ───────────────────────────────────────────────────────────
   Fitnplus — Final UI/UX Feature Completion (tasks #2–#11)

   Self-contained widget library. Every surface here reads from
   CSS-variable tokens (--fp-glass, --fp-text, ...) which are defined
   per-theme in src/index.css, so every widget auto-adapts to BOTH
   light and dark themes with zero theme branching.

   useTheme() mirrors App.tsx's localStorage key ('fp-theme') + the
   :root[data-theme] attribute so widgets react to the toggle WITHOUT
   App.tsx needing to pass a prop (preserves existing app wiring).
   ─────────────────────────────────────────────────────────── */
import React, { useState, useEffect } from 'react'

/* ── Shared design tokens (mirror of screens.tsx; CSS-var backed) ── */
const G = '#16A34A'
const LIME = '#65A30D'
const CYAN = '#0891B2'
const ORANGE = '#EA580C'
const RED = '#DC2626'
const PURPLE = '#7C3AED'
const PINK = '#DB2777'
const TXT = 'var(--fp-text)'
const TXT2 = 'var(--fp-text-2)'
const MUTED = 'var(--fp-muted)'
const LIGHTER = 'var(--fp-lighter)'
const BORDER = 'var(--fp-border-strong)'
const SOFT = 'var(--fp-field)'
const BG = 'var(--fp-bg)'

/* ── Surface style helpers (mirror screens.tsx aesthetic) ── */
const gl = (blur = 22, r = 18) => ({
  background: 'var(--fp-glass)',
  borderRadius: r,
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
  border: `1px solid ${BORDER}`,
  boxShadow: '0 6px 22px rgba(0,0,0,0.06)',
})
const card = () => ({
  ...gl(20, 20),
  boxShadow: '0 18px 46px rgba(0,0,0,0.18)',
  border: `1px solid ${BORDER}`,
})
const ghost = (color: string = MUTED) => ({
  background: 'none', border: 'none', color, cursor: 'pointer',
  fontFamily: "'Outfit', sans-serif", fontWeight: 600,
})
const FF = "'Outfit', sans-serif"
const radius = (r: number | string) => ({ borderRadius: r })

/* ── Theme + responsiveness hooks ──────────────────────────────
   useTheme mirrors App.tsx: reads localStorage 'fp-theme' and the
   :root[data-theme] attribute, re-rendering on the toggle without
   App.tsx needing to pass a prop down. ───────────────────────── */
export function useTheme(): 'light' | 'dark' {
  const get = () => {
    if (typeof localStorage !== 'undefined') {
      const v = localStorage.getItem('fp-theme')
      if (v === 'dark' || v === 'light') return v
    }
    if (typeof document !== 'undefined') {
      const v = document.documentElement.getAttribute('data-theme')
      if (v === 'dark' || v === 'light') return v
    }
    return 'light'
  }
  const [t, setT] = useState<'light' | 'dark'>(get)
  useEffect(() => {
    const root = document.documentElement
    const update = () => setT(get())
    const mo = new MutationObserver(update)
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    const onStorage = (e: StorageEvent) => { if (e.key === 'fp-theme') update() }
    window.addEventListener('storage', onStorage)
    return () => { mo.disconnect(); window.removeEventListener('storage', onStorage) }
  }, [])
  return t
}

export function useIsDesktop() {
  const [d, setD] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const fn = () => setD(mq.matches)
    mq.addEventListener('change', fn)
        return () => mq.removeEventListener('change', fn)
  }, [])
  return d
}

/* ── Shared modal / bottom-sheet ───────────────────────────────
   Desktop → centered glassmorphic sheet
   Mobile  → bottom-anchored sliding sheet (task #11) ────────── */
export interface FitModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children?: React.ReactNode
}
export function FitModal({ open, onClose, title, subtitle, children }: FitModalProps) {
  const desktop = useIsDesktop()
  if (!open) return null
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.45)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: desktop ? 'center' : 'flex-end', justifyContent: 'center' }}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            ...card(),
            width: '100%', maxWidth: desktop ? 420 : 430,
            maxHeight: desktop ? '86vh' : '92vh', overflowY: 'auto',
            borderRadius: desktop ? 28 : 0,
            padding: desktop ? '22px 20px' : '22px 20px calc(20px + env(safe-area-inset-bottom))',
            animation: desktop ? 'logo-enter 320ms cubic-bezier(0.22,0.9,0.35,1) both' : 'slide-up 320ms ease both',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: subtitle ? 6 : 14 }}>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: TXT }}>{title}</h3>
            <button onClick={onClose} style={{ ...ghost(), fontSize: 18, padding: '2px 6px', lineHeight: 1, color: MUTED }} aria-label="Close">✕</button>
          </div>
          {subtitle && <div style={{ fontSize: 12, color: MUTED, marginBottom: 14, lineHeight: 1.5 }}>{subtitle}</div>}
                    {children}
        </div>
      </div>
    </>
  )
}

/* ── Gradient primary button ── */
export function GBtn({ children, onClick, style, variant = 'solid' }: { children: React.ReactNode; onClick?: () => void; style?: any; variant?: 'solid' | 'outline' | 'ghost' }) {
  const base = { fontFamily: FF, fontWeight: 700, borderRadius: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'transform 120ms, box-shadow 120ms', width: '100%' }
  if (variant === 'solid') return <button onClick={onClick} style={{ ...base, ...(style || {}), background: `linear-gradient(135deg,${G},${CYAN})`, color: '#fff', border: 'none', boxShadow: `0 8px 22px ${G}30` }}>{children}</button>
  if (variant === 'outline') return <button onClick={onClick} style={{ ...base, ...(style || {}), background: 'transparent', color: TXT, border: `1px solid ${BORDER}` }}>{children}</button>
  return <button onClick={onClick} style={{ ...base, ...(style || {}), background: 'none', border: 'none', color: MUTED }}>{children}</button>
}

/* ── Spinner (CSS animation: spin) ── */
export function Spinner({ color = '#fff', size = 14 }: { color?: string; size?: number }) {
  return <span style={{ width: size, height: size, border: `2px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%',     animation: 'spin 0.8s linear infinite' }} />
}

/** ChallengeInfo (shared with Community screen) */
export interface ChallengeInfo {
  title: string
  desc: string
  reward: string
  endDate: string
  total: number
  progress: number
  img?: string
  participants: { name: string; avatar: string }[]
}

/** Join Challenge widget — task #2 & #3.
 *  press (idle) → loading (spinner) → success (✓) → parent onAccept.
 *  Invite / Share buttons hand off to the parent flow (tasks #4 & #5). */
export function JoinChallengeWidget({
  challenge, onAccept, onInvite, onShare,
}: { challenge: ChallengeInfo; onAccept: () => void; onInvite: () => void; onShare: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const doJoin = () => {
    if (status !== 'idle') return
    setStatus('loading')
    setTimeout(() => { setStatus('success'); onAccept() }, 950)
  }
  return (
    <>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
        <div style={{ ...radius(14), background: `${G}15`, border: `1px solid ${G}25`, width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>{challenge.img || '🏃'}</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: TXT }}>{challenge.title}</div>
          <div style={{ fontSize: 11, color: MUTED }}>{challenge.endDate} · {challenge.reward}</div>
        </div>
      </div>

      <div style={{ fontSize: 12.5, color: TXT2, lineHeight: 1.6, marginBottom: 16 }}>{challenge.desc}</div>

      <div style={{ height: 7, borderRadius: 4, background: 'var(--fp-track)', marginBottom: 6 }}>
        <div style={{ width: `${challenge.progress}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90,${G},${CYAN})` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED, marginBottom: 18 }}>
        <span>{challenge.progress}% complete</span>
        <span>{challenge.total.toLocaleString()} goal</span>
      </div>

      {status === 'success' ? (
        <div style={{ textAlign: 'center', padding: '6px 0' }}>
          <div style={{ ...radius(999), background: `${G}15`, width: 56, height: 56, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, animation: 'success-pop 400ms ease-out both' }}>✓</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: TXT, marginBottom: 4 }}>🎉 Challenge Joined</div>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>You’re in! Invite friends or share your progress.</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <GBtn onClick={onInvite}>👥 Invite People</GBtn>
            <GBtn variant="outline" onClick={onShare}>↗️ Share Progress</GBtn>
          </div>
        </div>
      ) : (
        <GBtn onClick={doJoin} disabled={status === 'loading'} style={{ opacity: status === 'loading' ? 0.8 : 1, cursor: status === 'loading' ? 'default' : 'pointer' }}>
          {status === 'loading' ? (<><Spinner color="#fff" /> Joining…</>) : (<>🏆 Join Challenge</>)}
        </GBtn>
      )}

      <div style={{ marginTop: 16, fontSize: 11.5, color: MUTED, textAlign: 'center' }}>
                By joining, you agree to the challenge rules. {challenge.participants.length}+ friends already joined.
      </div>
    </>
  )
}

/** Invite People widget — task #4 (multi-select with checkmarks). */
export function InvitePeopleWidget({
  people, onBack, onInvite,
}: { people: { name: string; avatar: string; added: boolean }[]; onBack: () => void; onInvite: (selected: string[]) => void }) {
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState<Set<string>>(new Set())
  const visible = people.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
  const toggle = (n: string) => setSel(s => { const c = new Set(s); if (c.has(n)) c.delete(n); else c.add(n); return c })
  const selected = Array.from(sel)
  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ ...gl(16, 10), flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 15, color: MUTED }}>🔍</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search friends" style={{ ...ghost(TXT2), flex: 1, fontSize: 13, outline: 'none', width: '100%' }} />
        </div>
        <button onClick={onBack} style={{ ...ghost(), fontSize: 13 }}>← Back</button>
      </div>

      <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
        {visible.map(p => {
          const on = sel.has(p.name)
          return (
            <div key={p.name} onClick={() => !p.added && toggle(p.name)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8',
              cursor: p.added ? 'default' : 'pointer', borderRadius: 10, marginBottom: 4,
              background: on ? `${G}12` : p.added ? `${LIME}0f` : 'transparent',
              border: `1px solid ${on ? G : p.added ? LIME : 'transparent'}`,
              transition: 'background 150ms, border 150ms',
            }}>
              <div style={{ ...radius('50%'), width: 38, height: 38, fontSize: 19, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.avatar || '👤'}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: p.added ? MUTED : TXT }}>{p.name}</div>
              {p.added
                ? <span style={{ fontSize: 10, color: LIME, fontWeight: 700 }}>Added</span>
                : <span style={{ fontSize: 16, color: on ? G : MUTED, transform: on ? 'scale(1.2)' : 'scale(1)', transition: 'transform 150ms' }}>✓</span>}
            </div>
          )
        })}
        {visible.length === 0 && <div style={{ color: MUTED, fontSize: 13, textAlign: 'center', padding: '18px 0' }}>No friends found</div>}
      </div>

      <GBtn disabled={selected.length === 0} style={{ opacity: selected.length === 0 ? 0.55 : 1 }} onClick={() => onInvite(selected)}>
                📨 Invite Selected ({selected.length})
      </GBtn>
    </>
  )
}

/* ── Account widget: Edit Profile (task #6) ─────────────────── */
export interface ProfileData {
  name: string; email: string; height: string; weight: string; level: string
}
/* local, so features.tsx stays a leaf module (no screens import → no cycle) */
function useCountUp(target: number, duration = 1000, delay = 0) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const begin = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - begin - delay) / duration))
      setV(Math.round(target * p))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, delay])
  return v
}
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div role="switch" aria-checked={on} onClick={onToggle}
      style={{ width: 36, height: 20, borderRadius: 20, padding: 2, position: 'relative',
        background: on ? `linear-gradient(135deg,${G},${CYAN})` : 'var(--fp-track)',
        cursor: 'pointer', transition: 'background 180ms, transform 180ms', transform: on ? 'scale(1.05)' : 'scale(1)' }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--fp-surface)',
        position: 'absolute', top: 2, left: on ? 20 : 2, transition: 'left 180ms, background 180ms' }} />
    </div>
  )
}

export function EditProfile({ profile, onBack, onSave }: { profile: ProfileData; onBack: () => void; onSave: (p: ProfileData) => void }) {
  const [form, setForm] = useState(profile)
  const [saved, setSaved] = useState(false)
  const set = (k: keyof ProfileData, v: string) => setForm(p => ({ ...p, [k]: v }))
  const save = () => { setSaved(true); onSave(form); setTimeout(() => setSaved(false), 1500) }
  const fields: { k: keyof ProfileData; label: string; ph: string }[] = [
    { k: 'name', label: 'Full Name', ph: 'Ananya Sharma' },
    { k: 'email', label: 'Email', ph: 'ananya@fitpulse.app' },
    { k: 'height', label: 'Height (cm)', ph: '165' },
    { k: 'weight', label: 'Weight (kg)', ph: '58' },
    { k: 'level', label: 'Fitness Level', ph: 'Intermediate' },
  ]
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 6 }}>
        {fields.map(f => (
          <div key={f.k}>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: MUTED, marginBottom: 4, display: 'block' }}>{f.label}</label>
            <input value={form[f.k]} onChange={e => set(f.k, e.target.value)} placeholder={f.ph}
              style={{ ...gl(14, 10), width: '100%', padding: '10px 12px', fontSize: 13, color: TXT, outline: 'none', fontFamily: FF }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <GBtn variant="outline" onClick={onBack}>← Back</GBtn>
        <GBtn onClick={save} disabled={saved} style={{ color: saved ? G : '#fff' }}>{saved ? '✓ Saved' : 'Save Changes'}</GBtn>
      </div>
    </>
  )
}

/* ── Account widget: Subscription (task #7) ────────────────── */
export function Subscription({ onBack, onUpgrade }: { onBack: () => void; onUpgrade: () => void }) {
  const [upgraded, setUpgraded] = useState(false)
  const features = [
    { k: '📊', t: 'Unlimited analytics' },
    { k: '🎯', t: 'Advanced insights' },
    { k: '🏆', t: 'All challenges & rankings' },
    { k: '🌙', t: 'Dark mode themes' },
    { k: '🎵', t: 'Custom workout playlists' },
  ]
  const TagMini = ({ c, children }: { c: string; children: React.ReactNode }) => (
    <span style={{ ...gl(0.9, 8), padding: '2px 8px', fontSize: 10, fontWeight: 700, color: c, border: `1px solid ${c}25` }}>{children}</span>
  )
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 6 }}>
        <div style={{ ...gl(0.8, 16, 12), padding: 16, border: `2px solid ${G}20` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TXT }}>FitPulse Free</div>
            <TagMini c={LIME}>✓ Active</TagMini>
          </div>
          <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>5,000 steps/day · Basic analytics · 3 challenges</div>
        </div>
        <div style={{ ...gl(0.95, 16, 12), padding: 16, border: `2px solid ${G}70` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TXT }}>FitPulse Pro</div>
            <TagMini c={PURPLE}>Most popular</TagMini>
          </div>
          <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, marginBottom: 10 }}>Unlimited everything · All challenges · Full stats</div>
          <ul style={{ fontSize: 12, color: TXT2, paddingLeft: 18, lineHeight: 1.8, margin: 0 }}>
            {features.map(f => <li key={f.t}>{f.k} {f.t}</li>)}
          </ul>
        </div>
      </div>
      <div style={{ marginTop: 6 }}>
        {upgraded
          ? <div style={{ textAlign: 'center', padding: '18px 0', fontSize: 14, fontWeight: 700, color: TXT }}>🎉 Premium queued! Check your email to activate.</div>
          : <GBtn onClick={() => { setUpgraded(true); onUpgrade() }}>💎 Upgrade to Premium · $9.99/mo</GBtn>}
      </div>
      <GBtn variant="outline" onClick={onBack} style={{ marginTop: 12 }}>← Back</GBtn>
    </>
  )
}

/* ── Account widget: Personal Records (task #8) ─────────────── */
export function PersonalRecords({
  records, onBack,
}: { records: { label: string; value: string; icon: string; color: string; num?: number }[]; onBack: () => void }) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 12, marginBottom: 8 }}>
        {records.map((r, i) => <RecordCard key={r.label} r={r} i={i} />)}
      </div>
      <GBtn variant="outline" onClick={onBack}>← Back</GBtn>
    </>
  )
}
function RecordCard({ r, i }: { r: { label: string; value: string; icon: string; color: string; num?: number }; i: number }) {
  const shown = useCountUp(r.num ?? 0, 1100, i * 110)
  const isNum = typeof r.num === 'number' && r.num > 0
  return (
    <div style={{ ...gl(0.7, 14, 12), padding: 14, textAlign: 'center', animation: `fade-slide-up 360ms ease-out ${i * 80}ms both` }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{r.icon}</div>
      <div style={{ fontSize: 19, fontWeight: 800, color: r.color }}>{isNum ? shown : r.value}</div>
      {isNum && <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>new PR</div>}
      <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{r.label}</div>
    </div>
  )
}

/* ── Account widget: Privacy & Security (task #9) ───────────── */
export function PrivacySecurity({
  settings, onBack, onUpdate,
}: {
  settings: { key: string; label: string; desc: string; on: boolean }[]
  onBack: () => void
  onUpdate: (s: { key: string; label: string; desc: string; on: boolean }[]) => void
}) {
  const [s, setS] = useState(settings)
  const flip = (k: string) => setS(p => {
    const n = p.map(x => x.key === k ? { ...x, on: !x.on } : x)
    onUpdate(n)
    return n
  })
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 6 }}>
        {s.map(it => (
          <div key={it.key} style={{ ...gl(0.6, 12, 10), padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: TXT }}>{it.label}</div>
              <div style={{ fontSize: 10.5, color: MUTED, lineHeight: 1.5 }}>{it.desc}</div>
            </div>
            <Toggle on={it.on} onToggle={() => flip(it.key)} />
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: MUTED, textAlign: 'center', padding: '12px 0', borderTop: `1px solid ${BORDER}` }}>🔐 Your health data stays encrypted and under your control.</div>
      <GBtn variant="outline" onClick={onBack} style={{ marginTop: 12 }}>← Back</GBtn>
    </>
  )
}

/** Share Progress widget — task #5. */
export function ShareProgressWidget({
  challenge, stats, onBack,
}: { challenge: ChallengeInfo; stats: { label: string; value: string }[]; onBack: () => void }) {
  const share = async () => {
    const text = `I just joined the "${challenge.title}" challenge on FitPulse! ${stats.map(s => `${s.label}: ${s.value}`).join(' · ')}`
    if (navigator.share) {
      try { await navigator.share({ title: 'FitPulse', text }) } catch { await navigator.clipboard.writeText(text) }
    } else {
      await navigator.clipboard.writeText(text)
    }
  }
  return (
    <>
      <div style={{ ...card(), padding: 16, marginBottom: 18, textAlign: 'center' }}>
        <div style={{ fontSize: 34 }}>{challenge.img || '🎯'}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: TXT, marginTop: 8 }}>{challenge.title} — {Math.round((challenge.progress / challenge.total) * 100)}% complete</div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        {stats.map(s => (
          <div key={s.label} style={{ flex: 1, ...gl(0.7, 14, 12), padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: G }}>{s.value}</div>
            <div style={{ fontSize: 10, color: MUTED }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <GBtn variant="outline" onClick={onBack}>← Back</GBtn>
        <GBtn onClick={share}>↗️ Share to…</GBtn>
      </div>
    </>
  )
}
