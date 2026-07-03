import { useState, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { timewalkingExpansions } from '../data/wikiData'
import styles from './Timewalking.module.css'

const TODAY = new Date('2026-07-03T00:00:00Z')

function eventStatus(exp) {
  const start = new Date(exp.nextEvent)
  const end = new Date(exp.nextEventEnd)
  if (TODAY >= start && TODAY <= end) return 'active'
  if (start > TODAY) return 'upcoming'
  return 'past'
}

function formatEventDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - TODAY
  return Math.ceil(diff / 86400000)
}

const DIFF_META = {
  Easy:      { color: '#4ade80', label: 'Easy' },
  Medium:    { color: '#fb923c', label: 'Medium' },
  Hard:      { color: '#f87171', label: 'Hard' },
  'Very Hard':{ color: '#c084fc', label: 'Very Hard' },
}

const REWARD_TYPE_COLOR = {
  'Mount':              '#c9a227',
  'Weapon Illusion':    '#60a5fa',
  'Pet':                '#4ade80',
  'Pet Bundle':         '#4ade80',
  'Pet Cache':          '#4ade80',
  'Gear Cache':         '#94a3b8',
  'Toy':                '#f472b6',
  'Tabard':             '#a78bfa',
  'Transmog Shoulders': '#fb923c',
  'First-Clear Mount':  '#fbbf24',
  'Consumable Bundle':  '#94a3b8',
  'Mount Customization':'#c9a227',
}

function DungeonRow({ dungeon, idx }) {
  const [open, setOpen] = useState(false)
  const diff = DIFF_META[dungeon.difficulty] || { color: '#94a3b8', label: dungeon.difficulty }
  return (
    <div className={`${styles.dungeonRow} ${open ? styles.dungeonRowOpen : ''}`}>
      <button className={styles.dungeonBtn} onClick={() => setOpen(o => !o)}>
        <span className={styles.dungeonNum}>{idx + 1}</span>
        <div className={styles.dungeonInfo}>
          <span className={styles.dungeonName}>{dungeon.name}</span>
          <span className={styles.dungeonLocation}>{dungeon.location}</span>
        </div>
        <div className={styles.dungeonMeta}>
          <span className={styles.dungeonBosses}>{dungeon.bosses} bosses</span>
          <span
            className={styles.diffBadge}
            style={{ color: diff.color, borderColor: diff.color + '50', background: diff.color + '12' }}
          >
            {diff.label}
          </span>
        </div>
        <span className={styles.dungeonChevron}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className={styles.dungeonTip}>
          <span className={styles.tipLabel}>Strategy Tip</span>
          <p>{dungeon.tip}</p>
        </div>
      )}
    </div>
  )
}

function RewardRow({ reward, color }) {
  const typeColor = REWARD_TYPE_COLOR[reward.type] || '#94a3b8'
  return (
    <div className={styles.rewardRow}>
      <div className={styles.rewardLeft}>
        <span
          className={styles.rewardType}
          style={{ color: typeColor, background: typeColor + '14', borderColor: typeColor + '40' }}
        >
          {reward.type}
        </span>
        <span className={styles.rewardName}>{reward.name}</span>
        {reward.special && (
          <span className={styles.rewardSpecial}>{reward.special}</span>
        )}
      </div>
      {reward.cost > 0 && (
        <span className={styles.rewardCost} style={{ color }}>
          {reward.cost.toLocaleString()} Badges
        </span>
      )}
      {reward.cost === 0 && (
        <span className={styles.rewardFree}>Free</span>
      )}
    </div>
  )
}

export default function Timewalking() {
  const [selectedId, setSelectedId] = useState('cataclysm')
  const [tab, setTab] = useState('dungeons')

  const expansion = useMemo(
    () => timewalkingExpansions.find(e => e.id === selectedId),
    [selectedId]
  )

  const sorted = useMemo(() =>
    [...timewalkingExpansions].sort((a, b) => {
      const order = { active: 0, upcoming: 1, past: 2 }
      return order[eventStatus(a)] - order[eventStatus(b)]
    }),
  [])

  const activeEvent = timewalkingExpansions.find(e => eventStatus(e) === 'active')

  return (
    <div>
      <PageHeader
        title="Timewalking"
        subtitle="Revisit Azeroth's history — dungeons and raids from nine expansions scaled to current level, with exclusive badge rewards and rare mount drops."
        accent={`${timewalkingExpansions.length} Expansions`}
      />

      {/* Active event banner */}
      {activeEvent && (
        <div className={styles.activeBanner} style={{ '--exp-color': activeEvent.color }}>
          <div className={styles.activePulse} />
          <div className={styles.activeBannerContent}>
            <span className={styles.activeLive}>Live Now</span>
            <span className={styles.activeName}>{activeEvent.name}</span>
            <span className={styles.activeEnds}>
              Ends {formatEventDate(activeEvent.nextEventEnd)}
            </span>
          </div>
          <button
            className={styles.activeViewBtn}
            style={{ borderColor: activeEvent.color + '80', color: activeEvent.color }}
            onClick={() => setSelectedId(activeEvent.id)}
          >
            View Guide
          </button>
        </div>
      )}

      {/* Mechanics overview */}
      <div className={styles.mechanicsGrid}>
        <div className={styles.mechCard}>
          <span className={styles.mechIcon}>⚔</span>
          <div>
            <span className={styles.mechTitle}>Scaled to Current Level</span>
            <p className={styles.mechDesc}>Your character and all enemies scale to max level. Gear ilvl from Timewalking matches the current expansion's normal-difficulty equivalent.</p>
          </div>
        </div>
        <div className={styles.mechCard}>
          <span className={styles.mechIcon}>🏅</span>
          <div>
            <span className={styles.mechTitle}>Timewarped Badges</span>
            <p className={styles.mechDesc}>The primary currency. Earn from dungeon end bosses and the weekly Timewalking quest (5 completions = bonus cache). Spend at expansion-specific vendors.</p>
          </div>
        </div>
        <div className={styles.mechCard}>
          <span className={styles.mechIcon}>📅</span>
          <div>
            <span className={styles.mechTitle}>Weekly Rotation</span>
            <p className={styles.mechDesc}>Each expansion's Timewalking runs for one week, rotating in order. The active event resets on Tuesday with the weekly lockout.</p>
          </div>
        </div>
        <div className={styles.mechCard}>
          <span className={styles.mechIcon}>🏰</span>
          <div>
            <span className={styles.mechTitle}>Timewalking Raids</span>
            <p className={styles.mechDesc}>Each expansion includes one iconic raid scaled to 5, 10, or 25 players. Raid loot scales higher than dungeon loot and can drop exclusive legacy mounts.</p>
          </div>
        </div>
      </div>

      {/* Expansion selector */}
      <div className={styles.expSelector}>
        <span className={styles.selectorLabel}>Select Expansion</span>
        <div className={styles.expGrid}>
          {sorted.map(exp => {
            const status = eventStatus(exp)
            return (
              <button
                key={exp.id}
                className={`${styles.expBtn} ${selectedId === exp.id ? styles.expBtnActive : ''}`}
                style={{ '--exp-color': exp.color }}
                onClick={() => setSelectedId(exp.id)}
              >
                <span className={styles.expColorDot} />
                <span className={styles.expBtnName}>{exp.shortName}</span>
                <span className={`${styles.expStatus} ${styles['expStatus_' + status]}`}>
                  {status === 'active' ? '● Live' : status === 'upcoming' ? `In ${daysUntil(exp.nextEvent)}d` : exp.yearRange}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Expansion detail */}
      {expansion && (
        <div className={styles.expDetail} style={{ '--exp-color': expansion.color }}>
          {/* Header */}
          <div className={styles.expHeader}>
            <div className={styles.expHeaderLeft}>
              <div className={styles.expHeaderBadges}>
                {eventStatus(expansion) === 'active' && (
                  <span className={styles.statusLive}>Live Now</span>
                )}
                {eventStatus(expansion) === 'upcoming' && (
                  <span className={styles.statusUpcoming}>
                    Starts {formatEventDate(expansion.nextEvent)}
                  </span>
                )}
                <span className={styles.expYear}>{expansion.yearRange}</span>
              </div>
              <h2 className={styles.expTitle}>{expansion.name}</h2>
              <p className={styles.expDesc}>{expansion.description}</p>
              <div className={styles.expMetaRow}>
                <span className={styles.expMetaItem}>
                  <span className={styles.expMetaLabel}>Vendor</span>
                  {expansion.vendor.name}
                </span>
                <span className={styles.expMetaDivider} />
                <span className={styles.expMetaItem}>
                  <span className={styles.expMetaLabel}>Location</span>
                  {expansion.vendor.location}
                </span>
                <span className={styles.expMetaDivider} />
                <span className={styles.expMetaItem}>
                  <span className={styles.expMetaLabel}>Currency</span>
                  {expansion.currency}
                </span>
              </div>
            </div>
            <div className={styles.expStats}>
              <div className={styles.expStat}>
                <span className={styles.expStatNum} style={{ color: expansion.color }}>
                  {expansion.dungeons.length}
                </span>
                <span className={styles.expStatLabel}>Dungeons</span>
              </div>
              {expansion.raid && (
                <div className={styles.expStat}>
                  <span className={styles.expStatNum} style={{ color: expansion.color }}>
                    {expansion.raid.bosses}
                  </span>
                  <span className={styles.expStatLabel}>Raid Bosses</span>
                </div>
              )}
              <div className={styles.expStat}>
                <span className={styles.expStatNum} style={{ color: expansion.color }}>
                  {expansion.badgeRewards.length}
                </span>
                <span className={styles.expStatLabel}>Badge Rewards</span>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className={styles.tabBar}>
            {['dungeons', 'raid', 'rewards'].map(t => (
              <button
                key={t}
                className={`${styles.tabBtn} ${tab === t ? styles.tabBtnActive : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'dungeons' && `Dungeons (${expansion.dungeons.length})`}
                {t === 'raid' && (expansion.raid ? `Raid: ${expansion.raid.name}` : 'Raid')}
                {t === 'rewards' && `Badge Rewards (${expansion.badgeRewards.length})`}
              </button>
            ))}
          </div>

          {/* Dungeons tab */}
          {tab === 'dungeons' && (
            <div className={styles.tabContent}>
              <p className={styles.tabHint}>Click a dungeon to reveal the strategy tip.</p>
              <div className={styles.dungeonList}>
                {expansion.dungeons.map((d, i) => (
                  <DungeonRow key={d.name} dungeon={d} idx={i} />
                ))}
              </div>
            </div>
          )}

          {/* Raid tab */}
          {tab === 'raid' && expansion.raid && (
            <div className={styles.tabContent}>
              <div className={styles.raidCard}>
                <div className={styles.raidHeader}>
                  <div>
                    <span className={styles.raidTag}>Timewalking Raid</span>
                    <h3 className={styles.raidName}>{expansion.raid.name}</h3>
                    <span className={styles.raidLocation}>{expansion.raid.location}</span>
                  </div>
                  <div className={styles.raidStats}>
                    <div className={styles.raidStat}>
                      <span className={styles.raidStatNum} style={{ color: expansion.color }}>
                        {expansion.raid.bosses}
                      </span>
                      <span className={styles.raidStatLabel}>Bosses</span>
                    </div>
                    <div className={styles.raidStat}>
                      <span
                        className={styles.raidStatBadge}
                        style={{
                          color: DIFF_META[expansion.raid.difficulty]?.color,
                          background: (DIFF_META[expansion.raid.difficulty]?.color ?? '#94a3b8') + '14',
                          borderColor: (DIFF_META[expansion.raid.difficulty]?.color ?? '#94a3b8') + '40',
                        }}
                      >
                        {expansion.raid.difficulty}
                      </span>
                      <span className={styles.raidStatLabel}>Difficulty</span>
                    </div>
                  </div>
                </div>
                <p className={styles.raidDesc}>{expansion.raid.description}</p>
                {expansion.raid.highlightDrop && (
                  <div className={styles.raidHighlight}>
                    <span className={styles.raidHighlightLabel}>Highlight Drop</span>
                    <span className={styles.raidHighlightItem}>{expansion.raid.highlightDrop}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {tab === 'raid' && !expansion.raid && (
            <div className={styles.tabContent}>
              <div className={styles.emptyRaid}>No Timewalking raid available for this expansion.</div>
            </div>
          )}

          {/* Rewards tab */}
          {tab === 'rewards' && (
            <div className={styles.tabContent}>
              <div className={styles.rewardsList}>
                {expansion.badgeRewards.map(r => (
                  <RewardRow key={r.name} reward={r} color={expansion.color} />
                ))}
              </div>
              <p className={styles.rewardsNote}>
                Badges are shared across all Timewalking vendors. Earn them in any expansion's event and spend at the vendor of your choice.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
