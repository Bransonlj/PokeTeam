import styles from './TeamMember.module.scss'
import classNames from 'classnames'
import { useBaseURL } from '../../utils/urls'

export default function EmptyMember() {
  return (
    <div className={classNames(styles.memberContainer, styles.empty)}>
        <img src={useBaseURL('/pokeball.png')} className={styles.sprite} />
    </div>
  )
}
