import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { tutorialCategories } from '../data/wikiData'
import styles from './Tutorials.module.css'

const DIFFICULTY_STYLES = {
  Beginner: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
  Intermediate: { color: '#facc15', bg: 'rgba(250,204,21,0.08)', border: 'rgba(250,204,21,0.2)' },
  Advanced: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
}

const totalTutorials = tutorialCategories.reduce((a, c) => a + c.tutorials.length, 0)

export default function Tutorials() {
  const [activeCat, setActiveCat] = useState(tutorialCategories[0].id)
  const [expanded, setExpanded] = useState(null)

  const category = tutorialCategories.find(c => c.id === activeCat)

  function handleCategoryChange(id) {
    setActiveCat(id)
    setExpanded(null)
  }

  return (
    <div>
      <PageHeader
        title="Tutorials"
        subtitle="Step-by-step guides covering everything from your first login to high-end optimization — written for players at every level."
        accent={`${totalTutorials} Guides`}
      />

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {tutorialCategories.map(cat => {
            const isActive = activeCat === cat.id
            return (
              <button
                key={cat.id}
                className={`${styles.catBtn} ${isActive ? styles.catBtnActive : ''}`}
                style={isActive ? { borderLeftColor: cat.color, color: cat.color } : {}}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <span className={styles.catIcon} dangerouslySetInnerHTML={{ __html: cat.icon }} />
                <div className={styles.catInfo}>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={styles.catCount}>{cat.tutorials.length} guides</span>
                </div>
              </button>
            )
          })}

          <div className={styles.sidebarNote}>
            <span className={styles.noteIcon}>&#9670;</span>
            <p>All guides are written for World of Warcraft: Midnight and updated for the current season.</p>
          </div>
        </aside>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.categoryHeader} style={{ borderLeftColor: category.color }}>
            <div className={styles.categoryTitleRow}>
              <h2 className={styles.categoryTitle} style={{ color: category.color }}>
                {category.name}
              </h2>
              <span className={styles.categoryCount}>{category.tutorials.length} guides</span>
            </div>
            <p className={styles.categoryDesc}>{category.description}</p>
          </div>

          <div className={styles.tutorialList}>
            {category.tutorials.map((tutorial, i) => {
              const key = `${activeCat}-${i}`
              const isOpen = expanded === key
              const diffStyle = DIFFICULTY_STYLES[tutorial.difficulty] || DIFFICULTY_STYLES.Beginner

              return (
                <article
                  key={tutorial.title}
                  className={`${styles.card} ${isOpen ? styles.cardOpen : ''}`}
                  style={{ '--cat-color': category.color }}
                >
                  <button
                    className={styles.cardHeader}
                    onClick={() => setExpanded(isOpen ? null : key)}
                  >
                    <div className={styles.cardLeft}>
                      <div className={styles.cardTitleRow}>
                        <h3 className={styles.cardTitle}>{tutorial.title}</h3>
                        <div className={styles.cardBadges}>
                          <span
                            className={styles.diffBadge}
                            style={{ color: diffStyle.color, background: diffStyle.bg, border: `1px solid ${diffStyle.border}` }}
                          >
                            {tutorial.difficulty}
                          </span>
                          <span className={styles.timeBadge}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {tutorial.time}
                          </span>
                        </div>
                      </div>
                      <p className={styles.cardSummary}>{tutorial.summary}</p>
                      <div className={styles.cardTags}>
                        {tutorial.tags.map(tag => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.cardRight}>
                      <span className={styles.stepCount}>{tutorial.steps.length} steps</span>
                      <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.cardBody}>
                      {/* Steps */}
                      <div className={styles.stepsSection}>
                        <h4 className={styles.sectionLabel}>Step-by-Step Guide</h4>
                        <ol className={styles.stepsList}>
                          {tutorial.steps.map((step, si) => (
                            <li key={si} className={styles.step}>
                              <div className={styles.stepNum} style={{ background: category.color + '18', color: category.color, border: `1px solid ${category.color}30` }}>
                                {si + 1}
                              </div>
                              <div className={styles.stepContent}>
                                <strong className={styles.stepTitle}>{step.title}</strong>
                                <p className={styles.stepDesc}>{step.description}</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Tips */}
                      {tutorial.tips.length > 0 && (
                        <div className={styles.tipsSection}>
                          <h4 className={styles.sectionLabel}>Tips</h4>
                          <ul className={styles.tipsList}>
                            {tutorial.tips.map((tip, ti) => (
                              <li key={ti} className={styles.tip} style={{ '--tip-color': category.color }}>
                                {tip}
                              </li>
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
