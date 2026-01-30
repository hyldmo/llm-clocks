import { useEffect, useState } from 'react'

function getDisplayTime(): string {
	const now = new Date()
	const hours = now.getHours()
	const minutes = now.getMinutes()
	const seconds = now.getSeconds()
	const ampm = hours >= 12 ? 'PM' : 'AM'
	const displayHours = (hours % 12 || 12).toString().padStart(2, '0')
	const displayMinutes = minutes.toString().padStart(2, '0')
	const displaySeconds = seconds.toString().padStart(2, '0')
	return `${displayHours}:${displayMinutes}:${displaySeconds} ${ampm}`
}

interface HeaderProps {
	onHelpClick: () => void
}

export function Header({ onHelpClick }: HeaderProps) {
	const [time, setTime] = useState(getDisplayTime())

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(getDisplayTime())
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	return (
		<header className="mb-5 text-center">
			<h1 className="mb-1 inline-block bg-black px-5 py-2.5 font-light text-2xl text-white uppercase tracking-wide md:text-3xl">
				AI World Clocks
			</h1>
			<div className="font-mono text-base text-gray-500">{time}</div>
			<button
				type="button"
				onClick={onHelpClick}
				className="fixed top-5 right-5 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black font-bold text-2xl text-white opacity-60 transition-opacity hover:opacity-100"
				aria-label="About"
			>
				?
			</button>
		</header>
	)
}
