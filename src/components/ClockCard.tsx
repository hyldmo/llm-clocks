import type { Clock } from '../types'

interface ClockCardProps {
	clock: Clock
}

export function ClockCard({ clock }: ClockCardProps) {
	return (
		<div className="flex flex-col items-center">
			<div className="relative mb-2.5 w-full overflow-hidden bg-white pb-[100%]">
				<iframe
					sandbox="allow-scripts"
					scrolling="no"
					srcDoc={clock.html_content}
					className="absolute inset-0 h-full w-full border-0"
					title={`Clock by ${clock.model_name}`}
				/>
			</div>
			<div className="w-1/2 min-w-[120px] bg-black px-4 py-2 text-center font-bold text-sm text-white uppercase tracking-wider md:text-base">
				{clock.model_name}
			</div>
		</div>
	)
}
