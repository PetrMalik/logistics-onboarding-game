import { createContext } from 'react'

export interface ScoreData {
  totalScore: number
  miniGamesCompleted: number
  lastUpdated: number
}

export interface ScoreContextType {
  score: number
  miniGamesCompleted: number
  lastUpdated: number
  scoreData: ScoreData
  addScore: (points: number, miniGameCompleted?: boolean) => void
  resetScore: () => void
  setScore: (score: number) => void
}

export const ScoreContext = createContext<ScoreContextType | undefined>(undefined)
