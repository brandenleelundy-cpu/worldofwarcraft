import PageHeader from '../components/PageHeader'
import { characters } from '../data/wikiData'
import styles from './Characters.module.css'

export default function Characters() {
  return (
    <div>
      <PageHeader
        title="Key Characters"
        subtitle="Heroes and villains whose fates intertwine in the battle for Quel'Thalas and the Sunwell."
        accent="Major Figures"
      />
      <div className={styles.list}>
        {characters.map(char => (
          <article key={char.name} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>
                {char.name.charAt(0)}
              </div>
              <div>
                <h3 className={styles.name}>{char.name}</h3>
                <span className={styles.role}>{char.role}</span>
              </div>
              <span className={`${styles.faction} ${styles[char.faction.toLowerCase()]}`}>
                {char.faction}
              </span>
            </div>
            <p className={styles.description}>{char.description}</p>
            <div className={styles.tags}>
              {char.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
