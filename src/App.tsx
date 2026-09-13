import { useState, useEffect } from 'react'
import {
  SplashScreen,
  OnboardingScreen,
  LoginScreen,
  SignUpScreen,
  ProfileSetupScreen,
  DeviceSyncScreen,
  GoalSelectionScreen,
  PermissionsScreen,
  HomeScreen,
  WorkoutsScreen,
  ActivityLogScreen,
  CommunityScreen,
  ProgressScreen,
  AccountScreen,
  SettingsScreen,
} from './screens'

/* ── Responsive breakpoints (mobile / tablet / desktop) ─────
   Mobile : < 768px    → existing 430px column layout (unchanged)
   Tablet : 768–1024px (any pointer) + 1025–1400px on touch/coarse
            devices (large tablets like iPad Pro 11"/13") →
            same 430px phone design, uniformly scaled up via zoom
            edge-to-edge (no side gaps, no stretch)
   Desktop: > 1024px on fine-pointer devices, or > 1400px →
            existing 430px centered column (unchanged) */
function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const get = () => {
    if (typeof window === 'undefined') return 'mobile' as const
    const w = window.innerWidth
    if (w < 768) return 'mobile' as const
    if (w <= 1024) return 'tablet' as const
    /* Large tablets (iPad Pro 11" 834×1194, 13" 1032×1376, landscape
       up to ~1400px): treat touch/coarse-pointer devices as tablets
       so they get the scaled layout instead of the 430px desktop
       letterbox. Fine-pointer laptops/desktops stay desktop. */
    if (w <= 1400) {
      const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
      if (coarse) return 'tablet' as const
    }
    return 'desktop' as const
  }
  const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop'>(get)
  useEffect(() => {
    const onResize = () => setBp(get())
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])
  return bp
}

const SCREEN_ORDER = [
  'splash','onboard1','onboard2','onboard3','login','signup',
  'profile-setup','device-sync','goals','permissions',
  'home','workouts','activity','community','progress','account','settings',
  'addwater',
]

export default function App() {
  const [current, setCurrent] = useState('splash')
  const [animKey, setAnimKey] = useState(0)
  const [dir, setDir] = useState<'fwd' | 'bwd'>('fwd')

  /* ── Centralized theme system ───────────────────────────── */
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('fp-theme')
      return saved === 'dark' ? 'dark' : 'light'
    } catch { return 'light' }
  })

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    try { localStorage.setItem('fp-theme', theme) } catch { /* ignore */ }
    // Brief crossfade so surfaces/tokens transition smoothly (350–500ms ease-in-out).
    root.classList.add('theme-transition')
    const t = setTimeout(() => root.classList.remove('theme-transition'), 500)
    return () => clearTimeout(t)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  const nav = (s: string) => {
    const ci = SCREEN_ORDER.indexOf(current)
    const ni = SCREEN_ORDER.indexOf(s)
    setDir(ni >= ci ? 'fwd' : 'bwd')
    setAnimKey(k => k + 1)
    setCurrent(s)
  }

  const renderScreen = (id: string) => {
    const map: Record<string, React.ReactNode> = {
      splash:          <SplashScreen onNav={nav} />,
      onboard1:        <OnboardingScreen slide={0} onNav={nav} />,
      onboard2:        <OnboardingScreen slide={1} onNav={nav} />,
      onboard3:        <OnboardingScreen slide={2} onNav={nav} />,
      login:           <LoginScreen onNav={nav} />,
      signup:          <SignUpScreen onNav={nav} />,
      'profile-setup': <ProfileSetupScreen onNav={nav} />,
      'device-sync':   <DeviceSyncScreen onNav={nav} />,
      goals:           <GoalSelectionScreen onNav={nav} />,
      permissions:     <PermissionsScreen onNav={nav} />,
      home:            <HomeScreen onNav={nav} />,
      workouts:        <WorkoutsScreen onNav={nav} />,
      activity:        <ActivityLogScreen onNav={nav} />,
      addwater:        <ActivityLogScreen onNav={nav} initialTab="water" />,
      community:       <CommunityScreen onNav={nav} />,
      progress:        <ProgressScreen onNav={nav} />,
      account:         <AccountScreen onNav={nav} />,
      settings:        <SettingsScreen onNav={nav} theme={theme} onToggleTheme={toggleTheme} />,
    }
    return map[id] ?? <HomeScreen onNav={nav} />
  }

  const bp = useBreakpoint()
  const isTablet = bp === 'tablet'

  /* Tablet scale: fill the tablet viewport edge-to-edge with the
     unchanged 430px phone design, uniformly magnified.
     scale = viewportWidth / 430 → painted width = viewport width.
     768w → 1.79, 820w → 1.91, 900w → 2.09, 1024w → 2.38,
     1032w (iPad Pro 13" portrait) → 2.40 edge-to-edge; wider
     landscape (e.g. 1194w/1376w) caps at 2.6 and centers with
     slim balanced margins so text/cards stay usable.
     Cards/text/icons/spacing/nav all grow together — zero side gaps,
     zero stretch. Mobile/desktop ignore this entirely.
     NOTE: coarse-pointer changes don't re-fire resize on some iPads,
     so also listen to the media query itself (see effect below). */
  const tabletScale = (() => {
    if (typeof window === 'undefined') return 1.79
    const w = window.innerWidth
    const s = w / 430
    /* Edge-to-edge up to ~1118px viewport (covers 768→1032 portrait
       incl. iPad Pro 13" 1032×1376). Beyond that (large landscape,
       e.g. 1376w) cap at 2.6 so cards/text stay usable — the frame
       then centers with small balanced margins via margin:auto. */
    return Math.min(2.6, Math.max(1.78, s))
  })()
  /* Keep two decimals for the CSS var; the inline zoom gets full float. */
  const tabletScaleCss = tabletScale.toFixed(2)

  /* Re-evaluate breakpoint + scale when the coarse-pointer match
     changes (iPadOS docked keyboard / stage manager) and on every
     resize/orientation change. A state tick forces recompute since
     tabletScale derives from window.innerWidth each render. */
  const [, setTabletTick] = useState(0)
  useEffect(() => {
    if (!isTablet) return
    const onChange = () => setTabletTick(t => t + 1)
    window.addEventListener('resize', onChange)
    window.addEventListener('orientationchange', onChange)
    const mq = window.matchMedia?.('(pointer: coarse)')
    mq?.addEventListener?.('change', onChange)
    return () => {
      window.removeEventListener('resize', onChange)
      window.removeEventListener('orientationchange', onChange)
      mq?.removeEventListener?.('change', onChange)
    }
  }, [isTablet])

  return (
    /* App shell — mobile/desktop keep the 430px column exactly.
       Tablet keeps the same 430px phone design and uniformly scales
       it edge-to-edge (no side gaps), like a native tablet app. */
    <div
      data-breakpoint={bp}
      className={isTablet ? 'fp-shell fp-shell--tablet' : 'fp-shell'}
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        background: 'var(--fp-bg)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        transition: 'background 300ms ease',
      }}
    >
      <div
        key={animKey}
        data-breakpoint={bp}
        data-tablet-scale={isTablet ? tabletScaleCss : undefined}
        className={isTablet ? 'fp-frame fp-frame--tablet' : 'fp-frame'}
        style={{
          width: isTablet ? 430 : '100%',
          maxWidth: 430,
          height: '100dvh',
          overflow: 'hidden',
          position: 'relative',
          margin: '0 auto',
          flexShrink: 0,
          ...(isTablet
            ? {
                zoom: tabletScale,
                ['--fp-zoom' as any]: tabletScaleCss,
                height: `calc(100dvh / ${tabletScaleCss})`,
              }
            : null),
          transition: 'max-width 300ms ease-in-out',
          animation: `${dir === 'fwd' ? 'screen-enter' : 'screen-enter-back'} 350ms ease-out both`,
        }}
      >
        {renderScreen(current)}
      </div>
    </div>
  )
}
