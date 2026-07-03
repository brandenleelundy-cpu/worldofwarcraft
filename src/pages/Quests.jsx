import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { questChains } from '../data/wikiData'
import styles from './Quests.module.css'

const TYPE_ICONS = {
  'Intro': '&#9670;',
  'Story': '&#9654;',
  'Combat': '&#9876;',
  'Investigation': '&#9906;',
  'Confrontation': '&#9888;',
  'Exploration': '&#9903;',
  'Lore / Exploration': '&#9903;',
  'Lore': '&#9900;',
  'Combat / Revelation': '&#9876;',
  'Reputation Intro': '&#9733;',
  'Finale / Ceremony': '&#10022;',
}

const REWARD_COLORS = {
  'Bag': styles.rewardBag,
  'Currency': styles.rewardCurrency,
  'Armor': styles.rewardArmor,
  'Accessory': styles.rewardArmor,
  'Cosmetic': styles.rewardCosmetic,
  'Cosmetic Weapon': styles.rewardCosmetic,
  'Cosmetic Accessory': styles.rewardCosmetic,
  'Cosmetic Armor': styles.rewardCosmetic,
  'Cosmetic Use-item': styles.rewardCosmetic,
  'Cosmetic Off-hand': styles.rewardCosmetic,
  'Toy/Cosmetic': styles.rewardCosmetic,
  'Off-hand / Cosmetic': styles.rewardCosmetic,
  'Reputation': styles.rewardRep,
  'Lore Book / Cosmetic': styles.rewardCosmetic,
  'Lore Item / Cosmetic': styles.rewardCosmetic,
  'Title': styles.rewardTitle,
  'Mount Item': styles.rewardMount,
}

export default function Quests() {
  const [activeChain, setActiveChain] = useState(questChains[0].id)
  const [expandedQuest, setExpandedQuest] = useState(null)

  const chain = questChains.find(c => c.id === activeChain)

  function handleChainChange(id) {
    setActiveChain(id)
    setExpandedQuest(null)
  }

  return (
    <div>
      <PageHeader
        title="Quests"
        subtitle="Main story campaigns, side chains, and reputation quests across Quel'Thalas. Every notable reward, objective, and story beat catalogued."
        accent={`${questChains.reduce((a, c) => a + c.quests, 0)}+ Quests`}
      />

      <div className={styles.layout}>
        <aside className={styles.chainList}>
          {questChains.map(c => (
            <button
              key={c.id}
              className={`${styles.chainBtn} ${styles[`chain_${c.color}`]} ${activeChain === c.id ? styles.chainActive : ''}`}
              onClick={() => handleChainChange(c.id)}
            >
              <span className={styles.chainType}>{c.type}</span>
              <span className={styles.chainName}>{c.name}</span>
              <div className={styles.chainMeta}>
                <span>{c.quests} quests</span>
                <span>{c.zone}</span>
              </div>
            </button>
          ))}
        </aside>

        <div className={styles.chainDetail}>
          <div className={styles.chainHeader}>
            <div>
              <div className={styles.chainHeaderTop}>
                <span className={`${styles.typePill} ${styles[`pill_${chain.color}`]}`}>{chain.type}</span>
                <span className={styles.chainQuestCount}>{chain.quests} total quests</span>
              </div>
              <h2 className={styles.chainTitle}>{chain.name}</h2>
              <p className={styles.chainDesc}>{chain.description}</p>
            </div>
            <div className={styles.chainZoneBadge}>{chain.zone}</div>
          </div>

          <div className={styles.questList}>
            <div className={styles.questListHeader}>
              <span>Featured Quests</span>
              <span className={styles.featuredNote}>Showing key quests from this chain</span>
            </div>
            {chain.quests_list.map((quest, i) => {
              const isOpen = expandedQuest === `${chain.id}-${i}`
              return (
                <article key={quest.title} className={`${styles.questItem} ${isOpen ? styles.questOpen : ''}`}>
                  <button
                    className={styles.questHeader}
                    onClick={() => setExpandedQuest(isOpen ? null : `${chain.id}-${i}`)}
                  >
                    <div className={styles.questLeft}>
                      <span
                        className={`${styles.questTypeIcon} ${styles[`icon_${chain.color}`]}`}
                        dangerouslySetInnerHTML={{ __html: TYPE_ICONS[quest.type] || '&#9654;' }}
                      />
                      <div className={styles.questTitleBlock}>
                        <span className={styles.questTitle}>{quest.title}</span>
                        <div className={styles.questSubline}>
                          <span className={styles.questType}>{quest.type}</span>
                          <span className={styles.questDot}>·</span>
                          <span className={styles.questLocation}>{quest.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.questRight}>
                      <div className={styles.miniRewards}>
                        {quest.rewards.slice(0, 2).map(r => (
                          <span key={r.name} className={`${styles.miniReward} ${REWARD_COLORS[r.type] || ''}`}>{r.type}</span>
                        ))}
                      </div>
                      <span className={styles.questChevron}>{isOpen ? '\u25B2' : '\u25BC'}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.questBody}>
                      <p className={styles.questSummary}>{quest.summary}</p>

                      <div className={styles.questColumns}>
                        <div className={styles.objectivesBlock}>
                          <h4 className={styles.blockLabel}>Objectives</h4>
                          <ul className={styles.objectiveList}>
                            {quest.objectives.map((obj, j) => (
                              <li key={j} className={styles.objective}>{obj}</li>
                            ))}
                          </ul>
                        </div>

                        <div className={styles.rewardsBlock}>
                          <h4 className={styles.blockLabel}>Rewards</h4>
                          <div className={styles.rewardList}>
                            {quest.rewards.map(r => (
                              <div key={r.name} className={styles.reward}>
                                <span className={`${styles.rewardBadge} ${REWARD_COLORS[r.type] || styles.rewardBag}`}>{r.type}</span>
                                <span className={styles.rewardName}>{r.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {quest.notable && (
                        <div className={styles.notableBlock}>
                          <span className={styles.notableIcon}>&#9670;</span>
                          <span className={styles.notableText}>{quest.notable}</span>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
