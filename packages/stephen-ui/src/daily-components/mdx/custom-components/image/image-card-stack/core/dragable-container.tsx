import { motion } from 'motion/react'
import { useCardRotation } from './use-card-rotation'

interface MdxDraggableContainerProps {
	children: React.ReactNode
	onSendToBack?: () => void
	className?: string
}

function MdxDraggableContainer({ children, onSendToBack, className }: MdxDraggableContainerProps) {
	const { x, y, rotateX, rotateY, handleDragEnd } = useCardRotation(onSendToBack)

	return (
		<motion.div
			className={className}
			style={{ x, y, rotateX, rotateY }}
			drag
			dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
			dragElastic={0.6}
			whileTap={{ cursor: 'grabbing' }}
			onDragEnd={handleDragEnd}
		>
			{children}
		</motion.div>
	)
}

export { MdxDraggableContainer }
