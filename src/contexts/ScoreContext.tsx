import { useState, useEffect, type ReactNode } from 'react'
import { ScoreContext, type ScoreData } from './ScoreContextDefinition'

const SCORE_STORAGE_KEY = 'logistics-game-score'

interface ScoreProviderProps {
  children: ReactNode
}

export function ScoreProvider({ children }: ScoreProviderProps) {
  const [scoreData, setScoreData] = useState<ScoreData>(() => {
    // Načíst score z localStorage při inicializaci
    const stored = localStorage.getItem(SCORE_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return { totalScore: 0, miniGamesCompleted: 0, lastUpdated: Date.now() }
      }
    }
    return { totalScore: 0, miniGamesCompleted: 0, lastUpdated: Date.now() }
  })

  // Automatické ukládání do localStorage při změně
  useEffect(() => {
    localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(scoreData))
  }, [scoreData])

  /**
   * Přidá body k celkovému skóre
   * @param points - počet bodů k přidání
   * @param miniGameCompleted - jestli byla minihra dokončena (inkrementuje counter)
   */
  const addScore = (points: number, miniGameCompleted: boolean = false) => {
    setScoreData(prev => ({
      totalScore: prev.totalScore + points,
      miniGamesCompleted: miniGameCompleted 
        ? prev.miniGamesCompleted + 1 
        : prev.miniGamesCompleted,
      lastUpdated: Date.now()
    }))
  }

  /**
   * Resetuje celé skóre na nulu
   */
  const resetScore = () => {
    setScoreData({
      totalScore: 0,
      miniGamesCompleted: 0,
      lastUpdated: Date.now()
    })
  }

  /**
   * Nastaví konkrétní hodnotu skóre (pro debugging nebo speciální případy)
   */
  const setScore = (score: number) => {
    setScoreData(prev => ({
      ...prev,
      totalScore: score,
      lastUpdated: Date.now()
    }))
  }

  const value = {
    score: scoreData.totalScore,
    miniGamesCompleted: scoreData.miniGamesCompleted,
    lastUpdated: scoreData.lastUpdated,
    scoreData,
    addScore,
    resetScore,
    setScore
  }

  return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
}


