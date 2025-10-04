import { useScore } from '../contexts/ScoreContext'
import './ScoreDisplay.css'

export function ScoreDisplay() {
  const { score, miniGamesCompleted } = useScore()

  return (
    <div className="score-display">
      <div className="score-icon">🏆</div>
      <div className="score-content">
        <div className="score-value">{score.toLocaleString()}</div>
        <div className="score-label">bodů</div>
      </div>
      {miniGamesCompleted > 0 && (
        <div className="minigames-counter">
          {miniGamesCompleted} miniher
        </div>
      )}
    </div>
  )
}

