import PageHeader from '../components/PageHeader'
import InfoCard from '../components/InfoCard'
import { zones } from '../data/wikiData'
import styles from './Zones.module.css'

export default function Zones() {
  return (
    <div>
      <PageHeader
        title="Zones of Quel'Thalas"
        subtitle="From the golden spires of Silvermoon to the reality-warping Void Breach, explore the lands threatened by darkness in World of Warcraft: Midnight."
        accent="6 Major Zones"
      />
      <div className={styles.grid}>
        {zones.map(zone => (
          <InfoCard
            key={zone.name}
            title={zone.name}
            description={zone.description}
            image={zone.image}
            meta={zone.type}
            tags={zone.tags}
          />
        ))}
      </div>
    </div>
  )
}
