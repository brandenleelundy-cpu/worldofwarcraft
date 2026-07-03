import { Link } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header({ onMenuToggle, theme, onThemeToggle }) {
  const isDark = theme === 'dark'

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>&#10022;</span>
          <span className={styles.logoText}>Midnight Wiki</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/addons">Addons</Link>
          <Link to="/characters">Characters</Link>
          <Link to="/delves">Delves</Link>
          <Link to="/dungeons">Dungeons</Link>
          <Link to="/expansions">Expansions</Link>
          <Link to="/features">Features</Link>
          <Link to="/lore">Lore</Link>
          <Link to="/mythic-plus">Mythic+</Link>
          <Link to="/pvp">PvP</Link>
          <Link to="/promotions">Promotions</Link>
          <Link to="/timewalking">Timewalking</Link>
          <Link to="/quests">Quests</Link>
          <Link to="/races">Races</Link>
          <Link to="/raids">Raids</Link>
          <Link to="/rare-items">Rare Items</Link>
          <Link to="/realms">Realm Status</Link>
          <Link to="/talents">Talents</Link>
          <Link to="/tutorials">Tutorials</Link>
          <Link to="/wow-token">WoW Token</Link>
          <Link to="/zones">Zones</Link>
        </nav>
        <button
          className={styles.themeBtn}
          onClick={onThemeToggle}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}
