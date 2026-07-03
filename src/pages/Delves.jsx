import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { delves, delveTiers, delveModifiers } from '../data/wikiData'
import styles from './Delves.module.css'

const DIFFICULTY_CLASS = {
  'Easy': styles.easy,
  'Medium': styles.medium,
  'Hard': styles.hard,
  'Very Hard': styles.veryHard,
}

const REWARD_CLASS = {
  'Cosmetic Armor': styles.rewardCosmetic,
  'Cosmetic Head': styles.rewardCosmetic,
  'Cosmetic Off-hand': styles.rewardCosmetic,
  'Cosmetic Back (cape)': styles.rewardCosmetic,
  'Cosmetic Trinket Visual': styles.rewardCosmetic,
  'Reputation': styles.rewardRep,
  'Battle Pet': styles.rewardPet,
}

export default function Delves() {
  const [selectedDelve, setSelectedDelve] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

  const delve = delves[selectedDelve]

  function handleSelect(i) {
    setSelectedDelve(i)
    setActiveTab('overview')
  }

  return (
    <div>
      <PageHeader
        title="Delves"
        subtitle="Solo and small-group content scattered across Quel'Thalas. Each delve is a self-contained challenge with its own mechanics, modifiers, and rewards."
        accent={`${delves.length} Delves Available`}
      />

      <section className={styles.systemSection}>
        <div className={styles.systemGrid}>
          <div className={styles.systemCard}>
            <h3 className={styles.systemTitle}>Delver's Journey</h3>
            <p className={styles.systemText}>Complete delves to earn Delver's Journey reputation. Reaching each milestone unlocks new curios, cosmetics, and a weekly Bountiful Delve assignment with bonus rewards.</p>
          </div>
          <div className={styles.systemCard}>
            <h3 className={styles.systemTitle}>Curios</h3>
            <p className={styles.systemText}>Equip up to 3 curio items before entering a delve. Curios provide passive bonuses ranging from extra healing to combat modifiers. Unlock new curios through reputation milestones.</p>
          </div>
          <div className={styles.systemCard}>
            <h3 className={styles.systemTitle}>Bountiful Delves</h3>
            <p className={styles.systemText}>Each week a random delve is designated Bountiful. Completing it awards an additional large chest with higher-quality loot. Bountiful delves also have unique NPC interactions in some runs.</p>
          </div>
        </div>
      </section>

      <section className={styles.tiersSection}>
        <h2 className={styles.sectionTitle}>Tier Scaling</h2>
        <div className={styles.tierTable}>
          {delveTiers.map(t => (
            <div key={t.tier} className={styles.tierRow}>
              <span className={styles.tierNum}>T{t.tier}</span>
              <span className={styles.tierIlvl}>{t.ilvlRange}</span>
              <span className={styles.tierDesc}>{t.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.modifiersSection}>
        <h2 className={styles.sectionTitle}>Active Modifiers</h2>
        <div className={styles.modifierGrid}>
          {delveModifiers.map(m => (
            <div key={m.name} className={styles.modifierCard}>
              <span className={styles.modifierName}>{m.name}</span>
              <p className={styles.modifierDesc}>{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.delvesSection}>
        <h2 className={styles.sectionTitle}>Delve Directory</h2>
        <div className={styles.layout}>
          <aside className={styles.delveList}>
            {delves.map((d, i) => (
              <button
                key={d.name}
                className={`${styles.delveBtn} ${selectedDelve === i ? styles.delveBtnActive : ''}`}
                onClick={() => handleSelect(i)}
              >
                <div className={styles.delveBtnTop}>
                  <span className={`${styles.diffPill} ${DIFFICULTY_CLASS[d.difficulty]}`}>{d.difficulty}</span>
                  <span className={styles.delveTiers}>T{d.tiers}</span>
                </div>
                <span className={styles.delveBtnName}>{d.name}</span>
                <div className={styles.delveBtnMeta}>
                  <span>{d.zone}</span>
                  <span>{d.time}</span>
                </div>
              </button>
            ))}
          </aside>

          <div className={styles.delveDetail}>
            <div className={styles.detailHeader}>
              <div>
                <div className={styles.detailHeaderTop}>
                  <span className={`${styles.diffPill} ${DIFFICULTY_CLASS[delve.difficulty]}`}>{delve.difficulty}</span>
                  <span className={styles.typeTag}>{delve.type}</span>
                  <span className={styles.timerTag}>{delve.time}</span>
                </div>
                <h2 className={styles.detailName}>{delve.name}</h2>
                <p className={styles.detailZone}>{delve.zone}</p>
              </div>
              <div className={styles.detailStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Tiers</span>
                  <span className={styles.statValue}>{delve.tiers}</span>
                </div>
              </div>
            </div>

            <p className={styles.synopsis}>{delve.synopsis}</p>

            <div className={styles.tabs}>
              {['overview', 'mechanics', 'boss', 'tips'].map(tab => (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'overview' && (
                <div className={styles.overviewContent}>
                  <div className={styles.twoCol}>
                    <div>
                      <h4 className={styles.contentLabel}>Layout</h4>
                      <p className={styles.contentText}>{delve.layout}</p>
                    </div>
                    <div>
                      <h4 className={styles.contentLabel}>Bountiful Chest</h4>
                      <p className={styles.contentText}>{delve.bountifulNote}</p>
                    </div>
                  </div>

                  <div className={styles.modifierTags}>
                    <h4 className={styles.contentLabel}>Active Modifiers</h4>
                    <div className={styles.tagRow}>
                      {delve.modifiers.map(m => (
                        <span key={m} className={styles.modTag}>{m}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className={styles.contentLabel}>Rewards</h4>
                    <div className={styles.rewardList}>
                      {delve.rewards.map(r => (
                        <div key={r.name} className={styles.rewardRow}>
                          <span className={`${styles.rewardBadge} ${REWARD_CLASS[r.type] || styles.rewardDefault}`}>{r.type}</span>
                          <span className={styles.rewardName}>{r.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'mechanics' && (
                <div className={styles.mechanicsContent}>
                  {delve.keyMechanics.map(m => (
                    <div key={m.name} className={styles.mechCard}>
                      <h4 className={styles.mechName}>{m.name}</h4>
                      <p className={styles.mechDesc}>{m.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'boss' && (
                <div className={styles.bossContent}>
                  <div className={styles.bossIntro}>
                    <h3 className={styles.bossName}>{delve.finalBoss.name}</h3>
                    <p className={styles.bossDesc}>{delve.finalBoss.description}</p>
                  </div>
                  <h4 className={styles.contentLabel}>Abilities</h4>
                  <div className={styles.abilityList}>
                    {delve.finalBoss.abilities.map(a => (
                      <div key={a.name} className={styles.abilityRow}>
                        <div className={styles.abilityLeft}>
                          <span className={styles.abilityName}>{a.name}</span>
                          <span className={styles.abilityCast}>{a.cast}</span>
                        </div>
                        <p className={styles.abilityNotes}>{a.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tips' && (
                <div className={styles.tipsContent}>
                  {delve.tips.map((tip, i) => (
                    <div key={i} className={styles.tipCard}>
                      <span className={styles.tipNum}>{String(i + 1).padStart(2, '0')}</span>
                      <p className={styles.tipText}>{tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
