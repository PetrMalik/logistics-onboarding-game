import { useState, useEffect } from 'react'
import { useScore } from '../hooks/useScore'
import { useQuest } from '../contexts/QuestContext'
import './PackageDeliveryGame.css'

interface DeliveryPackage {
  id: number
  number: number
  selected: boolean
}

interface DraggedPackage extends DeliveryPackage {
  fromVan: boolean
}

interface PackageDeliveryGameProps {
  onClose: () => void
}

const TOTAL_PACKAGES = 20
const REQUIRED_PACKAGES = 5
const POINTS_PER_CORRECT_PACKAGE = 20 // Body za každý správný balík

type GameStep = 'storytelling' | 'game' | 'result'

export function PackageDeliveryGame({ onClose }: PackageDeliveryGameProps) {
  const [currentStep, setCurrentStep] = useState<GameStep>('storytelling')
  const [packages, setPackages] = useState<DeliveryPackage[]>([])
  const [requiredNumbers, setRequiredNumbers] = useState<number[]>([])
  const [selectedPackages, setSelectedPackages] = useState<DeliveryPackage[]>([])
  const [draggedPackage, setDraggedPackage] = useState<DraggedPackage | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [hasPlayedBefore, setHasPlayedBefore] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const { addScore } = useScore()
  const { completeCurrentQuest, currentQuest } = useQuest()

  // Inicializace hry - vytvoření balíků a náhodných čísel k výdeji
  useEffect(() => {
    // Vytvoření 20 balíků s unikátními čísly
    const newPackages: DeliveryPackage[] = []
    const allNumbers = Array.from({ length: 50 }, (_, i) => i + 1) // Čísla 1-50
    const shuffledNumbers = allNumbers.sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < TOTAL_PACKAGES; i++) {
      newPackages.push({
        id: i,
        number: shuffledNumbers[i],
        selected: false
      })
    }

    setPackages(newPackages)

    // Vybrat 5 náhodných čísel z balíků pro výdej
    const packageNumbers = newPackages.map(p => p.number)
    const shuffledPackageNumbers = packageNumbers.sort(() => Math.random() - 0.5)
    setRequiredNumbers(shuffledPackageNumbers.slice(0, REQUIRED_PACKAGES))
  }, [])

  const handleDragStart = (pkg: DeliveryPackage, fromVan: boolean) => {
    setDraggedPackage({ ...pkg, fromVan })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropToDeliveryArea = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedPackage || draggedPackage.fromVan) return
    
    if (selectedPackages.length < REQUIRED_PACKAGES) {
      setSelectedPackages([...selectedPackages, draggedPackage])
      setPackages(packages.filter(p => p.id !== draggedPackage.id))
    }
    setDraggedPackage(null)
  }

  const handleDropBackToVan = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedPackage || !draggedPackage.fromVan) return
    
    setPackages([...packages, draggedPackage])
    setSelectedPackages(selectedPackages.filter(p => p.id !== draggedPackage.id))
    setDraggedPackage(null)
  }

  const handleStartGame = () => {
    setCurrentStep('game')
  }

  const handleFinishDelivery = () => {
    // Spočítej správné balíky
    const correctPackages = selectedPackages.filter(pkg => 
      requiredNumbers.includes(pkg.number)
    )
    const correct = correctPackages.length
    setCorrectCount(correct)

    // Spočítej body
    const points = correct * POINTS_PER_CORRECT_PACKAGE
    setEarnedPoints(points)

    // Přidej body do celkového skóre
    addScore(points)

    // Pokud hráč vybral všech 5 správných balíků, splní quest
    if (correct === REQUIRED_PACKAGES) {
      completeCurrentQuest()
    }

    setCurrentStep('result')
  }

  const handlePlayAgain = () => {
    setHasPlayedBefore(true)
    setSelectedPackages([])
    setCorrectCount(0)
    setEarnedPoints(0)
    
    // Znovu promíchej balíky a čísla
    const newPackages: DeliveryPackage[] = []
    const allNumbers = Array.from({ length: 50 }, (_, i) => i + 1)
    const shuffledNumbers = allNumbers.sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < TOTAL_PACKAGES; i++) {
      newPackages.push({
        id: i,
        number: shuffledNumbers[i],
        selected: false
      })
    }

    setPackages(newPackages)

    const packageNumbers = newPackages.map(p => p.number)
    const shuffledPackageNumbers = packageNumbers.sort(() => Math.random() - 0.5)
    setRequiredNumbers(shuffledPackageNumbers.slice(0, REQUIRED_PACKAGES))

    setCurrentStep('game')
  }

  if (currentStep === 'storytelling') {
    return (
      <div className="package-sorting-overlay">
        <div className="package-sorting-modal storytelling">
          <div className="story-content">
            <h2>📦 Doručení balíků na výdejní místo</h2>
            <div className="story-text">
              <p>
                {hasPlayedBefore ? 
                  "Další zastávka - výdejní místo! Máte další balíky k výdeji." :
                  "Dorazili jste do výdejního místa! Máte ve vozidle 20 balíků, ale na tomto místě potřebujete vydat pouze 5 konkrétních balíků."
                }
              </p>
              <p>
                Každý balík má své číslo. Na obrazovce uvidíte, které balíky (podle čísel) máte vydat.
              </p>
              <p>
                <strong>Úkol:</strong> Přetáhněte správných 5 balíků do výdejní oblasti trafiky.
              </p>
              <p>
                <strong>Body:</strong> {POINTS_PER_CORRECT_PACKAGE} bodů za každý správný balík.
              </p>
            </div>
            
            <button 
              className="start-button"
              onClick={handleStartGame}
            >
              {hasPlayedBefore ? 'Hrát znovu' : 'Začít výdej'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'game') {
    return (
      <div className="package-sorting-overlay">
        <div className="package-sorting-modal game">
          <div className="game-header">
            <h2>📦 Doručení balíků na výdejní místo</h2>
            <div className="required-packages">
              <h3>Balíky k výdeji (čísla):</h3>
              <div className="required-numbers">
                {requiredNumbers.map(num => (
                  <span 
                    key={num} 
                    className={`required-number ${
                      selectedPackages.some(pkg => pkg.number === num) ? 'found' : ''
                    }`}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="game-area">
            {/* Oblast dodávky */}
            <div className="van-area">
              <h3>🚚 Dodávka ({packages.length} balíků)</h3>
              <div 
                className="packages-container van-packages"
                onDrop={handleDropBackToVan}
                onDragOver={handleDragOver}
              >
                {packages.map(pkg => (
                  <div
                    key={pkg.id}
                    className="package"
                    draggable
                    onDragStart={() => handleDragStart(pkg, false)}
                  >
                    <div className="package-number">{pkg.number}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Oblast výdeje */}
            <div className="sorting-area">
              <h3>🏪 Výdejní místo ({selectedPackages.length}/{REQUIRED_PACKAGES})</h3>
              <div 
                className="packages-container delivery-packages"
                onDrop={handleDropToDeliveryArea}
                onDragOver={handleDragOver}
              >
                {selectedPackages.map(pkg => (
                  <div
                    key={pkg.id}
                    className={`package ${requiredNumbers.includes(pkg.number) ? 'correct' : 'incorrect'}`}
                    draggable
                    onDragStart={() => handleDragStart(pkg, true)}
                  >
                    <div className="package-number">{pkg.number}</div>
                  </div>
                ))}
              </div>
              
              <button 
                className="finish-delivery-button"
                onClick={handleFinishDelivery}
                disabled={selectedPackages.length === 0}
              >
                Dokončit výdej
              </button>
            </div>
          </div>

          <div className="game-controls">
            <button className="close-button-bottom" onClick={onClose}>
              Zavřít
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'result') {
    const isSuccess = correctCount === REQUIRED_PACKAGES
    const questCompleted = isSuccess && currentQuest && !currentQuest.completed

    return (
      <div className="package-sorting-overlay">
        <div className="package-sorting-modal result">
          <div className="result-content">
            <h2>
              {isSuccess ? '🎉 Výborně!' : '📦 Výdej dokončen'}
            </h2>
            
            <div className="result-summary">
              <p>
                Správně jste vydali <strong>{correctCount}</strong> z {REQUIRED_PACKAGES} požadovaných balíků.
              </p>
              
              {isSuccess ? (
                <p className="success-message">
                  Perfektní práce! Všechny balíky byly vydány správně.
                </p>
              ) : (
                <p className="partial-message">
                  Někdy je těžké najít správné balíky mezi tolika čísly. Zkuste to znovu!
                </p>
              )}

              <div className="points-earned">
                <strong>Získané body: {earnedPoints}</strong>
              </div>

              {questCompleted && (
                <div className="quest-completed">
                  ✅ Quest dokončen!
                </div>
              )}
            </div>

            <div className="result-actions">
              <button 
                className="play-again-button"
                onClick={handlePlayAgain}
              >
                Hrát znovu
              </button>
              <button 
                className="continue-button"
                onClick={onClose}
              >
                Pokračovat v jízdě
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}