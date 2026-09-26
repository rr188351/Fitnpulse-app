/* ───────────────────────────────────────────────────────────
   FitPulse — WEB first-run screens

   Desktop / tablet presentation of the same journey the phone app
   runs: Splash → Onboarding (3 slides) → Login / Sign Up →
   Profile Setup → Device Sync → Goal Selection → Permissions.

   Same content, same flow and same state machines (the device-sync
   logic is shared via useDeviceSync(), the slides via SLIDES, the
   datasets via src/data.ts) — only the layout differs: a roomy
   centred stage with brand panels instead of a 430px column.

   Rendered by App.tsx on the tablet/desktop breakpoints. Phones and
   the embedded (/?embed=1) presentation keep src/screens.tsx.
   ─────────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react'
import { Logo, SLIDES, Toggle } from './screens'
import { GBtn, useTheme, useDeviceSync } from './features'
import {
  PALETTE, BRAND, SYNC_DEVICES, SYNC_STATUS_LABELS, SETUP_GOALS, GOAL_DEFAULT_SELECTION,
  PERMISSION_ITEMS, PERMISSION_DEFAULTS, PROFILE_FIELDS, GENDER_OPTIONS, FITNESS_LEVELS,
  PROFILE_LEVEL_DEFAULT,
} from './data'
import googleLogo from '@/imports/google-logo.png'
import appleLogo from '@/imports/apple-logo.png'

const C = PALETTE

/* ── Stage: the full-page canvas every first-run screen sits on ── */
function Stage({ children, wide = false, xl = false, auth = false, className = '' }: {
  children: React.ReactNode
  wide?: boolean
  xl?: boolean
  /* Login / Create Account are the hero screens of the web app, so they
     get a wider stage + the larger form card (see .fp-auth__inner--auth
     in src/index.css). */
  auth?: boolean
  className?: string
}) {
  return (
    <div className={`fp-auth ${className}`}>
      <div className="fp-auth__glow fp-auth__glow--a" />
      <div className="fp-auth__glow fp-auth__glow--b" />
      <div className="fp-auth__glow fp-auth__glow--c" />
      <div className={`fp-auth__inner ${wide ? 'fp-auth__inner--wide' : ''} ${xl ? 'fp-auth__inner--xl' : ''} ${auth ? 'fp-auth__inner--auth' : ''}`}>
        {children}
      </div>
    </div>
  )
}

/* Brand panel used by the split (two-pane) layouts. */
function BrandPanel() {
  return (
    <div className="fp-auth__brand">
      <Logo size={54} />
      <div className="fp-auth__brand-name">{BRAND.name}</div>
      <div className="fp-auth__brand-tag">{BRAND.tagline}</div>
    </div>
  )
}

/* Web text field (same placeholders/icons as the mobile inputs). */
function Field({ icon, placeholder, type = 'text' }: { icon: string; placeholder: string; type?: string }) {
  return (
    <label className="fp-auth__field">
      <span className="fp-auth__field-ico">{icon}</span>
      <input type={type} placeholder={placeholder} />
    </label>
  )
}

/* ═══ SPLASH ═════════════════════════════════════════════════ */
export function WebSplashScreen({ onNav }: { onNav: (s: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onNav('onboard1'), 800)
    return () => clearTimeout(t)
  }, [onNav])

  return (
    <Stage className="fp-auth--splash">
      <div className="fp-auth__splash-card">
        <div className="fp-auth__splash-logo">
          <Logo size={92} />
        </div>
        <h1 className="fp-auth__splash-name">{BRAND.name}</h1>
        <p className="fp-auth__splash-tag">{BRAND.tagline}</p>
      </div>

      <div className="fp-auth__splash-ring">
        <svg width="52" height="52" style={{ animation: 'spin 1.4s linear infinite', display: 'block' }}>
          <circle cx="26" cy="26" r="20" fill="none" stroke={`${C.green}20`} strokeWidth="3" />
          <circle cx="26" cy="26" r="20" fill="none" stroke={C.green} strokeWidth="3"
            strokeDasharray="44 82" strokeLinecap="round" />
        </svg>
      </div>

      <p className="fp-auth__splash-copy">{BRAND.copyright}</p>
    </Stage>
  )
}

/* ═══ ONBOARDING (3 slides) ══════════════════════════════════ */
export function WebOnboardingScreen({ slide = 0, onNav }: { slide?: number; onNav: (s: string) => void }) {
  const [current, setCurrent] = useState(slide)
  const [dir, setDir] = useState<'fwd' | 'bwd'>('fwd')
  const s = SLIDES[current]
  const Illustration = s.illustration

  const go = (next: number, direction: 'fwd' | 'bwd') => {
    setDir(direction)
    setCurrent(next)
  }

  return (
    <Stage xl>
      <div className="fp-auth__onboard">
        <div className="fp-auth__onboard-top">
          <div className="fp-auth__mini-brand">
            <Logo size={30} />
            <span>{BRAND.name}</span>
          </div>
          <button className="fp-auth__skip" onClick={() => onNav('login')}>Skip</button>
        </div>

        <div key={current} className={`fp-auth__onboard-body ${dir === 'fwd' ? 'is-fwd' : 'is-bwd'}`}>
          <div className="fp-auth__onboard-art"><Illustration /></div>

          <div className="fp-auth__onboard-text">
            <div className="fp-auth__dots">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={i === current ? 'is-active' : ''}
                  onClick={() => go(i, i > current ? 'fwd' : 'bwd')}
                  style={i === current ? { background: s.accentColor } : undefined}
                />
              ))}
            </div>
            <h2>{s.title}</h2>
            <p>{s.subtitle}</p>

            <div className="fp-auth__onboard-actions">
              {current < 2 ? (
                <GBtn
                  className="fp-web-btn fp-web-btn--grow"
                  onClick={() => go(current + 1, 'fwd')}
                  style={{ background: `linear-gradient(135deg,${s.accentColor},${s.accentColor}cc)`, boxShadow: `0 18px 24px ${s.accentColor}40` }}
                >
                  Next
                </GBtn>
              ) : (
                <GBtn className="fp-web-btn fp-web-btn--grow" onClick={() => onNav('login')}>Get Started</GBtn>
              )}
              {current > 0 && <GBtn className="fp-web-btn fp-web-btn--back" variant="ghost" onClick={() => go(current - 1, 'bwd')}>Back</GBtn>}
            </div>
          </div>
        </div>
      </div>
    </Stage>
  )
}

/* ═══ LOGIN ══════════════════════════════════════════════════ */
export function WebLoginScreen({ onNav }: { onNav: (s: string) => void }) {
  const theme = useTheme()

  return (
    <Stage auth>
      <div className="fp-auth__split fp-auth__split--auth">
        <BrandPanel />

        <div className="fp-auth__panel fp-auth__panel--auth">
          <div className="fp-auth__panel-head">
            <h2>Welcome Back</h2>
            <p>Sign in to your FitPulse account</p>
          </div>

          <Field icon="📧" placeholder="Email address" type="email" />
          <Field icon="🔒" placeholder="Password" type="password" />

          <div className="fp-auth__form-row">
            <button className="fp-auth__link">Forgot Password?</button>
          </div>

          <GBtn className="fp-web-btn" onClick={() => onNav('home')}>Sign In</GBtn>

          <div className="fp-auth__divider">
            <span />
            or continue with
            <span />
          </div>

          <div className="fp-auth__social">
            {[
              { iconSrc: googleLogo, name: 'Google' },
              { iconSrc: appleLogo, name: 'Apple' },
            ].map(b => (
              <button key={b.name} className="fp-auth__social-btn" aria-label={`Continue with ${b.name}`}>
                <img
                  src={b.iconSrc}
                  alt=""
                  style={{ filter: b.name === 'Apple' && theme === 'dark' ? 'invert(1) brightness(0.9)' : undefined }}
                />
              </button>
            ))}
          </div>

          <p className="fp-auth__switch">
            New here?{' '}
            <button className="fp-auth__link" onClick={() => onNav('signup')}>Create Account</button>
          </p>
        </div>
      </div>
    </Stage>
  )
}

/* ═══ SIGN UP ════════════════════════════════════════════════ */
export function WebSignUpScreen({ onNav }: { onNav: (s: string) => void }) {
  return (
    <Stage auth>
      <div className="fp-auth__split fp-auth__split--auth">
        <BrandPanel />

        <div className="fp-auth__panel fp-auth__panel--auth">
          <div className="fp-auth__panel-head">
            <h2>Create Account</h2>
            <p>Start your fitness journey today</p>
          </div>

          <Field icon="👤" placeholder="Full Name" />
          <Field icon="📧" placeholder="Email address" type="email" />
          <Field icon="🔒" placeholder="Password" type="password" />
          <Field icon="✅" placeholder="Confirm Password" type="password" />

          <GBtn className="fp-web-btn" onClick={() => onNav('profile-setup')} style={{ marginTop: 8 }}>Create Account 🎉</GBtn>

          <p className="fp-auth__switch">
            Already have an account?{' '}
            <button className="fp-auth__link" onClick={() => onNav('login')}>Sign In</button>
          </p>
        </div>
      </div>
    </Stage>
  )
}

/* ═══ PROFILE SETUP ══════════════════════════════════════════ */
export function WebProfileSetupScreen({ onNav }: { onNav: (s: string) => void }) {
  const [level, setLevel] = useState(PROFILE_LEVEL_DEFAULT)

  return (
    <Stage wide>
      <div className="fp-auth__head">
        <h2>Set Up Profile</h2>
        <p>Help us personalize your experience</p>
      </div>

      <div className="fp-auth__card">
        <div className="fp-auth__avatar">
          👩‍🦱
          <span className="fp-auth__avatar-cam">📷</span>
        </div>

        <div className="fp-auth__form-grid">
          {PROFILE_FIELDS.map((f, i) => (
            <Field key={i} icon={f.icon} placeholder={f.placeholder} type={f.type} />
          ))}
        </div>

        <div className="fp-auth__group">
          <div className="fp-auth__label">Gender</div>
          <div className="fp-auth__chips">
            {GENDER_OPTIONS.map(g => (
              <button key={g} className="fp-auth__chip">{g}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="fp-auth__group">
        <div className="fp-auth__label">Fitness Level</div>
        <div className="fp-auth__chips">
          {FITNESS_LEVELS.map(lv => (
            <button
              key={lv.id}
              onClick={() => setLevel(lv.id)}
              className={`fp-auth__chip ${level === lv.id ? 'is-active' : ''}`}
              style={{
                background: level === lv.id ? `${lv.color}18` : undefined,
                borderColor: level === lv.id ? lv.color : undefined,
                color: level === lv.id ? lv.color : undefined,
                boxShadow: level === lv.id ? `0 4px 14px ${lv.color}30` : undefined,
              }}
            >
              {lv.label}
            </button>
          ))}
        </div>
      </div>

      <div className="fp-auth__actions">
        <GBtn className="fp-web-btn" onClick={() => onNav('device-sync')}>Next</GBtn>
      </div>
    </Stage>
  )
}

/* ═══ DEVICE SYNC ════════════════════════════════════════════ */
export function WebDeviceSyncScreen({ onNav }: { onNav: (s: string) => void }) {
  const { syncSt, syncDevice, syncPct, startSync, isConnected } = useDeviceSync()
  const statusColor = isConnected ? C.green : syncSt === 'idle' ? 'var(--fp-muted)' : C.cyan

  return (
    <Stage wide>
      <div className="fp-auth__head">
        <div className="fp-auth__head-ico">🔵</div>
        <h2>Connect Device</h2>
        <p>Pair your tracker for complete health sync</p>
      </div>

      <div className="fp-auth__card">
        <div className="fp-auth__status" style={{ borderColor: `${statusColor}30` }}>
          <div className="fp-auth__status-text" style={{ color: statusColor }}>{SYNC_STATUS_LABELS[syncSt]}</div>
          {syncSt === 'syncing' && <div className="fp-auth__status-pct" style={{ color: C.cyan }}>{syncPct}%</div>}
        </div>

        {syncSt !== 'idle' && (
          <div className="fp-auth__progress">
            <div
              className="fp-auth__progress-fill"
              style={{
                width: `${syncPct}%`,
                background: isConnected ? `linear-gradient(90deg,${C.green},${C.lime})` : `linear-gradient(90deg,${C.cyan},${C.green})`,
                boxShadow: `0 0 8px ${isConnected ? C.green : C.cyan}60`,
              }}
            />
          </div>
        )}

        <div className="fp-auth__devices">
          {SYNC_DEVICES.map((d, i) => {
            const active = syncDevice === i && isConnected
            return (
              <button
                key={i}
                onClick={() => startSync(i)}
                className={`fp-auth__device ${active ? 'is-active' : ''}`}
              >
                <div className="fp-auth__device-ico">{d.icon}</div>
                <div className="fp-auth__device-name">{d.name}</div>
                <div className="fp-auth__device-sub">{d.sub}</div>
                {syncDevice === i && syncSt !== 'idle' && (
                  <div className="fp-auth__device-state" style={{ color: isConnected ? C.green : C.cyan }}>
                    {isConnected ? '✓ Connected' : SYNC_STATUS_LABELS[syncSt].replace(/[^a-zA-Z .!]/g, '')}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="fp-auth__actions">
        <GBtn className="fp-web-btn" onClick={() => onNav('goals')}>{isConnected ? 'Continue' : 'Skip for Now'}</GBtn>
      </div>
    </Stage>
  )
}

/* ═══ GOAL SELECTION ═════════════════════════════════════════ */
export function WebGoalSelectionScreen({ onNav }: { onNav: (s: string) => void }) {
  const [selected, setSelected] = useState<number[]>(GOAL_DEFAULT_SELECTION)

  const toggle = (i: number) =>
    setSelected(prev => (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]))

  return (
    <Stage wide>
      <div className="fp-auth__head">
        <h2>What's Your Goal?</h2>
        <p>Select all that apply — you can change later</p>
      </div>

      <div className="fp-auth__card">
        <div className="fp-auth__goals">
          {SETUP_GOALS.map((g, i) => {
            const on = selected.includes(i)
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={`fp-auth__goal ${on ? 'is-on' : ''}`}
                style={{ borderColor: on ? g.color : undefined, boxShadow: on ? `0 4px 20px ${g.color}25` : undefined }}
              >
                <span
                  className="fp-auth__goal-ico"
                  style={{ background: `${g.color}15`, border: `1px solid ${g.color}30` }}
                >
                  {g.icon}
                </span>
                <span className="fp-auth__goal-body">
                  <span className="fp-auth__goal-title">{g.title}</span>
                  <span className="fp-auth__goal-sub">{g.sub}</span>
                </span>
                <span
                  className="fp-auth__goal-check"
                  style={{
                    background: on ? C.green : undefined,
                    borderColor: on ? C.green : undefined,
                    boxShadow: on ? `0 2px 8px ${C.green}50` : undefined,
                  }}
                >
                  {on && '✓'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="fp-auth__actions">
        <GBtn className="fp-web-btn" onClick={() => onNav('permissions')}>Continue ({selected.length} selected)</GBtn>
      </div>
    </Stage>
  )
}

/* ═══ PERMISSIONS ════════════════════════════════════════════ */
export function WebPermissionsScreen({ onNav }: { onNav: (s: string) => void }) {
  const [perms, setPerms] = useState(PERMISSION_DEFAULTS)

  const toggle = (k: string) => setPerms(p => ({ ...p, [k]: !(p as any)[k] }))

  return (
    <Stage wide>
      <div className="fp-auth__head">
        <div className="fp-auth__head-ico">📱</div>
        <h2>Enable Permissions</h2>
        <p>FitPulse needs these to deliver the full experience</p>
      </div>

      <div className="fp-auth__card">
        <div className="fp-auth__rows">
          {PERMISSION_ITEMS.map(it => (
            <div key={it.key} className="fp-row fp-row--static">
              <span className="fp-row__ico" style={{ background: `${it.color}15`, border: `1px solid ${it.color}30` }}>
                {it.icon}
              </span>
              <span className="fp-row__body">
                <span className="fp-row__label">{it.title}</span>
                <span className="fp-row__sub">{it.sub}</span>
              </span>
              <Toggle on={(perms as any)[it.key]} onToggle={() => toggle(it.key)} />
            </div>
          ))}
        </div>
      </div>

      <div className="fp-auth__actions">
        <GBtn className="fp-web-btn" onClick={() => onNav('home')}>Finish Setup 🎉</GBtn>
        <GBtn className="fp-web-btn" variant="ghost" onClick={() => onNav('home')}>Skip for now</GBtn>
      </div>
    </Stage>
  )
}
