import { useState, useEffect } from 'react'

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
    <header className="text-center mb-5">
      <h1 className="inline-block bg-black text-white text-2xl md:text-3xl font-light tracking-wide uppercase px-5 py-2.5 mb-1">
        AI World Clocks
      </h1>
      <div className="text-gray-500 font-mono text-base">
        {time}
      </div>
      <button
        onClick={onHelpClick}
        className="fixed top-5 right-5 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer opacity-60 hover:opacity-100 transition-opacity z-50"
        aria-label="About"
      >
        ?
      </button>
    </header>
  )
}
