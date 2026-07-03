import { useState, useEffect, useCallback } from 'react'
import PageHeader from '../components/PageHeader'
import styles from './Promotions.module.css'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const CATEGORIES = [
  { id: 'all',               label: 'All',               color: '#c9a227' },
  { id: 'shop_sale',         label: 'Shop Sales',        color: '#fb923c' },
  { id: 'bonus_event',       label: 'Bonus Events',      color: '#4ade80' },
  { id: 'subscription_deal', label: 'Subscription Deals', color: '#60a5fa' },
  { id: 'bundle',            label: 'Bundles',           color: '#c084fc' },
]

const CAT_META = {
  shop_sale:         { label: 'Shop Sale',    color: '#fb923c' },
  bonus_event:       { label: 'Bonus Event',  color: '#4ade80' },
  subscription_deal: { label: 'Sub Deal',     color: '#60a5fa' },
  bundle:            { label: 'Bundle',       color: '#c084fc' },
}

function now() { return new Date() }

function isActive(p) {
  const n = now()
  return new Date(p.start_date) <= n && new Date(p.end_date) >= n
}

function isUpcoming(p) {
  return new Date(p.start_date) > now()
}

function useCountdown(endDate) {
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    function calc() {
      const ms = new Date(endDate) - now()
      if (ms <= 0) { setRemaining(null); return }
      const days  = Math.floor(ms / 86400000)
      const hours = Math.floor((ms % 86400000) / 3600000)
      const mins  = Math.floor((ms % 3600000)  / 60000)
      setRemaining({ days, hours, mins, ms })
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [endDate])

  return remaining
}

function CountdownBadge({ endDate, startDate }) {
  const upcoming = new Date(startDate) > now()
  const targetDate = upcoming ? startDate : endDate
  const remaining = useCountdown(targetDate)

  if (!remaining) {
    return <span className={`${styles.timerBadge} ${styles.timerExpired}`}>Ended</span>
  }

  if (upcoming) {
    const startsIn = new Date(startDate) - now()
    const days = Math.floor(startsIn / 86400000)
    const hours = Math.floor((startsIn % 86400000) / 3600000)
    return (
      <span className={`${styles.timerBadge} ${styles.timerUpcoming}`}>
        Starts in {days > 0 ? `${days}d ` : ''}{hours}h
      </span>
    )
  }

  if (remaining.days >= 7) {
    return (
      <span className={`${styles.timerBadge} ${styles.timerPlenty}`}>
        {remaining.days}d left
      </span>
    )
  }
  if (remaining.days >= 1) {
    return (
      <span className={`${styles.timerBadge} ${styles.timerSoon}`}>
        {remaining.days}d {remaining.hours}h left
      </span>
    )
  }
  return (
    <span className={`${styles.timerBadge} ${styles.timerUrgent}`}>
      {remaining.hours}h {remaining.mins}m left
    </span>
  )
}

function PriceLine({ p }) {
  if (!p.original_price && !p.sale_price) return null
  return (
    <div className={styles.priceLine}>
      {p.original_price && p.sale_price && p.original_price !== p.sale_price ? (
        <>
          <span className={styles.priceOriginal}>${Number(p.original_price).toFixed(2)}</span>
          <span className={styles.priceSale}>${Number(p.sale_price).toFixed(2)}</span>
        </>
      ) : (
        <span className={styles.priceSale}>
          ${Number(p.sale_price ?? p.original_price).toFixed(2)}
        </span>
      )}
    </div>
  )
}

function PromotionCard({ p }) {
  const active = isActive(p)
  const upcoming = isUpcoming(p)
  const meta = CAT_META[p.category] ?? { label: p.category, color: '#c9a227' }

  return (
    <article
      className={`${styles.card} ${!active && !upcoming ? styles.cardExpired : ''}`}
      style={{ '--cat-color': meta.color }}
    >
      {p.image_url && (
        <div className={styles.cardImg}>
          <img src={p.image_url} alt={p.title} loading="lazy" />
          <div className={styles.cardImgOverlay} />
          <div className={styles.cardImgBadges}>
            <span
              className={styles.catBadge}
              style={{ color: meta.color, background: meta.color + '1a', borderColor: meta.color + '50' }}
            >
              {meta.label}
            </span>
            {p.discount_text && (
              <span className={styles.discountBadge}>{p.discount_text}</span>
            )}
          </div>
        </div>
      )}
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          {!p.image_url && (
            <span
              className={styles.catBadge}
              style={{ color: meta.color, background: meta.color + '1a', borderColor: meta.color + '50' }}
            >
              {meta.label}
            </span>
          )}
          <CountdownBadge endDate={p.end_date} startDate={p.start_date} />
        </div>

        <h3 className={styles.cardTitle}>{p.title}</h3>

        {p.short_note && (
          <p className={styles.cardNote}>{p.short_note}</p>
        )}

        <p className={styles.cardDesc}>{p.description}</p>

        {p.tags?.length > 0 && (
          <div className={styles.cardTags}>
            {p.tags.map(t => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        )}

        <div className={styles.cardFooter}>
          <PriceLine p={p} />
          <span className={styles.dateRange}>
            {new Date(p.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {' – '}
            {new Date(p.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
    </article>
  )
}

function FeaturedCard({ p }) {
  const meta = CAT_META[p.category] ?? { label: p.category, color: '#c9a227' }
  return (
    <article className={styles.featuredCard} style={{ '--cat-color': meta.color }}>
      {p.image_url && (
        <div className={styles.featuredImg}>
          <img src={p.image_url} alt={p.title} loading="eager" />
          <div className={styles.featuredImgOverlay} />
        </div>
      )}
      <div className={styles.featuredContent}>
        <div className={styles.featuredBadges}>
          <span className={styles.featuredLabel}>Featured</span>
          <span
            className={styles.catBadge}
            style={{ color: meta.color, background: meta.color + '1a', borderColor: meta.color + '50' }}
          >
            {meta.label}
          </span>
          {p.discount_text && (
            <span className={styles.discountBadge}>{p.discount_text}</span>
          )}
          <CountdownBadge endDate={p.end_date} startDate={p.start_date} />
        </div>
        <h2 className={styles.featuredTitle}>{p.title}</h2>
        <p className={styles.featuredDesc}>{p.description}</p>
        <div className={styles.featuredFooter}>
          <PriceLine p={p} />
          <div className={styles.featuredTags}>
            {p.tags?.slice(0, 4).map(t => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Promotions() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('all')

  const fetchPromotions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/promotions?select=*&order=sort_order.asc`,
        {
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
        }
      )
      if (!res.ok) throw new Error(`Failed to load promotions (${res.status})`)
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('Unexpected response from server')
      setPromotions(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPromotions() }, [fetchPromotions])

  const filtered = promotions.filter(p =>
    category === 'all' || p.category === category
  )

  const featured   = filtered.filter(p => p.featured && isActive(p))
  const active     = filtered.filter(p => !p.featured && isActive(p))
  const upcoming   = filtered.filter(p => isUpcoming(p))

  const activeCatCount = (id) =>
    promotions.filter(p => (id === 'all' || p.category === id) && isActive(p)).length

  return (
    <div>
      <PageHeader
        title="Sales & Promotions"
        subtitle="Current and upcoming Blizzard Shop sales, in-game bonus events, subscription deals, and limited-time bundles."
        accent={`${promotions.filter(isActive).length} Active`}
      />

      {/* Category filter */}
      <div className={styles.filterBar}>
        {CATEGORIES.map(c => {
          const count = activeCatCount(c.id)
          return (
            <button
              key={c.id}
              className={`${styles.filterBtn} ${category === c.id ? styles.filterBtnActive : ''}`}
              style={{ '--cat-color': c.color }}
              onClick={() => setCategory(c.id)}
            >
              <span className={styles.filterDot} />
              {c.label}
              {count > 0 && <span className={styles.filterCount}>{count}</span>}
            </button>
          )
        })}
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>Loading promotions...</span>
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>⚠</span>
          <div>
            <strong>Could not load promotions</strong>
            <p>{error}</p>
          </div>
          <button className={styles.retryBtn} onClick={fetchPromotions}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionDot} style={{ background: '#c9a227' }} />
                Featured Promotions
              </h2>
              <div className={styles.featuredGrid}>
                {featured.map(p => <FeaturedCard key={p.id} p={p} />)}
              </div>
            </section>
          )}

          {/* Active */}
          {active.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionDot} style={{ background: '#4ade80' }} />
                Active Now
                <span className={styles.sectionCount}>{active.length}</span>
              </h2>
              <div className={styles.cardGrid}>
                {active.map(p => <PromotionCard key={p.id} p={p} />)}
              </div>
            </section>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionDot} style={{ background: '#60a5fa' }} />
                Upcoming
                <span className={styles.sectionCount}>{upcoming.length}</span>
              </h2>
              <div className={styles.cardGrid}>
                {upcoming.map(p => <PromotionCard key={p.id} p={p} />)}
              </div>
            </section>
          )}

          {featured.length === 0 && active.length === 0 && upcoming.length === 0 && (
            <div className={styles.emptyState}>
              No promotions found for this category right now. Check back soon.
            </div>
          )}
        </>
      )}
    </div>
  )
}
