/* ───────────────────────────────────────────────────────────
   FitPulse — web application shell

   Turns the mobile app chrome (bottom tab bar + per-screen headers)
   into a real desktop / tablet application frame:

     ┌──────────┬──────────────────────────────────────────┐
     │ sidebar  │ topbar  (title · contextual actions)     │
     │ brand    ├──────────────────────────────────────────┤
     │ Home     │                                          │
     │ Progress │  scrollable page content                 │
     │ Community│                                          │
     │ Account  │                                          │
     └──────────┴──────────────────────────────────────────┘

   The four areas, the quick-log actions, the notification list, the
   theme switch and the account chip all come from the SAME data and
   handlers the mobile app uses (src/data.ts + App.tsx state) — this
   file only changes how they are presented on large screens.

   Not used on phones or in embedded (/?embed=1) presentation: those
   keep the untouched mobile layout.
   ─────────────────────────────────────────────────────────── */
import { useState } from 'react'
import { Logo } from './screens'
import { MAIN_NAV, NOTIFICATIONS, QUICK_ACTIONS, HOME_PROFILE, BRAND } from './data'

export type WebMode = 'tablet' | 'desktop'

/* Route → product area (mirrors the active tab the mobile screens
   pass to BottomNav, so the sidebar highlights the same area). */
export const AREA_BY_ROUTE: Record<string, string> = {
  home: 'home',
  workouts: 'home',
  progress: 'progress',
  activity: 'progress',
  addwater: 'progress',
  community: 'community',
  account: 'account',
  settings: 'account',
}

/* Page titles reuse the wording already used by the mobile screens. */
const PAGE_META: Record<string, { title: string; subtitle?: string }> = {
  home: { title: 'Home' },
  workouts: { title: 'Workouts', subtitle: 'Choose your session' },
  progress: { title: 'Progress' },
  activity: { title: 'Activity Log', subtitle: 'Detailed health analytics' },
  addwater: { title: 'Activity Log', subtitle: 'Detailed health analytics' },
  community: { title: 'Community', subtitle: 'Challenges, friends & achievements' },
  account: { title: 'Account' },
  settings: { title: 'Settings' },
}

export interface WebAppProps {
  mode: WebMode
  current: string
  onNav: (s: string) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  children: React.ReactNode
}

export function WebApp({ mode, current, onNav, theme, onToggleTheme, children }: WebAppProps) {
  /* The sidebar can always be collapsed to an icon rail from the
     topbar button. Tablets and narrower windows start collapsed. */
  const [collapsed, setCollapsed] = useState(
    () => mode === 'tablet' || (typeof window !== 'undefined' && window.innerWidth < 1180),
  )

  const area = AREA_BY_ROUTE[current] ?? 'home'
  const meta = PAGE_META[current] ?? { title: 'Home' }

  const go = (id: string) => onNav(id)

  return (
    <div className={`fp-web ${collapsed ? 'fp-web--collapsed' : ''}`} data-mode={mode}>
      <div className="fp-web__glow fp-web__glow--a" />
      <div className="fp-web__glow fp-web__glow--b" />
      <div className="fp-web__glow fp-web__glow--c" />

      <aside className="fp-web__sidebar">
        <div className="fp-web__brand">
          <Logo size={38} />
          <div className="fp-web__label">
            <div className="fp-web__brand-name">{BRAND.name}</div>
            <div className="fp-web__brand-tag">{BRAND.tagline}</div>
          </div>
        </div>

        <nav className="fp-web__nav">
          {MAIN_NAV.map(t => {
            const active = t.id === area
            return (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`fp-web__nav-item ${active ? 'is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                title={t.label}
              >
                <span className="fp-web__nav-ico">{t.emoji}</span>
                <span className="fp-web__label">{t.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="fp-web__side-foot">
          <div className="fp-web__streak">
            <span className="fp-web__streak-ico">🔥</span>
            <span className="fp-web__label">{HOME_PROFILE.streak}</span>
          </div>
        </div>
      </aside>

      <div className="fp-web__main">
        <header className="fp-web__topbar">
          <button
            className="fp-web__menu-btn"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            aria-expanded={!collapsed}
            title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            ☰
          </button>

          <div className="fp-web__titles">
            <h1 className="fp-web__title">{meta.title}</h1>
            {meta.subtitle && <p className="fp-web__subtitle">{meta.subtitle}</p>}
          </div>

          <div className="fp-web__actions">
            {/* keyed on the route so an open popover closes on navigation */}
            <QuickLogMenu key={`log-${current}`} onNav={go} />
            <NotificationsMenu key={`bell-${current}`} />
            <button
              className="fp-web__icon-btn"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="fp-web__user" onClick={() => go('account')} title="Account">
              <span className="fp-web__user-avatar">{HOME_PROFILE.avatar}</span>
              <span className="fp-web__user-name">{HOME_PROFILE.name}</span>
            </button>
          </div>
        </header>

        <div className="fp-web__content">{children}</div>
      </div>
    </div>
  )
}

/* ── Topbar: quick log menu (same destinations as the Home FAB) ── */
function QuickLogMenu({ onNav }: { onNav: (s: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="fp-web__pop-host">
      <button
        className="fp-web__btn fp-web__btn--primary"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="fp-web__btn-plus">+</span> Log
      </button>
      {open && (
        <>
          <div className="fp-web__pop-scrim" onClick={() => setOpen(false)} />
          <div className="fp-web__pop" role="menu">
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.label}
                role="menuitem"
                className="fp-web__pop-item"
                onClick={() => { setOpen(false); onNav(a.nav) }}
              >
                <span className="fp-web__pop-ico">{a.icon}</span>
                <span className="fp-web__pop-label">{a.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ── Topbar: notifications (same list as the mobile bell) ─────── */
function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <div className="fp-web__pop-host">
      <button
        className="fp-web__icon-btn"
        onClick={() => setOpen(o => !o)}
        aria-label="Notifications"
        aria-expanded={open}
      >
        🔔
        <span className="fp-web__badge">{NOTIFICATIONS.length}</span>
      </button>
      {open && (
        <>
          <div className="fp-web__pop-scrim" onClick={close} />
          <div className="fp-web__pop fp-web__pop--wide">
            <div className="fp-web__pop-head">
              <span>Notifications</span>
              <button className="fp-web__pop-clear" onClick={close}>Clear all</button>
            </div>
            {NOTIFICATIONS.map((n, i) => (
              <div key={i} className="fp-web__notif">
                <div className="fp-web__notif-ico" style={{ background: `${n.color}15`, border: `1px solid ${n.color}25` }}>{n.icon}</div>
                <div className="fp-web__notif-body">
                  <div className="fp-web__notif-title">{n.title}</div>
                  <div className="fp-web__notif-msg">{n.msg}</div>
                </div>
                <div className="fp-web__notif-time">{n.time}</div>
              </div>
            ))}
            <button className="fp-web__pop-all" onClick={close}>View All Notifications</button>
          </div>
        </>
      )}
    </div>
  )
}

/*__CONTINUE__*/