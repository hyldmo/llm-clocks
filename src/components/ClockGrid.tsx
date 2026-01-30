import type { Clock } from '../types'
import { MODEL_ORDER } from '../types'
import { ClockCard } from './ClockCard'

interface ClockGridProps {
  clocks: Clock[]
  isLoading: boolean
}

export function ClockGrid({ clocks, isLoading }: ClockGridProps) {
  if (isLoading) {
    return (
      <div className="text-center text-gray-800 text-lg mt-12">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-5" />
        <p>Generating AI Clocks...</p>
      </div>
    )
  }

  if (clocks.length === 0) {
    return (
      <div className="text-center text-gray-500 text-lg mt-12">
        <p>No clocks available for the current time.</p>
        <p className="text-sm mt-2">Clocks are generated every minute.</p>
      </div>
    )
  }

  // Sort clocks according to MODEL_ORDER
  const sortedClocks = [...clocks].sort((a, b) => {
    const aIndex = MODEL_ORDER.indexOf(a.model_name as typeof MODEL_ORDER[number])
    const bIndex = MODEL_ORDER.indexOf(b.model_name as typeof MODEL_ORDER[number])
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
      {sortedClocks.map((clock) => (
        <ClockCard key={clock.id} clock={clock} />
      ))}
    </div>
  )
}
