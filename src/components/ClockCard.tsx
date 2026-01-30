import type { Clock } from '../types'

interface ClockCardProps {
  clock: Clock
}

export function ClockCard({ clock }: ClockCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full pb-[100%] bg-white overflow-hidden mb-2.5">
        <iframe
          sandbox="allow-scripts"
          scrolling="no"
          srcDoc={clock.html_content}
          className="absolute inset-0 w-full h-full border-0"
          title={`Clock by ${clock.model_name}`}
        />
      </div>
      <div className="bg-black text-white text-center py-2 px-4 text-sm md:text-base font-bold tracking-wider uppercase w-1/2 min-w-[120px]">
        {clock.model_name}
      </div>
    </div>
  )
}
