/* ───────────────────────────────────────────────────────────
   FitPulse — shared product data (single source of truth)

   Everything the product shows lives here: steps, daily metrics,
   charts, challenges, leaderboard, account data and settings.
   Two renderers read from this module —
     • src/screens.tsx     → mobile phone layout (unchanged design)
     • src/webscreens.tsx  → desktop / tablet web dashboard
   so the web app shows exactly the same content as the mobile app
   and the two layouts can never drift apart.
   ─────────────────────────────────────────────────────────── */

import type { ChallengeInfo, ProfileData } from './features'

/* Accent palette — the same brand extremes used by the mobile
   screens and by the CSS theme tokens. */
export const PALETTE = {
  green: '#16A34A',
  lime: '#65A30D',
  cyan: '#0891B2',
  orange: '#EA580C',
  red: '#DC2626',
  purple: '#7C3AED',
  pink: '#DB2777',
} as const

/* ── Main navigation ──────────────────────────────────────────
   Mobile renders this as the bottom tab bar, the web shell as the
   left sidebar. Same four product areas in both. */
export const MAIN_NAV = [
  { id: 'home', emoji: '🏠', label: 'Home' },
  { id: 'progress', emoji: '📊', label: 'Progress' },
  { id: 'community', emoji: '👥', label: 'Community' },
  { id: 'account', emoji: '👤', label: 'Account' },
]

/* ── Notifications (bell) ─────────────────────────────────── */
export interface AppNotification {
  icon: string
  title: string
  msg: string
  time: string
  color: string
}
export const NOTIFICATIONS: AppNotification[] = [
  { icon: '🏆', title: 'Challenge Complete!', msg: 'You finished the Weekly 70K Steps challenge.', time: '2m ago', color: PALETTE.orange },
  { icon: '👥', title: 'Rahul liked your post', msg: '"5K personal best" got 14 reactions!', time: '18m ago', color: PALETTE.green },
  { icon: '🎯', title: 'Daily Goal Reached', msg: 'You hit 10,000 steps today. Keep it up!', time: '1h ago', color: PALETTE.cyan },
  { icon: '❤️', title: 'Heart Rate Alert', msg: 'Resting HR improved: 72 → 68 BPM this week.', time: '3h ago', color: PALETTE.red },
]

/* ── Quick log actions (Home radial FAB / web "+ Log" menu) ── */
export const QUICK_ACTIONS = [
  { icon: '🍎', label: 'Log Meal', nav: 'activity' },
  { icon: '🏋️', label: 'Log Workout', nav: 'workouts' },
  { icon: '💧', label: 'Add Water', nav: 'addwater' },
]

/* ── Home: profile, steps hero, daily metrics ──────────────── */
export const HOME_PROFILE = {
  greeting: 'Good Morning 👋',
  name: 'Ananya',
  avatar: '👩‍🦱',
  streak: '14 streak',
}

export const TODAY_STEPS = 12847
export const WEEK_STEPS = [
  { v: 6200 }, { v: 8100 }, { v: 7400 }, { v: 9800 }, { v: 8600 }, { v: 11200 }, { v: 12847 },
]
export const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
export const STEPS_DELTA = '↑ 28% vs yesterday'
export const STEPS_GOAL_LABEL = '128% Goal'

export interface MetricCard {
  icon: string
  label: string
  value: string
  unit: string
  sub: string
  color: string
}
export const HOME_METRICS: Record<'heart' | 'calories' | 'water' | 'sleep' | 'stress', MetricCard> = {
  heart: { icon: '❤️', label: 'Heart Rate', value: '72', unit: 'BPM', sub: 'Resting · Normal', color: PALETTE.red },
  calories: { icon: '🔥', label: 'Calories', value: '1,847', unit: 'kcal', sub: '482 remaining', color: PALETTE.orange },
  water: { icon: '💧', label: 'Water', value: '1.8', unit: 'L', sub: 'Goal: 2.5L', color: PALETTE.cyan },
  sleep: { icon: '😴', label: 'Sleep', value: '7.4', unit: 'hrs', sub: 'Deep 2.1h', color: PALETTE.purple },
  stress: { icon: '🧠', label: 'Stress', value: 'Low', unit: '', sub: 'Score 24/100', color: PALETTE.lime },
}

export const HOME_WORKOUT = {
  title: 'Start Workout',
  sub: 'Today: Upper body strength',
}

export const AI_INSIGHTS = [
  'Great progress this week! Hit step goal 5 days in a row.',
  'Heart rate improved by 8% — cardio sessions are working!',
  'Consider a rest day — recovery maximizes muscle gains.',
]

export const HOME_CHALLENGE = {
  title: '🏆 Weekly Challenge',
  name: '10,000 Steps Every Day',
  tag: '3 days left',
  pct: 72,
  participants: '1,247 participants',
}

/* ── Progress review ──────────────────────────────────────── */
export const PROGRESS_STATS: MetricCard[] = [
  { icon: '🏋️', label: 'Workouts', value: '24', unit: '', sub: '', color: PALETTE.green },
  { icon: '📅', label: 'Active Days', value: '19/30', unit: '', sub: '', color: PALETTE.cyan },
  { icon: '👟', label: 'Avg Steps', value: '9.8k', unit: '', sub: '', color: PALETTE.lime },
]

export const WEIGHT_TREND = [
  { d: 'W1', v: 74.2 }, { d: 'W2', v: 73.8 }, { d: 'W3', v: 73.1 },
  { d: 'W4', v: 72.6 }, { d: 'W5', v: 72.0 }, { d: 'W6', v: 71.4 }, { d: 'Now', v: 71.0 },
]
export const WEIGHT_SUMMARY = {
  sub: 'Lost 3.2 kg this month',
  delta: '↓ 3.2 kg',
}

export const BMI = {
  label: 'BMI Score',
  value: '22.4',
  tag: 'Normal Weight',
  height: '178 cm',
  weight: '71.0 kg',
}

export const AI_MONTHLY_SUMMARY = {
  title: '✨ AI Monthly Summary',
  body: 'Outstanding month! 19/30 step goals hit, resting HR improved by 8 BPM, and 3.2kg lost. Cardio and strength both trending upward — keep it up! 💪',
  tag: 'Top 5% of users this month',
}

export const BADGES = [
  { icon: '🔥', label: '100 Day Streak', earned: true },
  { icon: '👟', label: '500K Steps', earned: true },
  { icon: '🏃', label: '50 Workouts', earned: true },
  { icon: '💧', label: '30-Day Hydration', earned: false },
  { icon: '💪', label: 'Strength Master', earned: false },
  { icon: '🧘', label: 'Zen Master', earned: false },
]

/* ── Activity log (shared by the web analytics dashboard) ──── */
export const ACTIVITY_TABS = [
  { id: 'steps', label: '👟 Steps' },
  { id: 'heart', label: '❤️ Heart' },
  { id: 'calories', label: '🔥 Calories' },
  { id: 'sleep', label: '😴 Sleep' },
  { id: 'stress', label: '🧠 Stress' },
  { id: 'water', label: '💧 Water' },
]

export const ACTIVITY_STEPS = [
  { d: 'Mon', v: 8200 }, { d: 'Tue', v: 6100 }, { d: 'Wed', v: 9800 },
  { d: 'Thu', v: 7400 }, { d: 'Fri', v: 11200 }, { d: 'Sat', v: 10400 }, { d: 'Sun', v: TODAY_STEPS },
]

/* Hourly heart-rate series (same curve the mobile chart draws). */
export function heartRateSeries() {
  return Array.from({ length: 20 }, (_, i) => ({
    h: `${6 + i}h`,
    v: 58 + Math.round(Math.sin(i * 0.5) * 18 + (i % 3) * 6),
  }))
}

export const SLEEP_STAGES = [
  { name: 'Light', value: 2.8, fill: PALETTE.cyan },
  { name: 'Deep', value: 2.1, fill: PALETTE.purple },
  { name: 'REM', value: 1.6, fill: PALETTE.green },
  { name: 'Awake', value: 0.9, fill: PALETTE.orange },
]

export const ACTIVITY_STEPS_HEADER = {
  label: 'Today',
  value: TODAY_STEPS.toLocaleString(),
  tag: '↑ 28% vs avg',
  goalLabel: 'Goal',
  goal: '10,000',
  goalPct: '128%',
}

export const ACTIVITY_STEP_SUMMARY = [
  { label: 'Avg Daily', value: '9,840', color: PALETTE.green },
  { label: 'Best Day', value: '14,200', color: PALETTE.lime },
  { label: 'This Week', value: '65,947', color: PALETTE.cyan },
]

export const ACTIVITY_HEART = {
  label: 'Current',
  value: '72',
  unit: 'BPM',
  tag: 'Normal Zone',
}

export const ACTIVITY_HEART_SUMMARY = [
  { label: 'Resting', value: '58 BPM', color: PALETTE.green },
  { label: 'Average', value: '72 BPM', color: PALETTE.red },
  { label: 'Max Today', value: '142 BPM', color: PALETTE.orange },
]

export const ACTIVITY_CALORIE_TOTALS = [
  { icon: '🍽️', label: 'Consumed', unit: 'kcal', value: '1,847', color: PALETTE.orange },
  { icon: '🔥', label: 'Burned', unit: 'kcal', value: '682', color: PALETTE.green },
]
export const NUTRITION_PIE = [{ v: 45 }, { v: 30 }, { v: 25 }]
export const NUTRITION_SPLIT = [
  { label: 'Carbs', value: '45%', color: PALETTE.orange },
  { label: 'Protein', value: '30%', color: PALETTE.cyan },
  { label: 'Fat', value: '25%', color: PALETTE.purple },
]

export const ACTIVITY_SLEEP_HEADER = {
  label: 'Last Night',
  value: '7h 24m',
  tag: 'Good Sleep',
  bedtime: 'Bedtime 10:42 PM',
  woke: 'Woke 6:06 AM',
}
export const ACTIVITY_SLEEP_SUMMARY = [
  { label: 'Deep Sleep', value: '2h 6m', color: PALETTE.purple },
  { label: 'REM Sleep', value: '1h 36m', color: PALETTE.green },
  { label: 'Sleep Score', value: '84/100', color: PALETTE.cyan },
]

export const ACTIVITY_STRESS = {
  label: 'Current Stress Level',
  score: '24',
  tag: 'LOW STRESS',
  levels: ['Low', 'Moderate', 'High', 'Very High'],
  markerPct: 24,
}
export const ACTIVITY_MEDITATION = {
  icon: '🧘',
  title: 'Meditation Suggestion',
  sub: '5-min breathing exercise · Tap to start',
}

/* Water tracker */
export const WATER_TOTAL_GLASSES = 8
export const WATER_START_GLASSES = 5
export const WATER_ML_PER_GLASS = 250
export const WATER_GOAL_LABEL = 'of 2.0L daily goal'
export function litersFromGlasses(glasses: number) {
  return ((glasses * WATER_ML_PER_GLASS) / 1000).toFixed(1)
}

/* ── Community ─────────────────────────────────────────────── */
export const COMMUNITY_CHALLENGE: ChallengeInfo = {
  title: 'Weekly 70K',
  desc: 'Walk 70,000 steps between Monday and Sunday. Sync your tracker to earn the finisher badge!',
  reward: '🏆 Finisher Badge',
  endDate: '3d left',
  total: 70000,
  progress: 72,
  img: '🏃',
  participants: [
    { name: 'Rahul K.', avatar: '🧑‍🦰' },
    { name: 'Priya M.', avatar: '👩‍🦳' },
    { name: 'Dev R.', avatar: '🧑‍🦱' },
  ],
}
export const COMMUNITY_PEOPLE: { name: string; avatar: string; added: boolean }[] = [
  { name: 'Rahul K.', avatar: '🧑‍🦰', added: true },
  { name: 'Priya M.', avatar: '👩‍🦳', added: false },
  { name: 'Dev R.', avatar: '🧑‍🦱', added: false },
  { name: 'Meera S.', avatar: '👩', added: false },
  { name: 'Arjun P.', avatar: '👨', added: false },
]
export const COMMUNITY_STATS = [
  { label: 'Steps', value: '50,430' },
  { label: 'Streak', value: '12d' },
  { label: 'Active min', value: '210' },
]
export const ACTIVE_CHALLENGES = [
  { title: 'Weekly 70K', icon: '👟', progress: 72, end: '3d left', color: PALETTE.green },
  { title: 'Hydration Month', icon: '💧', progress: 54, end: '18d left', color: PALETTE.cyan },
]
export const LEADERBOARD = [
  { rank: '🥇', emoji: '👩‍🦱', name: 'Ananya S.', score: '86,420', highlight: true, you: false },
  { rank: '🥈', emoji: '🧑‍🦰', name: 'Rahul K.', score: '79,100', highlight: false, you: false },
  { rank: '🥉', emoji: '👩‍🦳', name: 'Priya M.', score: '71,850', highlight: false, you: false },
  { rank: '8️⃣', emoji: '🧑', name: 'You', score: '65,947', highlight: false, you: true },
]
export const LEADERBOARD_TAG = 'This Week'
export const FEED_POSTS = [
  { emoji: '🧑‍🦰', name: 'Rahul K.', time: '2h ago', msg: 'Completed a 5K run in 28:30 🏃 Personal best!', likes: 14 },
  { emoji: '👩‍🦳', name: 'Priya M.', time: '4h ago', msg: 'Hit 100-day streak! 🔥 So proud of this milestone.', likes: 42 },
  { emoji: '🧑‍🦱', name: 'Dev R.', time: '6h ago', msg: 'New PR: Bench Press 100kg 💪 Strength is growing!', likes: 28 },
]

/* ── Workouts ──────────────────────────────────────────────── */
export const WORKOUT_CATEGORIES = [
  { icon: '🏃', name: 'Running', cal: '450 kcal', color: PALETTE.orange },
  { icon: '🚶', name: 'Walking', cal: '180 kcal', color: PALETTE.green },
  { icon: '🚴', name: 'Cycling', cal: '380 kcal', color: PALETTE.cyan },
  { icon: '🧘', name: 'Yoga', cal: '200 kcal', color: PALETTE.purple },
  { icon: '🏋️', name: 'Strength', cal: '320 kcal', color: PALETTE.red },
  { icon: '⚡', name: 'HIIT', cal: '580 kcal', color: PALETTE.pink },
]
export const ACTIVE_WORKOUT = {
  title: '🏃 Running · Active',
  stats: [
    { label: 'Duration', value: '24:38' },
    { label: 'Calories', value: '287 kcal' },
    { label: 'Distance', value: '3.2 km' },
    { label: 'Pace', value: '7.8/km' },
  ],
}
export const RECENT_WORKOUTS = [
  { icon: '🏃', name: 'Morning Run', time: 'Today 7:20 AM', cal: '412 kcal', dur: '38 min' },
  { icon: '🏋️', name: 'Upper Body', time: 'Yesterday', cal: '298 kcal', dur: '52 min' },
  { icon: '🧘', name: 'Yoga Flow', time: '2 days ago', cal: '145 kcal', dur: '30 min' },
]

/* ── Account ───────────────────────────────────────────────── */
export const ACCOUNT_PROFILE: ProfileData = {
  name: 'Ananya Sharma',
  email: 'ananya@fitpulse.app',
  height: '165',
  weight: '58',
  level: 'Intermediate',
}
export const ACCOUNT_CARD = {
  avatar: '👩‍🦱',
  plan: '⭐ FitPulse Pro',
}
export const ACCOUNT_STATS = [
  { value: '247', label: 'Workouts' },
  { value: '100🔥', label: 'Day Streak' },
  { value: '18', label: 'Badges' },
]
export const PERSONAL_RECORDS = [
  { label: '5K Run', value: '28:30', icon: '🏃', color: PALETTE.cyan },
  { label: 'Bench Press', value: '100kg', icon: '💪', color: PALETTE.orange, num: 100 },
  { label: 'Workouts', value: '247', icon: '🏋️', color: PALETTE.green, num: 247 },
  { label: 'Longest Streak', value: '42d', icon: '🔥', color: PALETTE.red, num: 42 },
]
export const PRIVACY_SETTINGS = [
  { key: 'p1', label: 'Private Profile', desc: 'Hide activity from friends', on: false },
  { key: 'p2', label: 'Activity Status', desc: 'Show when you are online', on: true },
  { key: 'p3', label: 'Data Sharing', desc: 'Share anonymized metrics', on: true },
  { key: 'p4', label: 'Login Alerts', desc: 'Email on new device', on: true },
]

/* `id` drives the shared behaviour (modals / routes), `group` is how
   the web layout arranges the same entries into setting sections. */
export type AccountGroup = 'Profile' | 'Health & Fitness' | 'Subscription' | 'Privacy & Security'
export interface AccountMenuItem {
  id: 'edit' | 'goals' | 'device-sync' | 'subscription' | 'records' | 'privacy' | 'signout'
  group: AccountGroup
  icon: string
  label: string
  sub: string | null
  color: string
}
export const ACCOUNT_MENU: AccountMenuItem[] = [
  { id: 'edit', group: 'Profile', icon: '✏️', label: 'Edit Profile', sub: 'Update your information', color: PALETTE.green },
  { id: 'goals', group: 'Health & Fitness', icon: '🎯', label: 'Goals & Progress', sub: 'Track your milestones', color: PALETTE.cyan },
  { id: 'device-sync', group: 'Health & Fitness', icon: '⌚', label: 'Device Sync', sub: 'Manage connected devices', color: PALETTE.lime },
  { id: 'subscription', group: 'Subscription', icon: '⭐', label: 'Subscription', sub: 'FitPulse Pro · Active', color: PALETTE.orange },
  { id: 'records', group: 'Health & Fitness', icon: '🏆', label: 'Personal Records', sub: 'Your best performances', color: PALETTE.purple },
  { id: 'privacy', group: 'Privacy & Security', icon: '🔒', label: 'Privacy & Security', sub: 'Manage your data', color: '#6B7280' },
  { id: 'signout', group: 'Privacy & Security', icon: '🚪', label: 'Sign Out', sub: null, color: PALETTE.red },
]
export const ACCOUNT_GROUPS: AccountGroup[] = ['Profile', 'Health & Fitness', 'Subscription', 'Privacy & Security']
export const APP_FOOTER = 'FitPulse v3.2.1 · Member since Jan 2024'

/* ── Settings (toggles + rows) ─────────────────────────────── */
export interface SettingsItem {
  key?: string
  icon: string
  label: string
  sub: string
  type: 'toggle' | 'nav'
}
export const SETTINGS_SECTIONS: { title: string; items: SettingsItem[] }[] = [
  {
    title: 'Preferences',
    items: [
      { key: 'notif', icon: '🔔', label: 'Push Notifications', sub: 'Reminders & challenges', type: 'toggle' },
      { key: 'sounds', icon: '🔊', label: 'Sounds', sub: 'Workout & achievement sounds', type: 'toggle' },
      { key: 'haptics', icon: '📳', label: 'Haptic Feedback', sub: 'Vibration on interactions', type: 'toggle' },
      { key: 'dark', icon: '🌙', label: 'Dark Mode', sub: 'Currently disabled', type: 'toggle' },
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

/* ── Brand (splash, auth screens, web sidebar) ─────────────── */
export const BRAND = {
  name: 'FitPulse',
  tagline: 'Track. Improve. Achieve.',
  copyright: '© 2025 FitPulse Inc.',
}

/* ── Device sync (first-run + Account → Device Sync) ───────── */
export const SYNC_DEVICES = [
  { icon: '⌚', name: 'Apple Watch', sub: 'Series 9' },
  { icon: '⌚', name: 'Samsung Watch', sub: 'Galaxy 6' },
  { icon: '🏃', name: 'Fitbit', sub: 'Charge 6' },
  { icon: '🗺️', name: 'Garmin', sub: 'Forerunner 265' },
  { icon: '📱', name: 'Mi Band', sub: 'Band 8 Pro' },
  { icon: '⌚', name: 'Smartwatch', sub: 'Generic BLE' },
]
export const SYNC_STATUS_LABELS: Record<string, string> = {
  idle: 'Tap a device to connect',
  searching: '🔍 Searching...',
  found: '📡 Device Found!',
  connecting: '🔗 Connecting...',
  syncing: '⚡ Syncing...',
  connected: '✅ Connected!',
}

/* ── Goal selection ────────────────────────────────────────── */
export const SETUP_GOALS = [
  { icon: '⚖️', title: 'Lose Weight', sub: 'Burn fat & slim down', color: PALETTE.orange },
  { icon: '💪', title: 'Build Muscle', sub: 'Gain strength & mass', color: PALETTE.cyan },
  { icon: '🏃', title: 'Stay Active', sub: '10k+ steps every day', color: PALETTE.green },
  { icon: '❤️', title: 'Improve Cardio', sub: 'Boost endurance', color: PALETTE.red },
  { icon: '🥗', title: 'Healthy Lifestyle', sub: 'Balanced wellness', color: PALETTE.purple },
]
export const GOAL_DEFAULT_SELECTION = [2]

/* ── Permissions ───────────────────────────────────────────── */
export const PERMISSION_ITEMS = [
  { key: 'notif', icon: '🔔', title: 'Notifications', sub: 'Reminders, achievements & challenges', color: PALETTE.orange },
  { key: 'health', icon: '❤️', title: 'Health Data', sub: 'Steps, heart rate & sleep tracking', color: PALETTE.red },
  { key: 'location', icon: '📍', title: 'Location', sub: 'Route mapping & outdoor workouts', color: PALETTE.green },
  { key: 'bt', icon: '🔵', title: 'Bluetooth', sub: 'Connect wearables & smart devices', color: PALETTE.cyan },
]
export const PERMISSION_DEFAULTS = { notif: true, health: true, location: false, bt: true }

/* ── Profile setup ─────────────────────────────────────────── */
export const PROFILE_FIELDS = [
  { placeholder: 'Full Name', icon: '👤' },
  { placeholder: 'Age', icon: '🎂', type: 'number' },
  { placeholder: 'Height (cm)', icon: '📏', type: 'number' },
  { placeholder: 'Weight (kg)', icon: '⚖️', type: 'number' },
]
export const GENDER_OPTIONS = ['Male', 'Female', 'Other']
export const FITNESS_LEVELS = [
  { id: 'beginner', label: '🌱 Beginner', color: PALETTE.lime },
  { id: 'intermediate', label: '⚡ Intermediate', color: PALETTE.cyan },
  { id: 'advanced', label: '🔥 Advanced', color: PALETTE.orange },
]
export const PROFILE_LEVEL_DEFAULT = 'intermediate'

