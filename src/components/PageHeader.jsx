import styles from './PageHeader.module.css'

export default function PageHeader({ title, subtitle, accent }) {
  return (
    <div className={styles.header}>
      <div className={styles.accentLine} />
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {accent && <span className={styles.accent}>{accent}</span>}
    </div>
  )
}
