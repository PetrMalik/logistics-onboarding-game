import { useState } from 'react'
import { useQuest } from '../contexts/QuestContext'
import { useScore } from '../contexts/ScoreContext'
import './DebugPanel.css'

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { quests, completeCurrentQuest, resetQuests } = useQuest()
  const { score, resetScore } = useScore()

  const handleCompleteQuest = () => {
    completeCurrentQuest()
  }

  const handleResetAll = () => {
    if (window.confirm('Opravdu chceš resetovat všechny questy a skóre?')) {
      resetQuests()
      resetScore()
    }
  }

  const currentQuest = quests.find(q => !q.completed && !q.locked)

  return (
    <>
      {/* Toggle button */}
      <button 
        className="debug-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Debug Panel"
      >
        🛠️
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="debug-panel">
          <div className="debug-header">
            <h3>🛠️ Debug Panel</h3>
            <button className="debug-close" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="debug-content">
            {/* Current Score */}
            <div className="debug-section">
              <h4>Skóre</h4>
              <div className="debug-info">
                <strong>Aktuální skóre:</strong> {score} bodů
              </div>
            </div>

            {/* Quest Status */}
            <div className="debug-section">
              <h4>Questy</h4>
              <div className="quest-list-debug">
                {quests.map((quest) => (
                  <div 
                    key={quest.id} 
                    className={`quest-item-debug ${quest.completed ? 'completed' : ''} ${!quest.locked && !quest.completed ? 'active' : ''}`}
                  >
                    <span className="quest-icon">
                      {quest.completed ? '✓' : quest.locked ? '🔒' : '⭐'}
                    </span>
                    <span className="quest-title">{quest.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="debug-section">
              <h4>Akce</h4>
              <div className="debug-actions">
                <button 
                  onClick={handleCompleteQuest}
                  disabled={!currentQuest}
                  className="debug-btn complete"
                >
                  ✓ Dokončit aktuální quest
                </button>
                {currentQuest && (
                  <div className="current-quest-info">
                    Aktivní: <strong>{currentQuest.title}</strong>
                  </div>
                )}
                <button 
                  onClick={handleResetAll}
                  className="debug-btn reset"
                >
                  🔄 Reset všeho
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="debug-section">
              <h4>ℹ️ Návod</h4>
              <ul className="debug-instructions">
                <li>Použij "Dokončit quest" pro přeskočení aktuálního úkolu</li>
                <li>Skóre se počítá i při debugování</li>
                <li>Reset smaže vše a začneš od začátku</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

