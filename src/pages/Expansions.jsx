import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { pastExpansions } from '../data/wikiData'
import styles from './Expansions.module.css'

export default function Expansions() {
  const [selected, setSelected] = useState(pastExpansions[pastExpansions.length - 1].id)
  const [activeTab, setActiveTab] = useState('overview')

  const exp = pastExpansions.find(e => e.id === selected)

  function handleSelect(id) {
    setSelected(id)
    setActiveTab('overview')
  }

  return (
    <div>
      <PageHeader
        title="Past Expansions"
        subtitle="A chronicle of every World of Warcraft expansion -- the stories they told, the systems they built, and their lasting legacy on Azeroth."
        accent={`${pastExpansions.length} Expansions`}
      />

      <div className={styles.timeline}>
        {pastExpansions.map((e, i) => (
          <button
            key={e.id}
            className={`${styles.timelineNode} ${selected === e.id ? styles.nodeActive : ''}`}
            style={{ '--exp-color': e.color }}
            onClick={() => handleSelect(e.id)}
            title={e.name}
          >
            <span className={styles.nodeDot} />
            <span className={styles.nodeYear}>{e.year}</span>
            <span className={styles.nodeShort}>{e.subtitle}</span>
          </button>
        ))}
        <div className={styles.timelineLine} />
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          {pastExpansions.map(e => (
            <button
              key={e.id}
              className={`${styles.expBtn} ${selected === e.id ? styles.expBtnActive : ''}`}
              style={selected === e.id ? { borderLeftColor: e.color } : {}}
              onClick={() => handleSelect(e.id)}
            >
              <div className={styles.expBtnTop}>
                <span className={styles.expYear}>{e.year}</span>
                <span
                  className={styles.expShort}
                  style={selected === e.id ? { color: e.color } : {}}
                >{e.subtitle}</span>
              </div>
              <span className={styles.expBtnName}>{e.name}</span>
              <span className={styles.expSetting}>{e.setting}</span>
            </button>
          ))}
        </aside>

        <div className={styles.detail}>
          <div
            className={styles.hero}
            style={{ backgroundImage: `url(${exp.accentImage})` }}
          >
            <div className={styles.heroOverlay} style={{ '--exp-color': exp.color }} />
            <div className={styles.heroContent}>
              <div className={styles.heroMeta}>
                <span className={styles.heroYear}>{exp.year}</span>
                <span className={styles.heroDot} />
                <span className={styles.heroSetting}>{exp.setting}</span>
              </div>
              <h2 className={styles.heroTitle}>{exp.name}</h2>
              <p className={styles.heroTagline} style={{ color: exp.color }}>&ldquo;{exp.tagline}&rdquo;</p>
            </div>
          </div>

          <div className={styles.tabs}>
            {['overview', 'content', 'legacy', 'relevance'].map(tab => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                style={activeTab === tab ? { color: exp.color, borderBottomColor: exp.color } : {}}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'relevance' ? 'Worldsoul Link' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.overviewTab}>
                <p className={styles.summary}>{exp.summary}</p>

                <div className={styles.twoCol}>
                  <div className={styles.infoBlock}>
                    <h4 className={styles.blockLabel}>Setting</h4>
                    <p className={styles.blockText}>{exp.setting_description}</p>
                  </div>
                  <div className={styles.infoBlock}>
                    <h4 className={styles.blockLabel}>Endgame Loop</h4>
                    <p className={styles.blockText}>{exp.endgameLoop}</p>
                    <div className={styles.villainBlock}>
                      <span className={styles.villainLabel}>Primary Antagonist</span>
                      <span className={styles.villainName}>{exp.villain}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.musicBlock}>
                  <span className={styles.musicIcon}>&#9836;</span>
                  <div>
                    <span className={styles.musicLabel}>Iconic Music Moment</span>
                    <p className={styles.musicText}>{exp.musicMoment}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className={styles.contentTab}>
                <div className={styles.twoCol}>
                  <div>
                    <h4 className={styles.blockLabel}>Key Raids</h4>
                    <div className={styles.pillList}>
                      {exp.keyRaids.map(r => (
                        <span key={r} className={styles.raidPill} style={{ borderColor: exp.color + '55', background: exp.color + '11' }}>{r}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className={styles.blockLabel}>Iconic Zones</h4>
                    <div className={styles.pillList}>
                      {exp.keyZones.map(z => (
                        <span key={z} className={styles.zonePill}>{z}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'legacy' && (
              <div className={styles.legacyTab}>
                <h4 className={styles.blockLabel}>Lasting Impact</h4>
                <div className={styles.legacyList}>
                  {exp.legacy.map((item, i) => (
                    <div key={i} className={styles.legacyItem} style={{ '--exp-color': exp.color }}>
                      <span className={styles.legacyNum}>{String(i + 1).padStart(2, '0')}</span>
                      <p className={styles.legacyText}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'relevance' && (
              <div className={styles.relevanceTab}>
                <div className={styles.relevanceCard} style={{ borderColor: exp.color + '44', background: exp.color + '08' }}>
                  <div className={styles.relevanceIcon} style={{ color: exp.color }}>&#9670;</div>
                  <div>
                    <h4 className={styles.relevanceTitle} style={{ color: exp.color }}>
                      {exp.name} &rsaquo; Worldsoul Saga
                    </h4>
                    <p className={styles.relevanceText}>{exp.worldsoulRelevance}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
