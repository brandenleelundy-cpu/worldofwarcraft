import styles from './InfoCard.module.css'

export default function InfoCard({ title, description, image, tags, meta }) {
  return (
    <article className={styles.card}>
      {image && (
        <div className={styles.imageWrap}>
          <img src={image} alt={title} className={styles.image} loading="lazy" />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {meta && <span className={styles.meta}>{meta}</span>}
        <p className={styles.description}>{description}</p>
        {tags && (
          <div className={styles.tags}>
            {tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
