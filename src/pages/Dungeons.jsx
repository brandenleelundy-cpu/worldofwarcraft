import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { normalHeroicDungeons } from '../data/wikiData'
import styles from './Dungeons.module.css'

const DIFFICULTIES = [
  { id: 'normal',  label: 'Normal',  color: '#4ade80', description: 'Entry-level 5-player content. Group Finder compatible. Suitable for fresh max-level characters.' },
  { id: 'heroic',  label: 'Heroic',  color: '#fb923c', description: 'Harder version of each dungeon with increased enemy damage, health, and additional ability variants.' },
]

const DIFF_BADGE = {
  normal: { label: 'Normal', style: styles.badgeNormal },
  heroic: { label: 'Heroic', style: styles.badgeHeroic },
}

function AbilityRow({ ability, isHeroic }) {
  const isHeroicAbility = ability.name.toLowerCase().includes('heroic') ||
    ability.description.toLowerCase().startsWith('heroic:')
  return (
    <div className={`${styles.ability} ${isHeroicAbility ? styles.abilityHeroic : ''}`}>
      <div className={styles.abilityHeader}>
        <span className={styles.abilityName}>{ability.name}</span>
        {isHeroicAbility && (
          <span className={styles.heroicOnlyTag}>Heroic Only</span>
        )}
      </div>
      <p className={styles.abilityDesc}>
        {ability.description.replace(/^Heroic:\s*/i, '')}
      </p>
    </div>
  )
}

function BossAccordion({ boss, difficulty }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${styles.boss} ${open ? styles.bossOpen : ''}`}>
      <button className={styles.bossHeader} onClick={() => setOpen(o => !o)}>
        <div className={styles.bossLeft}>
          <span className={styles.bossDot} />
          <span className={styles.bossName}>{boss.name}</span>
          <div className={styles.bossTags}>
            {boss.tags.map(t => (
              <span key={t} className={styles.bossTag}>{t}</span>
            ))}
          </div>
        </div>
        <span className={styles.bossChevron}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className={styles.bossBody}>
          <p className={styles.bossDesc}>{boss.description}</p>
          <div className={styles.bossGrid}>
            <div className={styles.abilitiesSection}>
              <h5 className={styles.subLabel}>Abilities</h5>
              <div className={styles.abilities}>
                {boss.abilities
                  .filter(a => {
                    if (difficulty === 'normal') {
                      const isHeroicOnly = a.name.toLowerCase().includes('heroic') ||
                        a.description.toLowerCase().startsWith('heroic:')
                      return !isHeroicOnly
                    }
                    return true
                  })
                  .map(a => <AbilityRow key={a.name} ability={a} difficulty={difficulty} />)}
              </div>
            </div>
            <div className={styles.rolesSection}>
              <h5 className={styles.subLabel}>Role Tips</h5>
              <div className={styles.roles}>
                <div className={styles.roleCard}>
                  <div className={`${styles.roleHeader} ${styles.tankRole}`}>
                    <span>&#9711;</span> Tanks
                  </div>
                  <p className={styles.roleText}>{boss.roles.tanks}</p>
                </div>
                <div className={styles.roleCard}>
                  <div className={`${styles.roleHeader} ${styles.healerRole}`}>
                    <span>+</span> Healers
                  </div>
                  <p className={styles.roleText}>{boss.roles.healers}</p>
                </div>
                <div className={styles.roleCard}>
                  <div className={`${styles.roleHeader} ${styles.dpsRole}`}>
                    <span>&#9876;</span> DPS
                  </div>
                  <p className={styles.roleText}>{boss.roles.dps}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dungeons() {
  const [difficulty, setDifficulty] = useState('normal')
  const [openDungeon, setOpenDungeon] = useState(null)

  const diffMeta = DIFFICULTIES.find(d => d.id === difficulty)
  const totalBosses = normalHeroicDungeons.reduce((s, d) => s + d.bosses, 0)
  const ilvlKey = difficulty === 'heroic' ? 'heroicIlvl' : 'normalIlvl'
  const minIlvl = Math.min(...normalHeroicDungeons.map(d => d[ilvlKey].recommended))
  const maxIlvl = Math.max(...normalHeroicDungeons.map(d => d[ilvlKey].lootMax))

  function toggleDungeon(idx) {
    setOpenDungeon(prev => prev === idx ? null : idx)
  }

  return (
    <div>
      <PageHeader
        title="Normal & Heroic Dungeons"
        subtitle="Boss strategies, ability breakdowns, and role-specific tips for all WoW: Midnight 5-player dungeons — Normal and Heroic difficulty."
        accent={`${normalHeroicDungeons.length} Dungeons`}
      />

      {/* Difficulty switcher */}
      <div className={styles.diffBar}>
        <div className={styles.diffTabs}>
          {DIFFICULTIES.map(d => (
            <button
              key={d.id}
              className={`${styles.diffTab} ${difficulty === d.id ? styles.diffTabActive : ''}`}
              style={{ '--d-color': d.color }}
              onClick={() => setDifficulty(d.id)}
            >
              <span className={styles.diffDot} />
              {d.label}
            </button>
          ))}
        </div>
        <p className={styles.diffDesc}>{diffMeta.description}</p>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{normalHeroicDungeons.length}</span>
          <span className={styles.statLabel}>Dungeons</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{totalBosses}</span>
          <span className={styles.statLabel}>Total Bosses</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{minIlvl}+</span>
          <span className={styles.statLabel}>Recommended ilvl</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum} style={{ color: diffMeta.color }}>
            {Math.min(...normalHeroicDungeons.map(d => d[ilvlKey].lootMin))}–{maxIlvl}
          </span>
          <span className={styles.statLabel}>Loot ilvl Range</span>
        </div>
      </div>

      {/* Dungeon list */}
      <div className={styles.dungeonList}>
        {normalHeroicDungeons.map((dungeon, idx) => {
          const ilvl = dungeon[ilvlKey]
          const isOpen = openDungeon === idx
          return (
            <article key={dungeon.name} className={`${styles.dungeon} ${isOpen ? styles.dungeonOpen : ''}`}>
              <button
                className={styles.dungeonHeader}
                onClick={() => toggleDungeon(idx)}
              >
                <div className={styles.dungeonLeft}>
                  <span className={styles.dungeonNum}>{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className={styles.dungeonName}>{dungeon.name}</h3>
                    <span className={styles.dungeonZone}>{dungeon.zone}</span>
                  </div>
                </div>
                <div className={styles.dungeonRight}>
                  <div className={styles.dungeonMeta}>
                    <span className={styles.dungeonBossCount}>{dungeon.bosses} Bosses</span>
                    <span className={`${styles.diffBadge} ${DIFF_BADGE[difficulty].style}`}>
                      {DIFF_BADGE[difficulty].label} {ilvl.lootMin}–{ilvl.lootMax}
                    </span>
                    <span className={styles.recIlvl}>Req. {ilvl.recommended}+</span>
                  </div>
                  <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div className={styles.dungeonBody}>
                  <div className={styles.dungeonOverview}>
                    <div className={styles.dungeonDesc}>
                      <p className={styles.flavor}>"{dungeon.flavor}"</p>
                      <p className={styles.descText}>{dungeon.description}</p>
                    </div>
                    <div className={styles.dungeonInfo}>
                      <div className={styles.infoRow}>
                        <span className={styles.infoKey}>Zone</span>
                        <span className={styles.infoVal}>{dungeon.zone}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoKey}>Bosses</span>
                        <span className={styles.infoVal}>{dungeon.bosses}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoKey}>Min. ilvl</span>
                        <span className={styles.infoVal}>{ilvl.recommended}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoKey}>Loot ilvl</span>
                        <span className={styles.infoVal} style={{ color: diffMeta.color }}>
                          {ilvl.lootMin}–{ilvl.lootMax}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.bossListLabel}>
                    <h4 className={styles.bossListTitle}>Boss Encounters</h4>
                    <span className={styles.bossListHint}>Click a boss to expand strategies</span>
                  </div>
                  <div className={styles.bossList}>
                    {dungeon.encounters.map((boss, bi) => (
                      <BossAccordion key={boss.name} boss={boss} difficulty={difficulty} />
                    ))}
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
