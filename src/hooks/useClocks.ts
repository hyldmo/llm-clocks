import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Clock } from '../types'
import { MODEL_ORDER } from '../types'

function getCurrentTimeForDb(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`
}

// Mock data for development when Supabase is not configured
const MOCK_CLOCKS: Clock[] = MODEL_ORDER.map((name, i) => ({
  id: `mock-${i}`,
  model_name: name,
  provider: 'mock',
  html_content: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: white; font-family: sans-serif; }
        .clock { width: 200px; height: 200px; border: 4px solid #333; border-radius: 50%; position: relative; }
        .center { position: absolute; top: 50%; left: 50%; width: 10px; height: 10px; background: #333; border-radius: 50%; transform: translate(-50%, -50%); z-index: 10; }
        .hand { position: absolute; bottom: 50%; left: 50%; transform-origin: bottom center; background: #333; }
        .hour { width: 4px; height: 50px; transform: translateX(-50%) rotate(${30 * (new Date().getHours() % 12) + new Date().getMinutes() * 0.5}deg); }
        .minute { width: 3px; height: 70px; transform: translateX(-50%) rotate(${new Date().getMinutes() * 6}deg); }
        .second { width: 2px; height: 80px; background: red; transform: translateX(-50%) rotate(0deg); animation: tick 60s linear infinite; }
        @keyframes tick { from { transform: translateX(-50%) rotate(0deg); } to { transform: translateX(-50%) rotate(360deg); } }
        .label { position: absolute; bottom: -40px; width: 100%; text-align: center; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="clock">
        <div class="center"></div>
        <div class="hand hour"></div>
        <div class="hand minute"></div>
        <div class="hand second"></div>
        <div class="label">${name}</div>
      </div>
    </body>
    </html>
  `,
  time_shown: getCurrentTimeForDb(),
  generated_at: new Date().toISOString(),
  generation_time_ms: Math.floor(Math.random() * 2000) + 500,
}))

export function useClocks() {
  const [clocks, setClocks] = useState<Clock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastFetchedMinute, setLastFetchedMinute] = useState<number>(-1)

  const fetchClocks = useCallback(async () => {
    if (!supabase) {
      // Use mock data when Supabase is not configured
      setClocks(MOCK_CLOCKS)
      setIsLoading(false)
      return
    }

    const timeForDb = getCurrentTimeForDb()
    
    try {
      const { data, error } = await supabase
        .from('clocks')
        .select('*')
        .eq('time_shown', timeForDb)
        .order('generated_at', { ascending: false })
        .limit(9)

      if (error) {
        console.error('Error fetching clocks:', error)
        return
      }

      // Deduplicate by model_name (keep most recent)
      const clocksByModel = new Map<string, Clock>()
      for (const clock of data || []) {
        if (!clocksByModel.has(clock.model_name)) {
          clocksByModel.set(clock.model_name, clock)
        }
      }

      setClocks(Array.from(clocksByModel.values()))
    } catch (error) {
      console.error('Error fetching clocks:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClocks()

    // Check every second if the minute has changed
    const interval = setInterval(() => {
      const currentMinute = new Date().getMinutes()
      if (currentMinute !== lastFetchedMinute) {
        setLastFetchedMinute(currentMinute)
        fetchClocks()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [fetchClocks, lastFetchedMinute])

  return { clocks, isLoading, refetch: fetchClocks }
}
