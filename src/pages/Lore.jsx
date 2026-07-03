import PageHeader from '../components/PageHeader'
import { loreEntries } from '../data/wikiData'
import styles from './Lore.module.css'

export default function Lore() {
  return (
    <div>
      <PageHeader
        title="Lore & Story"
        subtitle="The deep history and narrative threads that converge in Midnight's tale of darkness, sacrifice, and unity."
        accent="Background Lore"
      />
      <div className={styles.entries}>
        {loreEntries.map((entry, i) => (
          <article key={entry.title} className={styles.entry}>
            <div className={styles.index}>{String(i + 1).padStart(2, '0')}</div>
            <div className={styles.content}>
              <h3 className={styles.title}>{entry.title}</h3>
              <p className={styles.text}>{entry.content}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
