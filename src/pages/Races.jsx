import PageHeader from '../components/PageHeader'
import InfoCard from '../components/InfoCard'
import { races } from '../data/wikiData'
import styles from './Races.module.css'

export default function Races() {
  return (
    <div>
      <PageHeader
        title="Elven Races"
        subtitle="The scattered children of the Well of Eternity, divided by millennia of conflict, must reunite or face annihilation at the hands of the void."
        accent="Playable Factions"
      />
      <div className={styles.grid}>
        {races.map(race => (
          <article key={race.name} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={race.image} alt={race.name} className={styles.image} loading="lazy" />
              <div className={styles.imageOverlay} />
            </div>
            <div className={styles.content}>
              <h3 className={styles.name}>{race.name}</h3>
              <p className={styles.description}>{race.description}</p>
              <div className={styles.traits}>
                {race.traits.map(trait => (
                  <span key={trait} className={styles.trait}>{trait}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
