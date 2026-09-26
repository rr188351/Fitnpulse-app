/* ───────────────────────────────────────────────────────────
   FitPulse — WEB dashboard screens

   The desktop / tablet presentation of the exact same product that
   lives in src/screens.tsx: same features, same content, same data
   (src/data.ts), same interactions and states — reorganised from
   mobile cards into responsive dashboard widgets.

   Every screen here is rendered inside the web shell
   (src/weblayout.tsx → <WebApp/>). Phones and the embedded
   (/?embed=1) presentation keep using src/screens.tsx untouched.
   ─────────────────────────────────────────────────────────── */
import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  AreaChart, Area, BarChart as RBarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

import { Logo, Tag, Toggle, WaterTab, useCountUp } from './screens'
import {
  FitModal, GBtn, Spinner, JoinChallengeWidget, InvitePeopleWidget, ShareProgressWidget,
  EditProfile, Subscription, PersonalRecords, PrivacySecurity, useDeviceSync,
} from './features'
import {
  PALETTE, ACTIVITY_TABS, ACTIVITY_STEPS, ACTIVITY_STEPS_HEADER, ACTIVITY_STEP_SUMMARY,
  ACTIVITY_HEART, ACTIVITY_HEART_SUMMARY, ACTIVITY_CALORIE_TOTALS, ACTIVITY_SLEEP_HEADER,
  ACTIVITY_SLEEP_SUMMARY, ACTIVITY_STRESS, ACTIVITY_MEDITATION, NUTRITION_PIE, NUTRITION_SPLIT,
  SLEEP_STAGES, heartRateSeries, ACTIVE_CHALLENGES, ACTIVE_WORKOUT, ACCOUNT_CARD, ACCOUNT_GROUPS,
  ACCOUNT_MENU, ACCOUNT_PROFILE, ACCOUNT_STATS, AI_INSIGHTS, AI_MONTHLY_SUMMARY, APP_FOOTER,
  BADGES, BMI, BRAND, COMMUNITY_CHALLENGE, COMMUNITY_PEOPLE, COMMUNITY_STATS, FEED_POSTS, HOME_CHALLENGE,
  HOME_METRICS, HOME_PROFILE, HOME_WORKOUT, LEADERBOARD, LEADERBOARD_TAG, PERSONAL_RECORDS,
  PRIVACY_SETTINGS, PROGRESS_STATS, RECENT_WORKOUTS, SETTINGS_SECTIONS, STEPS_DELTA,
  STEPS_GOAL_LABEL, SYNC_DEVICES, SYNC_STATUS_LABELS, SETUP_GOALS, GOAL_DEFAULT_SELECTION,
  TODAY_STEPS, WEEK_LABELS, WEEK_STEPS, WEIGHT_SUMMARY,
  WEIGHT_TREND, WORKOUT_CATEGORIES, type AccountMenuItem, type MetricCard,
} from './data'

const C = PALETTE

/* Recharts styling shared by every web chart. */
const tipStyle = {
  background: 'var(--fp-surface)',
  border: '1px solid var(--fp-field)',
  borderRadius: 10,
  fontSize: 12,
  color: 'var(--fp-text)',
}
const tickStyle = { fill: 'var(--fp-muted)', fontSize: 11 }

/* ── Layout primitives (desktop card / metric / row) ───────── */
function Card({
  title, subtitle, action, children, className = '',
}: {
  title?: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const head = title || action
  return (
    <section className={`fp-card ${className}`}>
      {head && (
        <header className="fp-card__head">
          <div className="fp-card__heading">
            {title && <h2 className="fp-card__title">{title}</h2>}
            {subtitle && <p className="fp-card__sub">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

function Metric({ m, big = false }: { m: MetricCard; big?: boolean }) {
  return (
    <div className="fp-metric">
      <div className="fp-metric__ico" style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}>{m.icon}</div>
      <div className="fp-metric__label">{m.label}</div>
      <div className="fp-metric__value" style={big ? { fontSize: 30 } : undefined}>
        {m.value}{m.unit ? <span className="fp-metric__unit"> {m.unit}</span> : null}
      </div>
      {m.sub ? <div className="fp-metric__sub">{m.sub}</div> : null}
    </div>
  )
}

function StatStrip({ items }: { items: { label: string; value: string; color: string }[] }) {
  return (
    <div className="fp-strip">
      {items.map(s => (
        <div key={s.label} className="fp-strip__item">
          <div className="fp-strip__value" style={{ color: s.color }}>{s.value}</div>
          <div className="fp-strip__label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

function ProgressBar({ pct, color = C.green }: { pct: number; color?: string }) {
  return (
    <div className="fp-bar">
      <div className="fp-bar__fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color},${C.cyan})` }} />
    </div>
  )
}

/* Page head row — contextual actions for the current page. */
function PageActions({ children }: { children: React.ReactNode }) {
  return <div className="fp-web__w--12 fp-pagehead">{children}</div>
}

/* ═══ HOME ═══════════════════════════════════════════════════
   Same content as the mobile Home screen: greeting, today's steps
   with the weekly chart, the four daily metrics, AI Insights, the
   weekly challenge and the Start Workout entry.                     */
export function WebHomeScreen({ onNav }: { onNav: (s: string) => void }) {
  const steps = useCountUp(TODAY_STEPS, 1400, 400)
  const week = WEEK_STEPS.map((s, i) => ({ ...s, d: WEEK_LABELS[i] ?? '' }))

  return (
    <div className="fp-web__grid">
      {/* Greeting / summary */}
      <Card className="fp-web__w--4">
        <div className="fp-hero">
          <div className="fp-hero__avatar">{HOME_PROFILE.avatar}</div>
          <div>
            <div className="fp-hero__greet">{HOME_PROFILE.greeting}</div>
            <div className="fp-hero__name">{HOME_PROFILE.name}</div>
          </div>
        </div>
        <div className="fp-hero__chips">
          <span className="fp-chip fp-chip--orange">🔥 {HOME_PROFILE.streak}</span>
        </div>
      </Card>

      {/* Today's steps — main progress widget */}
      <Card
        className="fp-web__w--8"
        title="Today's Steps"
        action={<Tag color={C.green}>{STEPS_GOAL_LABEL}</Tag>}
      >
        <div className="fp-hero-steps">
          <div className="fp-hero-steps__value">{steps.toLocaleString()}</div>
          <div className="fp-hero-steps__delta">{STEPS_DELTA}</div>
        </div>
        <div className="fp-chart fp-chart--steps">
          <ResponsiveContainer width="100%" height="100%">
            <RBarChart data={week} barGap={6} barCategoryGap="20%" margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={tickStyle} />
              <Tooltip
                contentStyle={tipStyle}
                cursor={{ fill: 'var(--fp-track)' }}
                formatter={(v: any) => [`${Number(v).toLocaleString()} steps`, 'Steps']}
              />
              <Bar dataKey="v" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={900} animationEasing="ease-out">
                {week.map((_, i) => (
                  <Cell key={i} fill={i === week.length - 1 ? C.green : `${C.green}45`} />
                ))}
              </Bar>
            </RBarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Daily status metrics */}
      <div className="fp-web__w--12 fp-web__metrics">
        {[HOME_METRICS.heart, HOME_METRICS.calories, HOME_METRICS.water, HOME_METRICS.sleep, HOME_METRICS.stress].map(m => (
          <Metric key={m.label} m={m} />
        ))}
      </div>

      {/* AI Insights */}
      <Card
        className="fp-web__w--5 fp-card--accent"
        title="✨ AI Insights"
        action={<Tag color={C.cyan}>New</Tag>}
      >
        {AI_INSIGHTS.map((msg, i) => (
          <div key={i} className="fp-insight">
            <span className="fp-insight__dot">●</span>
            <p className="fp-insight__text">{msg}</p>
          </div>
        ))}
      </Card>

      {/* Weekly challenge */}
      <Card
        className="fp-web__w--4"
        title={HOME_CHALLENGE.title}
        action={<Tag color={C.orange}>{HOME_CHALLENGE.tag}</Tag>}
      >
        <div className="fp-card__sub fp-card__sub--block">{HOME_CHALLENGE.name}</div>
        <ProgressBar pct={HOME_CHALLENGE.pct} color={C.green} />
        <div className="fp-bar__meta">
          <span>{HOME_CHALLENGE.pct}% completed</span>
          <span style={{ color: C.green, fontWeight: 700 }}>{HOME_CHALLENGE.participants}</span>
        </div>
      </Card>

      {/* Start workout */}
      <Card className="fp-web__w--3">
        <button className="fp-cta" onClick={() => onNav('workouts')}>
          <span className="fp-cta__ico">🏋️</span>
          <span className="fp-cta__text">
            <span className="fp-cta__title">{HOME_WORKOUT.title}</span>
            <span className="fp-cta__sub">{HOME_WORKOUT.sub}</span>
          </span>
          <span className="fp-cta__arrow">›</span>
        </button>
      </Card>
    </div>
  )
}

/* ═══ PROGRESS ═══════════════════════════════════════════════
   The mobile Progress review as a web analytics dashboard:
   period switch, monthly totals, weight trend, BMI, the AI Monthly
   Summary, the achievement badges and the entry to the detailed
   Activity Log. Same numbers, bigger charts.                        */
export function WebProgressScreen({ onNav }: { onNav: (s: string) => void }) {
  const [period, setPeriod] = useState<'week' | 'month'>('month')

  return (
    <div className="fp-web__grid">
      <PageActions>
        <div className="fp-seg">
          {(['week', 'month'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`fp-seg__btn ${period === p ? 'is-active' : ''}`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <button className="fp-web__btn" onClick={() => {}}>📄 Download PDF Report</button>
      </PageActions>

      <div className="fp-web__w--12 fp-web__metrics fp-web__metrics--3">
        {PROGRESS_STATS.map(s => <Metric key={s.label} m={s} />)}
      </div>

      {/* Primary progress visualisation */}
      <Card
        className="fp-web__w--8"
        title="Weight Trend"
        subtitle={WEIGHT_SUMMARY.sub}
        action={<Tag color={C.green}>{WEIGHT_SUMMARY.delta}</Tag>}
      >
        <div className="fp-chart fp-chart--lg">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEIGHT_TREND} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="wGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={tickStyle} />
              <YAxis
                domain={[70, 75]}
                axisLine={false}
                tickLine={false}
                tick={tickStyle}
                width={46}
                tickFormatter={(v: any) => `${v} kg`}
              />
              <Tooltip contentStyle={tipStyle} formatter={(v: any) => [`${v} kg`, 'Weight']} />
              <Area
                type="monotone"
                dataKey="v"
                stroke={C.green}
                fill="url(#wGrad2)"
                strokeWidth={3}
                dot={{ r: 4, fill: C.green, strokeWidth: 2, stroke: 'var(--fp-surface)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* BMI */}
      <Card className="fp-web__w--4" title={BMI.label}>
        <div className="fp-bmi">
          <div className="fp-bmi__ico">⚕️</div>
          <div>
            <div className="fp-bmi__value">{BMI.value}</div>
            <Tag color={C.green}>{BMI.tag}</Tag>
          </div>
        </div>
        <div className="fp-bmi__meta">
          <div><span className="fp-bmi__key">Height</span><span className="fp-bmi__val">{BMI.height}</span></div>
          <div><span className="fp-bmi__key">Weight</span><span className="fp-bmi__val">{BMI.weight}</span></div>
        </div>
      </Card>

      {/* AI Monthly Summary */}
      <Card
        className="fp-web__w--7 fp-card--accent fp-card--accent-cyan"
        title={AI_MONTHLY_SUMMARY.title}
        action={<Tag color={C.green}>{AI_MONTHLY_SUMMARY.tag}</Tag>}
      >
        <p className="fp-body-text">{AI_MONTHLY_SUMMARY.body}</p>
      </Card>

      {/* Detailed analytics entry */}
      <Card className="fp-web__w--5">
        <button className="fp-cta" onClick={() => onNav('activity')}>
          <span className="fp-cta__ico">📊</span>
          <span className="fp-cta__text">
            <span className="fp-cta__title">Activity Log</span>
            <span className="fp-cta__sub">Detailed health analytics</span>
          </span>
          <span className="fp-cta__arrow">›</span>
        </button>
      </Card>

      {/* Badges */}
      <Card className="fp-web__w--12" title="Achievement Badges">
        <div className="fp-badges">
          {BADGES.map((b, i) => (
            <div
              key={b.label}
              className={`fp-badge ${b.earned ? 'is-earned' : ''}`}
              style={{ animation: b.earned ? `badge-pop 450ms cubic-bezier(0.34,1.56,0.64,1) ${i * 100}ms both` : undefined }}
            >
              <div className="fp-badge__ico">{b.icon}</div>
              <div className="fp-badge__label">{b.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ═══ ACTIVITY LOG ═══════════════════════════════════════════
   The six analytics tabs of the mobile Activity Log (steps, heart,
   calories, sleep, stress, water) as wide web chart widgets.         */
export function WebActivityLogScreen({ onNav, initialTab }: { onNav: (s: string) => void; initialTab?: string }) {
  const [tab, setTab] = useState(initialTab ?? 'steps')
  const hr = heartRateSeries()

  return (
    <div className="fp-web__grid">
      <PageActions>
        <div className="fp-tabs">
          {ACTIVITY_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`fp-tab ${tab === t.id ? 'is-active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button className="fp-web__btn" onClick={() => onNav('progress')}>‹ Progress</button>
      </PageActions>

      {tab === 'steps' && (
        <>
          <Card className="fp-web__w--12" title="Steps">
            <div className="fp-split">
              <div>
                <div className="fp-big-label">{ACTIVITY_STEPS_HEADER.label}</div>
                <div className="fp-big-value">{ACTIVITY_STEPS_HEADER.value}</div>
                <Tag color={C.green}>{ACTIVITY_STEPS_HEADER.tag}</Tag>
              </div>
              <div className="fp-goal">
                <div className="fp-goal__label">{ACTIVITY_STEPS_HEADER.goalLabel}</div>
                <div className="fp-goal__value">{ACTIVITY_STEPS_HEADER.goal}</div>
                <div className="fp-goal__pct">{ACTIVITY_STEPS_HEADER.goalPct}</div>
              </div>
            </div>
            <div className="fp-chart fp-chart--lg">
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={ACTIVITY_STEPS} barCategoryGap="24%" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={tickStyle} />
                  <YAxis axisLine={false} tickLine={false} tick={tickStyle} width={52} tickFormatter={(v: any) => Number(v).toLocaleString()} />
                  <Tooltip
                    contentStyle={tipStyle}
                    cursor={{ fill: 'var(--fp-track)' }}
                    formatter={(v: any) => [`${Number(v).toLocaleString()} steps`, 'Steps']}
                  />
                  <Bar dataKey="v" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={1000} animationEasing="ease-out">
                    {ACTIVITY_STEPS.map((_, i) => (
                      <Cell key={i} fill={i === ACTIVITY_STEPS.length - 1 ? C.green : `${C.green}45`} />
                    ))}
                  </Bar>
                </RBarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <div className="fp-web__w--12">
            <StatStrip items={ACTIVITY_STEP_SUMMARY} />
          </div>
        </>
      )}

      {tab === 'heart' && (
        <>
          <Card className="fp-web__w--12" title="Heart Rate">
            <div className="fp-split">
              <div>
                <div className="fp-big-label">{ACTIVITY_HEART.label}</div>
                <div className="fp-big-value">
                  {ACTIVITY_HEART.value} <span className="fp-big-unit">{ACTIVITY_HEART.unit}</span>
                </div>
                <Tag color={C.green}>{ACTIVITY_HEART.tag}</Tag>
              </div>
              <div className="fp-heart-ico">❤️</div>
            </div>
            <div className="fp-chart fp-chart--lg">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hr} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hrG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.red} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={C.red} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="h" axisLine={false} tickLine={false} tick={tickStyle} interval={3} />
                  <YAxis axisLine={false} tickLine={false} tick={tickStyle} width={46} />
                  <Tooltip contentStyle={tipStyle} formatter={(v: any) => [`${v} BPM`, 'Heart rate']} />
                  <Area type="monotone" dataKey="v" stroke={C.red} fill="url(#hrG)" strokeWidth={3} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <div className="fp-web__w--12">
            <StatStrip items={ACTIVITY_HEART_SUMMARY} />
          </div>
        </>
      )}

      {tab === 'calories' && (
        <>
          <div className="fp-web__w--5 fp-web__metrics fp-web__metrics--2">
            {ACTIVITY_CALORIE_TOTALS.map(t => (
              <div key={t.label} className="fp-metric fp-metric--center">
                <div className="fp-metric__ico" style={{ background: `${t.color}15`, border: `1px solid ${t.color}25` }}>{t.icon}</div>
                <div className="fp-metric__value" style={{ color: t.color, fontSize: 30 }}>{t.value}</div>
                <div className="fp-metric__label">{t.label} {t.unit}</div>
              </div>
            ))}
          </div>
          <Card className="fp-web__w--7" title="Nutrition Breakdown">
            <div className="fp-nutrition">
              <PieChart width={170} height={170}>
                <Pie data={NUTRITION_PIE} cx={85} cy={85} innerRadius={46} outerRadius={80} dataKey="v" paddingAngle={3}>
                  {[C.orange, C.cyan, C.purple].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip contentStyle={tipStyle} formatter={(v: any) => [`${v}%`, 'Share']} />
              </PieChart>
              <div className="fp-legend">
                {NUTRITION_SPLIT.map(n => (
                  <div key={n.label} className="fp-legend__row">
                    <span className="fp-legend__dot" style={{ background: n.color }} />
                    <span className="fp-legend__label">{n.label}</span>
                    <span className="fp-legend__value" style={{ color: n.color }}>{n.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </>
      )}

      {tab === 'sleep' && (
        <>
          <Card className="fp-web__w--12" title="Sleep">
            <div className="fp-split">
              <div>
                <div className="fp-big-label">{ACTIVITY_SLEEP_HEADER.label}</div>
                <div className="fp-big-value">{ACTIVITY_SLEEP_HEADER.value}</div>
                <Tag color={C.green}>{ACTIVITY_SLEEP_HEADER.tag}</Tag>
              </div>
              <div className="fp-sleepmeta">
                <div>{ACTIVITY_SLEEP_HEADER.bedtime}</div>
                <div>{ACTIVITY_SLEEP_HEADER.woke}</div>
              </div>
            </div>
            <div className="fp-chart fp-chart--md">
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={SLEEP_STAGES} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={tickStyle}
                    width={64}
                  />
                  <Tooltip contentStyle={tipStyle} formatter={(v: any) => [`${v} h`, 'Duration']} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
                    {SLEEP_STAGES.map((s, i) => <Cell key={i} fill={s.fill} />)}
                  </Bar>
                </RBarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <div className="fp-web__w--12">
            <StatStrip items={ACTIVITY_SLEEP_SUMMARY} />
          </div>
        </>
      )}

      {tab === 'stress' && (
        <Card className="fp-web__w--12">
          <div className="fp-stress">
            <div className="fp-stress__score">
              <div className="fp-big-label">{ACTIVITY_STRESS.label}</div>
              <div className="fp-big-value fp-big-value--xl" style={{ color: C.green }}>{ACTIVITY_STRESS.score}</div>
              <Tag color={C.green}>{ACTIVITY_STRESS.tag}</Tag>
            </div>
            <div className="fp-stress__scale">
              <div className="fp-stress__track">
                <div className="fp-stress__marker" style={{ left: `${ACTIVITY_STRESS.markerPct}%` }} />
              </div>
              <div className="fp-stress__levels">
                {ACTIVITY_STRESS.levels.map(l => <span key={l}>{l}</span>)}
              </div>
              <div className="fp-cta fp-cta--static">
                <span className="fp-cta__ico">{ACTIVITY_MEDITATION.icon}</span>
                <span className="fp-cta__text">
                  <span className="fp-cta__title">{ACTIVITY_MEDITATION.title}</span>
                  <span className="fp-cta__sub">{ACTIVITY_MEDITATION.sub}</span>
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {tab === 'water' && (
        <Card className="fp-web__w--12">
          <div className="fp-water-wrap">
            <WaterTab />
          </div>
        </Card>
      )}
    </div>
  )
}

/* ═══ WORKOUTS ═══════════════════════════════════════════════
   Workout categories, the live workout tracker and the recent
   workout list, laid out as a desktop training page.                */
export function WebWorkoutsScreen({ onNav }: { onNav: (s: string) => void }) {
  const [active, setActive] = useState(false)

  return (
    <div className="fp-web__grid">
      <PageActions>
        <div className="fp-search">
          <span className="fp-search__ico">🔍</span>
          <span className="fp-search__ph">Search workouts...</span>
        </div>
        <button className="fp-web__btn" onClick={() => onNav('home')}>‹ Home</button>
      </PageActions>

      <Card className="fp-web__w--7">
        <div className="fp-cats">
          {WORKOUT_CATEGORIES.map(c => (
            <button key={c.name} className="fp-cat" onClick={() => setActive(true)}>
              <span className="fp-cat__ico" style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>{c.icon}</span>
              <span className="fp-cat__name">{c.name}</span>
              <span className="fp-cat__cal" style={{ color: c.color }}>~{c.cal}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="fp-web__w--5 fp-stack">
        {active ? (
          <Card className="fp-card--live">
            <div className="fp-live__head">
              <span className="fp-live__title">{ACTIVE_WORKOUT.title}</span>
              <span className="fp-live__dot" />
            </div>
            <div className="fp-live__stats">
              {ACTIVE_WORKOUT.stats.map(s => (
                <div key={s.label}>
                  <div className="fp-live__value">{s.value}</div>
                  <div className="fp-live__label">{s.label}</div>
                </div>
              ))}
            </div>
            <GBtn
              onClick={() => setActive(false)}
              style={{ background: `linear-gradient(135deg,${C.red},#b91c1c)`, boxShadow: `0 4px 16px ${C.red}40` }}
            >
              ⏹ Stop Workout
            </GBtn>
          </Card>
        ) : (
          <Card>
            <GBtn onClick={() => setActive(true)}>▶ Start Workout</GBtn>
          </Card>
        )}

        <Card title="Recent Workouts">
          {RECENT_WORKOUTS.map((w, i) => (
            <div
              key={w.name}
              className="fp-row fp-row--static"
              style={{ borderBottom: i < RECENT_WORKOUTS.length - 1 ? '1px solid var(--fp-track)' : 'none' }}
            >
              <span className="fp-row__ico" style={{ background: `${C.green}15`, border: `1px solid ${C.green}25` }}>{w.icon}</span>
              <span className="fp-row__body">
                <span className="fp-row__label">{w.name}</span>
                <span className="fp-row__sub">{w.time}</span>
              </span>
              <span className="fp-row__right">
                <span className="fp-row__value" style={{ color: C.orange }}>{w.cal}</span>
                <span className="fp-row__sub">{w.dur}</span>
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

/* ═══ COMMUNITY ══════════════════════════════════════════════
   Challenges, leaderboard and the friends feed on a wide web
   canvas. The join / invite / share flows reuse the exact same
   widgets and modals the mobile app opens.                          */
export function WebCommunityScreen() {
  const [likes, setLikes] = useState([false, false, false])
  const [flow, setFlow] = useState<null | 'join' | 'invite' | 'share'>(null)
  const [joined, setJoined] = useState(false)

  return (
    <div className="fp-web__grid">
      <PageActions>
        {joined && (
          <div className="fp-joined">
            🎉 You joined <b>Weekly 70K</b> — good luck!
          </div>
        )}
        <button className="fp-web__btn fp-web__btn--primary" onClick={() => setFlow('join')}>
          <span className="fp-web__btn-plus">+</span> Join Challenge
        </button>
      </PageActions>

      {/* Active challenges */}
      <div className="fp-web__w--12 fp-section-title">Active Challenges</div>
      {ACTIVE_CHALLENGES.map(c => (
        <Card key={c.title} className="fp-web__w--6">
          <div className="fp-chal">
            <span className="fp-chal__ico" style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>{c.icon}</span>
            <div className="fp-chal__body">
              <div className="fp-chal__title">{c.title}</div>
              <div className="fp-chal__end">{c.end}</div>
              <ProgressBar pct={c.progress} color={c.color} />
              <div className="fp-chal__pct" style={{ color: c.color }}>{c.progress}%</div>
            </div>
          </div>
        </Card>
      ))}

      {/* Leaderboard */}
      <Card
        className="fp-web__w--5"
        title="🏆 Leaderboard"
        action={<Tag color={C.orange}>{LEADERBOARD_TAG}</Tag>}
      >
        {LEADERBOARD.map((u, i) => (
          <div
            key={u.name}
            className={`fp-lb ${u.you ? 'is-you' : ''}`}
            style={{ borderBottom: i < LEADERBOARD.length - 1 ? '1px solid var(--fp-track)' : 'none' }}
          >
            <span className="fp-lb__rank">{u.rank}</span>
            <span className="fp-lb__avatar">{u.emoji}</span>
            <span className="fp-lb__name">{u.name}</span>
            <span className="fp-lb__score">{u.score}</span>
          </div>
        ))}
      </Card>

      {/* Friends feed */}
      <Card className="fp-web__w--7" title="Friends Activity">
        {FEED_POSTS.map((post, i) => (
          <div key={post.name} className="fp-post" style={{ marginBottom: i < FEED_POSTS.length - 1 ? 12 : 0 }}>
            <div className="fp-post__head">
              <span className="fp-post__avatar">{post.emoji}</span>
              <span className="fp-post__who">
                <span className="fp-post__name">{post.name}</span>
                <span className="fp-post__time">{post.time}</span>
              </span>
            </div>
            <p className="fp-post__msg">{post.msg}</p>
            <div className="fp-post__actions">
              {[
                { icon: likes[i] ? '❤️' : '🤍', label: `${post.likes + (likes[i] ? 1 : 0)}`, action: () => setLikes(p => { const n = [...p]; n[i] = !n[i]; return n }) },
                { icon: '💬', label: 'Comment', action: undefined },
                { icon: '↗️', label: 'Share', action: undefined },
              ].map((a, j) => (
                <button key={j} className="fp-post__btn" onClick={a.action}>
                  <span className="fp-post__btn-ico">{a.icon}</span> {a.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </Card>

      {/* Same join / invite / share flow as the mobile Community screen */}
      <FitModal open={flow === 'join'} title="Join Challenge" subtitle="Weekly 70K Steps · 72% complete · 3d left" onClose={() => setFlow(null)}>
        <JoinChallengeWidget
          challenge={COMMUNITY_CHALLENGE}
          onAccept={() => setJoined(true)}
          onInvite={() => setFlow('invite')}
          onShare={() => setFlow('share')}
        />
      </FitModal>
      <FitModal open={flow === 'invite'} title="Invite People" subtitle="Invite friends to this challenge" onClose={() => setFlow(null)}>
        <InvitePeopleWidget people={COMMUNITY_PEOPLE} onBack={() => setFlow('join')} onInvite={() => setFlow(null)} />
      </FitModal>
      <FitModal open={flow === 'share'} title="Share Progress" subtitle="Share your Weekly 70K progress" onClose={() => setFlow(null)}>
        <ShareProgressWidget challenge={COMMUNITY_CHALLENGE} stats={COMMUNITY_STATS} onBack={() => setFlow(null)} />
      </FitModal>
    </div>
  )
}

/* ═══ ACCOUNT ════════════════════════════════════════════════
   Profile overview plus grouped settings sections
   (Profile · Health & Fitness · Subscription · Privacy & Security).
   Every entry keeps its exact behaviour: Edit Profile, Subscription,
   Personal Records and Privacy & Security open the same modals the
   mobile app opens; Goals & Progress and Device Sync now open as
   in-shell sheets (same widgets/data as the first-run screens);
   Sign Out keeps its route.                                        */
export function WebAccountScreen({ onNav }: { onNav: (s: string) => void }) {
  const [modal, setModal] = useState<null | 'edit' | 'subscription' | 'records' | 'privacy' | 'sync' | 'goals'>(null)

  const select = (id: AccountMenuItem['id']) => {
    if (id === 'edit') setModal('edit')
    else if (id === 'subscription') setModal('subscription')
    else if (id === 'records') setModal('records')
    else if (id === 'privacy') setModal('privacy')
    else if (id === 'device-sync') setModal('sync')
    else if (id === 'goals') setModal('goals')
    else onNav('login')
  }

  return (
    <div className="fp-web__grid">
      <PageActions>
        <button className="fp-web__btn" onClick={() => onNav('settings')}>⚙️ Settings</button>
      </PageActions>

      {/* Profile overview */}
      <Card className="fp-web__w--5 fp-card--profile">
        <div className="fp-profile">
          <div className="fp-profile__avatar">
            {ACCOUNT_CARD.avatar}
            <span className="fp-profile__edit">✏️</span>
          </div>
          <div className="fp-profile__name">{ACCOUNT_PROFILE.name}</div>
          <div className="fp-profile__mail">{ACCOUNT_PROFILE.email}</div>
          <Tag color={C.lime}>{ACCOUNT_CARD.plan}</Tag>
          <div className="fp-profile__stats">
            {ACCOUNT_STATS.map(s => (
              <div key={s.label} className="fp-profile__stat">
                <div className="fp-profile__value">{s.value}</div>
                <div className="fp-profile__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="fp-profile__foot">{APP_FOOTER}</div>
      </Card>

      {/* Grouped account sections */}
      <div className="fp-web__w--7 fp-stack">
        {ACCOUNT_GROUPS.map(group => (
          <Card key={group} title={group}>
            {ACCOUNT_MENU.filter(m => m.group === group).map(m => (
              <button
                key={m.id}
                className={`fp-row ${m.id === 'signout' ? 'is-danger' : ''}`}
                onClick={() => select(m.id)}
              >
                <span className="fp-row__ico" style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}>{m.icon}</span>
                <span className="fp-row__body">
                  <span className="fp-row__label">{m.label}</span>
                  {m.sub && <span className="fp-row__sub">{m.sub}</span>}
                </span>
                {m.id !== 'signout' && <span className="fp-row__arrow">›</span>}
              </button>
            ))}
          </Card>
        ))}
      </div>

      {/* Existing account modals (unchanged widgets) */}
      <FitModal open={modal === 'edit'} title="Edit Profile" subtitle="Update your information" onClose={() => setModal(null)}>
        <EditProfile profile={ACCOUNT_PROFILE} onBack={() => setModal(null)} onSave={() => {}} />
      </FitModal>
      <FitModal open={modal === 'subscription'} title="Subscription" subtitle="FitPulse Pro" onClose={() => setModal(null)}>
        <Subscription onBack={() => setModal(null)} onUpgrade={() => setModal(null)} />
      </FitModal>
      <FitModal open={modal === 'records'} title="Personal Records" subtitle="Your best performances" onClose={() => setModal(null)}>
        <PersonalRecords records={PERSONAL_RECORDS} onBack={() => setModal(null)} />
      </FitModal>
      <FitModal open={modal === 'privacy'} title="Privacy & Security" subtitle="Manage your data" onClose={() => setModal(null)}>
        <PrivacySecurity settings={PRIVACY_SETTINGS} onBack={() => setModal(null)} onUpdate={() => {}} />
      </FitModal>
      <FitModal open={modal === 'sync'} title="Device Sync" subtitle="Pair your tracker for complete health sync" onClose={() => setModal(null)}>
        <DeviceSyncSheet onDone={() => setModal(null)} />
      </FitModal>
      <FitModal open={modal === 'goals'} title="Goals & Progress" subtitle="Select all that apply — you can change later" onClose={() => setModal(null)}>
        <GoalsSheet onDone={() => setModal(null)} />
      </FitModal>
    </div>
  )
}

/* ═══ SETTINGS SUB-WIDGETS ═══════════════════════════════════
   Every settings row that used to be a dead "›" now opens a real
   sheet: Privacy Settings (the shared PrivacySecurity widget),
   Security, Language, Backup & Restore, Help & Support and About.
   Copy reuses the app's existing wording wherever it exists.       */
export type SheetId = 'privacy' | 'security' | 'language' | 'backup' | 'help' | 'about'

export const SETTINGS_SHEETS: Record<string, SheetId> = {
  'Privacy Settings': 'privacy',
  'Security': 'security',
  'Language': 'language',
  'Backup & Restore': 'backup',
  'Help & Support': 'help',
  'About FitPulse': 'about',
}

const LANGUAGES = [
  'English (US)', 'English (UK)', 'हिन्दी', 'Español', 'Deutsch', 'Français', '日本語',
]

const HELP_FAQS = [
  {
    q: 'How do I sync my tracker?',
    a: 'Open Account → Device Sync and pick your device. FitPulse pairs over Bluetooth and imports steps, heart rate and sleep.',
  },
  {
    q: 'How are my streak and challenges tracked?',
    a: 'Every day you hit your goal feeds the streak on Home, and any challenge you join shows up in Community.',
  },
  {
    q: 'Can I change my daily goal?',
    a: 'Yes — Account → Goals & Progress lets you update your targets at any time.',
  },
  {
    q: 'How is my health data protected?',
    a: 'Your health data stays encrypted and under your control; manage access from Privacy & Security.',
  },
]

function SheetRows({ children }: { children: ReactNode }) {
  return <div className="fp-sheet__rows">{children}</div>
}

/* ── Security ───────────────────────────────────────────── */
export function SecuritySheet({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState([
    { key: 'bio', label: 'Biometrics & passcode', desc: 'Unlock FitPulse with your device security', on: true },
    { key: 'alerts', label: 'Login Alerts', desc: 'Email on new device', on: true },
    { key: 'lock', label: 'Auto-lock', desc: 'Ask again when FitPulse returns to the foreground', on: false },
  ])

  return (
    <>
      <SheetRows>
        {rows.map(r => (
          <div key={r.key} className="fp-row fp-row--static">
            <span className="fp-row__body">
              <span className="fp-row__label">{r.label}</span>
              <span className="fp-row__sub">{r.desc}</span>
            </span>
            <Toggle
              on={r.on}
              onToggle={() => setRows(p => p.map(x => (x.key === r.key ? { ...x, on: !x.on } : x)))}
            />
          </div>
        ))}
      </SheetRows>
      <div className="fp-sheet__note">🔐 Your health data stays encrypted and under your control.</div>
      <GBtn variant="outline" onClick={onBack} style={{ marginTop: 12 }}>← Back</GBtn>
    </>
  )
}

/* ── Language ───────────────────────────────────────────── */
export function LanguageSheet({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(LANGUAGES[0])

  return (
    <>
      <SheetRows>
        {LANGUAGES.map(lang => (
          <button
            key={lang}
            className="fp-row"
            onClick={() => setCurrent(lang)}
          >
            <span className="fp-row__body">
              <span className={`fp-row__label ${current === lang ? 'is-active' : ''}`}>{lang}</span>
            </span>
            {current === lang && <span className="fp-sheet__check">✓</span>}
          </button>
        ))}
      </SheetRows>
      <div className="fp-sheet__note">The app language changes instantly across FitPulse.</div>
      <GBtn variant="outline" onClick={onBack} style={{ marginTop: 12 }}>← Back</GBtn>
    </>
  )
}

/* ── Backup & Restore ───────────────────────────────────── */
export function BackupSheet({ onBack }: { onBack: () => void }) {
  const [auto, setAuto] = useState(true)
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')

  const runBackup = () => {
    if (status === 'running') return
    setStatus('running')
    setTimeout(() => setStatus('done'), 1400)
  }

  return (
    <>
      <SheetRows>
        <div className="fp-row fp-row--static">
          <span className="fp-row__body">
            <span className="fp-row__label">Auto Backup</span>
            <span className="fp-row__sub">Backup data to cloud</span>
          </span>
          <Toggle on={auto} onToggle={() => setAuto(a => !a)} />
        </div>
      </SheetRows>

      <div className="fp-sheet__status">
        {status === 'running' && <><Spinner color={C.cyan} /> Backing up…</>}
        {status === 'done' && <span className="fp-sheet__ok">✓ Backup complete</span>}
        {status === 'idle' && <span className="fp-sheet__idle">☁️ Your data is safe in the cloud</span>}
      </div>

      <GBtn onClick={runBackup} disabled={status === 'running'} style={{ opacity: status === 'running' ? 0.75 : 1 }}>
        ⬆️ Backup now
      </GBtn>
      <GBtn variant="outline" onClick={onBack} style={{ marginTop: 12 }}>← Back</GBtn>
    </>
  )
}

/* ── Help & Support ─────────────────────────────────────── */
export function HelpSheet({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <div className="fp-sheet__label">Frequently asked</div>
      <SheetRows>
        {HELP_FAQS.map((f, i) => (
          <div key={f.q} className="fp-sheet__faq">
            <button className="fp-sheet__faq-q" onClick={() => setOpen(open === i ? null : i)}>
              <span>{f.q}</span>
              <span className="fp-sheet__faq-ico">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="fp-sheet__faq-a">{f.a}</p>}
          </div>
        ))}
      </SheetRows>

      <div className="fp-sheet__label">Contact us</div>
      <a className="fp-sheet__contact" href="mailto:support@fitpulse.app">
        <span className="fp-row__ico fp-row__ico--plain">✉️</span>
        <span className="fp-row__body">
          <span className="fp-row__label">Email support</span>
          <span className="fp-row__sub">We usually reply within one day</span>
        </span>
        <span className="fp-row__arrow">›</span>
      </a>

      <GBtn variant="outline" onClick={onBack} style={{ marginTop: 16 }}>← Back</GBtn>
    </>
  )
}

/* ── About ──────────────────────────────────────────────── */
export function AboutSheet({ onBack }: { onBack: () => void }) {
  return (
    <>
      <div className="fp-sheet__about">
        <Logo size={64} />
        <div className="fp-sheet__about-name">{BRAND.name}</div>
        <div className="fp-sheet__about-tag">{BRAND.tagline}</div>
      </div>

      <SheetRows>
        <div className="fp-row fp-row--static">
          <span className="fp-row__ico fp-row__ico--plain">ℹ️</span>
          <span className="fp-row__body">
            <span className="fp-row__label">Version</span>
            <span className="fp-row__sub">v3.2.1 · Legal &amp; licenses</span>
          </span>
        </div>
        <div className="fp-row fp-row--static">
          <span className="fp-row__ico fp-row__ico--plain">⭐</span>
          <span className="fp-row__body">
            <span className="fp-row__label">{ACCOUNT_CARD.plan.replace('⭐ ', '')}</span>
            <span className="fp-row__sub">{APP_FOOTER}</span>
          </span>
        </div>
      </SheetRows>

      <div className="fp-sheet__note">{BRAND.copyright}</div>
      <GBtn variant="outline" onClick={onBack} style={{ marginTop: 12 }}>← Back</GBtn>
    </>
  )
}

/* ── Account → Device Sync (in-shell sheet) ─────────────────
   Same state machine (useDeviceSync) and same device list as the
   first-run screen — rendered inside the shell's modal instead of
   leaving the dashboard.                                             */
export function DeviceSyncSheet({ onDone }: { onDone: () => void }) {
  const { syncSt, syncDevice, syncPct, startSync, isConnected } = useDeviceSync()
  const statusColor = isConnected ? C.green : syncSt === 'idle' ? 'var(--fp-muted)' : C.cyan

  return (
    <>
      <div className="fp-sheet__strip">
        <span style={{ color: statusColor }}>{SYNC_STATUS_LABELS[syncSt]}</span>
        {syncSt === 'syncing' && <span style={{ color: C.cyan, fontWeight: 700 }}>{syncPct}%</span>}
      </div>

      {syncSt !== 'idle' && (
        <div className="fp-sheet__bar">
          <div
            className="fp-sheet__bar-fill"
            style={{
              width: `${syncPct}%`,
              background: isConnected
                ? `linear-gradient(90deg,${C.green},${C.lime})`
                : `linear-gradient(90deg,${C.cyan},${C.green})`,
            }}
          />
        </div>
      )}

      <div className="fp-sync-grid">
        {SYNC_DEVICES.map((d, i) => {
          const active = syncDevice === i && isConnected
          return (
            <button key={d.name} className={`fp-sync-dev ${active ? 'is-on' : ''}`} onClick={() => startSync(i)}>
              <span className="fp-sync-dev__ico">{d.icon}</span>
              <span className="fp-sync-dev__name">{d.name}</span>
              <span className="fp-sync-dev__sub">{d.sub}</span>
              {syncDevice === i && syncSt !== 'idle' && (
                <span className="fp-sync-dev__st" style={{ color: isConnected ? C.green : C.cyan }}>
                  {isConnected ? '✓ Connected' : SYNC_STATUS_LABELS[syncSt].replace(/[^a-zA-Z .!]/g, '')}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <GBtn onClick={onDone} style={{ marginTop: 16 }}>
        {isConnected ? 'Done' : 'Skip for Now'}
      </GBtn>
    </>
  )
}

/* ── Account → Goals & Progress (in-shell sheet) ──────────────
   The same goal picker the first-run flow uses (SETUP_GOALS +
   GOAL_DEFAULT_SELECTION), kept inside the shell.                 */
export function GoalsSheet({ onDone }: { onDone: () => void }) {
  const [selected, setSelected] = useState<number[]>(GOAL_DEFAULT_SELECTION)
  const toggle = (i: number) =>
    setSelected(prev => (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]))

  return (
    <>
      <div className="fp-goals-grid">
        {SETUP_GOALS.map((g, i) => {
          const on = selected.includes(i)
          return (
            <button
              key={g.title}
              className={`fp-goal-card ${on ? 'is-on' : ''}`}
              style={{ '--gc': g.color } as CSSProperties}
              onClick={() => toggle(i)}
            >
              <span className="fp-goal-card__ico" style={{ background: `${g.color}15`, border: `1px solid ${g.color}30` }}>{g.icon}</span>
              <span className="fp-goal-card__body">
                <span className="fp-goal-card__title">{g.title}</span>
                <span className="fp-goal-card__sub">{g.sub}</span>
              </span>
              <span className="fp-goal-card__check">{on ? '✓' : ''}</span>
            </button>
          )
        })}
      </div>
      <GBtn onClick={onDone} style={{ marginTop: 16 }}>Done ({selected.length} selected)</GBtn>
    </>
  )
}

/* ═══ SETTINGS ═══════════════════════════════════════════════
   The mobile settings list, grouped into web preference cards.
   Dark Mode keeps driving the real theme toggle.                */
export function WebSettingsScreen({
  onNav, theme = 'dark', onToggleTheme,
}: {
  onNav: (s: string) => void
  theme?: 'light' | 'dark'
  onToggleTheme?: () => void
}) {
  const [t, setT] = useState({ notif: true, dark: false, health: true, auto: false, sounds: true, haptics: true })
  const tog = (k: string) => setT(p => ({ ...p, [k]: !(p as any)[k] }))
  const [sheet, setSheet] = useState<SheetId | null>(null)
  const closeSheet = () => setSheet(null)

  return (
    <div className="fp-web__grid">
      <PageActions>
        <button className="fp-web__btn" onClick={() => onNav('account')}>‹ Account</button>
      </PageActions>

      {SETTINGS_SECTIONS.map(sec => (
        <Card key={sec.title} className="fp-web__w--6" title={sec.title}>
          {sec.items.map((item, i) => {
            const sheetId = item.type === 'nav' ? SETTINGS_SHEETS[item.label] : undefined
            const rowStyle = { borderBottom: i < sec.items.length - 1 ? '1px solid var(--fp-track)' : 'none' }
            const inner = (
              <>
                <span className="fp-row__ico fp-row__ico--plain">{item.icon}</span>
                <span className="fp-row__body">
                  <span className="fp-row__label">{item.label}</span>
                  <span className="fp-row__sub">
                    {item.key === 'dark'
                      ? (theme === 'dark' ? 'Currently enabled' : 'Currently disabled')
                      : item.sub}
                  </span>
                </span>
                {item.type === 'toggle'
                  ? (
                    <Toggle
                      on={item.key === 'dark' ? theme === 'dark' : Boolean(item.key && (t as any)[item.key])}
                      onToggle={() => item.key === 'dark'
                        ? (onToggleTheme ? onToggleTheme() : tog('dark'))
                        : tog(item.key as string)}
                    />
                  )
                  : <span className="fp-row__arrow">›</span>}
              </>
            )
            return sheetId ? (
              <button key={item.label} className="fp-row" style={rowStyle} onClick={() => setSheet(sheetId)}>
                {inner}
              </button>
            ) : (
              <div key={item.label} className="fp-row fp-row--static" style={rowStyle}>
                {inner}
              </div>
            )
          })}
        </Card>
      ))}

      {/* ── Settings sub-widgets: every settings row now opens a real sheet ── */}
      <FitModal open={sheet === 'privacy'} title="Privacy Settings" subtitle="Manage your data" onClose={closeSheet}>
        <PrivacySecurity settings={PRIVACY_SETTINGS} onBack={closeSheet} onUpdate={() => {}} />
      </FitModal>

      <FitModal open={sheet === 'security'} title="Security" subtitle="Biometrics & passcode" onClose={closeSheet}>
        <SecuritySheet onBack={closeSheet} />
      </FitModal>

      <FitModal open={sheet === 'language'} title="Language" subtitle="English (US)" onClose={closeSheet}>
        <LanguageSheet onBack={closeSheet} />
      </FitModal>

      <FitModal open={sheet === 'backup'} title="Backup & Restore" subtitle="Manage your data backup" onClose={closeSheet}>
        <BackupSheet onBack={closeSheet} />
      </FitModal>

      <FitModal open={sheet === 'help'} title="Help & Support" subtitle="FAQs and contact us" onClose={closeSheet}>
        <HelpSheet onBack={closeSheet} />
      </FitModal>

      <FitModal open={sheet === 'about'} title="About FitPulse" subtitle="v3.2.1 · Legal & licenses" onClose={closeSheet}>
        <AboutSheet onBack={closeSheet} />
      </FitModal>
    </div>
  )
}
