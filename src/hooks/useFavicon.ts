import { useEffect } from 'react'

const CLOCK_EMOJIS: [string, string][] = [
	['🕛', '🕧'], // 12
	['🕐', '🕜'], // 1
	['🕑', '🕝'], // 2
	['🕒', '🕞'], // 3
	['🕓', '🕟'], // 4
	['🕔', '🕠'], // 5
	['🕕', '🕡'], // 6
	['🕖', '🕢'], // 7
	['🕗', '🕣'], // 8
	['🕘', '🕤'], // 9
	['🕙', '🕥'], // 10
	['🕚', '🕦'] // 11
]

function updateFavicon() {
	const now = new Date()
	let hours = now.getHours()
	const minutes = now.getMinutes()

	// Round to nearest :00 or :30
	const roundedMinutes = minutes < 15 ? 0 : minutes < 45 ? 30 : 0
	if (roundedMinutes === 0 && minutes >= 45) {
		hours = (hours + 1) % 24
	}

	const hour12 = hours % 12
	const emoji = CLOCK_EMOJIS[hour12][roundedMinutes === 30 ? 1 : 0]

	let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']")
	if (!link) {
		link = document.createElement('link')
		link.rel = 'icon'
		document.head.appendChild(link)
	}
	link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`
}

export function useFavicon() {
	useEffect(() => {
		updateFavicon()
		const interval = setInterval(updateFavicon, 60000)
		return () => clearInterval(interval)
	}, [])
}
