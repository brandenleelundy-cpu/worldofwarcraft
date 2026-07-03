import { useState, useMemo } from 'react'
import PageHeader from '../components/PageHeader'
import { rareItems } from '../data/wikiData'
import styles from './RareItems.module.css'

const RARITY_ORDER = ['Legendary', 'Epic', 'Rare']
const RARITY_COLORS = {
  Legendary: '#ff8000',
  Epic: '#c27bff',
  Rare: '#2a9fd6',
}

const CATEGORIES = ['All', 'Weapons', 'Armor', 'Trinkets', 'Mounts', 'Crafted', 'World Drops']
const RARITIES = ['All', 'Legendary', 'Epic', 'Rare']

const SOURCE_ICONS = {
  Raid: '&#9876;',
  'Mythic+': '&#9883;',
  Reputation: '&#9734;',
  Achievement: '&#9670;',
  Crafted: '&#9881;',
  Delve: '&#9649;',
  'World Drop': '&#9728;',
}

export default function RareItems() {
  const [category, setCategory] = useState('All')
  const [rarity, setRarity] = useState('All')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = useMemo(() => {
    return rareItems
      .filter(item => {
        if (category !== 'All' && item.category !== category) return false
        if (rarity !== 'All' && item.rarity !== rarity) return false
        if (search.trim()) {
          const q = search.toLowerCase()
          return (
            item.name.toLowerCase().includes(q) ||
            item.type.toLowerCase().includes(q) ||
            item.source.toLowerCase().includes(q) ||
            item.tags.some(t => t.toLowerCase().includes(q))
          )
        }
        return true
      })
      .sort((a, b) => {
        const ra = RARITY_ORDER.indexOf(a.rarity)
        const rb = RARITY_ORDER.indexOf(b.rarity)
        return ra - rb
      })
  }, [category, rarity, search])

  const counts = useMemo(() => {
    const c = {}
    RARITIES.slice(1).forEach(r => {
      c[r] = rareItems.filter(i => i.rarity === r).length
    })
    return c
  }, [])

  return (
    <div>
      <PageHeader
        title="Rare Items"
        subtitle="Legendary weapons, epic mounts, powerful trinkets, and ultra-rare world drops in World of Warcraft: Midnight."
        accent={`${rareItems.length} Items Catalogued`}
      />

      {/* Rarity summary */}
      <div className={styles.raritySummary}>
        {RARITY_ORDER.map(r => (
          <button
            key={r}
            className={`${styles.rarityPill} ${rarity === r ? styles.rarityPillActive : ''}`}
            style={{ '--rarity-color': RARITY_COLORS[r] }}
            onClick={() => { setRarity(rarity === r ? 'All' : r); setExpanded(null) }}
          >
            <span className={styles.rarityDot} />
            <span>{r}</span>
            <span className={styles.rarityCount}>{counts[r]}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        <div className={styles.categoryTabs}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`${styles.catTab} ${category === c ? styles.catTabActive : ''}`}
              onClick={() => { setCategory(c); setExpanded(null) }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search items, sources, tags..."
            value={search}
            onChange={e => { setSearch(e.target.value); setExpanded(null) }}
          />
          {search && (
            <button className={styles.searchClear} onClick={() => setSearch('')}>&#215;</button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsMeta}>
        {filtered.length === rareItems.length
          ? `All ${rareItems.length} items`
          : `${filtered.length} of ${rareItems.length} items`}
        {(category !== 'All' || rarity !== 'All' || search) && (
          <button className={styles.clearFilters} onClick={() => { setCategory('All'); setRarity('All'); setSearch('') }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Item list */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>No items match the current filters.</div>
      ) : (
        <div className={styles.itemList}>
          {filtered.map(item => {
            const isOpen = expanded === item.id
            const color = RARITY_COLORS[item.rarity]
            return (
              <article
                key={item.id}
                className={`${styles.itemCard} ${isOpen ? styles.itemCardOpen : ''}`}
                style={{ '--item-color': color }}
              >
                <button
                  className={styles.itemHeader}
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                >
                  <div className={styles.itemLeft}>
                    <div className={styles.itemIcon}>
                      <span dangerouslySetInnerHTML={{ __html: SOURCE_ICONS[item.sourcetype] || '&#9670;' }} />
                    </div>
                    <div className={styles.itemTitleBlock}>
                      <div className={styles.itemNameRow}>
                        <h3 className={styles.itemName} style={{ color }}>{item.name}</h3>
                        <span className={styles.itemRarity} style={{ color }}>{item.rarity}</span>
                      </div>
                      <div className={styles.itemSubRow}>
                        <span className={styles.itemType}>{item.type}</span>
                        {item.ilvl && <span className={styles.itemIlvl}>ilvl {item.ilvl}</span>}
                      </div>
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <span className={styles.itemSourceBadge}>{item.sourcetype}</span>
                    <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className={styles.itemBody}>
                    <div className={styles.itemLayout}>
                      <div className={styles.itemImageCol}>
                        <div className={styles.itemImageWrap}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className={styles.itemImage}
                            loading="lazy"
                          />
                          <div className={styles.itemImageOverlay} style={{ background: `linear-gradient(to top, ${color}22, transparent)` }} />
                        </div>
                      </div>
                      <div className={styles.itemDetailCol}>
                        <p className={styles.itemDesc}>{item.description}</p>

                        <div className={styles.effectBlock}>
                          <span className={styles.effectLabel}>Effect</span>
                          <p className={styles.effectText}>{item.effect}</p>
                        </div>

                        <div className={styles.sourceBlock}>
                          <div className={styles.sourceRow}>
                            <span className={styles.sourceLabel}>Source</span>
                            <span className={styles.sourceValue}>{item.source}</span>
                          </div>
                          <div className={styles.sourceRow}>
                            <span className={styles.sourceLabel}>Obtain</span>
                            <span className={styles.sourceValue}>{item.droprate}</span>
                          </div>
                          <div className={styles.sourceRow}>
                            <span className={styles.sourceLabel}>Zone</span>
                            <span className={styles.sourceValue}>{item.zone}</span>
                          </div>
                        </div>

                        <div className={styles.loreBlock}>
                          <span className={styles.loreLabel}>Lore</span>
                          <p className={styles.loreText}>{item.lore}</p>
                        </div>

                        <div className={styles.itemTags}>
                          {item.tags.map(tag => (
                            <span key={tag} className={styles.itemTag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
