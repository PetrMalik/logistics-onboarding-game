import { useState, useEffect } from 'react'
import { useScore } from '../contexts/ScoreContext'
import { useQuest } from '../contexts/QuestContext'
import './CourierDeliveryGame.css'

interface CourierDeliveryGameProps {
  onClose: () => void
}

type GameStep = 'storytelling' | 'pin-input' | 'parcel-input' | 'locker-open' | 'result'
type ErrorType = 'wrong-pin' | 'wrong-parcel' | null

const CORRECT_PIN = '1234' // Předgenerovaný správný PIN
const POINTS_FOR_DELIVERY = 50 // Body za úspěšné doručení

export function CourierDeliveryGame({ onClose }: CourierDeliveryGameProps) {
  const [currentStep, setCurrentStep] = useState<GameStep>('storytelling')
  const [pinInput, setPinInput] = useState('')
  const [parcelInput, setParcelInput] = useState('')
  const [correctParcelNumber, setCorrectParcelNumber] = useState('')
  const [openLockerNumber, setOpenLockerNumber] = useState<number | null>(null)
  const [errorType, setErrorType] = useState<ErrorType>(null)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const { addScore } = useScore()
  const { completeCurrentQuest, currentQuest } = useQuest()

  // Vygeneruj náhodné 14místné číslo zásilky
  useEffect(() => {
    const randomParcel = Array.from({ length: 14 }, () => 
      Math.floor(Math.random() * 10)
    ).join('')
    setCorrectParcelNumber(randomParcel)
  }, [])

  // Podpora fyzické klávesnice
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pouze pokud nejsme v chybovém stavu
      if (errorType) return

      // PIN input step
      if (currentStep === 'pin-input') {
        // Číselné klávesy 0-9
        if (e.key >= '0' && e.key <= '9') {
          if (pinInput.length < 4) {
            setPinInput(pinInput + e.key)
          }
          e.preventDefault()
        }
        // Backspace
        else if (e.key === 'Backspace') {
          setPinInput(pinInput.slice(0, -1))
          e.preventDefault()
        }
        // Enter - odeslat PIN
        else if (e.key === 'Enter' && pinInput.length === 4) {
          handlePinSubmit()
          e.preventDefault()
        }
      }
      
      // Parcel input step
      else if (currentStep === 'parcel-input') {
        // Číselné klávesy 0-9
        if (e.key >= '0' && e.key <= '9') {
          if (parcelInput.length < 14) {
            setParcelInput(parcelInput + e.key)
          }
          e.preventDefault()
        }
        // Backspace
        else if (e.key === 'Backspace') {
          setParcelInput(parcelInput.slice(0, -1))
          e.preventDefault()
        }
        // Enter - odeslat parcel number
        else if (e.key === 'Enter' && parcelInput.length === 14) {
          handleParcelSubmit()
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, pinInput, parcelInput, errorType])

  // Příběh a úvod
  const handleStartGame = () => {
    setCurrentStep('pin-input')
  }

  // Virtuální klávesnice - stisknutí čísla
  const handleNumberClick = (num: string) => {
    if (currentStep === 'pin-input' && pinInput.length < 4) {
      setPinInput(pinInput + num)
    } else if (currentStep === 'parcel-input' && parcelInput.length < 14) {
      setParcelInput(parcelInput + num)
    }
  }

  // Smazání posledního znaku
  const handleBackspace = () => {
    if (currentStep === 'pin-input') {
      setPinInput(pinInput.slice(0, -1))
    } else if (currentStep === 'parcel-input') {
      setParcelInput(parcelInput.slice(0, -1))
    }
  }

  // Potvrzení PIN
  const handlePinSubmit = () => {
    if (pinInput === CORRECT_PIN) {
      setErrorType(null)
      setCurrentStep('parcel-input')
    } else {
      setErrorType('wrong-pin')
    }
  }

  // Potvrzení parcel number
  const handleParcelSubmit = () => {
    if (parcelInput === correctParcelNumber) {
      setErrorType(null)
      // Náhodně vyber schránku (1-9)
      const randomLocker = Math.floor(Math.random() * 9) + 1
      setOpenLockerNumber(randomLocker)
      setCurrentStep('locker-open')
    } else {
      setErrorType('wrong-parcel')
    }
  }

  // Zavření schránky
  const handleCloseLocker = () => {
    const points = POINTS_FOR_DELIVERY
    setEarnedPoints(points)
    addScore(points, true)
    
    // Dokončit quest-2 po dokončení minihry
    if (currentQuest?.id === 'quest-2') {
      completeCurrentQuest()
    }
    
    setCurrentStep('result')
  }

  // Retry po chybě
  const handleRetry = () => {
    if (errorType === 'wrong-pin') {
      setPinInput('')
      setErrorType(null)
    } else if (errorType === 'wrong-parcel') {
      setParcelInput('')
      setErrorType(null)
    }
  }

  return (
    <div className="courier-delivery-overlay">
      <div className="courier-delivery-container">
        
        {/* STORYTELLING */}
        {currentStep === 'storytelling' && (
          <div className="story-section">
            <h2>📦 Doručení zásilky</h2>
            <div className="story-content">
              <p>
                Vítej u výdejního boxu! Jako kurýr máš za úkol doručit zásilku do správné schránky.
              </p>
              <p>
                <strong>Tvůj úkol:</strong>
              </p>
              <ol>
                <li>Přihlas se pomocí svého 4místného kurýrního PINu</li>
                <li>Naskenuj číslo zásilky (14 číslic)</li>
                <li>Systém otevře správnou schránku</li>
                <li>Vlož zásilku a zavři schránku</li>
              </ol>
              <div className="info-box">
                <strong>💡 Tip:</strong> PIN a číslo zásilky najdeš na této obrazovce.
              </div>
            </div>
            <button onClick={handleStartGame} className="primary-button">
              Začít úkol
            </button>
          </div>
        )}

        {/* PIN INPUT */}
        {currentStep === 'pin-input' && (
          <div className="input-section">
            <h2>🔐 Zadej kurýrní PIN</h2>
            
            {!errorType && (
              <div className="info-display">
                <p>Tvůj kurýrní PIN: <strong className="highlight">{CORRECT_PIN}</strong></p>
              </div>
            )}

            {errorType === 'wrong-pin' && (
              <div className="error-box">
                <h3>❌ Nesprávný PIN!</h3>
                <p>
                  <strong>Proč je důležité znát svůj kurýrní PIN?</strong>
                </p>
                <p>
                  Kurýrní PIN je tvoje jedinečná identifikace v systému. Bez správného PINu 
                  nemůžeš přistoupit k výdejnímu boxu a doručit zásilky. Každý kurýr má vlastní 
                  PIN pro bezpečnost a sledovatelnost doručení.
                </p>
                <button onClick={handleRetry} className="retry-button">
                  Zkusit znovu
                </button>
              </div>
            )}

            {!errorType && (
              <>
                <div className="pin-display">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="pin-digit">
                      {pinInput[index] || '•'}
                    </div>
                  ))}
                </div>

                <div className="keyboard-hint">
                  💡 Můžeš použít klávesnici: 0-9, Backspace, Enter
                </div>

                <div className="numpad">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button 
                      key={num} 
                      onClick={() => handleNumberClick(num.toString())}
                      className="numpad-button"
                    >
                      {num}
                    </button>
                  ))}
                  <button onClick={handleBackspace} className="numpad-button backspace">
                    ←
                  </button>
                  <button onClick={() => handleNumberClick('0')} className="numpad-button">
                    0
                  </button>
                  <button 
                    onClick={handlePinSubmit} 
                    className="numpad-button submit"
                    disabled={pinInput.length !== 4}
                  >
                    ✓
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* PARCEL INPUT */}
        {currentStep === 'parcel-input' && (
          <div className="input-section">
            <h2>📦 Naskenuj číslo zásilky</h2>
            
            {!errorType && (
              <div className="info-display">
                <p>Číslo zásilky: <strong className="highlight">{correctParcelNumber}</strong></p>
              </div>
            )}

            {errorType === 'wrong-parcel' && (
              <div className="error-box">
                <h3>❌ Nesprávné číslo zásilky!</h3>
                <p>
                  <strong>Proč je důležité naskladňovat správnou zásilku?</strong>
                </p>
                <p>
                  Každá zásilka má unikátní číslo, které odpovídá konkrétní schránce. 
                  Pokud zadáš špatné číslo, systém neotevře schránku a zásilka nemůže 
                  být doručena. Vždy zkontroluj číslo zásilky před naskenováním!
                </p>
                <button onClick={handleRetry} className="retry-button">
                  Zkusit znovu
                </button>
              </div>
            )}

            {!errorType && (
              <>
                <div className="parcel-display">
                  {parcelInput || 'Zadej číslo zásilky...'}
                  <span className="cursor-blink">|</span>
                </div>
                <div className="parcel-progress">
                  {parcelInput.length} / 14 číslic
                </div>

                <div className="keyboard-hint">
                  💡 Můžeš použít klávesnici: 0-9, Backspace, Enter
                </div>

                <div className="numpad">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button 
                      key={num} 
                      onClick={() => handleNumberClick(num.toString())}
                      className="numpad-button"
                    >
                      {num}
                    </button>
                  ))}
                  <button onClick={handleBackspace} className="numpad-button backspace">
                    ←
                  </button>
                  <button onClick={() => handleNumberClick('0')} className="numpad-button">
                    0
                  </button>
                  <button 
                    onClick={handleParcelSubmit} 
                    className="numpad-button submit"
                    disabled={parcelInput.length !== 14}
                  >
                    ✓
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* LOCKER OPEN */}
        {currentStep === 'locker-open' && (
          <div className="locker-section">
            <h2>✅ Schránka otevřena!</h2>
            <p className="success-message">
              Schránka číslo <strong>{openLockerNumber}</strong> je nyní otevřená.
            </p>

            <div className="locker-grid">
              {Array.from({ length: 9 }).map((_, index) => {
                const lockerNum = index + 1
                const isOpen = lockerNum === openLockerNumber
                
                return (
                  <div 
                    key={lockerNum} 
                    className={`locker-box ${isOpen ? 'open' : ''}`}
                  >
                    <div className="locker-number">{lockerNum}</div>
                    {isOpen && (
                      <div className="locker-status">
                        <span className="open-indicator">🔓 OTEVŘENO</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="action-prompt">
              <p>📦 Vlož zásilku do schránky a zavři dvířka.</p>
              <button onClick={handleCloseLocker} className="primary-button">
                Zavřít schránku
              </button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {currentStep === 'result' && (
          <div className="result-section">
            <h2>🎉 Úkol splněn!</h2>
            <div className="result-content">
              <p className="success-text">
                Skvělá práce! Úspěšně jsi doručil zásilku do výdejního boxu.
              </p>
              <div className="points-earned">
                <div className="points-label">Získané body:</div>
                <div className="points-value">+{earnedPoints}</div>
              </div>
              
              <div className="summary-box">
                <h3>📋 Shrnutí:</h3>
                <ul>
                  <li>✓ Přihlášení kurýra (PIN)</li>
                  <li>✓ Skenování zásilky</li>
                  <li>✓ Otevření schránky č. {openLockerNumber}</li>
                  <li>✓ Zavření schránky</li>
                </ul>
              </div>
            </div>
            <button onClick={onClose} className="primary-button">
              Dokončit
            </button>
          </div>
        )}

        {/* Zavírací tlačítko */}
        {currentStep !== 'result' && (
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

