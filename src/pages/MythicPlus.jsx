import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { mythicDungeons, affixes } from '../data/wikiData'
import styles from './MythicPlus.module.css'

export default function MythicPlus() {
  const [selectedDungeon, setSelectedDungeon] = useState(null)

  const difficultyColor = (d) => {
    if (d === 'Easy') return styles.easy
    if (d === 'Medium') return styles.medium
    if (d === 'Hard') return styles.hard
    return styles.veryHard
  }

  return (
    <div>
      <PageHeader
        title="Mythic+ Strategies"
        subtitle="Dungeon guides, optimal routes, and affix strategies for pushing high keys in Midnight's Mythic+ season."
        accent="Season 1 - 6 Dungeons"
      />

      <section className={styles.affixSection}>
        <h2 className={styles.sectionTitle}>Seasonal Affixes</h2>
        <div className={styles.affixGrid}>
          {affixes.map(affix => (
            <div key={affix.name} className={styles.affixCard}>
              <div className={styles.affixHeader}>
                <span className={styles.affixName}>{affix.name}</span>
                <span className={styles.affixLevel}>+{affix.level}</span>
              </div>
              <p className={styles.affixDesc}>{affix.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.dungeonSection}>
        <h2 className={styles.sectionTitle}>Dungeon Pool</h2>
        <div className={styles.dungeonGrid}>
          {mythicDungeons.map((dungeon, i) => (
            <button
              key={dungeon.name}
              className={`${styles.dungeonCard} ${selectedDungeon === i ? styles.selected : ''}`}
              onClick={() => setSelectedDungeon(selectedDungeon === i ? null : i)}
            >
              <div className={styles.dungeonCardHeader}>
                <span className={`${styles.diffBadge} ${difficultyColor(dungeon.difficulty)}`}>
                  {dungeon.difficulty}
                </span>
                <span className={styles.timer}>{dungeon.timer}</span>
              </div>
              <h3 className={styles.dungeonName}>{dungeon.name}</h3>
              <span className={styles.dungeonZone}>{dungeon.zone}</span>
              <div className={styles.dungeonMeta}>
                <span>{dungeon.bosses} Bosses</span>
                <span>{dungeon.trashCount} Trash Count</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedDungeon !== null && (
        <section className={styles.detailSection}>
          <DungeonDetail dungeon={mythicDungeons[selectedDungeon]} />
        </section>
      )}
    </div>
  )
}

function DungeonDetail({ dungeon }) {
  const [expandedBoss, setExpandedBoss] = useState(null)

  return (
    <div className={styles.detail}>
      <div className={styles.detailHeader}>
        <h2 className={styles.detailTitle}>{dungeon.name}</h2>
        <p className={styles.detailDesc}>{dungeon.description}</p>
      </div>

      <div className={styles.routeSection}>
        <h3 className={styles.subsectionTitle}>Recommended Route</h3>
        <p className={styles.routeText}>{dungeon.route}</p>
      </div>

      <div className={styles.tipsSection}>
        <h3 className={styles.subsectionTitle}>Key Tips</h3>
        <ul className={styles.tipsList}>
          {dungeon.tips.map((tip, i) => (
            <li key={i} className={styles.tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className={styles.bossSection}>
        <h3 className={styles.subsectionTitle}>Boss Encounters</h3>
        <div className={styles.bossList}>
          {dungeon.encounters.map((enc, i) => (
            <div key={enc.name} className={styles.bossItem}>
              <button
                className={`${styles.bossHeader} ${expandedBoss === i ? styles.bossExpanded : ''}`}
                onClick={() => setExpandedBoss(expandedBoss === i ? null : i)}
              >
                <div className={styles.bossLeft}>
                  <span className={styles.bossNum}>{i + 1}</span>
                  <span className={styles.bossName}>{enc.name}</span>
                </div>
                <span className={styles.bossChevron}>{expandedBoss === i ? '\u25B2' : '\u25BC'}</span>
              </button>
              {expandedBoss === i && (
                <div className={styles.bossStrategy}>
                  <p>{enc.strategy}</p>
                  {enc.videos && enc.videos.length > 0 && (
                    <div className={styles.videoSection}>
                      <span className={styles.videoLabel}>Strategy Videos</span>
                      <div className={styles.videoGrid}>
                        {enc.videos.map(video => (
                          <div key={video.title} className={styles.videoCard}>
                            <div className={styles.videoThumb}>
                              <div className={styles.playBtn}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                              <span className={styles.videoDur}>{video.duration}</span>
                            </div>
                            <div className={styles.videoMeta}>
                              <span className={styles.videoType}>{video.type}</span>
                              <span className={styles.videoTitle}>{video.title}</span>
                              <span className={styles.videoCreator}>{video.creator}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
