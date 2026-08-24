import { useState, useEffect, useRef, type CSSProperties } from 'react'
import googleLogo from "@/imports/google-logo.png";
import appleLogo from "@/imports/apple-logo.png";

import {
  AreaChart, Area, BarChart as RBarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

import {
  useTheme, FitModal, JoinChallengeWidget, InvitePeopleWidget, ShareProgressWidget,
  EditProfile, Subscription, PersonalRecords, PrivacySecurity,
  type ChallengeInfo, type ProfileData,
} from './features'


/* ─── Design Tokens ───────────────────────────────────────── */
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

/* ─── Animation hooks ────────────────────────────────────── */

/* ─── Animation hooks ────────────────────────────────────── */
function useCountUp(target: number, duration = 1200, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        const e = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(target * e))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(t)
  }, [target, duration, delay])
  return val
}

function Animated({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: CSSProperties }) {
  return (
    <div style={{ animation: `fade-slide-up 380ms ease-out ${delay}ms both`, ...style }}>
      {children}
    </div>
  )
}

/* ─── Style helpers ───────────────────────────────────────── */
const gl = (op = 0.72, blur = 22, r = 18): CSSProperties => ({
  background: 'var(--fp-glass)',
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
  border: '1px solid var(--fp-border)',
  borderRadius: r,
  boxShadow: '0 4px 24px var(--fp-shadow), 0 1px 4px var(--fp-shadow-soft)',
})

const scr: CSSProperties = {
  background: BG,
  width: '100%',
  height: '100dvh',
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  color: TXT,
  fontFamily: "'Outfit', sans-serif",
  userSelect: 'none',
}

/* Shared inner-scroll wrapper for screens with a bottom nav */
const innerScroll = (extraPadding = 0): CSSProperties => ({
  height: `calc(100dvh - ${88 + extraPadding}px)`,
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  zIndex: 1,
})

/* Background blobs — add to every screen for depth */
function BgBlobs() {
  return (
    <>
      <div style={{ position: 'absolute', top: '-8%', right: '-18%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,var(--fp-glow),transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '12%', left: '-12%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,var(--fp-glow-2),transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '45%', right: '25%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,var(--fp-glow-3),transparent 70%)', filter: 'blur(35px)', pointerEvents: 'none', zIndex: 0 }} />
    </>
  )
}

/* ─── Logo ─────────────────────────────────────────────────── */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="fpg2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#16A34A" floodOpacity="0.35" />
        </filter>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#fpg2)" filter="url(#logo-shadow)" />
      <circle cx="24" cy="24" r="23" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
      <polyline
        points="6,26 11,26 14,17 18,35 22,20 26,26 32,26 38,26"
        stroke="white" strokeWidth="2.5" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/* ─── Bottom Nav ──────────────────────────────────────────── */
export function BottomNav({ active = 'home', onNav }: { active?: string; onNav?: (s: string) => void }) {
  const tabs = [
    { id: 'home', emoji: '🏠', label: 'Home' },
    { id: 'progress', emoji: '📊', label: 'Progress' },
    { id: 'community', emoji: '👥', label: 'Community' },
    { id: 'account', emoji: '👤', label: 'Account' },
  ]
  const activeIdx = tabs.findIndex(t => t.id === active)
  const tabW = 100 / tabs.length

  return (
    <div style={{
      ...gl(0.88, 30, 0),
      position: 'absolute', bottom: 0, left: 0, right: 0,
      display: 'flex', paddingTop: 10, paddingBottom: 26,
      borderTop: `1px solid ${SOFT}`,
      boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
    }}>
      {/* Sliding indicator */}
      <div style={{
        position: 'absolute', top: 0, height: 3,
        width: `${tabW - 8}%`,
        left: `${tabW * activeIdx + 4}%`,
        background: `linear-gradient(90deg,${G},${CYAN})`,
        borderRadius: '0 0 4px 4px',
        transition: 'left 280ms cubic-bezier(0.4,0,0.2,1)',
        boxShadow: `0 2px 8px ${G}50`,
      }} />
      {tabs.map(t => (
        <button key={t.id} onClick={() => onNav?.(t.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 3,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif",
          color: t.id === active ? G : MUTED,
          fontSize: 10, fontWeight: t.id === active ? 700 : 400,
          transition: 'color 0.2s',
          paddingTop: 4,
        }}>
          <span style={{
            fontSize: 22,
            display: 'block',
            transform: t.id === active ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform 200ms ease-out',
          }}>{t.emoji}</span>
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ─── Status Bar ─────────────────────────────────────────── */
function StatusBar({ light = false }: { light?: boolean }) {
  const c = light ? 'rgba(255,255,255,0.85)' : TXT2
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: c, marginBottom: 14, fontWeight: 600, flexShrink: 0 }}>
      <span style={{ letterSpacing: 0.5 }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
        <span>●●●</span>
        <span>5G</span>
        <span>🔋</span>
      </div>
    </div>
  )
}

/* ─── Primitives ──────────────────────────────────────────── */
function GBtn({ children, onClick, style, variant = 'solid' }: any) {
  const base: CSSProperties = {
    borderRadius: 30, padding: '15px 28px', fontSize: 15, fontWeight: 700,
    cursor: 'pointer', width: '100%', fontFamily: "'Outfit', sans-serif",
    border: 'none', transition: 'opacity 0.15s',
  }
  if (variant === 'outline') {
    return (
      <button onClick={onClick} style={{
        ...base, ...gl(0.85, 16, 30),
        color: TXT, fontSize: 14, ...style,
        border: `1px solid ${SOFT}`, boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      }}>{children}</button>
    )
  }
  if (variant === 'ghost') {
    return (
      <button onClick={onClick} style={{
        ...base, background: 'transparent', color: MUTED, fontSize: 14, ...style,
      }}>{children}</button>
    )
  }
  return (
    <button onClick={onClick} style={{
      ...base,
      background: `linear-gradient(135deg,${G} 0%,#15803d 100%)`,
      color: 'white',
      boxShadow: `0 8px 24px ${G}40`,
      ...style,
    }}>{children}</button>
  )
}

function FInput({ placeholder, type = 'text', icon, value, onChange }: any) {
  return (
    <div style={{ position: 'relative', marginBottom: 12 }}>
      {icon && (
        <span style={{
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          fontSize: 17, pointerEvents: 'none',
        }}>{icon}</span>
      )}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{
          ...gl(0.8, 16, 14),
          width: '100%', padding: '14px 16px',
          paddingLeft: icon ? 48 : 16,
          color: TXT, fontSize: 15, outline: 'none',
          boxSizing: 'border-box',
          fontFamily: "'Outfit', sans-serif",
          border: `1px solid ${SOFT}`,
        } as CSSProperties}
      />
    </div>
  )
}

function Tag({ children, color = G }: any) {
  return (
    <span style={{
      background: `${color}18`, color,
      border: `1px solid ${color}35`,
      borderRadius: 20, padding: '3px 10px',
      fontSize: 11, fontWeight: 700, display: 'inline-block',
    }}>{children}</span>
  )
}

function Toggle({ on = false, onToggle }: { on?: boolean; onToggle?: () => void }) {
  return (
    <div onClick={onToggle} style={{
      width: 46, height: 26, borderRadius: 13, cursor: 'pointer', transition: 'background 0.25s',
      background: on ? G : 'var(--fp-faint)',
      position: 'relative', flexShrink: 0,
      boxShadow: on ? `0 2px 8px ${G}50` : 'none',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: 'var(--fp-surface)',
        position: 'absolute', top: 3, transition: 'left 0.25s',
        left: on ? 23 : 3,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }} />
    </div>
  )
}

function StatCard({ icon, label, value, unit, color, sub }: any) {
  return (
    <div style={{ ...gl(0.8, 18, 18), padding: '14px 12px', flex: 1, minWidth: 0 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 11,
        background: `${color}15`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 19, marginBottom: 8, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ fontSize: 10.5, color: MUTED, fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: TXT, lineHeight: 1.1 }}>
        {value}
        {unit && <span style={{ fontSize: 11, fontWeight: 500, color: MUTED, marginLeft: 2 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 10, color: MUTED, marginTop: 3, lineHeight: 1.3 }}>{sub}</div>}
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 1 — SPLASH
   ─────────────────────────────────────────────────────────── */
export function SplashScreen({ onNav }: { onNav?: (s: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onNav?.('onboard1'), 800)
    return () => clearTimeout(t)
  }, [onNav])

  return (
    <div style={{ ...scr, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <BgBlobs />

      {/* Particle dots */}
      {[[40,100],[320,180],[30,480],[340,560],[190,680],[285,360],[90,300]].map(([x, y], i) => (
        <div key={i} style={{
          position: 'absolute', left: x, top: y,
          width: 5 + (i % 3) * 2, height: 5 + (i % 3) * 2,
          borderRadius: '50%',
          background: [G, CYAN, LIME][i % 3],
          opacity: 0.3 + (i % 3) * 0.12,
          animation: `float ${2.5 + i * 0.4}s ease-in-out infinite`,
          animationDelay: `${i * 0.35}s`,
          zIndex: 1,
        }} />
      ))}

      {/* Main glass card — logo enters first (0–250ms), tagline follows */}
      <div style={{ ...gl(0.78, 32, 32), padding: '48px 44px', textAlign: 'center', zIndex: 2, position: 'relative' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24, animation: 'logo-enter 250ms ease-out both' }}>
          <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', background: `radial-gradient(circle,${G}35,transparent)`, filter: 'blur(16px)', animation: 'pulse-glow 2.5s ease-in-out infinite 250ms' }} />
          <Logo size={84} />
        </div>

        <h1 style={{ margin: 0, fontSize: 44, fontWeight: 900, letterSpacing: -1.5, color: TXT, animation: 'fade-slide-up 300ms ease-out 250ms both' }}>
          FitPulse
        </h1>
        <p style={{ margin: '10px 0 0', fontSize: 12, fontWeight: 600, letterSpacing: 3.5, color: MUTED, textTransform: 'uppercase', animation: 'fade-slide-up 300ms ease-out 350ms both' }}>
          Track. Improve. Achieve.
        </p>
      </div>

      {/* Loading ring */}
      <div style={{ marginTop: 52, position: 'relative', width: 52, height: 52, zIndex: 2, animation: 'fade-slide-up 300ms ease-out 450ms both' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `2px solid ${G}25`,
          animation: 'ring-pulse 1.6s ease-out infinite',
        }} />
        <svg width="52" height="52" style={{ animation: 'spin 1.4s linear infinite', display: 'block' }}>
          <circle cx="26" cy="26" r="20" fill="none" stroke={`${G}20`} strokeWidth="3" />
          <circle cx="26" cy="26" r="20" fill="none" stroke={G} strokeWidth="3"
            strokeDasharray="44 82" strokeLinecap="round" />
        </svg>
      </div>

      <p style={{ position: 'absolute', bottom: 36, fontSize: 11, color: LIGHTER, zIndex: 2, fontWeight: 500, animation: 'fade-slide-up 300ms ease-out 550ms both' }}>
        © 2025 FitPulse Inc.
      </p>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREENS 2–4 — ONBOARDING
   ─────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    title: 'Track Your Health Easily',
    subtitle: "Monitor steps, heart rate, calories & sleep all in one place.",
    accentColor: G,
    illustration: () => (
      <div style={{ position: 'relative', height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 170, height: 170, borderRadius: '50%', background: `${G}12`, border: `1.5px solid ${G}25` }} />
        <div style={{ fontSize: 84, animation: 'float 3s ease-in-out infinite', zIndex: 1 }}>🏃‍♂️</div>
        {[
          { text: '👟 8,432 Steps', color: G, top: 16, left: 4 },
          { text: '❤️ 72 BPM', color: RED, top: 64, right: 4 },
          { text: '🔥 482 kcal', color: ORANGE, bottom: 24, left: 20 },
        ].map((c, i) => (
          <div key={i} style={{
            ...gl(0.82, 14, 22), padding: '7px 13px', fontSize: 11.5, fontWeight: 700,
            color: c.color, position: 'absolute',
            top: c.top, left: (c as any).left, right: (c as any).right, bottom: (c as any).bottom,
            animation: `float ${2.5 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.55}s`,
          }}>{c.text}</div>
        ))}
      </div>
    ),
  },
  {
    title: 'AI Insights For Your Goals',
    subtitle: "Personalized predictions and weekly analytics powered by AI.",
    accentColor: CYAN,
    illustration: () => (
      <div style={{ position: 'relative', height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...gl(0.85, 18, 22), width: 250, padding: '16px 18px' }}>
          <div style={{ fontSize: 11.5, color: CYAN, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 15 }}>✨</span> AI Weekly Analysis
          </div>
          <ResponsiveContainer width="100%" height={72}>
            <RBarChart data={[{v:65},{v:72},{v:58},{v:84},{v:76},{v:91},{v:88}]} barCategoryGap="20%">
              <Bar dataKey="v" fill={CYAN} radius={[3,3,0,0]} />
            </RBarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            {[['Fitness','92%',G],['Sleep','78%',PURPLE],['Stress','34%',ORANGE],['Heart','88%',RED]].map(([l,v,c],i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: c as string }}>{v}</div>
                <div style={{ fontSize: 9, color: MUTED }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...gl(0.85, 14, 18), padding: '8px 13px', fontSize: 11, fontWeight: 700, color: G, position: 'absolute', top: 12, right: 12, animation: 'float 2.8s ease-in-out infinite' }}>
          🎯 Goal: 95%
        </div>
      </div>
    ),
  },
  {
    title: 'Stay Motivated Together',
    subtitle: "Join challenges, climb leaderboards, and celebrate wins with friends.",
    accentColor: PURPLE,
    illustration: () => (
      <div style={{ position: 'relative', height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', animation: 'float 2.5s ease-in-out infinite', zIndex: 1 }}>
          <div style={{ fontSize: 76 }}>🏆</div>
          <div style={{ ...gl(0.82, 12, 14), padding: '5px 14px', fontSize: 11, fontWeight: 700, color: PURPLE, marginTop: 8 }}>Champion League</div>
        </div>
        <div style={{ position: 'absolute', bottom: 16, display: 'flex', gap: 10 }}>
          {[{e:'👩‍🦱',n:'Ananya',s:'12.4k',c:G},{e:'🧑‍🦰',n:'Rahul',s:'11.8k',c:ORANGE},{e:'👩‍🦳',n:'Priya',s:'10.9k',c:CYAN}].map((u,i) => (
            <div key={i} style={{ ...gl(0.8, 14, 16), padding: '9px 12px', textAlign: 'center', minWidth: 72 }}>
              <div style={{ fontSize: 22 }}>{u.e}</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: TXT2 }}>{u.n}</div>
              <div style={{ fontSize: 10, color: u.c, fontWeight: 700 }}>{u.s}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

export function OnboardingScreen({ slide = 0, onNav }: { slide?: number; onNav?: (s: string) => void }) {
  const [current, setCurrent] = useState(slide)
  const [dir, setDir] = useState<'fwd' | 'bwd'>('fwd')
  const s = SLIDES[current]
  const Illustration = s.illustration

  const go = (next: number, direction: 'fwd' | 'bwd') => {
    setDir(direction)
    setCurrent(next)
  }

  return (
    <div style={{ ...scr, display: 'flex', flexDirection: 'column', padding: '52px 28px 40px', position: 'relative' }}>
      <BgBlobs />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Static skip button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button onClick={() => onNav?.('login')} style={{ background: 'none', border: 'none', color: MUTED, fontSize: 14, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>Skip</button>
        </div>

        {/* Animated slide content — key forces re-mount and re-triggers CSS animation */}
        <div key={current} style={{
          animation: `${dir === 'fwd' ? 'slide-in-right' : 'slide-in-left'} 350ms ease-out both`,
          flex: 1, display: 'flex', flexDirection: 'column',
        }}>
          <Illustration />

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, marginBottom: 24 }}>
            {SLIDES.map((_, i) => (
              <div key={i} onClick={() => go(i, i > current ? 'fwd' : 'bwd')} style={{
                width: i === current ? 28 : 8, height: 8, borderRadius: 4,
                background: i === current ? s.accentColor : 'var(--fp-faint)',
                transition: 'all 0.3s', cursor: 'pointer',
              }} />
            ))}
          </div>

          <h2 style={{ margin: '0 0 10px', fontSize: 28, fontWeight: 800, color: TXT, letterSpacing: -0.5, lineHeight: 1.2 }}>{s.title}</h2>
          <p style={{ margin: '0 0 0', fontSize: 15, color: MUTED, lineHeight: 1.6 }}>{s.subtitle}</p>
        </div>

        {/* Static nav buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
          {current < 2 ? (
            <GBtn onClick={() => go(current + 1, 'fwd')} style={{ background: `linear-gradient(135deg,${s.accentColor},${s.accentColor}cc)`, boxShadow: `0 8px 24px ${s.accentColor}40` }}>Next</GBtn>
          ) : (
            <GBtn onClick={() => onNav?.('login')}>Get Started </GBtn>
          )}
          {current > 0 && <GBtn variant="ghost" onClick={() => go(current - 1, 'bwd')}>Back</GBtn>}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 5 — LOGIN
   ─────────────────────────────────────────────────────────── */
export function LoginScreen({ onNav }: { onNav?: (s: string) => void }) {
  const theme = useTheme()
  return (
    <div style={{ ...scr, display: 'flex', flexDirection: 'column', padding: '52px 24px 40px', alignItems: 'center', position: 'relative' }}>
      <BgBlobs />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Staggered: logo → heading → form → social */}
        <Animated delay={0} style={{ display: 'flex', justifyContent: 'center' }}><Logo size={52} /></Animated>
        <Animated delay={80} style={{ textAlign: 'center', width: '100%' }}>
          <h2 style={{ margin: '14px 0 4px', fontSize: 28, fontWeight: 800, color: TXT, letterSpacing: -0.5 }}>Welcome Back</h2>
          <p style={{ margin: '0 0 28px', color: MUTED, fontSize: 14 }}>Sign in to your FitPulse account</p>
        </Animated>

        <Animated delay={180} style={{ width: '100%' }}>
          <div style={{ ...gl(0.82, 26, 26), padding: '26px 22px', width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
            <FInput placeholder="Email address" type="email" icon="📧" />
            <FInput placeholder="Password" type="password" icon="🔒" />
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <button style={{ background: 'none', border: 'none', color: G, fontSize: 13, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>Forgot Password?</button>
            </div>
            <GBtn onClick={() => onNav?.('home')}>Sign In</GBtn>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--fp-field)' }} />
              <span style={{ color: MUTED, fontSize: 12 }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'var(--fp-field)' }} />
            </div>

            {[
              { iconSrc: googleLogo, name: 'Google' },
              { iconSrc: appleLogo, name: 'Apple' },
            ].map(b => (
              <button key={b.name} aria-label={`Continue with ${b.name}`} style={{
                ...gl(0.7, 14, 14), width: '100%', padding: '10px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', marginBottom: 10,
                border: `1px solid ${SOFT}`,
              }}>
                <img src={b.iconSrc} alt="" style={{ width: 40, height: 35, objectFit: 'contain', filter: b.name === 'Apple' && theme === 'dark' ? 'invert(1) brightness(0.9)' : undefined }} />
              </button>
            ))}
          </div>
        </Animated>

        <Animated delay={280} style={{ width: '100%', textAlign: 'center' }}>
          <p style={{ marginTop: 22, color: MUTED, fontSize: 14 }}>
            New here?{' '}
            <button onClick={() => onNav?.('signup')} style={{ background: 'none', border: 'none', color: G, fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>
              Create Account
            </button>
          </p>
        </Animated>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 6 — SIGN UP
   ─────────────────────────────────────────────────────────── */
export function SignUpScreen({ onNav }: { onNav?: (s: string) => void }) {
  return (
    <div style={{ ...scr, display: 'flex', flexDirection: 'column', padding: '52px 24px 40px', alignItems: 'center', position: 'relative' }}>
      <BgBlobs />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Animated delay={0} style={{ display: 'flex', justifyContent: 'center' }}><Logo size={52} /></Animated>
        <Animated delay={80} style={{ textAlign: 'center', width: '100%' }}>
          <h2 style={{ margin: '14px 0 4px', fontSize: 28, fontWeight: 800, color: TXT, letterSpacing: -0.5 }}>Create Account</h2>
          <p style={{ margin: '0 0 24px', color: MUTED, fontSize: 14 }}>Start your fitness journey today</p>
        </Animated>

        <Animated delay={180} style={{ width: '100%' }}>
          <div style={{ ...gl(0.82, 26, 26), padding: '24px 22px', width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
            <FInput placeholder="Full Name" icon="👤" />
            <FInput placeholder="Email address" type="email" icon="📧" />
            <FInput placeholder="Password" type="password" icon="🔒" />
            <FInput placeholder="Confirm Password" type="password" icon="✅" />
            <GBtn onClick={() => onNav?.('profile-setup')} style={{ marginTop: 8 }}>Create Account 🎉</GBtn>
          </div>
        </Animated>

        <Animated delay={280} style={{ width: '100%', textAlign: 'center' }}>
          <p style={{ marginTop: 20, color: MUTED, fontSize: 14 }}>
            Already have an account?{' '}
            <button onClick={() => onNav?.('login')} style={{ background: 'none', border: 'none', color: G, fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: "'Outfit', sans-serif" }}>
              Sign In
            </button>
          </p>
        </Animated>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 7 — PROFILE SETUP
   ─────────────────────────────────────────────────────────── */
export function ProfileSetupScreen({ onNav }: { onNav?: (s: string) => void }) {
  const [level, setLevel] = useState('intermediate')

  return (
    <div style={{ ...scr, padding: '52px 24px 40px', position: 'relative' }}>
      <BgBlobs />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, color: TXT }}>Set Up Profile</h2>
          <p style={{ margin: 0, color: MUTED, fontSize: 14 }}>Help us personalize your experience</p>
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 84, height: 84, borderRadius: '50%',
              background: `linear-gradient(135deg,${G},${CYAN})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 38, boxShadow: `0 0 0 4px white, 0 0 0 6px ${G}35`,
            }}>👩‍🦱</div>
            <div style={{
              position: 'absolute', bottom: 2, right: 2, width: 24, height: 24,
              borderRadius: '50%', background: G, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>📷</div>
          </div>
        </div>

        <div style={{ ...gl(0.78, 20, 22), padding: '18px 18px', marginBottom: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
          {[
            { placeholder: 'Full Name', icon: '👤' },
            { placeholder: 'Age', icon: '🎂', type: 'number' },
            { placeholder: 'Height (cm)', icon: '📏', type: 'number' },
            { placeholder: 'Weight (kg)', icon: '⚖️', type: 'number' },
          ].map((f, i) => <FInput key={i} {...f} />)}

          <div style={{ marginBottom: 4 }}>
            <label style={{ fontSize: 11.5, color: MUTED, marginBottom: 6, display: 'block', fontWeight: 600 }}>Gender</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Male', 'Female', 'Other'].map(g => (
                <button key={g} style={{
                  ...gl(0.7, 12, 12), flex: 1, padding: '11px 0', fontSize: 13, fontWeight: 600,
                  color: TXT2, cursor: 'pointer', border: `1px solid ${SOFT}`,
                  fontFamily: "'Outfit', sans-serif",
                }}>{g}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Fitness Level</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { id: 'beginner', label: '🌱 Beginner', color: LIME },
              { id: 'intermediate', label: '⚡ Intermediate', color: CYAN },
              { id: 'advanced', label: '🔥 Advanced', color: ORANGE },
            ].map(lv => (
              <button key={lv.id} onClick={() => setLevel(lv.id)} style={{
                flex: 1, padding: '13px 4px', borderRadius: 14, fontSize: 11, fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'all 0.2s',
                background: level === lv.id ? `${lv.color}18` : 'rgba(255,255,255,0.7)',
                border: `1.5px solid ${level === lv.id ? lv.color : 'var(--fp-field)'}`,
                color: level === lv.id ? lv.color : MUTED,
                boxShadow: level === lv.id ? `0 4px 14px ${lv.color}30` : 'none',
              }}>{lv.label}</button>
            ))}
          </div>
        </div>

        <GBtn onClick={() => onNav?.('device-sync')}>Next</GBtn>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 8 — DEVICE SYNC
   ─────────────────────────────────────────────────────────── */
type SyncSt = 'idle' | 'searching' | 'found' | 'connecting' | 'syncing' | 'connected'

const SYNC_LABELS: Record<SyncSt, string> = {
  idle: 'Tap a device to connect',
  searching: '🔍 Searching...',
  found: '📡 Device Found!',
  connecting: '🔗 Connecting...',
  syncing: '⚡ Syncing...',
  connected: '✅ Connected!',
}

export function DeviceSyncScreen({ onNav }: { onNav?: (s: string) => void }) {
  const [syncSt, setSyncSt] = useState<SyncSt>('idle')
  const [syncDevice, setSyncDevice] = useState<number | null>(null)
  const [syncPct, setSyncPct] = useState(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const devices = [
    { icon: '⌚', name: 'Apple Watch', sub: 'Series 9' },
    { icon: '⌚', name: 'Samsung Watch', sub: 'Galaxy 6' },
    { icon: '🏃', name: 'Fitbit', sub: 'Charge 6' },
    { icon: '🗺️', name: 'Garmin', sub: 'Forerunner 265' },
    { icon: '📱', name: 'Mi Band', sub: 'Band 8 Pro' },
    { icon: '⌚', name: 'Smartwatch', sub: 'Generic BLE' },
  ]

  const startSync = (i: number) => {
    if (syncSt === 'searching' || syncSt === 'connecting' || syncSt === 'syncing') return
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setSyncDevice(i)
    setSyncPct(0)
    setSyncSt('searching')
    timersRef.current.push(setTimeout(() => setSyncSt('found'), 700))
    timersRef.current.push(setTimeout(() => setSyncSt('connecting'), 1500))
    timersRef.current.push(setTimeout(() => setSyncSt('syncing'), 2300))
    timersRef.current.push(setTimeout(() => { setSyncSt('connected'); setSyncPct(100) }, 3400))
  }

  useEffect(() => {
    if (syncSt !== 'syncing') return
    setSyncPct(0)
    let pct = 0
    const iv = setInterval(() => {
      pct = Math.min(100, pct + 5)
      setSyncPct(pct)
      if (pct >= 100) clearInterval(iv)
    }, 55)
    return () => clearInterval(iv)
  }, [syncSt])

  useEffect(() => () => { timersRef.current.forEach(clearTimeout) }, [])

  const isConnected = syncSt === 'connected'
  const statusColor = isConnected ? G : syncSt === 'idle' ? MUTED : CYAN

  return (
    <div style={{ ...scr, padding: '52px 22px 40px', position: 'relative' }}>
      <BgBlobs />
      {/* BT rings */}
      <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)' }}>
        {[70, 110, 150].map((r, i) => (
          <div key={i} style={{
            position: 'absolute', left: -(r/2), top: -(r/2),
            width: r, height: r, borderRadius: '50%',
            border: `1.5px solid ${CYAN}${['55','30','18'][i]}`,
            animation: `ring-pulse ${1.5 + i * 0.5}s ease-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }} />
        ))}
        <div style={{ fontSize: 30 }}>🔵</div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: 110 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, color: TXT }}>Connect Device</h2>
        <p style={{ margin: '0 0 14px', color: MUTED, fontSize: 14 }}>Pair your tracker for complete health sync</p>

        {/* Status strip */}
        <div style={{ ...gl(0.82, 16, 14), padding: '10px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${statusColor}30` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: statusColor, flex: 1 }}>{SYNC_LABELS[syncSt]}</div>
          {(syncSt === 'syncing') && (
            <div style={{ fontSize: 12, fontWeight: 700, color: CYAN }}>{syncPct}%</div>
          )}
        </div>

        {/* Progress bar */}
        {syncSt !== 'idle' && (
          <div style={{ height: 4, borderRadius: 2, background: 'var(--fp-field)', marginBottom: 16, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: isConnected ? `linear-gradient(90deg,${G},${LIME})` : `linear-gradient(90deg,${CYAN},${G})`,
              width: `${syncPct}%`,
              transition: 'width 0.15s ease-out',
              boxShadow: `0 0 8px ${isConnected ? G : CYAN}60`,
            }} />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 26 }}>
          {devices.map((d, i) => {
            const active = syncDevice === i && isConnected
            return (
              <button key={i} onClick={() => startSync(i)} style={{
                ...gl(active ? 0.92 : 0.72, 16, 18), padding: '16px 14px', textAlign: 'left',
                cursor: 'pointer', border: `1.5px solid ${active ? G : SOFT}`,
                fontFamily: "'Outfit', sans-serif", transition: 'all 0.22s',
                boxShadow: active ? `0 4px 20px ${G}30` : '0 2px 10px rgba(0,0,0,0.05)',
                transform: active ? 'scale(1.02)' : 'scale(1)',
              }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{d.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>{d.name}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{d.sub}</div>
                {syncDevice === i && syncSt !== 'idle' && (
                  <div style={{ fontSize: 10, color: isConnected ? G : CYAN, marginTop: 4, fontWeight: 700 }}>
                    {isConnected ? '✓ Connected' : SYNC_LABELS[syncSt].replace(/[^a-zA-Z .!]/g, '')}
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <GBtn onClick={() => onNav?.('goals')}>{isConnected ? 'Continue' : 'Skip for Now'}</GBtn>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 9 — GOAL SELECTION
   ─────────────────────────────────────────────────────────── */
export function GoalSelectionScreen({ onNav }: { onNav?: (s: string) => void }) {
  const [selected, setSelected] = useState<number[]>([2])

  const goals = [
    { icon: '⚖️', title: 'Lose Weight', sub: 'Burn fat & slim down', color: ORANGE },
    { icon: '💪', title: 'Build Muscle', sub: 'Gain strength & mass', color: CYAN },
    { icon: '🏃', title: 'Stay Active', sub: '10k+ steps every day', color: G },
    { icon: '❤️', title: 'Improve Cardio', sub: 'Boost endurance', color: RED },
    { icon: '🥗', title: 'Healthy Lifestyle', sub: 'Balanced wellness', color: PURPLE },
  ]

  const toggle = (i: number) => setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  return (
    <div style={{ ...scr, padding: '52px 22px 40px', position: 'relative' }}>
      <BgBlobs />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 800, color: TXT }}>What's Your Goal?</h2>
        <p style={{ margin: '0 0 24px', color: MUTED, fontSize: 14 }}>Select all that apply — you can change later</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {goals.map((g, i) => {
            const on = selected.includes(i)
            return (
              <button key={i} onClick={() => toggle(i)} style={{
                ...gl(on ? 0.9 : 0.7, 18, 20), padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', border: `1.5px solid ${on ? g.color : SOFT}`,
                fontFamily: "'Outfit', sans-serif", textAlign: 'left',
                transition: 'all 220ms cubic-bezier(0.34,1.36,0.64,1)',
                boxShadow: on ? `0 4px 20px ${g.color}25` : '0 2px 10px rgba(0,0,0,0.05)',
                transform: on ? 'scale(1.03)' : 'scale(1)',
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 15,
                  background: `${g.color}15`, border: `1px solid ${g.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, flexShrink: 0,
                }}>{g.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: TXT }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{g.sub}</div>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: on ? G : 'var(--fp-track)',
                  border: `2px solid ${on ? G : 'var(--fp-field)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: 'white', flexShrink: 0, transition: 'all 0.2s',
                  boxShadow: on ? `0 2px 8px ${G}50` : 'none',
                }}>{on && '✓'}</div>
              </button>
            )
          })}
        </div>

        <GBtn onClick={() => onNav?.('permissions')}>Continue ({selected.length} selected)</GBtn>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 10 — PERMISSIONS
   ─────────────────────────────────────────────────────────── */
export function PermissionsScreen({ onNav }: { onNav?: (s: string) => void }) {
  const [perms, setPerms] = useState({ notif: true, health: true, location: false, bt: true })
  const toggle = (k: string) => setPerms(p => ({ ...p, [k]: !(p as any)[k] }))

  const items = [
    { key: 'notif', icon: '🔔', title: 'Notifications', sub: 'Reminders, achievements & challenges', color: ORANGE },
    { key: 'health', icon: '❤️', title: 'Health Data', sub: 'Steps, heart rate & sleep tracking', color: RED },
    { key: 'location', icon: '📍', title: 'Location', sub: 'Route mapping & outdoor workouts', color: G },
    { key: 'bt', icon: '🔵', title: 'Bluetooth', sub: 'Connect wearables & smart devices', color: CYAN },
  ]

  return (
    <div style={{ ...scr, padding: '52px 24px 40px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <BgBlobs />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 54, marginBottom: 12 }}>📱</div>
          <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: TXT }}>Enable Permissions</h2>
          <p style={{ margin: 0, color: MUTED, fontSize: 14, lineHeight: 1.55 }}>
            FitPulse needs these to deliver the full experience
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {items.map(it => (
            <div key={it.key} style={{ ...gl(0.8, 18, 18), padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14,
                background: `${it.color}15`, border: `1px solid ${it.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>{it.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: TXT }}>{it.title}</div>
                <div style={{ fontSize: 12, color: MUTED }}>{it.sub}</div>
              </div>
              <Toggle on={(perms as any)[it.key]} onToggle={() => toggle(it.key)} />
            </div>
          ))}
        </div>

        <GBtn onClick={() => onNav?.('home')} style={{ marginTop: 'auto' }}>Finish Setup 🎉</GBtn>
        <GBtn variant="ghost" onClick={() => onNav?.('home')} style={{ marginTop: 8 }}>Skip for now</GBtn>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 11 — HOME DASHBOARD
   ─────────────────────────────────────────────────────────── */
/* Notification panel — slides down from top of home screen */
function NotificationPanel({ onClose }: { onClose: () => void }) {
  const theme = useTheme()
  const items = [
    { icon: '🏆', title: 'Challenge Complete!', msg: 'You finished the Weekly 70K Steps challenge.', time: '2m ago', color: ORANGE },
    { icon: '👥', title: 'Rahul liked your post', msg: '"5K personal best" got 14 reactions!', time: '18m ago', color: G },
    { icon: '🎯', title: 'Daily Goal Reached', msg: 'You hit 10,000 steps today. Keep it up!', time: '1h ago', color: CYAN },
    { icon: '❤️', title: 'Heart Rate Alert', msg: 'Resting HR improved: 72 → 68 BPM this week.', time: '3h ago', color: RED },
  ]
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 19, background: 'rgba(0,0,0,0.08)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, animation: 'fade-slide-up 260ms ease-out both' }}>
        <div style={{ ...gl(0.97, 30, 0), background: theme === 'dark' ? 'rgba(10,16,28,0.94)' : 'rgba(255,255,255,0.96)', borderRadius: '0 0 28px 28px', padding: '52px 18px 20px', boxShadow: '0 12px 48px rgba(0,0,0,0.14)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: TXT }}>Notifications</div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUTED, fontSize: 13, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>Clear all</button>
          </div>
          {items.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: i < items.length - 1 ? '1px solid var(--fp-track)' : 'none', animation: `fade-slide-up 300ms ease-out ${i * 60}ms both` }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: `${n.color}15`, border: `1px solid ${n.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>{n.title}</div>
                <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.4, marginTop: 2 }}>{n.msg}</div>
              </div>
              <div style={{ fontSize: 10, color: MUTED, fontWeight: 500, flexShrink: 0, paddingTop: 3 }}>{n.time}</div>
            </div>
          ))}
          <button onClick={onClose} style={{ ...gl(0.75, 12, 12), width: '100%', padding: '10px 0', marginTop: 12, fontSize: 13, fontWeight: 700, color: G, border: `1px solid ${G}30`, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>View All Notifications</button>
        </div>
      </div>
    </>
  )
}

export function HomeScreen({ onNav }: { onNav?: (s: string) => void }) {
  const [fab, setFab] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const stepCount = useCountUp(12847, 1400, 400)
  const stepsData = [{ v: 6200 }, { v: 8100 }, { v: 7400 }, { v: 9800 }, { v: 8600 }, { v: 11200 }, { v: 12847 }]

  return (
    <div style={{ ...scr, overflow: 'hidden' }}>
      <BgBlobs />
      {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
      <div style={{ ...innerScroll(), padding: '50px 18px 16px' }}>
        {/* 1 - Status bar */}
        <Animated delay={0}>
          <StatusBar />
        </Animated>

        {/* 2 - Header / profile */}
        <Animated delay={60}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg,${G},${CYAN})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, boxShadow: `0 4px 14px ${G}40` }}>👩‍🦱</div>
              <div>
                <div style={{ fontSize: 12, color: MUTED }}>Good Morning 👋</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: TXT }}>Ananya</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ ...gl(0.82, 12, 14), padding: '5px 10px', fontSize: 11, fontWeight: 700, color: ORANGE, display: 'flex', alignItems: 'center', gap: 4 }}>
                🔥 <span>14 streak</span>
              </div>
              <div
              onClick={() => setNotifOpen(n => !n)}
              style={{ ...gl(0.82, 12, 12), width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, cursor: 'pointer', position: 'relative', transition: 'transform 150ms' }}
            >
              🔔
              <div style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: '50%', background: RED, color: 'white', fontSize: 8, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white', lineHeight: 1 }}>4</div>
            </div>
            </div>
          </div>
        </Animated>

        {/* 3 - Steps hero card — count-up animation */}
        <Animated delay={160}>
          <div style={{ ...gl(0.85, 22, 22), padding: '18px 18px 14px', marginBottom: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 1, fontWeight: 600 }}>{"Today's Steps"}</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: TXT, letterSpacing: -1 }}>
                  {stepCount.toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: G, fontWeight: 700 }}>↑ 28% vs yesterday</div>
              </div>
              <Tag color={G}>128% Goal</Tag>
            </div>
            <ResponsiveContainer width="100%" height={58}>
              <RBarChart data={stepsData} barGap={3} barCategoryGap="18%">
                <Bar dataKey="v" radius={[4,4,0,0]} isAnimationActive={true} animationDuration={900} animationEasing="ease-out">
                  {stepsData.map((_, i) => <Cell key={i} fill={i === 6 ? G : `${G}45`} />)}
                </Bar>
              </RBarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <span key={i} style={{ fontSize: 10, color: i === 6 ? G : MUTED, fontWeight: i === 6 ? 700 : 400, flex: 1, textAlign: 'center' }}>{d}</span>
              ))}
            </div>
          </div>
        </Animated>

        {/* 4 - Stats row 1: heart + calories */}
        <Animated delay={260}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ ...gl(0.8, 18, 18), padding: '14px 12px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${RED}15`, border: `1px solid ${RED}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>
                  <span style={{ animation: 'hr-pulse 1.2s ease-in-out infinite', display: 'inline-block' }}>❤️</span>
                </div>
              </div>
              <div style={{ fontSize: 10.5, color: MUTED, fontWeight: 600, marginBottom: 2 }}>Heart Rate</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: TXT, lineHeight: 1.1 }}>72 <span style={{ fontSize: 11, fontWeight: 500, color: MUTED }}>BPM</span></div>
              <div style={{ fontSize: 10, color: MUTED, marginTop: 3 }}>Resting · Normal</div>
            </div>
            <StatCard icon="🔥" label="Calories" value="1,847" unit="kcal" color={ORANGE} sub="482 remaining" />
          </div>
        </Animated>

        {/* 5 - Stats row 2: water + sleep + stress */}
        <Animated delay={340}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <StatCard icon="💧" label="Water" value="1.8" unit="L" color={CYAN} sub="Goal: 2.5L" />
            <StatCard icon="😴" label="Sleep" value="7.4" unit="hrs" color={PURPLE} sub="Deep 2.1h" />
            <StatCard icon="🧠" label="Stress" value="Low" unit="" color={LIME} sub="Score 24/100" />
          </div>
        </Animated>

        {/* 6 - AI Insights */}
        <Animated delay={430}>
          <div style={{
            ...gl(0.82, 22, 20), padding: '16px 18px', marginBottom: 12,
            background: 'rgba(255,255,255,0.78)',
            borderLeft: `4px solid ${G}`,
            boxShadow: `0 4px 20px ${G}15`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20, animation: 'spin 8s linear infinite', display: 'inline-block' }}>✨</span>
              <div style={{ fontSize: 14, fontWeight: 700, color: TXT }}>AI Insights</div>
              <Tag color={CYAN}>New</Tag>
            </div>
            {[
              "Great progress this week! Hit step goal 5 days in a row.",
              "Heart rate improved by 8% — cardio sessions are working!",
              "Consider a rest day — recovery maximizes muscle gains.",
            ].map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'flex-start', animation: `fade-slide-up 300ms ease-out ${500 + i * 80}ms both` }}>
                <span style={{ fontSize: 12, color: G, marginTop: 2 }}>●</span>
                <p style={{ margin: 0, fontSize: 12.5, color: TXT2, lineHeight: 1.5 }}>{msg}</p>
              </div>
            ))}
          </div>
        </Animated>

        {/* 7 - Community / quick-actions */}
        <Animated delay={520}>
          <div style={{ ...gl(0.8, 18, 20), padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TXT }}>🏆 Weekly Challenge</div>
              <Tag color={ORANGE}>3 days left</Tag>
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>10,000 Steps Every Day</div>
            <div style={{ height: 6, borderRadius: 3, background: 'var(--fp-track)', marginBottom: 6 }}>
              <div style={{ width: '72%', height: '100%', borderRadius: 3, background: `linear-gradient(90deg,${G},${LIME})` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: MUTED, fontWeight: 500 }}>72% completed</span>
              <span style={{ color: G, fontWeight: 700 }}>1,247 participants</span>
            </div>
          </div>
        </Animated>

        {/* 8 - Workout nav button */}
        <Animated delay={600}>
          <button onClick={() => onNav?.('workouts')} style={{
            ...gl(0.82, 16, 18), width: '100%', padding: '14px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: `1px solid ${G}30`, cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
            boxShadow: `0 4px 16px ${G}15`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: `${G}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏋️</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: TXT }}>Start Workout</div>
                <div style={{ fontSize: 11, color: MUTED }}>Today: Upper body strength</div>
              </div>
            </div>
            <span style={{ fontSize: 18, color: G }}>›</span>
          </button>
        </Animated>

        <div style={{ height: 88 }} />
      </div>

      {/* FAB — radial menu */}
      <div style={{ position: 'absolute', bottom: 96, right: 18, zIndex: 10 }}>
        {fab && (
          <div style={{ position: 'absolute', bottom: 58, right: 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            {[
              { icon: '🍎', label: 'Log Meal', nav: 'activity' },
              { icon: '🏋️', label: 'Log Workout', nav: 'workouts' },
              { icon: '💧', label: 'Add Water', nav: 'activity' },
            ].map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                animation: `fade-slide-up 250ms ease-out ${i * 60}ms both`,
              }}>
                <button onClick={() => { setFab(false); onNav?.(a.nav) }} style={{
                  ...gl(0.92, 16, 12), padding: '7px 14px', fontSize: 12, fontWeight: 700, color: TXT,
                  border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}>{a.label}</button>
                <div style={{ ...gl(0.92, 16, 22), width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>{a.icon}</div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setFab(f => !f)} style={{
          width: 52, height: 52, borderRadius: '50%',
          background: `linear-gradient(135deg,${G},#15803d)`,
          border: 'none', cursor: 'pointer', fontSize: 24, color: 'white',
          boxShadow: `0 8px 24px ${G}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 250ms cubic-bezier(0.34,1.36,0.64,1)',
          transform: fab ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>+</button>
      </div>

      <BottomNav active="home" onNav={onNav} />
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 12 — WORKOUTS
   ─────────────────────────────────────────────────────────── */
export function WorkoutsScreen({ onNav }: { onNav?: (s: string) => void }) {
  const [active, setActive] = useState(false)

  const categories = [
    { icon: '🏃', name: 'Running', cal: '450 kcal', color: ORANGE },
    { icon: '🚶', name: 'Walking', cal: '180 kcal', color: G },
    { icon: '🚴', name: 'Cycling', cal: '380 kcal', color: CYAN },
    { icon: '🧘', name: 'Yoga', cal: '200 kcal', color: PURPLE },
    { icon: '🏋️', name: 'Strength', cal: '320 kcal', color: RED },
    { icon: '⚡', name: 'HIIT', cal: '580 kcal', color: PINK },
  ]

  return (
    <div style={{ ...scr, overflow: 'hidden' }}>
      <BgBlobs />
      <div style={{ ...innerScroll(), padding: '52px 18px 16px' }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <button onClick={() => onNav?.('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 26, color: G, padding: 0, lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>‹</button>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: TXT }}>Workouts</h2>
        </div>
        <p style={{ margin: '0 0 12px', color: MUTED, fontSize: 14 }}>Choose your session</p>

        {/* Search bar */}
        <div style={{ ...gl(0.8, 16, 14), display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', marginBottom: 18, border: `1px solid ${SOFT}` }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <span style={{ fontSize: 13.5, color: MUTED, fontWeight: 500 }}>Search workouts...</span>
        </div>

        {active && (
          <div style={{
            ...gl(0.88, 22, 22), padding: '18px', marginBottom: 20,
            border: `1.5px solid ${G}40`,
            boxShadow: `0 8px 32px ${G}20`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: G }}>🏃 Running · Active</div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: G, boxShadow: `0 0 8px ${G}`, animation: 'pulse-glow 1.5s infinite' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 16 }}>
              {[{ l: 'Duration', v: '24:38' }, { l: 'Calories', v: '287 kcal' }, { l: 'Distance', v: '3.2 km' }, { l: 'Pace', v: '7.8/km' }].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: TXT }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: MUTED }}>{s.l}</div>
                </div>
              ))}
            </div>
            <GBtn onClick={() => setActive(false)} style={{ background: `linear-gradient(135deg,${RED},#b91c1c)`, boxShadow: `0 4px 16px ${RED}40` }}>⏹ Stop Workout</GBtn>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          {categories.map((c, i) => (
            <button key={i} onClick={() => setActive(true)} style={{
              ...gl(0.78, 16, 18), padding: '16px 14px', textAlign: 'left',
              cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              transition: 'all 0.18s', border: `1px solid ${SOFT}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>{c.name}</div>
              <div style={{ fontSize: 11, color: c.color, fontWeight: 700, marginTop: 2 }}>~{c.cal}</div>
            </button>
          ))}
        </div>

        <div style={{ ...gl(0.78, 16, 18), padding: '14px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TXT, marginBottom: 12 }}>Recent Workouts</div>
          {[
            { icon: '🏃', name: 'Morning Run', time: 'Today 7:20 AM', cal: '412 kcal', dur: '38 min' },
            { icon: '🏋️', name: 'Upper Body', time: 'Yesterday', cal: '298 kcal', dur: '52 min' },
            { icon: '🧘', name: 'Yoga Flow', time: '2 days ago', cal: '145 kcal', dur: '30 min' },
          ].map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, paddingBottom: i < 2 ? 11 : 0, borderBottom: i < 2 ? `1px solid var(--fp-track)` : 'none', marginBottom: i < 2 ? 11 : 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>{w.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TXT }}>{w.name}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{w.time}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: ORANGE }}>{w.cal}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{w.dur}</div>
              </div>
            </div>
          ))}
        </div>

        {!active && <GBtn onClick={() => setActive(true)} style={{ marginTop: 18 }}>▶ Start Workout</GBtn>}
        <div style={{ height: 8 }} />
      </div>

      <BottomNav active="home" onNav={onNav} />
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 13 — ACTIVITY LOG
   ─────────────────────────────────────────────────────────── */
function WaterTab() {
  const [glasses, setGlasses] = useState(5)
  const totalGlasses = 8
  const liters = (glasses * 250 / 1000).toFixed(1)
  const pct = Math.round((glasses / totalGlasses) * 100)

  return (
    <div style={{ ...gl(0.85, 20, 22), padding: '22px' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: CYAN, letterSpacing: -1 }}>{liters}L</div>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>of 2.0L daily goal</div>
        <Tag color={pct >= 100 ? G : CYAN}>{pct}% completed</Tag>
      </div>

      {/* Animated water bottle */}
      <div style={{ position: 'relative', width: 70, height: 120, margin: '0 auto 20px', border: `2.5px solid ${CYAN}50`, borderRadius: '8px 8px 14px 14px', overflow: 'hidden', background: '#F0FDFF' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${pct}%`, background: `linear-gradient(0deg,${CYAN}90,${CYAN}50)`, transition: 'height 0.5s ease-out', borderRadius: '0 0 12px 12px' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, zIndex: 1 }}>💧</div>
      </div>

      {/* Tap to log glasses */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
        {Array.from({ length: totalGlasses }, (_, i) => (
          <button key={i} onClick={() => setGlasses(i + 1)} style={{
            width: 36, height: 36, borderRadius: 10, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: i < glasses ? `${CYAN}18` : 'var(--fp-input-bg)',
            border: `1.5px solid ${i < glasses ? CYAN + '55' : 'var(--fp-field)'}`,
            cursor: 'pointer',
            transition: 'all 200ms ease-out',
            transform: i < glasses ? 'scale(1.05)' : 'scale(1)',
          }}>💧</button>
        ))}
      </div>
      <div style={{ fontSize: 11, color: MUTED, textAlign: 'center', marginBottom: 16 }}>Tap a glass to log intake</div>
      <GBtn onClick={() => setGlasses(g => Math.min(totalGlasses, g + 1))} style={{ background: `linear-gradient(135deg,${CYAN},#0e7490)`, boxShadow: `0 8px 24px ${CYAN}35` }}>+ Add Glass (250ml)</GBtn>
    </div>
  )
}

export function ActivityLogScreen({ onNav }: { onNav?: (s: string) => void }) {
  const [tab, setTab] = useState('steps')

  const tabs = [
    { id: 'steps', label: '👟 Steps' },
    { id: 'heart', label: '❤️ Heart' },
    { id: 'calories', label: '🔥 Calories' },
    { id: 'sleep', label: '😴 Sleep' },
    { id: 'stress', label: '🧠 Stress' },
    { id: 'water', label: '💧 Water' },
  ]

  const stepData = [
    { d: 'Mon', v: 8200 }, { d: 'Tue', v: 6100 }, { d: 'Wed', v: 9800 },
    { d: 'Thu', v: 7400 }, { d: 'Fri', v: 11200 }, { d: 'Sat', v: 10400 }, { d: 'Sun', v: 12847 },
  ]

  const hrData = Array.from({ length: 20 }, (_, i) => ({
    h: `${6 + i}h`, v: 58 + Math.round(Math.sin(i * 0.5) * 18 + (i % 3) * 6),
  }))

  const sleepData = [
    { name: 'Light', value: 2.8, fill: CYAN },
    { name: 'Deep', value: 2.1, fill: PURPLE },
    { name: 'REM', value: 1.6, fill: G },
    { name: 'Awake', value: 0.9, fill: ORANGE },
  ]

  return (
    <div style={{ ...scr, overflow: 'hidden' }}>
      <BgBlobs />
      <div style={{ ...innerScroll(), padding: '52px 0 16px' }}>
      <div style={{ padding: '0 18px', marginBottom: 16 }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <button onClick={() => onNav?.('progress')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 26, color: G, padding: 0, lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>‹</button>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: TXT }}>Activity Log</h2>
        </div>
        <p style={{ margin: 0, color: MUTED, fontSize: 14 }}>Detailed health analytics</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, padding: '0 18px', overflowX: 'auto', marginBottom: 18, scrollbarWidth: 'none', position: 'relative', zIndex: 1 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            ...gl(tab === t.id ? 0.92 : 0.65, 14, 22),
            padding: '8px 14px', whiteSpace: 'nowrap', fontSize: 12, fontWeight: 700,
            color: tab === t.id ? G : MUTED,
            border: `1.5px solid ${tab === t.id ? G : SOFT}`,
            cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
            transition: 'all 0.2s', flexShrink: 0,
            boxShadow: tab === t.id ? `0 2px 12px ${G}25` : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: '0 18px', position: 'relative', zIndex: 1 }}>
        {tab === 'steps' && (
          <>
            <div style={{ ...gl(0.85, 20, 22), padding: '18px', marginBottom: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>Today</div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: TXT, letterSpacing: -1 }}>12,847</div>
                  <Tag color={G}>↑ 28% vs avg</Tag>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: MUTED }}>Goal</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: TXT }}>10,000</div>
                  <div style={{ fontSize: 11, color: G, fontWeight: 700 }}>128%</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={90}>
                <RBarChart data={stepData} barCategoryGap="22%">
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: MUTED, fontSize: 10 }} />
                  <Bar dataKey="v" radius={[5,5,0,0]} isAnimationActive={true} animationDuration={1000} animationEasing="ease-out">
                    {stepData.map((_,i) => <Cell key={i} fill={i === 6 ? G : `${G}55`} />)}
                  </Bar>
                  <Tooltip contentStyle={{ background: 'var(--fp-surface)', border: '1px solid var(--fp-field)', borderRadius: 8, fontSize: 11, color: TXT }} />
                </RBarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ l: 'Avg Daily', v: '9,840', c: G }, { l: 'Best Day', v: '14,200', c: LIME }, { l: 'This Week', v: '65,947', c: CYAN }].map((s, i) => (
                <div key={i} style={{ ...gl(0.8, 14, 14), padding: '12px 10px', flex: 1, textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 9.5, color: MUTED, fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'heart' && (
          <>
            <div style={{ ...gl(0.85, 20, 22), padding: '18px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>Current</div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: TXT }}>72 <span style={{ fontSize: 14, color: MUTED }}>BPM</span></div>
                  <Tag color={G}>Normal Zone</Tag>
                </div>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${RED}12`, border: `2px solid ${RED}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, animation: 'pulse-glow 1.2s ease-in-out infinite' }}>❤️</div>
              </div>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={hrData}>
                  <defs>
                    <linearGradient id="hrG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={RED} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={RED} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={RED} fill="url(#hrG)" strokeWidth={2.5} dot={false} />
                  <Tooltip contentStyle={{ background: 'var(--fp-surface)', border: '1px solid var(--fp-field)', borderRadius: 8, fontSize: 11, color: TXT }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ l: 'Resting', v: '58 BPM', c: G }, { l: 'Average', v: '72 BPM', c: RED }, { l: 'Max Today', v: '142 BPM', c: ORANGE }].map((s, i) => (
                <div key={i} style={{ ...gl(0.8, 14, 14), padding: '12px 8px', flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 9.5, color: MUTED }}>{s.l}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'calories' && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              {[{ l: 'Consumed', v: '1,847', c: ORANGE, icon: '🍽️' }, { l: 'Burned', v: '682', c: G, icon: '🔥' }].map((s, i) => (
                <div key={i} style={{ ...gl(0.85, 18, 20), padding: '16px', flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{s.l} kcal</div>
                </div>
              ))}
            </div>
            <div style={{ ...gl(0.82, 18, 18), padding: '16px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TXT, marginBottom: 12 }}>Nutrition Breakdown</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <PieChart width={96} height={96}>
                  <Pie data={[{v:45},{v:30},{v:25}]} cx={48} cy={48} innerRadius={26} outerRadius={46} dataKey="v" paddingAngle={3}>
                    {[ORANGE, CYAN, PURPLE].map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                </PieChart>
                <div>
                  {[{ l: 'Carbs', v: '45%', c: ORANGE }, { l: 'Protein', v: '30%', c: CYAN }, { l: 'Fat', v: '25%', c: PURPLE }].map((n, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: n.c, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, color: TXT2, fontWeight: 500 }}>{n.l}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: n.c, marginLeft: 'auto' }}>{n.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'sleep' && (
          <>
            <div style={{ ...gl(0.85, 20, 22), padding: '18px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>Last Night</div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: TXT }}>7h 24m</div>
                  <Tag color={G}>Good Sleep</Tag>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, color: MUTED }}>
                  <div style={{ fontWeight: 600 }}>Bedtime 10:42 PM</div>
                  <div>Woke 6:06 AM</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={80}>
                <RBarChart data={sleepData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: MUTED, fontSize: 11 }} width={40} />
                  <Bar dataKey="value" radius={[0,6,6,0]}>
                    {sleepData.map((s, i) => <Cell key={i} fill={s.fill} />)}
                  </Bar>
                  <Tooltip contentStyle={{ background: 'var(--fp-surface)', border: '1px solid var(--fp-field)', borderRadius: 8, fontSize: 11 }} />
                </RBarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ l: 'Deep Sleep', v: '2h 6m', c: PURPLE }, { l: 'REM Sleep', v: '1h 36m', c: G }, { l: 'Sleep Score', v: '84/100', c: CYAN }].map((s, i) => (
                <div key={i} style={{ ...gl(0.8, 12, 14), padding: '11px 8px', flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 9.5, color: MUTED }}>{s.l}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'stress' && (
          <div style={{ ...gl(0.85, 20, 22), padding: '22px' }}>
            <div style={{ textAlign: 'center', marginBottom: 22 }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 4 }}>Current Stress Level</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: G }}>24</div>
              <Tag color={G}>LOW STRESS</Tag>
            </div>
            <div style={{ position: 'relative', height: 10, borderRadius: 5, background: `linear-gradient(90deg,${G},${LIME},${ORANGE},${RED})`, marginBottom: 8 }}>
              <div style={{ position: 'absolute', top: -4, left: '24%', width: 18, height: 18, borderRadius: '50%', background: 'var(--fp-surface)', border: `3px solid ${G}`, transform: 'translateX(-50%)', boxShadow: `0 2px 8px ${G}40` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: MUTED, fontWeight: 600, marginBottom: 22 }}>
              <span>Low</span><span>Moderate</span><span>High</span><span>Very High</span>
            </div>
            <div style={{ ...gl(0.78, 12, 14), padding: '13px 16px', display: 'flex', gap: 12, alignItems: 'center', border: `1px solid ${PURPLE}20` }}>
              <span style={{ fontSize: 28 }}>🧘</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>Meditation Suggestion</div>
                <div style={{ fontSize: 11.5, color: MUTED }}>5-min breathing exercise · Tap to start</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'water' && (
          <WaterTab />
        )}
      </div>

      </div>{/* end innerScroll */}
      <BottomNav active="progress" onNav={onNav} />
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 14 — COMMUNITY
   ─────────────────────────────────────────────────────────── */
export function CommunityScreen({ onNav }: { onNav?: (s: string) => void }) {
  const [likes, setLikes] = useState([false, false, false])
  const [flow, setFlow] = useState<null | 'join' | 'invite' | 'share'>(null)
  const [joined, setJoined] = useState(false)
  const challenge: ChallengeInfo = {
    title: 'Weekly 70K', desc: 'Walk 70,000 steps between Monday and Sunday. Sync your tracker to earn the finisher badge!', reward: '🏆 Finisher Badge', endDate: '3d left', total: 70000, progress: 72, img: '🏃',
    participants: [{ name: 'Rahul K.', avatar: '🧑‍🦰' }, { name: 'Priya M.', avatar: '👩‍🦳' }, { name: 'Dev R.', avatar: '🧑‍🦱' }],
  }
  const people: { name: string; avatar: string; added: boolean }[] = [
    { name: 'Rahul K.', avatar: '🧑‍🦰', added: true },
    { name: 'Priya M.', avatar: '👩‍🦳', added: false },
    { name: 'Dev R.', avatar: '🧑‍🦱', added: false },
    { name: 'Meera S.', avatar: '👩', added: false },
    { name: 'Arjun P.', avatar: '👨', added: false },
  ]
  const stats = [{ label: 'Steps', value: '50,430' }, { label: 'Streak', value: '12d' }, { label: 'Active min', value: '210' }]

  return (
    <div style={{ ...scr, overflow: 'hidden' }}>
      <BgBlobs />
      <div style={{ ...innerScroll(), padding: '52px 0 16px' }}>
      <div style={{ padding: '0 18px', marginBottom: 18 }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: TXT }}>Community</h2>
                    <button onClick={() => setFlow('join')} style={{ ...gl(0.95, 14, 16), border: `1px solid ${G}30`, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#fff', background: `linear-gradient(135deg,${G},${CYAN})`, boxShadow: `0 8px 20px ${G}30`, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 17 }}>+</span> Join Challenge
          </button>
        </div>
                <p style={{ margin: 0, color: MUTED, fontSize: 14 }}>Challenges, friends & achievements</p>
        {joined && <div style={{ marginTop: 12, padding: '11px 14px', borderRadius: 12, ...gl(0.85, 18, 12), color: G, fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>🎉 You joined <b style={{ fontSize: 13 }}>Weekly 70K</b> — good luck!</div>}
      </div>

      <div style={{ padding: '0 18px' }}>
        {/* Challenges */}
        <div style={{ fontSize: 13, fontWeight: 700, color: TXT, marginBottom: 10 }}>Active Challenges</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { title: 'Weekly 70K', icon: '👟', progress: 72, end: '3d left', color: G },
            { title: 'Hydration Month', icon: '💧', progress: 54, end: '18d left', color: CYAN },
          ].map((c, i) => (
            <div key={i} style={{ ...gl(0.82, 16, 18), padding: '14px', flex: 1, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>{c.title}</div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 8 }}>{c.end}</div>
              <div style={{ height: 5, borderRadius: 3, background: 'var(--fp-track)', marginBottom: 4 }}>
                <div style={{ width: `${c.progress}%`, height: '100%', borderRadius: 3, background: c.color }} />
              </div>
              <div style={{ fontSize: 10, color: c.color, fontWeight: 700 }}>{c.progress}%</div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div style={{ ...gl(0.82, 18, 20), padding: '16px', marginBottom: 18, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TXT }}>🏆 Leaderboard</div>
            <Tag color={ORANGE}>This Week</Tag>
          </div>
          {[
            { rank: '🥇', emoji: '👩‍🦱', name: 'Ananya S.', score: '86,420', highlight: true },
            { rank: '🥈', emoji: '🧑‍🦰', name: 'Rahul K.', score: '79,100', highlight: false },
            { rank: '🥉', emoji: '👩‍🦳', name: 'Priya M.', score: '71,850', highlight: false },
            { rank: '8️⃣', emoji: '🧑', name: 'You', score: '65,947', highlight: false, you: true },
          ].map((u, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: (u as any).you ? '10px 8px' : '10px 0',
              borderBottom: i < 3 ? `1px solid var(--fp-track)` : 'none',
              background: (u as any).you ? `${G}10` : 'transparent',
              borderRadius: (u as any).you ? 10 : 0,
              animation: `fade-slide-up 350ms ease-out ${i * 80}ms both`,
            }}>
              <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{u.rank}</span>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{u.emoji}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: (u as any).you ? 800 : 600, color: (u as any).you ? G : TXT }}>{u.name}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: (u as any).you ? G : MUTED }}>{u.score}</div>
            </div>
          ))}
        </div>

        {/* Friends feed */}
        <div style={{ fontSize: 13, fontWeight: 700, color: TXT, marginBottom: 10 }}>Friends Activity</div>
        {[
          { emoji: '🧑‍🦰', name: 'Rahul K.', time: '2h ago', msg: 'Completed a 5K run in 28:30 🏃 Personal best!', l: 14 },
          { emoji: '👩‍🦳', name: 'Priya M.', time: '4h ago', msg: 'Hit 100-day streak! 🔥 So proud of this milestone.', l: 42 },
          { emoji: '🧑‍🦱', name: 'Dev R.', time: '6h ago', msg: 'New PR: Bench Press 100kg 💪 Strength is growing!', l: 28 },
        ].map((post, i) => (
          <div key={i} style={{ ...gl(0.78, 16, 18), padding: '14px', marginBottom: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{post.emoji}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>{post.name}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{post.time}</div>
              </div>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: TXT2, lineHeight: 1.5 }}>{post.msg}</p>
            <div style={{ display: 'flex', gap: 14 }}>
              {[
                { icon: likes[i] ? '❤️' : '🤍', label: `${post.l + (likes[i] ? 1 : 0)}`, action: () => setLikes(p => { const n = [...p]; n[i] = !n[i]; return n }) },
                { icon: '💬', label: 'Comment', action: undefined },
                { icon: '↗️', label: 'Share', action: undefined },
              ].map((a, j) => (
                <button key={j} onClick={a.action} style={{
                  background: 'none', border: 'none', color: MUTED, fontSize: 12.5,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                }}>
                  <span style={{ fontSize: 15 }}>{a.icon}</span> {a.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>{/* end content padding */}
      </div>{/* end innerScroll */}
            <FitModal open={flow === 'join'} title="Join Challenge" subtitle="Weekly 70K Steps · 72% complete · 3d left" onClose={() => setFlow(null)}>
        <JoinChallengeWidget challenge={challenge} onAccept={() => setJoined(true)} onInvite={() => setFlow('invite')} onShare={() => setFlow('share')} />
      </FitModal>
      <FitModal open={flow === 'invite'} title="Invite People" subtitle="Invite friends to this challenge" onClose={() => setFlow(null)}>
        <InvitePeopleWidget people={people} onBack={() => setFlow('join')} onInvite={() => setFlow(null)} />
      </FitModal>
      <FitModal open={flow === 'share'} title="Share Progress" subtitle="Share your Weekly 70K progress" onClose={() => setFlow(null)}>
        <ShareProgressWidget challenge={challenge} stats={stats} onBack={() => setFlow(null)} />
      </FitModal>
      <BottomNav active="community" onNav={onNav} />
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 15 — PROGRESS REVIEW
   ─────────────────────────────────────────────────────────── */
export function ProgressScreen({ onNav }: { onNav?: (s: string) => void }) {
  const [period, setPeriod] = useState<'week' | 'month'>('month')

  const weightData = [
    { d: 'W1', v: 74.2 }, { d: 'W2', v: 73.8 }, { d: 'W3', v: 73.1 },
    { d: 'W4', v: 72.6 }, { d: 'W5', v: 72.0 }, { d: 'W6', v: 71.4 }, { d: 'Now', v: 71.0 },
  ]

  const badges = [
    { icon: '🔥', label: '100 Day Streak', earned: true },
    { icon: '👟', label: '500K Steps', earned: true },
    { icon: '🏃', label: '50 Workouts', earned: true },
    { icon: '💧', label: '30-Day Hydration', earned: false },
    { icon: '💪', label: 'Strength Master', earned: false },
    { icon: '🧘', label: 'Zen Master', earned: false },
  ]

  return (
    <div style={{ ...scr, overflow: 'hidden' }}>
      <BgBlobs />
      <div style={{ ...innerScroll(), padding: '52px 0 16px' }}>
      <div style={{ padding: '0 18px', marginBottom: 16 }}>
        <StatusBar />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: TXT }}>Progress</h2>
          <div style={{ display: 'flex', gap: 4, ...gl(0.82, 12, 22), padding: 4, border: `1px solid ${SOFT}` }}>
            {(['week', 'month'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: '6px 14px', borderRadius: 18, fontSize: 12, fontWeight: 700,
                background: period === p ? G : 'transparent',
                color: period === p ? 'white' : MUTED,
                border: 'none', cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif", transition: 'all 0.2s',
              }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 18px' }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[{ l: 'Workouts', v: '24', icon: '🏋️', c: G }, { l: 'Active Days', v: '19/30', icon: '📅', c: CYAN }, { l: 'Avg Steps', v: '9.8k', icon: '👟', c: LIME }].map((s, i) => (
            <div key={i} style={{ ...gl(0.82, 14, 16), padding: '12px 8px', flex: 1, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: 10, color: MUTED }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Weight trend */}
        <div style={{ ...gl(0.85, 20, 22), padding: '18px', marginBottom: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>Weight Trend</div>
              <div style={{ fontSize: 12, color: MUTED }}>Lost 3.2 kg this month</div>
            </div>
            <Tag color={G}>↓ 3.2 kg</Tag>
          </div>
          <ResponsiveContainer width="100%" height={88}>
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="wGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={G} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={G} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: MUTED, fontSize: 10 }} />
              <YAxis domain={[70, 75]} hide />
              <Area type="monotone" dataKey="v" stroke={G} fill="url(#wGrad2)" strokeWidth={2.5} dot={{ r: 3.5, fill: G, strokeWidth: 2, stroke: 'white' }} />
              <Tooltip contentStyle={{ background: 'var(--fp-surface)', border: '1px solid var(--fp-field)', borderRadius: 8, fontSize: 11 }} formatter={(v: any) => [`${v} kg`, 'Weight']} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* BMI */}
        <div style={{ ...gl(0.82, 16, 18), padding: '16px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: `${G}15`, border: `2px solid ${G}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>⚕️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>BMI Score</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: G, lineHeight: 1.1 }}>22.4</div>
            <Tag color={G}>Normal Weight</Tag>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: MUTED }}>
            <div style={{ fontWeight: 600 }}>178 cm</div>
            <div>71.0 kg</div>
          </div>
        </div>

        {/* AI Summary */}
        <div style={{
          ...gl(0.85, 20, 20), padding: '16px', marginBottom: 16,
          borderLeft: `4px solid ${CYAN}`,
          boxShadow: `0 4px 20px ${CYAN}15`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: CYAN, marginBottom: 8 }}>✨ AI Monthly Summary</div>
          <p style={{ margin: '0 0 10px', fontSize: 12.5, color: TXT2, lineHeight: 1.6 }}>
            Outstanding month! 19/30 step goals hit, resting HR improved by 8 BPM, and 3.2kg lost. Cardio and strength both trending upward — keep it up! 💪
          </p>
          <Tag color={G}>Top 5% of users this month</Tag>
        </div>

        {/* Badges */}
        <div style={{ fontSize: 13, fontWeight: 700, color: TXT, marginBottom: 10 }}>Achievement Badges</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
          {badges.map((b, i) => (
            <div key={i} style={{
              ...gl(b.earned ? 0.88 : 0.6, 14, 16), padding: '12px 8px', textAlign: 'center',
              opacity: b.earned ? 1 : 0.5,
              border: `1.5px solid ${b.earned ? G + '40' : SOFT}`,
              boxShadow: b.earned ? `0 2px 12px ${G}15` : 'none',
              animation: b.earned ? `badge-pop 450ms cubic-bezier(0.34,1.56,0.64,1) ${i * 100}ms both` : undefined,
            }}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>{b.icon}</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: b.earned ? TXT : MUTED }}>{b.label}</div>
            </div>
          ))}
        </div>

        <GBtn variant="outline" onClick={() => {}}>📄 Download PDF Report</GBtn>
      </div>
      </div>{/* end innerScroll */}
      <BottomNav active="progress" onNav={onNav} />
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 16 — ACCOUNT
   ─────────────────────────────────────────────────────────── */
export function AccountScreen({ onNav }: { onNav?: (s: string) => void }) {
  const theme = useTheme()
  const [modal, setModal] = useState<null | 'edit' | 'subscription' | 'records' | 'privacy'>(null)
  const profile: ProfileData = { name: 'Ananya Sharma', email: 'ananya@fitpulse.app', height: '165', weight: '58', level: 'Intermediate' }
  const records = [
    { label: '5K Run', value: '28:30', icon: '🏃', color: CYAN },
    { label: 'Bench Press', value: '100kg', icon: '💪', color: ORANGE, num: 100 },
    { label: 'Workouts', value: '247', icon: '🏋️', color: G, num: 247 },
    { label: 'Longest Streak', value: '42d', icon: '🔥', color: RED, num: 42 },
  ]
  const privacy = [
    { key: 'p1', label: 'Private Profile', desc: 'Hide activity from friends', on: false },
    { key: 'p2', label: 'Activity Status', desc: 'Show when you are online', on: true },
    { key: 'p3', label: 'Data Sharing', desc: 'Share anonymized metrics', on: true },
    { key: 'p4', label: 'Login Alerts', desc: 'Email on new device', on: true },
  ]
  const menu = [
    { icon: '✏️', label: 'Edit Profile', sub: 'Update your information', color: G },
    { icon: '🎯', label: 'Goals & Progress', sub: 'Track your milestones', color: CYAN },
    { icon: '⌚', label: 'Device Sync', sub: 'Manage connected devices', color: LIME },
    { icon: '⭐', label: 'Subscription', sub: 'FitPulse Pro · Active', color: ORANGE },
    { icon: '🏆', label: 'Personal Records', sub: 'Your best performances', color: PURPLE },
    { icon: '🔒', label: 'Privacy & Security', sub: 'Manage your data', color: MUTED },
    { icon: '🚪', label: 'Sign Out', sub: null, color: RED },
  ]

  return (
    <div style={{ ...scr, overflow: 'hidden' }}>
      <BgBlobs />
      <div style={{ ...innerScroll(), padding: '52px 0 16px' }}>
      <div style={{ padding: '0 18px' }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <button onClick={() => onNav?.('settings')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: MUTED, padding: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>⚙️</button>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: TXT, flex: 1 }}>Account</h2>
        </div>

        {/* Profile header */}
        <div style={{
          ...gl(0.88, 24, 24), padding: '22px 20px', marginBottom: 16, textAlign: 'center',
          boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
          background: theme === 'dark' ? 'linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))' : 'linear-gradient(135deg,rgba(255,255,255,0.55),rgba(240,253,244,0.40))',
          borderTop: `3px solid ${G}`,
        }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${G},${CYAN})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, boxShadow: `0 0 0 4px ${theme === 'dark' ? 'rgba(255,255,255,0.14)' : LIGHTER}, 0 0 0 6px ${G}30` }}>👩‍🦱</div>
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: 22, height: 22, borderRadius: '50%', background: G, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, border: `2px solid ${theme === 'dark' ? 'rgba(255,255,255,0.22)' : 'white'}` }}>✏️</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: TXT }}>Ananya Sharma</div>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>ananya@fitpulse.app</div>
          <Tag color={LIME}>⭐ FitPulse Pro</Tag>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 18, paddingTop: 16, borderTop: `1px solid var(--fp-track)` }}>
            {[{ v: '247', l: 'Workouts' }, { v: '100🔥', l: 'Day Streak' }, { v: '18', l: 'Badges' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: TXT }}>{s.v}</div>
                <div style={{ fontSize: 10, color: MUTED }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {menu.map((item, i) => (
            <button key={i} onClick={() => {
                            if (item.label === 'Edit Profile') setModal('edit')
              else if (item.label === 'Subscription') setModal('subscription')
              else if (item.label === 'Personal Records') setModal('records')
              else if (item.label === 'Privacy & Security') setModal('privacy')
              else if (item.label === 'Device Sync') onNav?.('device-sync')
              else if (item.label === 'Goals & Progress') onNav?.('goals')
              else if (item.label === 'Sign Out') onNav?.('login')
            }} style={{
              ...gl(0.78, 14, 16), padding: '13px 16px',
              display: 'flex', alignItems: 'center', gap: 13,
              cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              border: item.label === 'Sign Out' ? `1px solid ${RED}25` : `1px solid ${SOFT}`,
              width: '100%', textAlign: 'left',
              boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
              transition: 'transform 150ms, box-shadow 150ms',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${item.color}15`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: item.label === 'Sign Out' ? RED : TXT }}>{item.label}</div>
                {item.sub && <div style={{ fontSize: 11, color: MUTED }}>{item.sub}</div>}
              </div>
              {item.label !== 'Sign Out' && <span style={{ fontSize: 16, color: 'var(--fp-faint)' }}>›</span>}
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '18px 0', fontSize: 11, color: LIGHTER }}>
          FitPulse v3.2.1 · Member since Jan 2024
        </div>
      </div>
      </div>{/* end innerScroll */}

      <FitModal open={modal === 'edit'} title="Edit Profile" subtitle="Update your information" onClose={() => setModal(null)}>
        <EditProfile profile={profile} onBack={() => setModal(null)} onSave={() => {}} />
      </FitModal>
      <FitModal open={modal === 'subscription'} title="Subscription" subtitle="FitPulse Pro" onClose={() => setModal(null)}>
        <Subscription onBack={() => setModal(null)} onUpgrade={() => setModal(null)} />
      </FitModal>
      <FitModal open={modal === 'records'} title="Personal Records" subtitle="Your best performances" onClose={() => setModal(null)}>
        <PersonalRecords records={records} onBack={() => setModal(null)} />
      </FitModal>
      <FitModal open={modal === 'privacy'} title="Privacy & Security" subtitle="Manage your data" onClose={() => setModal(null)}>
        <PrivacySecurity settings={privacy} onBack={() => setModal(null)} onUpdate={() => {}} />
      </FitModal>
      <BottomNav active="account" onNav={onNav} />
    </div>
  )
}

/* ───────────────────────────────────────────────────────────
   SCREEN 17 — SETTINGS
   ─────────────────────────────────────────────────────────── */
export function SettingsScreen({ onNav, theme = 'dark', onToggleTheme }: { onNav?: (s: string) => void; theme?: 'light' | 'dark'; onToggleTheme?: () => void }) {
  const [t, setT] = useState({ notif: true, dark: false, health: true, auto: false, sounds: true, haptics: true })
  const tog = (k: string) => setT(p => ({ ...p, [k]: !(p as any)[k] }))

  const sections = [
    {
      title: 'Preferences',
      items: [
        { key: 'notif', icon: '🔔', label: 'Push Notifications', sub: 'Reminders & challenges', type: 'toggle' },
        { key: 'sounds', icon: '🔊', label: 'Sounds', sub: 'Workout & achievement sounds', type: 'toggle' },
        { key: 'haptics', icon: '📳', label: 'Haptic Feedback', sub: 'Vibration on interactions', type: 'toggle' },
        { key: 'dark', icon: '🌙', label: 'Dark Mode', sub: theme === 'dark' ? 'Currently enabled' : 'Currently disabled', type: 'toggle' },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        { key: 'health', icon: '❤️', label: 'Health Integration', sub: 'Sync with Apple / Google Health', type: 'toggle' },
        { key: 'auto', icon: '🔄', label: 'Auto Backup', sub: 'Backup data to cloud', type: 'toggle' },
        { icon: '🔐', label: 'Privacy Settings', sub: 'Manage your data', type: 'nav' },
        { icon: '🔒', label: 'Security', sub: 'Biometrics & passcode', type: 'nav' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: '🌐', label: 'Language', sub: 'English (US)', type: 'nav' },
        { icon: '☁️', label: 'Backup & Restore', sub: 'Manage your data backup', type: 'nav' },
        { icon: '💬', label: 'Help & Support', sub: 'FAQs and contact us', type: 'nav' },
        { icon: 'ℹ️', label: 'About FitPulse', sub: 'v3.2.1 · Legal & licenses', type: 'nav' },
      ],
    },
  ]

  return (
    <div style={{ ...scr, overflow: 'hidden' }}>
      <BgBlobs />
      <div style={{ ...innerScroll(), padding: '52px 0 16px' }}>
      <div style={{ padding: '0 18px' }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <button onClick={() => onNav?.('account')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 26, color: G, padding: 0, lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>‹</button>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: TXT }}>Settings</h2>
        </div>

        {sections.map((sec, si) => (
          <div key={si} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
              {sec.title}
            </div>
            <div style={{ ...gl(0.82, 18, 18), overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
              {sec.items.map((item: any, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px',
                  borderBottom: i < sec.items.length - 1 ? `1px solid var(--fp-track)` : 'none',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--fp-input-bg)', border: '1px solid var(--fp-field)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: TXT }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{item.sub}</div>
                  </div>
                  {item.type === 'toggle'
                    ? <Toggle on={item.key === 'dark' ? theme === 'dark' : (t as any)[item.key]} onToggle={() => item.key === 'dark' ? (onToggleTheme ? onToggleTheme() : tog('dark')) : tog(item.key)} />
                    : <span style={{ fontSize: 16, color: 'var(--fp-faint)' }}>›</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>{/* end innerScroll */}
      <BottomNav active="account" onNav={onNav} />
    </div>
  )
}
