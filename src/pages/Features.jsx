import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { features } from '../data/wikiData'
import styles from './Features.module.css'

const EXPANSIONS = ['All', 'The War Within', 'Midnight']

const CATEGORY_COLORS = {
  Story: { color: '#e8c94a', bg: 'rgba(232,201,74,0.08)', border: 'rgba(232,201,74,0.2)' },
  World: { color: '#2dd4bf', bg: 'rgba(45,212,191,0.08)', border: 'rgba(45,212,191,0.2)' },
  Gameplay: { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' },
  'End-Game': { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
  Class: { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  Social: { color: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)' },
}

const STATUS_COLORS = {
  'Live': { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)' },
  'Live (Seasonal)': { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)' },
  'Confirmed': { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)' },
}

const EXPANSION_COLORS = {
  'The War Within': { accent: '#c9882e', label: 'The War Within', short: 'TWW' },
  'Midnight': { accent: '#c9a227', label: 'Midnight', short: 'MN' },
}

const CATEGORIES = ['All', 'Story', 'World', 'Gameplay', 'End-Game', 'Class', 'Social']

export default function Features() {
  const [expansion, setExpansion] = useState('All')
  const [category, setCategory] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const visible = features.filter(f =>
    (expansion === 'All' || f.expansion === expansion) &&
    (category === 'All' || f.category === category)
  )

  const midnightCount = features.filter(f => f.expansion === 'Midnight').length
  const twwCount = features.filter(f => f.expansion === 'The War Within').length

  return (
    <div>
      <PageHeader
        title="Expansion Features"
        subtitle="New systems, content, and narrative innovations across The War Within and Midnight -- the second chapter of the Worldsoul Saga."
        accent={`${features.length} Features`}
      />

      <div className={styles.expansionTabs}>
        {EXPANSIONS.map(exp => (
          <button
            key={exp}
            className={`${styles.expTab} ${expansion === exp ? styles.expTabActive : ''} ${exp !== 'All' ? styles[`exp_${exp.replace(/[\s']/g, '')}`] : ''}`}
            onClick={() => { setExpansion(exp); setExpanded(null) }}
          >
            {exp === 'All'
              ? `All Expansions (${features.length})`
              : exp === 'Midnight'
                ? `Midnight (${midnightCount})`
                : `The War Within (${twwCount})`}
          </button>
        ))}
      </div>

      <div className={styles.categoryFilters}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${styles.catFilter} ${category === cat ? styles.catFilterActive : ''}`}
            style={category === cat && cat !== 'All' ? {
              color: CATEGORY_COLORS[cat]?.color,
              borderColor: CATEGORY_COLORS[cat]?.border,
              background: CATEGORY_COLORS[cat]?.bg,
            } : {}}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {expansion === 'All' ? (
        <>
          {['Midnight', 'The War Within'].map(exp => {
            const expFeatures = visible.filter(f => f.expansion === exp)
            if (expFeatures.length === 0) return null
            const { accent, label } = EXPANSION_COLORS[exp]
            return (
              <section key={exp} className={styles.expansionSection}>
                <div className={styles.expansionHeading} style={{ borderColor: accent + '55' }}>
                  <span className={styles.expansionLabel} style={{ color: accent }}>{label}</span>
                  <span className={styles.expansionCount}>{expFeatures.length} features</span>
                </div>
                <FeatureGrid
                  features={expFeatures}
                  expanded={expanded}
                  onExpand={setExpanded}
                />
              </section>
            )
          })}
        </>
      ) : (
        <FeatureGrid
          features={visible}
          expanded={expanded}
          onExpand={setExpanded}
        />
      )}

      {visible.length === 0 && (
        <p className={styles.empty}>No features match the current filters.</p>
      )}
    </div>
  )
}

function FeatureGrid({ features, expanded, onExpand }) {
  return (
    <div className={styles.grid}>
      {features.map((feature, i) => {
        const catStyle = CATEGORY_COLORS[feature.category] || {}
        const statusStyle = STATUS_COLORS[feature.status] || {}
        const isOpen = expanded === `${feature.expansion}-${feature.name}`
        const expColor = EXPANSION_COLORS[feature.expansion]?.accent

        return (
          <article
            key={`${feature.expansion}-${feature.name}`}
            className={`${styles.card} ${isOpen ? styles.cardOpen : ''}`}
            style={{ '--exp-accent': expColor }}
          >
            <div className={styles.cardTop}>
              <div className={styles.cardBadges}>
                <span
                  className={styles.category}
                  style={{ color: catStyle.color, background: catStyle.bg, borderColor: catStyle.border }}
                >
                  {feature.category}
                </span>
                <span
                  className={styles.status}
                  style={{ color: statusStyle.color, background: statusStyle.bg, borderColor: statusStyle.border }}
                >
                  {feature.status}
                </span>
              </div>
            </div>

            <h3 className={styles.name}>{feature.name}</h3>
            <p className={styles.description}>{feature.description}</p>

            {feature.detail && (
              <>
                <button
                  className={styles.detailToggle}
                  onClick={() => onExpand(isOpen ? null : `${feature.expansion}-${feature.name}`)}
                >
                  {isOpen ? 'Show less' : 'More details'}
                  <span className={styles.toggleIcon}>{isOpen ? '\u25B2' : '\u25BC'}</span>
                </button>
                {isOpen && (
                  <p className={styles.detail}>{feature.detail}</p>
                )}
              </>
            )}
          </article>
        )
      })}
    </div>
  )
}
