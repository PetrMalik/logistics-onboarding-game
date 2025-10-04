import { useQuest } from '../contexts/QuestContext'
import './QuestList.css'

export function QuestList() {
  const { quests, currentQuest } = useQuest()

  return (
    <div className="quest-list">
      <div className="quest-header">
        <span className="quest-icon">📋</span>
        <h3>Úkoly</h3>
      </div>
      
      <div className="quest-items">
        {quests.map((quest, index) => {
          const isActive = currentQuest?.id === quest.id
          
          return (
            <div
              key={quest.id}
              className={`quest-item ${
                quest.completed 
                  ? 'completed' 
                  : isActive 
                    ? 'active' 
                    : 'locked'
              }`}
            >
              <div className="quest-number">{index + 1}</div>
              <div className="quest-content">
                <div className="quest-title">
                  {quest.completed && <span className="check-icon">✓</span>}
                  {quest.locked && <span className="lock-icon">🔒</span>}
                  {quest.title}
                </div>
                {isActive && (
                  <div className="quest-description">
                    {quest.description}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

