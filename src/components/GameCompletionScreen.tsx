import { useScore } from '../contexts/ScoreContext'
import { useQuest } from '../contexts/QuestContext'
import './GameCompletionScreen.css'

export function GameCompletionScreen() {
  const { score, resetScore } = useScore()
  const { resetQuests } = useQuest()

  const handleRestart = () => {
    if (window.confirm('Opravdu chceš začít hru znovu od začátku?')) {
      resetQuests()
      resetScore()
      window.location.reload()
    }
  }

  return (
    <div className="completion-overlay">
      <div className="completion-modal">
        <div className="completion-header">
          <h1>🎉 Gratulujeme!</h1>
        </div>
        
        <div className="completion-content">
          <div className="trophy-icon">🏆</div>
          
          <h2>Úspěšně jsi dokončil logistický trénink!</h2>
          
          <div className="completion-stats">
            <div className="stat-item">
              <div className="stat-label">Celkové skóre</div>
              <div className="stat-value">{score} bodů</div>
            </div>
          </div>

          <div className="completion-achievements">
            <h3>Zvládl jsi:</h3>
            <div className="achievement-list">
              <div className="achievement-item">
                <span className="achievement-icon">✓</span>
                <span>Třídění zásilek na depotu</span>
              </div>
              <div className="achievement-item">
                <span className="achievement-icon">✓</span>
                <span>Doručení zásilky do výdejního boxu</span>
              </div>
              <div className="achievement-item">
                <span className="achievement-icon">✓</span>
                <span>Kompletní rozvozovou trasu</span>
              </div>
              <div className="achievement-item">
                <span className="achievement-icon">✓</span>
                <span>Závěrečný test znalostí</span>
              </div>
            </div>
          </div>

          <div className="completion-message">
            <p>
              <strong>Nyní jsi připraven pracovat jako profesionální kurýr!</strong>
            </p>
            <p>
              Naučil ses správně třídit zásilky, používat výdejní boxy a zvládl jsi všechny důležité 
              postupy v logistice. Děkujeme za hru!
            </p>
          </div>

          <div className="completion-actions">
            <button onClick={handleRestart} className="restart-btn">
              🔄 Hrát znovu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

