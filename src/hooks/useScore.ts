import { useContext } from 'react'
import { ScoreContext } from '../contexts/ScoreContextDefinition'

/**
 * Hook pro použití score systému v komponentách
 * Musí být použit uvnitř ScoreProvider
 */
export function useScore() {
  const context = useContext(ScoreContext)
  if (context === undefined) {
    throw new Error('useScore must be used within a ScoreProvider')
  }
  return context
}
