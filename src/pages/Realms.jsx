import { useState, useEffect, useCallback, useRef } from 'react'
import PageHeader from '../components/PageHeader'
import styles from './Realms.module.css'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const REGIONS = ['All', 'US', 'EU', 'OCE', 'KR', 'TW']
const TYPES = ['All', 'Normal', 'PvP', 'RP', 'RP-PvP']
const STATUSES = ['All', 'online', 'offline', 'maintenance']
const POP_ORDER = { Full: 4, High: 3, Medium: 2, Low: 1 }

const STATUS_META = {
  online:      { label: 'Online',      color: '#4ade80' },
  offline:     { label: 'Offline',     color: '#f87171' },
  maintenance: { label: 'Maintenance', color: '#facc15' },
}

const POP_META = {
  Full:   { color: '#f87171', label: 'Full' },
  High:   { color: '#fb923c', label: 'High' },
  Medium: { color: '#4ade80', label: 'Medium' },
  Low:    { color: '#94a3b8', label: 'Low' },
}

const REFRESH_INTERVAL = 30

function StatusDot({ status }) {
  const meta = STATUS_META[status] || STATUS_META.offline
  return (
    <span
      className={`${styles.dot} ${status === 'online' ? styles.dotPulse : ''}`}
      style={{ '--dot-color': meta.color }}
      title={meta.label}
    />
  )
}

function PopBadge({ population }) {
  const meta = POP_META[population] || POP_META.Low
  return (
    <span
      className={styles.popBadge}
      style={{ color: meta.color, borderColor: meta.color + '40', background: meta.color + '14' }}
    >
      {meta.label}
    </span>
  )
}

export default function Realms() {
  const [realms, setRealms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL)
  const [refreshing, setRefreshing] = useState(false)

  const [region, setRegion] = useState('All')
  const [type, setType] = useState('All')
  const [status, setStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const countdownRef = useRef(null)
  const refreshRef = useRef(null)

  const fetchRealms = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/realms?select=*&order=name.asc`,
        {
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
        }
      )
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('Unexpected response format')
      setRealms(data)
      setLastUpdated(new Date())
      setCountdown(REFRESH_INTERVAL)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchRealms()
    refreshRef.current = setInterval(() => fetchRealms(true), REFRESH_INTERVAL * 1000)
    return () => clearInterval(refreshRef.current)
  }, [fetchRealms])

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown(c => (c <= 1 ? REFRESH_INTERVAL : c - 1))
    }, 1000)
    return () => clearInterval(countdownRef.current)
  }, [])

  const filtered = realms
    .filter(r => {
      if (region !== 'All' && r.region !== region) return false
      if (type !== 'All' && r.type !== type) return false
      if (status !== 'All' && r.status !== status) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return r.name.toLowerCase().includes(q) || r.timezone.toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => {
      let cmp = 0
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortBy === 'status') cmp = a.status.localeCompare(b.status)
      else if (sortBy === 'population') cmp = (POP_ORDER[b.population] ?? 0) - (POP_ORDER[a.population] ?? 0)
      else if (sortBy === 'region') cmp = a.region.localeCompare(b.region)
      else if (sortBy === 'type') cmp = a.type.localeCompare(b.type)
      return sortDir === 'asc' ? cmp : -cmp
    })

  function handleSort(col) {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('asc') }
  }

  const onlineCount = realms.filter(r => r.status === 'online').length
  const offlineCount = realms.filter(r => r.status === 'offline').length
  const maintenanceCount = realms.filter(r => r.status === 'maintenance').length
  const queueCount = realms.filter(r => r.queue_time != null).length

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span className={styles.sortNeutral}>⇅</span>
    return <span className={styles.sortActive}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div>
      <PageHeader
        title="Realm Status"
        subtitle="Live status, population, and queue information for all World of Warcraft: Midnight realms across every region."
        accent={`${realms.length} Realms`}
      />

      {/* Summary bar */}
      <div className={styles.summaryBar}>
        <button
          className={`${styles.summaryCard} ${status === 'online' ? styles.summaryCardActive : ''}`}
          style={{ '--s-color': '#4ade80' }}
          onClick={() => setStatus(s => s === 'online' ? 'All' : 'online')}
        >
          <span className={styles.summaryDot} />
          <span className={styles.summaryNum}>{onlineCount}</span>
          <span className={styles.summaryLabel}>Online</span>
        </button>
        <button
          className={`${styles.summaryCard} ${status === 'offline' ? styles.summaryCardActive : ''}`}
          style={{ '--s-color': '#f87171' }}
          onClick={() => setStatus(s => s === 'offline' ? 'All' : 'offline')}
        >
          <span className={styles.summaryDot} />
          <span className={styles.summaryNum}>{offlineCount}</span>
          <span className={styles.summaryLabel}>Offline</span>
        </button>
        <button
          className={`${styles.summaryCard} ${status === 'maintenance' ? styles.summaryCardActive : ''}`}
          style={{ '--s-color': '#facc15' }}
          onClick={() => setStatus(s => s === 'maintenance' ? 'All' : 'maintenance')}
        >
          <span className={styles.summaryDot} />
          <span className={styles.summaryNum}>{maintenanceCount}</span>
          <span className={styles.summaryLabel}>Maintenance</span>
        </button>
        <div className={styles.summaryCard} style={{ '--s-color': '#60a5fa', cursor: 'default' }}>
          <span className={styles.summaryDot} />
          <span className={styles.summaryNum}>{queueCount}</span>
          <span className={styles.summaryLabel}>In Queue</span>
        </div>

        <div className={styles.summaryRefresh}>
          {lastUpdated && (
            <span className={styles.updatedAt}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <span className={styles.countdownLabel}>
            {refreshing ? 'Refreshing...' : `Refreshes in ${countdown}s`}
          </span>
          <button
            className={styles.refreshBtn}
            onClick={() => fetchRealms(true)}
            disabled={refreshing}
            title="Refresh now"
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={refreshing ? styles.spinning : ''}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>Region</span>
          <div className={styles.filterTabs}>
            {REGIONS.map(r => (
              <button
                key={r}
                className={`${styles.filterTab} ${region === r ? styles.filterTabActive : ''}`}
                onClick={() => setRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>Type</span>
          <div className={styles.filterTabs}>
            {TYPES.map(t => (
              <button
                key={t}
                className={`${styles.filterTab} ${type === t ? styles.filterTabActive : ''}`}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search realms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.searchClear} onClick={() => setSearch('')}>&#215;</button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>Loading realm data...</span>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <span>&#9888;</span>
          <div>
            <strong>Could not load realm data</strong>
            <p>{error}</p>
          </div>
          <button className={styles.retryBtn} onClick={() => fetchRealms()}>Retry</button>
        </div>
      ) : (
        <>
          <div className={styles.resultsMeta}>
            {filtered.length === realms.length
              ? `All ${realms.length} realms`
              : `${filtered.length} of ${realms.length} realms`}
            {(region !== 'All' || type !== 'All' || status !== 'All' || search) && (
              <button className={styles.clearBtn} onClick={() => { setRegion('All'); setType('All'); setStatus('All'); setSearch('') }}>
                Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty}>No realms match the current filters.</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.thStatus}>Status</th>
                    <th className={`${styles.th} ${styles.thSortable}`} onClick={() => handleSort('name')}>
                      Realm <SortIcon col="name" />
                    </th>
                    <th className={`${styles.th} ${styles.thSortable}`} onClick={() => handleSort('region')}>
                      Region <SortIcon col="region" />
                    </th>
                    <th className={`${styles.th} ${styles.thSortable}`} onClick={() => handleSort('type')}>
                      Type <SortIcon col="type" />
                    </th>
                    <th className={styles.th}>Timezone</th>
                    <th className={`${styles.th} ${styles.thSortable}`} onClick={() => handleSort('population')}>
                      Population <SortIcon col="population" />
                    </th>
                    <th className={styles.th}>Queue</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(realm => {
                    const sm = STATUS_META[realm.status] || STATUS_META.offline
                    return (
                      <tr key={realm.id} className={styles.row}>
                        <td className={styles.tdStatus}>
                          <StatusDot status={realm.status} />
                          <span className={styles.statusLabel} style={{ color: sm.color }}>
                            {sm.label}
                          </span>
                        </td>
                        <td className={styles.tdName}>{realm.name}</td>
                        <td className={styles.tdRegion}>
                          <span className={styles.regionBadge}>{realm.region}</span>
                        </td>
                        <td className={styles.tdType}>
                          <span className={`${styles.typeBadge} ${styles[`type_${realm.type.replace('-', '')}`]}`}>
                            {realm.type}
                          </span>
                        </td>
                        <td className={styles.tdTz}>{realm.timezone}</td>
                        <td className={styles.tdPop}>
                          <PopBadge population={realm.population} />
                        </td>
                        <td className={styles.tdQueue}>
                          {realm.queue_time != null
                            ? <span className={styles.queueTime}>~{realm.queue_time} min</span>
                            : <span className={styles.noQueue}>—</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
