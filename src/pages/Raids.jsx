import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { raids } from '../data/wikiData'
import styles from './Raids.module.css'

export default function Raids() {
  const [expandedBoss, setExpandedBoss] = useState(null)
  const raid = raids[0]

  return (
    <div>
      <PageHeader
        title="Raid Strategies"
        subtitle="Comprehensive encounter guides for Midnight's raid content. Boss-by-boss breakdowns with role-specific tactics and video guides."
        accent={`${raid.name} - ${raid.bosses} Bosses`}
      />

      <div className={styles.raidHeader}>
        <div className={styles.raidMeta}>
          <span className={styles.raidName}>{raid.name}</span>
          <span className={styles.difficulty}>{raid.difficulty}</span>
        </div>
        <p className={styles.raidDescription}>{raid.description}</p>
      </div>

      <div className={styles.encounters}>
        {raid.encounters.map((encounter, i) => {
          const isExpanded = expandedBoss === i
          return (
            <article key={encounter.name} className={styles.encounter}>
              <button
                className={`${styles.encounterHeader} ${isExpanded ? styles.expanded : ''}`}
                onClick={() => setExpandedBoss(isExpanded ? null : i)}
              >
                <div className={styles.encounterLeft}>
                  <span className={styles.bossNumber}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className={styles.bossName}>{encounter.name}</h3>
                    <span className={styles.phase}>{encounter.phase}</span>
                  </div>
                </div>
                <div className={styles.encounterRight}>
                  <div className={styles.tags}>
                    {encounter.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                  <span className={styles.chevron}>{isExpanded ? '\u25B2' : '\u25BC'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className={styles.encounterBody}>
                  <p className={styles.bossDescription}>{encounter.description}</p>

                  <div className={styles.strategySection}>
                    <h4 className={styles.sectionLabel}>Strategy Overview</h4>
                    <p className={styles.strategyText}>{encounter.strategy}</p>
                  </div>

                  <div className={styles.roles}>
                    <div className={styles.roleCard}>
                      <div className={`${styles.roleHeader} ${styles.tankRole}`}>
                        <span className={styles.roleIcon}>&#9711;</span>
                        <span>Tanks</span>
                      </div>
                      <p className={styles.roleText}>{encounter.roles.tanks}</p>
                    </div>
                    <div className={styles.roleCard}>
                      <div className={`${styles.roleHeader} ${styles.healerRole}`}>
                        <span className={styles.roleIcon}>+</span>
                        <span>Healers</span>
                      </div>
                      <p className={styles.roleText}>{encounter.roles.healers}</p>
                    </div>
                    <div className={styles.roleCard}>
                      <div className={`${styles.roleHeader} ${styles.dpsRole}`}>
                        <span className={styles.roleIcon}>&#9876;</span>
                        <span>DPS</span>
                      </div>
                      <p className={styles.roleText}>{encounter.roles.dps}</p>
                    </div>
                  </div>

                  {encounter.videos && encounter.videos.length > 0 && (
                    <div className={styles.videoSection}>
                      <h4 className={styles.sectionLabel}>Strategy Videos</h4>
                      <div className={styles.videoGrid}>
                        {encounter.videos.map(video => (
                          <div key={video.title} className={styles.videoCard}>
                            <div className={styles.videoThumbnail}>
                              <div className={styles.playButton}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                              <span className={styles.videoDuration}>{video.duration}</span>
                            </div>
                            <div className={styles.videoInfo}>
                              <span className={styles.videoType}>{video.type}</span>
                              <h5 className={styles.videoTitle}>{video.title}</h5>
                              <span className={styles.videoCreator}>{video.creator}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
