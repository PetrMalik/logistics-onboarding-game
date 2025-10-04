import { useState, useEffect } from 'react'
import { useScore } from '../contexts/ScoreContext'
import { useQuest } from '../contexts/QuestContext'
import './PackageSortingGame.css'

interface Package {
  id: number
  route: string
  trackingNumber: string
  isValid: boolean // Značí, zda je číslo zásilky validní
}

interface DraggedPackage extends Package {
  fromVan: boolean
}

interface PackageSortingGameProps {
  onClose: () => void
}

const ROUTES = ['A', 'B', 'C', 'D', 'E']
const TOTAL_PACKAGES = 12
const REQUIRED_PACKAGES = 4
const POINTS_PER_CORRECT_PACKAGE = 25 // Body za každý správný balík

// Helper funkce pro generování čísla zásilky
const generateTrackingNumber = (valid: boolean): string => {
  if (valid) {
    // Vygeneruj 14místné číslo
    return Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('')
  } else {
    // Vygeneruj 6místné číslo (nevalidní)
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('')
  }
}

type GameStep = 'storytelling' | 'game' | 'result'

// Komponenta pro čárový kód
function Barcode({ trackingNumber }: { trackingNumber: string }) {
  // Vygenerujeme vizuální reprezentaci čárového kódu
  const bars = trackingNumber.split('').map((digit) => {
    // Každá číslice má jiný pattern čar (simulace skutečného čárového kódu)
    const patterns = ['11', '101', '110', '1001', '1010', '1100', '10001', '10010', '10100', '11000']
    return patterns[parseInt(digit)]
  }).join('0') // mezery mezi čísly
  
  return (
    <div className="barcode-container">
      <div className="barcode">
        {bars.split('').map((bar, i) => (
          <div
            key={i}
            className={bar === '1' ? 'bar-black' : 'bar-white'}
          />
        ))}
      </div>
      <div className="tracking-number">{trackingNumber}</div>
    </div>
  )
}

export function PackageSortingGame({ onClose }: PackageSortingGameProps) {
  const [currentStep, setCurrentStep] = useState<GameStep>('storytelling')
  const [assignedRoute, setAssignedRoute] = useState('')
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([])
  const [draggedPackage, setDraggedPackage] = useState<DraggedPackage | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [hasPlayedBefore, setHasPlayedBefore] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [showPinNotification, setShowPinNotification] = useState(false)
  const [generatedPin, setGeneratedPin] = useState('')
  const { addScore } = useScore()
  const { completeCurrentQuest, currentQuest, generateCourierPin } = useQuest()

  // Inicializace hry - náhodné balíky a trasa
  useEffect(() => {
    // Náhodná trasa pro kurýra
    const randomRoute = ROUTES[Math.floor(Math.random() * ROUTES.length)]
    setAssignedRoute(randomRoute)

    const newPackages: Package[] = []
    
    // Přidáme 3 validní balíky se správnou trasou a správným 14místným číslem
    for (let i = 0; i < 3; i++) {
      newPackages.push({
        id: i,
        route: randomRoute,
        trackingNumber: generateTrackingNumber(true),
        isValid: true
      })
    }

    // Přidáme 1 nevalidní balík se správnou trasou, ale špatným formátem čísla (6místné)
    newPackages.push({
      id: 3,
      route: randomRoute,
      trackingNumber: generateTrackingNumber(false),
      isValid: false
    })

    // Zbylé balíky budou mít jiné trasy (všechny s validním číslem)
    for (let i = 4; i < TOTAL_PACKAGES; i++) {
      const otherRoutes = ROUTES.filter(r => r !== randomRoute)
      const randomOtherRoute = otherRoutes[Math.floor(Math.random() * otherRoutes.length)]
      newPackages.push({
        id: i,
        route: randomOtherRoute,
        trackingNumber: generateTrackingNumber(true),
        isValid: true
      })
    }

    // Zamícháme balíky
    const shuffledPackages = newPackages.sort(() => Math.random() - 0.5)
    setPackages(shuffledPackages)
  }, [])

  const handleDragStart = (pkg: Package, fromVan: boolean) => {
    setDraggedPackage({ ...pkg, fromVan })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropToVan = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedPackage || draggedPackage.fromVan) return
    
    if (selectedPackages.length < REQUIRED_PACKAGES) {
      setSelectedPackages([...selectedPackages, draggedPackage])
      setPackages(packages.filter(p => p.id !== draggedPackage.id))
    }
    setDraggedPackage(null)
  }

  const handleDropToWarehouse = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedPackage || !draggedPackage.fromVan) return
    
    setPackages([...packages, draggedPackage])
    setSelectedPackages(selectedPackages.filter(p => p.id !== draggedPackage.id))
    setDraggedPackage(null)
  }

  const handleStartGame = () => {
    setCurrentStep('game')
  }

  const handleSkipStory = () => {
    setCurrentStep('game')
  }

  const handleCheckResult = () => {
    // Spočítáme správné balíky (správná trasa A zároveň validní číslo zásilky)
    const correct = selectedPackages.filter(p => p.route === assignedRoute && p.isValid).length
    setCorrectCount(correct)
    
    // Výpočet bodů
    const points = correct * POINTS_PER_CORRECT_PACKAGE
    setEarnedPoints(points)
    
    // Přidání bodů do globálního skóre
    // Minihra je považována za dokončenou, pokud je alespoň 1 správný balík
    addScore(points, correct > 0)
    
    // Dokončit aktuální quest po dokončení minihry (bez ohledu na výsledek)
    if (currentQuest?.id === 'quest-1') {
      completeCurrentQuest()
    }
    
    setCurrentStep('result')
    setHasPlayedBefore(true)
  }

  const handlePlayAgain = () => {
    setCurrentStep('storytelling')
    setSelectedPackages([])
    setEarnedPoints(0)
    
    // Nová hra
    const randomRoute = ROUTES[Math.floor(Math.random() * ROUTES.length)]
    setAssignedRoute(randomRoute)

    const newPackages: Package[] = []
    
    // Přidáme 3 validní balíky se správnou trasou
    for (let i = 0; i < 3; i++) {
      newPackages.push({
        id: Date.now() + i,
        route: randomRoute,
        trackingNumber: generateTrackingNumber(true),
        isValid: true
      })
    }

    // Přidáme 1 nevalidní balík se správnou trasou
    newPackages.push({
      id: Date.now() + 3,
      route: randomRoute,
      trackingNumber: generateTrackingNumber(false),
      isValid: false
    })

    // Zbylé balíky s jinými trasami
    for (let i = 4; i < TOTAL_PACKAGES; i++) {
      const otherRoutes = ROUTES.filter(r => r !== randomRoute)
      const randomOtherRoute = otherRoutes[Math.floor(Math.random() * otherRoutes.length)]
      newPackages.push({
        id: Date.now() + i,
        route: randomOtherRoute,
        trackingNumber: generateTrackingNumber(true),
        isValid: true
      })
    }

    const shuffledPackages = newPackages.sort(() => Math.random() - 0.5)
    setPackages(shuffledPackages)
  }

  return (
    <div className="game-modal">
      <div className="game-container">
        <div className="game-header">
          <h2>
            {currentStep === 'storytelling' && 'Depo'}
            {currentStep === 'game' && 'Nakládka balíků'}
            {currentStep === 'result' && 'Vyhodnocení'}
          </h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {/* STEP 1: Storytelling */}
        {currentStep === 'storytelling' && (
          <div className="storytelling-section">
            <div className="story-icon">🏢</div>
            <h3>DEPO</h3>
            
            <div className="story-content">
              <p>
                Depo funguje jako organizovaný uzel – tady se z chaosu stovek balíků 
                stává plánovaná cesta k příjemcům.
              </p>
              
              <p>
                Kurýři zde ráno naloží zásilky do aut a balíky se roztřídí podle tras.
              </p>
            </div>

            <div className="story-buttons">
              <button className="start-button" onClick={handleStartGame}>
                ✓ Rozumím, pokračovat
              </button>
              {hasPlayedBefore && (
                <button className="skip-button" onClick={handleSkipStory}>
                  Přeskočit příběh →
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Game */}
        {currentStep === 'game' && (
          <>
            <div className="game-info">
              <div className="route-badge">
                <strong>Dnes rozvážíš trasu:</strong>
                <span className="route-label">{assignedRoute}</span>
              </div>
              <div className="instruction">
                Z hromady balíků vyber ty správné a nalož je do dodávky.
              </div>
            </div>

            <div className="game-content">
              {/* Skladiště s balíky */}
              <div className="warehouse-section">
                <h3>Skladiště ({packages.length} balíků)</h3>
                <div 
                  className="packages-grid"
                  onDragOver={handleDragOver}
                  onDrop={handleDropToWarehouse}
                >
                  {packages.map(pkg => (
                    <div
                      key={pkg.id}
                      className="package"
                      draggable
                      onDragStart={() => handleDragStart(pkg, false)}
                    >
                      <div className="package-route-badge">Trasa {pkg.route}</div>
                      <div className="package-box">📦</div>
                      <Barcode trackingNumber={pkg.trackingNumber} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dodávka */}
              <div className="van-section">
                <h3>Dodávka ({selectedPackages.length}/{REQUIRED_PACKAGES})</h3>
                <div 
                  className="van-container"
                  onDragOver={handleDragOver}
                  onDrop={handleDropToVan}
                >
                  {selectedPackages.length === 0 && (
                    <div className="van-empty">
                      Přetáhněte sem balíky
                    </div>
                  )}
                  {selectedPackages.map(pkg => (
                    <div
                      key={pkg.id}
                      className="package package-small"
                      draggable
                      onDragStart={() => handleDragStart(pkg, true)}
                    >
                      <div className="package-route-badge">Trasa {pkg.route}</div>
                      <div className="package-box">📦</div>
                      <Barcode trackingNumber={pkg.trackingNumber} />
                    </div>
                  ))}
                </div>
                
                {selectedPackages.length === REQUIRED_PACKAGES && (
                  <button 
                    className="check-button"
                    onClick={handleCheckResult}
                  >
                    Zkontrolovat výběr
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* STEP 3: Result */}
        {currentStep === 'result' && (
          <div className="result-section">
            <div className="result-content">
              <h2>Vyhodnocení úkolu</h2>
              <div className="result-score">
                <div className="score-big">{correctCount} / 3</div>
                <div className="score-text">správně vybraných balíků</div>
              </div>
              
              <div className="earned-points">
                <div className="points-icon">⭐</div>
                <div className="points-value">+{earnedPoints}</div>
                <div className="points-label">bodů</div>
              </div>
              
              {(() => {
                // Detekce nevalidní zásilky ve výběru
                const hasInvalidPackage = selectedPackages.some(p => !p.isValid)
                const wrongRouteCount = selectedPackages.filter(p => p.route !== assignedRoute).length
                
                if (correctCount === 3 && !hasInvalidPackage) {
                  return (
                    <div className="result-message success">
                      🎉 Výborně! Všechny balíky jsou správné!
                      <br />
                      <small>Jsi připraven vyrazit na trasu.</small>
                    </div>
                  )
                } else {
                  return (
                    <div className="result-message partial">
                      <div className="result-title">⚠️ Pozor!</div>
                      <div className="result-explanation">
                        <p><strong>Zásilka se nemůže dát k rozvozu pokud:</strong></p>
                        <ul className="result-list">
                          <li>Je poškozená zásilka</li>
                          <li>Je poškozený štítek</li>
                          <li>Je nevalidní číslo zásilky</li>
                        </ul>
                        {hasInvalidPackage && (
                          <>
                            <p className="result-highlight">
                              ❌ Vybral jsi zásilku s <strong>nevalidním číslem zásilky</strong>. 
                              Správné číslo zásilky musí mít 14 číslic.
                            </p>
                            <p className="result-info">
                              <strong>💡 Důležité:</strong> Parcel number je jedinečný identifikátor zásilky, 
                              který nese veškeré informace o zásilce. Bez tohoto čísla (ve správném formátu) 
                              nelze zásilku dát do rozvozu.
                            </p>
                          </>
                        )}
                        {wrongRouteCount > 0 && (
                          <p className="result-highlight">
                            ❌ Vybral jsi {wrongRouteCount} {wrongRouteCount === 1 ? 'balík' : 'balíky'} 
                            {' '}pro <strong>jinou trasu</strong>.
                          </p>
                        )}
                        <p>Zkontroluj pozorně štítky a čísla zásilek!</p>
                      </div>
                    </div>
                  )
                }
              })()}

              <div className="result-buttons">
                <button className="play-again-button" onClick={handlePlayAgain}>
                  Hrát znovu
                </button>
                <button className="continue-button" onClick={() => {
                  // Pokud je quest-1 dokončený a ještě jsme nezobrazili PIN
                  if (currentQuest?.id === 'quest-2' && !showPinNotification && !generatedPin) {
                    const pin = generateCourierPin()
                    setGeneratedPin(pin)
                    setShowPinNotification(true)
                  } else {
                    onClose()
                  }
                }}>
                  Pokračovat ve hře
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PIN NOTIFICATION OVERLAY */}
        {showPinNotification && (
          <div className="pin-notification-overlay">
            <div className="pin-notification-box">
              <div className="pin-notification-icon">🔐</div>
              <h2>Důležitá informace!</h2>
              <p>Byl ti přidělen kurýrní PIN pro přístup k výdejním boxům.</p>
              
              <div className="pin-display-large">
                <div className="pin-label">Tvůj kurýrní PIN:</div>
                <div className="pin-value">{generatedPin}</div>
              </div>
              
              <div className="pin-warning">
                <strong>⚠️ Zapamatuj si tento PIN!</strong>
                <p>Budeš ho potřebovat pro přístup k výdejnímu boxu. PIN se po zavření této notifikace již nezobrazí.</p>
              </div>
              
              <button 
                className="pin-confirm-button" 
                onClick={() => {
                  setShowPinNotification(false)
                  onClose()
                }}
              >
                Rozumím, zapamatoval jsem si PIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


