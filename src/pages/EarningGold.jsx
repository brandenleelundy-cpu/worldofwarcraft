import { useState, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { goldMethods, goldWeeklyRoutine, goldBeginnerPath } from '../data/wikiData'
import styles from './EarningGold.module.css'

const CATEGORIES = [
  { id: 'all',       label: 'All Methods',    color: '#c9a227' },
  { id: 'gathering', label: 'Gathering',      color: '#4ade80' },
  { id: 'crafting',  label: 'Crafting',       color: '#fb923c' },
  { id: 'trading',   label: 'Trading / AH',   color: '#60a5fa' },
  { id: 'questing',  label: 'Questing',       color: '#a78bfa' },
  { id: 'farming',   label: 'Farming',        color: '#f472b6' },
  { id: 'services',  label: 'Services',       color: '#2dd4bf' },
]

const EFFORTS = ['All', 'AFK-friendly', 'Low', 'Moderate', 'Active']

const CAT_COLOR = Object.fromEntries(CATEGORIES.map(c => [c.id, c.color]))
const DIFF_COLOR = {
  Easy:   '#4ade80',
  Medium: '#fb923c',
  Hard:   '#f87171',
}

function formatGold(n) {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k'
  return n.toLocaleString()
}

function GoldBar({ min, max }) {
  const cap = 100000
  const pctMin = Math.min((min / cap) * 100, 100)
  const pctMax = Math.min((max / cap) * 100, 100)
  return (
    <div className={styles.goldBar}>
      <div
        className={styles.goldBarFill}
        style={{ left: `${pctMin}%`, width: `${pctMax - pctMin}%` }}
      />
    </div>
  )
}

function MethodCard({ method }) {
  const [open, setOpen] = useState(false)
  const catColor = CAT_COLOR[method.category] ?? '#c9a227'
  const diffColor = DIFF_COLOR[method.difficulty] ?? '#94a3b8'
  const cat = CATEGORIES.find(c => c.id === method.category)

  return (
    <article
      className={`${styles.card} ${open ? styles.cardOpen : ''}`}
      style={{ '--cat-color': catColor }}
    >
      <button className={styles.cardHeader} onClick={() => setOpen(o => !o)}>
        <div className={styles.cardLeft}>
          <div className={styles.cardTitleRow}>
            <span
              className={styles.catTag}
              style={{ color: catColor, background: catColor + '14', borderColor: catColor + '40' }}
            >
              {cat?.label ?? method.category}
            </span>
            <h3 className={styles.cardTitle}>{method.name}</h3>
          </div>
          <p className={styles.cardSummaryShort}>{method.tip}</p>
        </div>

        <div className={styles.cardRight}>
          <div className={styles.goldRange}>
            <span className={styles.goldMin}>{formatGold(method.goldPerHour.min)}</span>
            <span className={styles.goldSep}>–</span>
            <span className={styles.goldMax}>{formatGold(method.goldPerHour.max)}</span>
            <span className={styles.goldUnit}>g/hr</span>
          </div>
          <GoldBar min={method.goldPerHour.min} max={method.goldPerHour.max} />
          <div className={styles.cardBadges}>
            <span
              className={styles.diffBadge}
              style={{ color: diffColor, background: diffColor + '12', borderColor: diffColor + '35' }}
            >
              {method.difficulty}
            </span>
            <span className={styles.effortBadge}>{method.effort}</span>
          </div>
        </div>

        <span className={styles.chevron}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className={styles.cardBody}>
          <p className={styles.cardDesc}>{method.summary}</p>

          <div className={styles.tipsSection}>
            <span className={styles.tipsLabel}>Tips</span>
            <ul className={styles.tipsList}>
              {method.tips.map((t, i) => (
                <li key={i} className={styles.tipItem}>
                  <span className={styles.tipDot} style={{ background: catColor }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {method.requirements?.length > 0 && (
            <div className={styles.reqRow}>
              <span className={styles.reqLabel}>Requirements</span>
              <div className={styles.reqTags}>
                {method.requirements.map(r => (
                  <span key={r} className={styles.reqTag}>{r}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default function EarningGold() {
  const [category, setCategory] = useState('all')
  const [effort, setEffort]     = useState('All')
  const [sort, setSort]         = useState('max')

  const filtered = useMemo(() => {
    let list = goldMethods
    if (category !== 'all') list = list.filter(m => m.category === category)
    if (effort !== 'All')   list = list.filter(m => m.effort === effort)
    return [...list].sort((a, b) =>
      sort === 'max'
        ? b.goldPerHour.max - a.goldPerHour.max
        : a.difficulty.localeCompare(b.difficulty)
    )
  }, [category, effort, sort])

  const totalMethods = goldMethods.length
  const topEarner = [...goldMethods].sort((a, b) => b.goldPerHour.max - a.goldPerHour.max)[0]
  const easyMethods = goldMethods.filter(m => m.difficulty === 'Easy').length
  const afkMethods  = goldMethods.filter(m => m.effort === 'AFK-friendly' || m.effort === 'Low').length

  return (
    <div>
      <PageHeader
        title="Earning Gold"
        subtitle="Every major gold-making method in WoW: Midnight — from gathering and crafting to Auction House trading, farming, and selling services."
        accent={`${totalMethods} Methods`}
      />

      {/* Summary stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{totalMethods}</span>
          <span className={styles.statLabel}>Methods Covered</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum} style={{ color: '#4ade80' }}>{easyMethods}</span>
          <span className={styles.statLabel}>Easy Difficulty</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum} style={{ color: '#60a5fa' }}>{afkMethods}</span>
          <span className={styles.statLabel}>Low / AFK-Friendly</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum} style={{ color: '#c9a227' }}>
            {formatGold(topEarner.goldPerHour.max)}
          </span>
          <span className={styles.statLabel}>Peak g/hr ({topEarner.name})</span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterWrap}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Category</span>
          <div className={styles.filterRow}>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`${styles.filterBtn} ${category === c.id ? styles.filterBtnActive : ''}`}
                style={{ '--cat-color': c.color }}
                onClick={() => setCategory(c.id)}
              >
                <span className={styles.filterDot} />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroupRight}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Effort</span>
            <div className={styles.filterRow}>
              {EFFORTS.map(e => (
                <button
                  key={e}
                  className={`${styles.effortBtn} ${effort === e ? styles.effortBtnActive : ''}`}
                  onClick={() => setEffort(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Sort by</span>
            <div className={styles.filterRow}>
              <button
                className={`${styles.effortBtn} ${sort === 'max' ? styles.effortBtnActive : ''}`}
                onClick={() => setSort('max')}
              >
                Max Gold/hr
              </button>
              <button
                className={`${styles.effortBtn} ${sort === 'diff' ? styles.effortBtnActive : ''}`}
                onClick={() => setSort('diff')}
              >
                Easiest First
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsMeta}>
        <span className={styles.resultsCount}>{filtered.length} method{filtered.length !== 1 ? 's' : ''}</span>
        <span className={styles.resultsSub}>Click any row to expand tips</span>
      </div>

      {/* Method list */}
      <div className={styles.methodList}>
        {filtered.map(m => <MethodCard key={m.id} method={m} />)}
      </div>

      {filtered.length === 0 && (
        <div className={styles.emptyState}>
          No methods match the selected filters.
        </div>
      )}

      {/* Beginner Path */}
      <div className={styles.sectionBlock}>
        <h3 className={styles.sectionTitle}>Beginner Path — From Zero to Token</h3>
        <p className={styles.sectionDesc}>
          A step-by-step progression for new gold-makers. Follow these milestones in order to build
          a sustainable gold income from scratch.
        </p>
        <div className={styles.pathTimeline}>
          {goldBeginnerPath.map(step => (
            <div key={step.step} className={styles.pathStep}>
              <div className={styles.pathStepNum}>{step.step}</div>
              <div className={styles.pathStepContent}>
                <span className={styles.pathStepTitle}>{step.title}</span>
                <p className={styles.pathStepDesc}>{step.description}</p>
                <span className={styles.pathMilestone}>Milestone: {step.milestone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Routine */}
      <div className={styles.sectionBlock}>
        <h3 className={styles.sectionTitle}>Optimal Weekly Routine</h3>
        <p className={styles.sectionDesc}>
          A structured schedule to maximize gold across the week. Adapt based on your available playtime —
          even completing the "high" priority tasks alone generates 20,000–50,000g weekly.
        </p>
        <div className={styles.weekGrid}>
          {goldWeeklyRoutine.map(day => (
            <div key={day.day} className={styles.dayCard}>
              <span className={styles.dayName}>{day.day}</span>
              <ul className={styles.dayTasks}>
                {day.tasks.map((t, i) => (
                  <li key={i} className={styles.dayTask}>
                    <span className={`${styles.taskPriority} ${styles['priority_' + t.priority]}`}>
                      {t.priority}
                    </span>
                    <span className={styles.taskText}>{t.task}</span>
                    <span className={styles.taskGold}>{t.gold}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* General advice footer */}
      <div className={styles.sectionBlock}>
        <h3 className={styles.sectionTitle}>General Principles</h3>
        <div className={styles.adviceGrid}>
          <div className={styles.adviceCard}>
            <span className={styles.adviceHead}>Diversify Your Income</span>
            <p>Relying on a single method leaves you exposed to market crashes and patch changes. Combine a passive source (crafting orders, AH flipping) with an active source (gathering, farming) for stable income across all conditions.</p>
          </div>
          <div className={styles.adviceCard}>
            <span className={styles.adviceHead}>Track the Market</span>
            <p>Install TradeSkillMaster (TSM) and configure it with up-to-date realm data. The shopping operation automatically identifies underpriced items. No other single investment improves gold-making efficiency as much.</p>
          </div>
          <div className={styles.adviceCard}>
            <span className={styles.adviceHead}>Time the Market</span>
            <p>Prices spike predictably: flasks and potions before Tuesday resets, crafting mats when new patches drop, mounts and pets during patch droughts. Buy low during off-periods, sell into demand spikes.</p>
          </div>
          <div className={styles.adviceCard}>
            <span className={styles.adviceHead}>Use Multiple Characters</span>
            <p>Each character can complete treasures, world quests, and Callings independently. Even two well-maintained alts can double your passive weekly income with only 30 minutes of additional play time.</p>
          </div>
          <div className={styles.adviceCard}>
            <span className={styles.adviceHead}>Understand Opportunity Cost</span>
            <p>Not every gold method is worth your time. If you can earn 10,000g/hr crafting but choose to farm 3,000g/hr mobs, you are losing 7,000g per hour. Always compare methods against your personal best before investing time.</p>
          </div>
          <div className={styles.adviceCard}>
            <span className={styles.adviceHead}>Patience Over Speed</span>
            <p>The wealthiest players in WoW built capital over months, not days. Transmog flipping, pet markets, and AH speculation all compound over time. Set weekly income targets and track progress rather than chasing one-time windfalls.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
