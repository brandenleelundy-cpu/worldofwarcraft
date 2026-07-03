import { useState, useEffect, useCallback, useRef } from 'react'
import PageHeader from '../components/PageHeader'
import styles from './WoWToken.module.css'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const REGIONS = [
  { id: 'us', label: 'Americas', flag: '🌎' },
  { id: 'eu', label: 'Europe',   flag: '🌍' },
  { id: 'kr', label: 'Korea',    flag: '🇰🇷' },
  { id: 'tw', label: 'Taiwan',   flag: '🇹🇼' },
]

const DAY_OPTIONS = [
  { value: 1,  label: '24 h' },
  { value: 7,  label: '7 d' },
  { value: 30, label: '30 d' },
]

function formatGold(n) {
  if (!n && n !== 0) return '—'
  return n.toLocaleString('en-US') + 'g'
}

function Sparkline({ points, color = 'var(--color-gold)', width = 320, height = 80 }) {
  if (!points || points.length < 2) return (
    <div className={styles.sparklinePlaceholder}>Not enough data yet — refreshes every visit</div>
  )

  const prices = points.map(p => p.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1

  const pad = 4
  const w = width - pad * 2
  const h = height - pad * 2

  const coords = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * w
    const y = pad + (1 - (p.price - min) / range) * h
    return [x, y]
  })

  const pathD = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const areaD = `${pathD} L${coords[coords.length - 1][0].toFixed(1)},${(height).toFixed(1)} L${coords[0][0].toFixed(1)},${(height).toFixed(1)} Z`

  const first = prices[0]
  const last = prices[prices.length - 1]
  const trend = last >= first ? 'up' : 'down'
  const lineColor = trend === 'up' ? '#4ade80' : '#f87171'
  const gradId = `grad-${trend}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.sparkline} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-up`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`grad-down`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f87171" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* Last price dot */}
      <circle
        cx={coords[coords.length - 1][0]}
        cy={coords[coords.length - 1][1]}
        r="3.5"
        fill={lineColor}
      />
    </svg>
  )
}

export default function WoWToken() {
  const [region, setRegion] = useState('us')
  const [days, setDays] = useState(7)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const intervalRef = useRef(null)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/wow-token?region=${region}&days=${days}`,
        { headers: { Authorization: `Bearer ${ANON_KEY}` } }
      )
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [region, days])

  useEffect(() => {
    fetchData()
    intervalRef.current = setInterval(() => fetchData(true), 5 * 60 * 1000)
    return () => clearInterval(intervalRef.current)
  }, [fetchData])

  const currentRegionData = data?.current?.[region]
  const stats = data?.stats
  const history = data?.history ?? []

  const trendUp = stats?.changePct >= 0
  const trendColor = trendUp ? '#4ade80' : '#f87171'
  const trendSign = trendUp ? '+' : ''

  return (
    <div>
      <PageHeader
        title="WoW Token"
        subtitle="Live token prices across all regions. Data sourced from wowtokenprices.com and refreshed every 5 minutes."
        accent="Live Prices"
      />

      {/* Region selector */}
      <div className={styles.regionBar}>
        {REGIONS.map(r => (
          <button
            key={r.id}
            className={`${styles.regionBtn} ${region === r.id ? styles.regionActive : ''}`}
            onClick={() => setRegion(r.id)}
          >
            <span>{r.flag}</span>
            <span>{r.label}</span>
            {data?.current?.[r.id] && (
              <span className={styles.regionPrice}>
                {data.current[r.id].formatted}g
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>Fetching live token prices...</span>
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>&#9888;</span>
          <div>
            <strong>Could not load token prices</strong>
            <p>{error}</p>
          </div>
          <button className={styles.retryBtn} onClick={() => fetchData()}>Retry</button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* Hero price card */}
          <div className={styles.heroCard}>
            <div className={styles.heroLeft}>
              <div className={styles.heroRegionLabel}>
                {REGIONS.find(r => r.id === region)?.flag}&nbsp;
                {REGIONS.find(r => r.id === region)?.label} Region
              </div>
              <div className={styles.heroPrice}>
                <span className={styles.heroPriceGold}>{currentRegionData?.formatted ?? '—'}</span>
                <span className={styles.heroPriceUnit}>gold</span>
              </div>
              {stats && (
                <div className={styles.heroTrend} style={{ color: trendColor }}>
                  <span className={styles.trendArrow}>{trendUp ? '▲' : '▼'}</span>
                  <span>{trendSign}{stats.changePct}% vs {days}d ago</span>
                </div>
              )}
            </div>
            <div className={styles.heroRight}>
              {refreshing && <span className={styles.refreshingBadge}>Refreshing...</span>}
              {lastUpdated && (
                <span className={styles.updatedAt}>
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                className={styles.refreshBtn}
                onClick={() => fetchData(true)}
                disabled={refreshing}
                title="Refresh now"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Stats row */}
          {stats && (
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>{days}d Low</span>
                <span className={styles.statValue} style={{ color: '#4ade80' }}>{formatGold(stats.min)}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>{days}d Average</span>
                <span className={styles.statValue}>{formatGold(stats.avg)}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>{days}d High</span>
                <span className={styles.statValue} style={{ color: '#f87171' }}>{formatGold(stats.max)}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>{days}d Change</span>
                <span className={styles.statValue} style={{ color: trendColor }}>
                  {trendSign}{stats.changePct}%
                </span>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Price History</h3>
              <div className={styles.dayBtns}>
                {DAY_OPTIONS.map(d => (
                  <button
                    key={d.value}
                    className={`${styles.dayBtn} ${days === d.value ? styles.dayBtnActive : ''}`}
                    onClick={() => setDays(d.value)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.chartWrap}>
              <Sparkline points={history} width={900} height={160} />
              {history.length >= 2 && (
                <div className={styles.chartAxis}>
                  <span>{new Date(history[0].recorded_at).toLocaleDateString()}</span>
                  <span>{new Date(history[Math.floor(history.length / 2)].recorded_at).toLocaleDateString()}</span>
                  <span>{new Date(history[history.length - 1].recorded_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* All regions comparison */}
          <div className={styles.allRegions}>
            <h3 className={styles.sectionTitle}>All Regions</h3>
            <div className={styles.regionsGrid}>
              {REGIONS.map(r => {
                const rd = data.current?.[r.id]
                if (!rd) return null
                return (
                  <button
                    key={r.id}
                    className={`${styles.regionCard} ${region === r.id ? styles.regionCardActive : ''}`}
                    onClick={() => setRegion(r.id)}
                  >
                    <span className={styles.regionCardFlag}>{r.flag}</span>
                    <div className={styles.regionCardInfo}>
                      <span className={styles.regionCardLabel}>{r.label}</span>
                      <span className={styles.regionCardPrice}>{rd.formatted}g</span>
                    </div>
                    {region === r.id && <span className={styles.activeIndicator} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Info footer */}
          <div className={styles.infoFooter}>
            <span className={styles.infoIcon}>&#9432;</span>
            <p>
              WoW Token prices update every few minutes. One Token purchased from the Auction House grants 30 days of game time or can be converted to Battle.net Balance at a ratio of 1 Token = 15 USD / 13 EUR equivalent. Prices shown are in gold. Source: wowtokenprices.com
            </p>
          </div>
        </>
      )}
    </div>
  )
}
