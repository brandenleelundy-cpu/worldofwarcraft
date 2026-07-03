import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { addonCategories } from '../data/wikiData'
import styles from './Addons.module.css'

const COMPLEXITY_COLORS = {
  Low: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
  Medium: { color: '#facc15', bg: 'rgba(250,204,21,0.08)', border: 'rgba(250,204,21,0.2)' },
  High: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
  'Negligible': { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
  'Negligible (web-based)': { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
}

const CATEGORY_ACCENT = {
  gold: 'var(--color-gold-light)',
  teal: 'var(--color-accent-teal)',
  arcane: '#a78bfa',
  red: '#f87171',
  blue: '#60a5fa',
  void: '#818cf8',
}

const totalAddons = addonCategories.reduce((a, c) => a + c.addons.length, 0)

export default function Addons() {
  const [activeCategory, setActiveCategory] = useState(addonCategories[0].id)
  const [expandedAddon, setExpandedAddon] = useState(null)

  const category = addonCategories.find(c => c.id === activeCategory)

  function handleCategoryChange(id) {
    setActiveCategory(id)
    setExpandedAddon(null)
  }

  return (
    <div>
      <PageHeader
        title="Addon Guide"
        subtitle="The essential addon stack for Midnight -- curated by category with setup tips, use-case guidance, and performance notes."
        accent={`${totalAddons} Addons`}
      />

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          {addonCategories.map(cat => {
            const accent = CATEGORY_ACCENT[cat.color]
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                className={`${styles.catBtn} ${isActive ? styles.catBtnActive : ''}`}
                style={isActive ? { borderLeftColor: accent, color: accent } : {}}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <span className={styles.catName}>{cat.name}</span>
                <span className={styles.catCount}>{cat.addons.length}</span>
              </button>
            )
          })}

          <div className={styles.sidebarNote}>
            <span className={styles.noteIcon}>&#9670;</span>
            <p>All addons listed are compatible with Curse Forge and the WoW addon client. Install and keep up-to-date automatically.</p>
          </div>
        </aside>

        <div className={styles.content}>
          <div className={styles.categoryHeader}>
            <div>
              <h2 className={styles.categoryTitle} style={{ color: CATEGORY_ACCENT[category.color] }}>
                {category.name}
              </h2>
              <p className={styles.categoryDesc}>{category.description}</p>
            </div>
            <span className={styles.addonCountBadge}>{category.addons.length} addons</span>
          </div>

          <div className={styles.addonList}>
            {category.addons.map((addon, i) => {
              const isOpen = expandedAddon === `${category.id}-${i}`
              const complexStyle = COMPLEXITY_COLORS[addon.complexity] || COMPLEXITY_COLORS['Low']
              const perfStyle = COMPLEXITY_COLORS[addon.performance] || COMPLEXITY_COLORS['Low']
              const accent = CATEGORY_ACCENT[category.color]

              return (
                <article
                  key={addon.name}
                  className={`${styles.addonCard} ${isOpen ? styles.addonOpen : ''}`}
                >
                  <button
                    className={styles.addonHeader}
                    onClick={() => setExpandedAddon(isOpen ? null : `${category.id}-${i}`)}
                  >
                    <div className={styles.addonLeft}>
                      <div className={styles.addonTitleBlock}>
                        <h3 className={styles.addonName}>{addon.name}</h3>
                        <span className={styles.addonAuthor}>by {addon.author}</span>
                      </div>
                      <p className={styles.addonSummaryShort}>{addon.summary}</p>
                    </div>
                    <div className={styles.addonRight}>
                      <div className={styles.addonMeta}>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Setup</span>
                          <span
                            className={styles.metaBadge}
                            style={{ color: complexStyle.color, background: complexStyle.bg, borderColor: complexStyle.border }}
                          >{addon.complexity}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>CPU Impact</span>
                          <span
                            className={styles.metaBadge}
                            style={{ color: perfStyle.color, background: perfStyle.bg, borderColor: perfStyle.border }}
                          >{addon.performance}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Best For</span>
                          <span className={styles.metaUse}>{addon.use}</span>
                        </div>
                      </div>
                      <span className={styles.chevron}>{isOpen ? '\u25B2' : '\u25BC'}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.addonBody}>
                      <div className={styles.tagRow}>
                        {addon.tags.map(tag => (
                          <span key={tag} className={styles.tag} style={{ color: accent, borderColor: accent + '44', background: accent + '11' }}>{tag}</span>
                        ))}
                      </div>

                      <div className={styles.whyBlock}>
                        <span className={styles.whyLabel}>Why install this?</span>
                        <p className={styles.whyText}>{addon.whyInstall}</p>
                      </div>

                      {addon.tips.length > 0 && (
                        <div className={styles.tipsBlock}>
                          <span className={styles.tipsLabel}>Setup Tips</span>
                          <ul className={styles.tipsList}>
                            {addon.tips.map((tip, j) => (
                              <li key={j} className={styles.tipItem}>{tip}</li>
                            ))}
                          </ul>
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
