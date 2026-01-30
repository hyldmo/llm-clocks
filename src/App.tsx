import { useState } from 'react'
import { AboutModal } from './components/AboutModal'
import { ClockGrid } from './components/ClockGrid'
import { Header } from './components/Header'
import { useClocks } from './hooks/useClocks'
import { useFavicon } from './hooks/useFavicon'

export function App() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { clocks, isLoading } = useClocks()

	useFavicon()

	return (
		<div className="min-h-screen bg-white p-5">
			<div className="mx-auto max-w-full text-center">
				<Header onHelpClick={() => setIsModalOpen(true)} />
				<ClockGrid clocks={clocks} isLoading={isLoading} />
			</div>
			<AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</div>
	)
}
