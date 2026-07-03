import { Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <span className={styles.eyebrow}>World of Warcraft</span>
        <h1 className={styles.title}>Midnight</h1>
        <p className={styles.tagline}>
          The second chapter of the Worldsoul Saga. Darkness descends upon Quel'Thalas
          as the void threatens to consume the Sunwell and shatter the elven kingdoms forever.
        </p>
        <div className={styles.heroMeta}>
          <span className={styles.metaItem}>Worldsoul Saga - Part II</span>
          <span className={styles.metaDot}></span>
          <span className={styles.metaItem}>Quel'Thalas</span>
          <span className={styles.metaDot}></span>
          <span className={styles.metaItem}>Elven Reunification</span>
        </div>
      </section>

      <section className={styles.grid}>
        <Link to="/zones" className={styles.card}>
          <div className={styles.cardIcon}>&#9675;</div>
          <h3 className={styles.cardTitle}>Zones</h3>
          <p className={styles.cardDesc}>Explore the revamped lands of Quel'Thalas, from Silvermoon to the Void Breach</p>
        </Link>
        <Link to="/races" className={styles.card}>
          <div className={styles.cardIcon}>&#9734;</div>
          <h3 className={styles.cardTitle}>Races</h3>
          <p className={styles.cardDesc}>The scattered elven factions unite against an existential threat</p>
        </Link>
        <Link to="/characters" className={styles.card}>
          <div className={styles.cardIcon}>&#9824;</div>
          <h3 className={styles.cardTitle}>Characters</h3>
          <p className={styles.cardDesc}>Key figures in the battle for Quel'Thalas and the Sunwell</p>
        </Link>
        <Link to="/features" className={styles.card}>
          <div className={styles.cardIcon}>&#9830;</div>
          <h3 className={styles.cardTitle}>Features</h3>
          <p className={styles.cardDesc}>New gameplay systems, raids, and the elven reunification narrative</p>
        </Link>
        <Link to="/lore" className={styles.card}>
          <div className={styles.cardIcon}>&#9733;</div>
          <h3 className={styles.cardTitle}>Lore</h3>
          <p className={styles.cardDesc}>Deep dive into the history and stakes of Midnight's story</p>
        </Link>
      </section>

      <section className={styles.timeline}>
        <h2 className={styles.sectionTitle}>The Worldsoul Saga</h2>
        <div className={styles.timelineTrack}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <h4>The War Within</h4>
              <p>Descent into Azeroth's depths. Nerubian kingdoms and the earthen.</p>
            </div>
          </div>
          <div className={`${styles.timelineItem} ${styles.active}`}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <h4>Midnight</h4>
              <p>Void assault on Quel'Thalas. Elven reunification and the Sunwell.</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <h4>The Last Titan</h4>
              <p>The final confrontation. Azeroth's worldsoul awakens.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
