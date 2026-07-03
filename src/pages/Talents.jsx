import { useState, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { talentClasses, talentBuilds } from '../data/wikiData'
import styles from './Talents.module.css'

const CONTENT_TYPES = ['All', 'Raiding', 'Mythic+', 'PvP', 'Leveling']
const ROLES = ['All', 'DPS', 'Healer', 'Tank']

const ROLE_META = {
  DPS:    { label: 'DPS',    color: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)' },
  Healer: { label: 'Healer', color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.25)' },
  Tank:   { label: 'Tank',   color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.25)' },
}

const CONTENT_META = {
  Raiding:  { color: '#f87171' },
  'Mythic+': { color: '#fb923c' },
  PvP:      { color: '#c084fc' },
  Leveling: { color: '#4ade80' },
}

function RoleBadge({ role }) {
  const m = ROLE_META[role] || ROLE_META.DPS
  return (
    <span
      className={styles.roleBadge}
      style={{ color: m.color, background: m.bg, borderColor: m.border }}
    >
      {m.label}
    </span>
  )
}

function ContentBadge({ type }) {
  const m = CONTENT_META[type] || { color: '#94a3b8' }
  return (
    <span
      className={styles.contentBadge}
      style={{ color: m.color, borderColor: m.color + '40', background: m.color + '14' }}
    >
      {type}
    </span>
  )
}

function StatBar({ stats }) {
  return (
    <div className={styles.statBar}>
      {stats.map((stat, i) => (
        <div key={stat} className={styles.statItem}>
          <span className={styles.statRank} style={{ opacity: 1 - i * 0.15 }}>
            {i + 1}
          </span>
          <span className={styles.statName}>{stat}</span>
        </div>
      ))}
    </div>
  )
}

function BuildCard({ build, classColor }) {
  const [open, setOpen] = useState(false)
  return (
    <article
      className={`${styles.card} ${open ? styles.cardOpen : ''}`}
      style={{ '--c-color': classColor }}
    >
      <button className={styles.cardHeader} onClick={() => setOpen(o => !o)}>
        <div className={styles.cardTop}>
          <div className={styles.cardTitles}>
            <div className={styles.cardBadges}>
              <RoleBadge role={build.role} />
              {build.content.map(c => <ContentBadge key={c} type={c} />)}
            </div>
            <h3 className={styles.cardName}>{build.name}</h3>
            <span className={styles.cardSpec}>{build.spec}</span>
          </div>
          <span className={styles.cardChevron}>{open ? '▲' : '▼'}</span>
        </div>
        <p className={styles.cardTagline}>{build.tagline}</p>
      </button>

      {open && (
        <div className={styles.cardBody}>
          <p className={styles.cardDesc}>{build.description}</p>

          <div className={styles.playstyleBlock}>
            <h4 className={styles.sectionLabel}>Playstyle</h4>
            <p className={styles.playstyleText}>{build.playstyle}</p>
          </div>

          <div className={styles.bodyGrid}>
            <div className={styles.talentsCol}>
              <h4 className={styles.sectionLabel}>Key Talents</h4>
              <div className={styles.talents}>
                {build.keyTalents.map(t => (
                  <div key={t.name} className={styles.talent}>
                    <span className={styles.talentName}>{t.name}</span>
                    <p className={styles.talentDesc}>{t.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.sideCol}>
              <div className={styles.statsBlock}>
                <h4 className={styles.sectionLabel}>Stat Priority</h4>
                <StatBar stats={build.statPriority} />
                {build.gems && (
                  <p className={styles.gemsNote}><strong>Gems:</strong> {build.gems}</p>
                )}
              </div>

              <div className={styles.prosConsBlock}>
                <div className={styles.prosList}>
                  <h4 className={`${styles.sectionLabel} ${styles.prosLabel}`}>Strengths</h4>
                  {build.pros.map(p => (
                    <div key={p} className={styles.proItem}>
                      <span className={styles.proIcon}>+</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.consList}>
                  <h4 className={`${styles.sectionLabel} ${styles.consLabel}`}>Weaknesses</h4>
                  {build.cons.map(c => (
                    <div key={c} className={styles.conItem}>
                      <span className={styles.conIcon}>−</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default function Talents() {
  const [selectedClass, setSelectedClass] = useState('mage')
  const [selectedContent, setSelectedContent] = useState('All')
  const [selectedRole, setSelectedRole] = useState('All')

  const cls = talentClasses.find(c => c.id === selectedClass)

  const filtered = useMemo(() => {
    return talentBuilds.filter(b => {
      if (b.classId !== selectedClass) return false
      if (selectedContent !== 'All' && !b.content.includes(selectedContent)) return false
      if (selectedRole !== 'All' && b.role !== selectedRole) return false
      return true
    })
  }, [selectedClass, selectedContent, selectedRole])

  const totalBuilds = talentBuilds.filter(b => b.classId === selectedClass).length

  return (
    <div>
      <PageHeader
        title="Talents & Builds"
        subtitle="Curated talent builds for every class and spec — optimized for Raiding, Mythic+, PvP, and Leveling in WoW: Midnight."
        accent={`${talentBuilds.length} Builds`}
      />

      {/* Class selector */}
      <div className={styles.classSection}>
        <span className={styles.sectionHeader}>Select Class</span>
        <div className={styles.classGrid}>
          {talentClasses.map(c => (
            <button
              key={c.id}
              className={`${styles.classBtn} ${selectedClass === c.id ? styles.classBtnActive : ''}`}
              style={{ '--c-color': c.color }}
              onClick={() => {
                setSelectedClass(c.id)
                setSelectedContent('All')
                setSelectedRole('All')
              }}
            >
              <span className={styles.classIndicator} />
              <span className={styles.className}>{c.name}</span>
              {c.isNew && <span className={styles.newBadge}>New</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Class info banner */}
      {cls && (
        <div className={styles.classBanner} style={{ '--c-color': cls.color }}>
          <div className={styles.bannerLeft}>
            <span className={styles.bannerName}>{cls.name}</span>
            {cls.isNew && <span className={styles.bannerNew}>Midnight Exclusive</span>}
            <p className={styles.bannerDesc}>{cls.description}</p>
            <div className={styles.bannerSpecs}>
              {cls.specs.map(s => (
                <span key={s} className={styles.specPill}>{s}</span>
              ))}
            </div>
          </div>
          <div className={styles.bannerStat}>
            <span className={styles.bannerStatNum}>{totalBuilds}</span>
            <span className={styles.bannerStatLabel}>Builds Available</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Content</span>
          <div className={styles.filterTabs}>
            {CONTENT_TYPES.map(t => (
              <button
                key={t}
                className={`${styles.filterTab} ${selectedContent === t ? styles.filterTabActive : ''}`}
                onClick={() => setSelectedContent(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Role</span>
          <div className={styles.filterTabs}>
            {ROLES.map(r => (
              <button
                key={r}
                className={`${styles.filterTab} ${selectedRole === r ? styles.filterTabActive : ''}`}
                onClick={() => setSelectedRole(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={styles.resultsMeta}>
        {filtered.length === 0
          ? 'No builds match the current filters.'
          : `${filtered.length} build${filtered.length !== 1 ? 's' : ''}`}
        {(selectedContent !== 'All' || selectedRole !== 'All') && (
          <button
            className={styles.clearBtn}
            onClick={() => { setSelectedContent('All'); setSelectedRole('All') }}
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          No builds available for this combination. Try adjusting the filters.
        </div>
      ) : (
        <div className={styles.buildList}>
          {filtered.map(build => (
            <BuildCard
              key={build.id}
              build={build}
              classColor={cls?.color ?? '#c9a227'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
