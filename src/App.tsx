import { useState } from 'react'
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

const SCREEN_ORDER = [
  'splash','onboard1','onboard2','onboard3','login','signup',
  'profile-setup','device-sync','goals','permissions',
  'home','workouts','activity','community','progress','account','settings',
]

export default function App() {
  const [current, setCurrent] = useState('splash')
  const [animKey, setAnimKey] = useState(0)
  const [dir, setDir] = useState<'fwd' | 'bwd'>('fwd')

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
      community:       <CommunityScreen onNav={nav} />,
      progress:        <ProgressScreen onNav={nav} />,
      account:         <AccountScreen onNav={nav} />,
      settings:        <SettingsScreen onNav={nav} />,
    }
    return map[id] ?? <HomeScreen onNav={nav} />
  }

  return (
    /* Full-viewport mobile shell — no phone frame wrapper */
    <div style={{
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      background: 'linear-gradient(145deg,#f0fdf4 0%,#dcfce7 16%,#cffafe 42%,#e0f2fe 60%,#faf5ff 82%,#fdf4ff 100%)',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div
        key={animKey}
        style={{
          width: '100%',
          maxWidth: 430,
          height: '100dvh',
          overflow: 'hidden',
          position: 'relative',
          animation: `${dir === 'fwd' ? 'screen-enter' : 'screen-enter-back'} 350ms ease-out both`,
        }}
      >
        {renderScreen(current)}
      </div>
    </div>
  )
}
