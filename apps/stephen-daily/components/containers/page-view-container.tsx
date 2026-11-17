import type { PropsWithChildren } from 'react'
import styles from './page-view-container.module.css'

function PageViewContainer({ children }: PropsWithChildren) {
	return <div className={`w-full max-w-7xl border-x m-auto flex flex-col ${styles.frame}`}>{children}</div>
}

export default PageViewContainer
