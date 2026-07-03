import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { pvpWorldZones, pvpBattlegrounds, pvpArena } from '../data/wikiData'
import styles from './PvP.module.css'

const TABS = [
  { id: 'world', label: 'World PvP', icon: '&#9670;' },
  { id: 'battlegrounds', label: 'Battlegrounds', icon: '&#9873;' },
  { id: 'arena', label: 'Arena', icon: '&#9876;' },
]

export default function PvP() {
  const [tab, setTab] = useState('world')

  return (
    <div>
      <PageHeader
        title="PvP Guide"
        subtitle="Everything you need for Midnight's PvP — open world objectives, battleground tactics, and arena composition guides."
        accent="Season 1 — The Midnight Opening"
      />

      <div className={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tabBtn} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span dangerouslySetInnerHTML={{ __html: t.icon }} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'world' && <WorldPvP />}
      {tab === 'battlegrounds' && <Battlegrounds />}
      {tab === 'arena' && <Arena />}
    </div>
  )
}

/* ── World PvP ─────────────────────────────────────────── */

function WorldPvP() {
  const [expanded, setExpanded] = useState(null)

  return (
    <div>
      <div className={styles.warModeInfo}>
        <div className={styles.warModeIcon}>&#9870;</div>
        <div>
          <strong>War Mode</strong>
          <p>Toggle War Mode in your faction's capital city to enable open-world PvP and unlock exclusive world PvP objectives, bonus XP, and gold. War Mode applies a flat 10% bonus before any zone-specific bonuses.</p>
        </div>
      </div>

      <div className={styles.zoneList}>
        {pvpWorldZones.map((zone, i) => {
          const isOpen = expanded === i
          return (
            <article key={zone.name} className={styles.zoneCard}>
              <button
                className={`${styles.zoneHeader} ${isOpen ? styles.zoneHeaderOpen : ''}`}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                <div className={styles.zoneLeft}>
                  <div className={styles.zoneTitle}>
                    <h3>{zone.name}</h3>
                    <span className={styles.zoneRegion}>{zone.region}</span>
                  </div>
                  <span className={styles.zoneType}>{zone.type}</span>
                </div>
                <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className={styles.zoneBody}>
                  <p className={styles.zoneDesc}>{zone.description}</p>

                  <div className={styles.warModeBonus}>
                    <span className={styles.bonusLabel}>War Mode Bonus</span>
                    <span className={styles.bonusValue}>{zone.warModeBonus}</span>
                  </div>

                  <h4 className={styles.subLabel}>Objectives</h4>
                  <div className={styles.objectivesGrid}>
                    {zone.objectives.map(obj => (
                      <div key={obj.name} className={styles.objectiveCard}>
                        <div className={styles.objectiveHeader}>
                          <span className={styles.objectiveIcon} dangerouslySetInnerHTML={{ __html: obj.icon }} />
                          <strong>{obj.name}</strong>
                        </div>
                        <p>{obj.description}</p>
                      </div>
                    ))}
                  </div>

                  <h4 className={styles.subLabel}>Tips</h4>
                  <ul className={styles.tipList}>
                    {zone.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}

/* ── Battlegrounds ─────────────────────────────────────── */

function Battlegrounds() {
  const [selected, setSelected] = useState(null)

  const bg = selected !== null ? pvpBattlegrounds[selected] : null

  return (
    <div>
      <div className={styles.bgGrid}>
        {pvpBattlegrounds.map((b, i) => (
          <button
            key={b.name}
            className={`${styles.bgCard} ${selected === i ? styles.bgCardActive : ''}`}
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <span className={styles.bgIcon} dangerouslySetInnerHTML={{ __html: b.icon }} />
            <div className={styles.bgCardInfo}>
              <span className={styles.bgName}>{b.name}</span>
              <span className={styles.bgBracket}>{b.bracket}</span>
            </div>
            <span className={styles.bgType}>{b.type}</span>
          </button>
        ))}
      </div>

      {bg && (
        <div className={styles.bgDetail}>
          <div className={styles.bgDetailHeader}>
            <div>
              <h2 className={styles.bgDetailName}>{bg.name}</h2>
              <div className={styles.bgDetailMeta}>
                <span className={styles.metaTag}>{bg.bracket}</span>
                <span className={styles.metaTag}>{bg.type}</span>
                <span className={styles.metaTag}>{bg.timeLimit}</span>
              </div>
            </div>
            <div className={styles.winCon}>
              <span className={styles.winConLabel}>Win Condition</span>
              <span>{bg.winCondition}</span>
            </div>
          </div>

          <p className={styles.bgDesc}>{bg.description}</p>

          <div className={styles.rolesRow}>
            {Object.entries(bg.roles).map(([role, text]) => (
              <div key={role} className={`${styles.roleCard} ${styles[`role_${role}`]}`}>
                <span className={styles.roleLabel}>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>

          <h4 className={styles.subLabel}>Objectives</h4>
          <div className={styles.objectivesTable}>
            {bg.objectives.map(obj => (
              <div key={obj.name} className={styles.objectiveRow}>
                <div className={styles.objLeft}>
                  <strong className={styles.objName}>{obj.name}</strong>
                  <span className={styles.objPoints}>{obj.points}</span>
                </div>
                <p className={styles.objDesc}>{obj.description}</p>
              </div>
            ))}
          </div>

          <h4 className={styles.subLabel}>Tips</h4>
          <ul className={styles.tipList}>
            {bg.tips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>

          <div className={styles.rewardsRow}>
            <span className={styles.rewardsLabel}>Rewards</span>
            {bg.rewards.map(r => (
              <span key={r} className={styles.rewardTag}>{r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Arena ─────────────────────────────────────────────── */

function Arena() {
  const [bracket, setBracket] = useState(0)
  const [expandedComp, setExpandedComp] = useState(null)
  const format = pvpArena.formats[bracket]

  return (
    <div>
      <div className={styles.arenaHeader}>
        <div className={styles.arenaInfo}>
          <p className={styles.arenaOverview}>{pvpArena.overview}</p>
          <div className={styles.arenaMeta}>
            <span className={styles.metaTag}>{pvpArena.season}</span>
            <span className={styles.metaTag}>Cap: {pvpArena.conquestCap}</span>
          </div>
        </div>
      </div>

      {/* Rating ladder */}
      <div className={styles.ratingLadder}>
        {pvpArena.ratings.map(r => (
          <div key={r.threshold} className={styles.ratingRow}>
            <span className={styles.ratingThreshold} style={{ color: r.color }}>{r.threshold}+</span>
            <span className={styles.ratingBar}>
              <span className={styles.ratingFill} style={{ background: r.color, width: `${(r.threshold / 2700) * 100}%` }} />
            </span>
            <span className={styles.ratingReward} style={{ color: r.color }}>{r.reward}</span>
          </div>
        ))}
      </div>

      {/* Maps */}
      <div className={styles.mapsRow}>
        {pvpArena.maps.map(m => (
          <div key={m.name} className={styles.mapCard}>
            <strong className={styles.mapName}>{m.name}</strong>
            <p className={styles.mapDesc}>{m.description}</p>
          </div>
        ))}
      </div>

      {/* Bracket tabs */}
      <div className={styles.bracketTabs}>
        {pvpArena.formats.map((f, i) => (
          <button
            key={f.bracket}
            className={`${styles.bracketTab} ${bracket === i ? styles.bracketTabActive : ''}`}
            onClick={() => { setBracket(i); setExpandedComp(null) }}
          >
            {f.bracket}
          </button>
        ))}
      </div>

      <p className={styles.bracketDesc}>{format.description}</p>

      {/* Comps */}
      <h4 className={styles.subLabel}>Top Compositions</h4>
      <div className={styles.compList}>
        {format.topComps.map((comp, i) => {
          const isOpen = expandedComp === i
          return (
            <article key={comp.name} className={styles.compCard}>
              <button
                className={`${styles.compHeader} ${isOpen ? styles.compHeaderOpen : ''}`}
                onClick={() => setExpandedComp(isOpen ? null : i)}
              >
                <div className={styles.compLeft}>
                  <strong className={styles.compName}>{comp.name}</strong>
                  <span className={styles.compSpecs}>{comp.specs}</span>
                </div>
                <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className={styles.compBody}>
                  <div className={styles.compGrid}>
                    <div className={styles.compSection}>
                      <span className={styles.compSectionLabel}>Play Style</span>
                      <p>{comp.style}</p>
                    </div>
                    <div className={styles.compSection}>
                      <span className={styles.compSectionLabel}>Win Condition</span>
                      <p>{comp.wincon}</p>
                    </div>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>

      {/* Tips */}
      <h4 className={styles.subLabel}>{format.bracket} Tips</h4>
      <ul className={styles.tipList}>
        {format.tips.map((tip, i) => <li key={i}>{tip}</li>)}
      </ul>
    </div>
  )
}
