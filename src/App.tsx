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
import { WebApp } from './weblayout'
import {
  WebHomeScreen,
  WebWorkoutsScreen,
  WebActivityLogScreen,
  WebProgressScreen,
  WebCommunityScreen,
  WebAccountScreen,
  WebSettingsScreen,
} from './webscreens'
import {
  WebSplashScreen,
  WebOnboardingScreen,
  WebLoginScreen,
  WebSignUpScreen,
  WebProfileSetupScreen,
  WebDeviceSyncScreen,
  WebGoalSelectionScreen,
  WebPermissionsScreen,
} from './webauth'

/* ── Layout modes ───────────────────────────────────────────
   embed   : /?embed=1 or rendered inside the 3D-showcase iframe →
             the phone design, uniformly scaled (unchanged: this is
             what the 3D / mobile-case showcase renders)
   mobile  : < 768px → existing 430px phone layout (unchanged)
   tablet  : 768–1024px (any pointer) plus 1025–1400px on
             touch/coarse devices → web app shell with the compact
             icon sidebar and two-column widget grids
   desktop : > 1024px on fine-pointer devices, or > 1400px →
             web app shell with the full sidebar */
export type LayoutMode = 'embed' | 'mobile' | 'tablet' | 'desktop'

export function detectLayoutMode(): LayoutMode {
  if (typeof window === 'undefined') return 'mobile'

  // The 3D Lab renders Fitnpulse inside a high-resolution iframe.
  // The iframe may be 1024/1536/2048px wide, but the app must
  // keep its phone-style 430px layout and scale it proportionally.
  const isEmbedded =
    window.self !== window.top ||
    new URLSearchParams(window.location.search).has('embed')

  if (isEmbedded) {
    return 'embed'
  }

  const w = window.innerWidth

  if (w < 768) return 'mobile'
  if (w <= 1024) return 'tablet'

  if (w <= 1400) {
    const coarse =
      window.matchMedia?.('(pointer: coarse)').matches ?? false

    if (coarse) return 'tablet'
  }

  return 'desktop'
}

function useLayoutMode(): LayoutMode {
  const [mode, setMode] = useState<LayoutMode>(detectLayoutMode)

  useEffect(() => {
    const onResize = () => setMode(detectLayoutMode())

    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    const mq = window.matchMedia?.('(pointer: coarse)')
    mq?.addEventListener?.('change', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      mq?.removeEventListener?.('change', onResize)
    }
  }, [])

  return mode
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

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data && e.data.type === 'FP_SET_THEME') {
        const next = e.data.theme === 'dark' ? 'dark' : 'light'
        setTheme(next)
      }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])
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

  /* ── Web routes ───────────────────────────────────────────
     The four product areas plus the sub-screens the mobile bottom
     nav / FAB already open (Workouts, Activity Log, Add Water,
     Settings). Desktop + tablet render these through the web shell;
     mobile and the embedded presentation keep the phone screens. */
  const WEB_ROUTES = ['home', 'workouts', 'activity', 'addwater', 'community', 'progress', 'account', 'settings']

  const renderWebScreen = (id: string) => {
    const map: Record<string, React.ReactNode> = {
      home:      <WebHomeScreen onNav={nav} />,
      workouts:  <WebWorkoutsScreen onNav={nav} />,
      activity:  <WebActivityLogScreen onNav={nav} />,
      addwater:  <WebActivityLogScreen onNav={nav} initialTab="water" />,
      community: <WebCommunityScreen />,
      progress:  <WebProgressScreen onNav={nav} />,
      account:   <WebAccountScreen onNav={nav} />,
      settings:  <WebSettingsScreen onNav={nav} theme={theme} onToggleTheme={toggleTheme} />,
    }
    return map[id] ?? <WebHomeScreen onNav={nav} />
  }

  /* ── Web first-run journey ────────────────────────────────
     Splash, walkthrough, login / sign up and the setup steps
     (profile, device sync, goals, permissions) as full-page web
     screens instead of the centred phone column. */
  const WEB_AUTH_ROUTES = ['splash', 'onboard1', 'onboard2', 'onboard3', 'login', 'signup', 'profile-setup', 'device-sync', 'goals', 'permissions']

  const renderWebAuthScreen = (id: string) => {
    const map: Record<string, React.ReactNode> = {
      splash:          <WebSplashScreen onNav={nav} />,
      onboard1:        <WebOnboardingScreen slide={0} onNav={nav} />,
      onboard2:        <WebOnboardingScreen slide={1} onNav={nav} />,
      onboard3:        <WebOnboardingScreen slide={2} onNav={nav} />,
      login:           <WebLoginScreen onNav={nav} />,
      signup:          <WebSignUpScreen onNav={nav} />,
      'profile-setup': <WebProfileSetupScreen onNav={nav} />,
      'device-sync':   <WebDeviceSyncScreen onNav={nav} />,
      goals:           <WebGoalSelectionScreen onNav={nav} />,
      permissions:     <WebPermissionsScreen onNav={nav} />,
    }
    return map[id] ?? <WebSplashScreen onNav={nav} />
  }

  const mode = useLayoutMode()
  const isWeb = mode === 'tablet' || mode === 'desktop'
  const isScaled = mode === 'embed'

  /* Embedded presentation scale (/?embed=1 and the 3D / mobile-case
     showcase iframe): fill the embed viewport edge-to-edge with the
     unchanged 430px phone design, uniformly magnified.
     scale = viewportWidth / 430 → painted width = viewport width.
     768w → 1.79, 820w → 1.91, 900w → 2.09, 1024w → 2.38,
     1032w (iPad Pro 13" portrait) → 2.40 edge-to-edge; wider
     landscape (e.g. 1194w/1376w) caps at 2.6 and centers with
     slim balanced margins so text/cards stay usable.
     Cards/text/icons/spacing/nav all grow together — zero side gaps,
     zero stretch. Mobile and the web shell never use this.
     NOTE: coarse-pointer changes don't re-fire resize on some iPads,
     so also listen to the media query itself (see effect below). */
  const tabletScale = (() => {
  if (typeof window === 'undefined') return 1

  const w = window.innerWidth
  return Math.max(1, w / 430)
})()
  /* Keep two decimals for the CSS var; the inline zoom gets full float. */
  const tabletScaleCss = tabletScale.toFixed(2)

  /* Re-evaluate the embed scale when the coarse-pointer match
     changes (iPadOS docked keyboard / stage manager) and on every
     resize/orientation change. A state tick forces recompute since
     tabletScale derives from window.innerWidth each render. */
  const [, setTabletTick] = useState(0)
  useEffect(() => {
    if (!isScaled) return
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
  }, [isScaled])

  /* ── Web application shell (desktop + tablet) ─────────────
     Same product, web presentation: sidebar navigation, top bar with
     the page title / contextual actions and responsive dashboard
     widgets. The pre-auth journey (splash, onboarding, login, profile
     setup, device sync, goals, permissions) keeps the untouched
     centred phone layout. */
  if (isWeb) {
    if (WEB_ROUTES.includes(current)) {
      return (
        <WebApp
          mode={mode === 'desktop' ? 'desktop' : 'tablet'}
          current={current}
          onNav={nav}
          theme={theme}
          onToggleTheme={toggleTheme}
        >
          {renderWebScreen(current)}
        </WebApp>
      )
    }

    /* First-run journey → full-page web screens */
    return renderWebAuthScreen(current)
  }

  return (
    /* Phone layout + embedded presentation — the unchanged 430px
       design. In embed mode it is uniformly scaled edge-to-edge
       (no side gaps), exactly as the 3D showcase expects. */
    <div
      data-breakpoint={mode}
      className={isScaled ? 'fp-shell fp-shell--tablet' : 'fp-shell'}
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
        data-breakpoint={mode}
        data-tablet-scale={isScaled ? tabletScaleCss : undefined}
        className={isScaled ? 'fp-frame fp-frame--tablet' : 'fp-frame'}
        style={{
          width: isScaled ? 430 : '100%',
          maxWidth: 430,
          height: '100dvh',
          overflow: 'hidden',
          position: 'relative',
          margin: '0 auto',
          flexShrink: 0,
          ...(isScaled
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
