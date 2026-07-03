import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const navItems = [
  { path: '/', label: 'Overview', icon: '&#9670;' },
  { path: '/addons', label: 'Addons', icon: '&#9881;' },
  { path: '/characters', label: 'Characters', icon: '&#9824;' },
  { path: '/delves', label: 'Delves', icon: '&#9649;' },
  { path: '/dungeons', label: 'Dungeons', icon: '&#9760;' },
  { path: '/expansions', label: 'Past Expansions', icon: '&#9775;' },
  { path: '/features', label: 'Features', icon: '&#9830;' },
  { path: '/lore', label: 'Lore', icon: '&#9733;' },
  { path: '/mythic-plus', label: 'Mythic+', icon: '&#9883;' },
  { path: '/pvp', label: 'PvP', icon: '&#9876;' },
  { path: '/quests', label: 'Quests', icon: '&#9902;' },
  { path: '/races', label: 'Races', icon: '&#9734;' },
  { path: '/raids', label: 'Raid Strategies', icon: '&#9876;' },
  { path: '/rare-items', label: 'Rare Items', icon: '&#9830;' },
  { path: '/realms', label: 'Realm Status', icon: '&#9728;' },
  { path: '/tutorials', label: 'Tutorials', icon: '&#9733;' },
  { path: '/wow-token', label: 'WoW Token', icon: '&#9672;' },
  { path: '/zones', label: 'Zones', icon: '&#9675;' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <nav className={styles.nav}>
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Navigation</span>
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                onClick={onClose}
              >
                <span className={styles.icon} dangerouslySetInnerHTML={{ __html: item.icon }} />
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Quick Info</span>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Expansion</p>
              <p className={styles.infoValue}>World of Warcraft: Midnight</p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Saga</p>
              <p className={styles.infoValue}>The Worldsoul Saga (Part 2)</p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Setting</p>
              <p className={styles.infoValue}>Quel'Thalas</p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
