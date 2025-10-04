import { useState, useEffect } from 'react'
import './PackageSortingGame.css'

interface Package {
  id: number
  route: string
}

interface PackageSortingGameProps {
  onClose: () => void
}

const ROUTES = ['A', 'B', 'C', 'D', 'E']
const TOTAL_PACKAGES = 12
const REQUIRED_PACKAGES = 4

type GameStep = 'storytelling' | 'game' | 'result'

export function PackageSortingGame({ onClose }: PackageSortingGameProps) {
  const [currentStep, setCurrentStep] = useState<GameStep>('storytelling')
  const [assignedRoute, setAssignedRoute] = useState('')
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([])
  const [draggedPackage, setDraggedPackage] = useState<Package | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [hasPlayedBefore, setHasPlayedBefore] = useState(false)

  // Inicializace hry - náhodné balíky a trasa
  useEffect(() => {
    // Náhodná trasa pro kurýra
    const randomRoute = ROUTES[Math.floor(Math.random() * ROUTES.length)]
    setAssignedRoute(randomRoute)

    // Vytvoření 12 balíků s náhodnými trasami
    // Zajistíme, že alespoň 4 balíky budou se správnou trasou
    const newPackages: Package[] = []
    
    // Přidáme 4-6 balíků se správnou trasou
    const correctPackagesCount = 4 + Math.floor(Math.random() * 3)
    for (let i = 0; i < correctPackagesCount; i++) {
      newPackages.push({
        id: i,
        route: randomRoute
      })
    }

    // Zbylé balíky budou mít jiné trasy
    for (let i = correctPackagesCount; i < TOTAL_PACKAGES; i++) {
      const otherRoutes = ROUTES.filter(r => r !== randomRoute)
      const randomOtherRoute = otherRoutes[Math.floor(Math.random() * otherRoutes.length)]
      newPackages.push({
        id: i,
        route: randomOtherRoute
      })
    }

    // Zamícháme balíky
    const shuffledPackages = newPackages.sort(() => Math.random() - 0.5)
    setPackages(shuffledPackages)
  }, [])

  const handleDragStart = (pkg: Package, fromVan: boolean) => {
    setDraggedPackage({ ...pkg, fromVan } as any)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropToVan = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedPackage || (draggedPackage as any).fromVan) return
    
    if (selectedPackages.length < REQUIRED_PACKAGES) {
      setSelectedPackages([...selectedPackages, draggedPackage])
      setPackages(packages.filter(p => p.id !== draggedPackage.id))
    }
    setDraggedPackage(null)
  }

  const handleDropToWarehouse = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedPackage || !(draggedPackage as any).fromVan) return
    
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
    const correct = selectedPackages.filter(p => p.route === assignedRoute).length
    setCorrectCount(correct)
    setCurrentStep('result')
    setHasPlayedBefore(true)
  }

  const handlePlayAgain = () => {
    setCurrentStep('storytelling')
    setSelectedPackages([])
    
    // Nová hra
    const randomRoute = ROUTES[Math.floor(Math.random() * ROUTES.length)]
    setAssignedRoute(randomRoute)

    const newPackages: Package[] = []
    const correctPackagesCount = 4 + Math.floor(Math.random() * 3)
    for (let i = 0; i < correctPackagesCount; i++) {
      newPackages.push({
        id: Date.now() + i,
        route: randomRoute
      })
    }

    for (let i = correctPackagesCount; i < TOTAL_PACKAGES; i++) {
      const otherRoutes = ROUTES.filter(r => r !== randomRoute)
      const randomOtherRoute = otherRoutes[Math.floor(Math.random() * otherRoutes.length)]
      newPackages.push({
        id: Date.now() + i,
        route: randomOtherRoute
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
            {currentStep === 'storytelling' && 'Ranní brífink'}
            {currentStep === 'game' && 'Nakládka balíků na depo'}
            {currentStep === 'result' && 'Výsledek'}
          </h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {/* STEP 1: Storytelling */}
        {currentStep === 'storytelling' && (
          <div className="storytelling-section">
            <div className="story-icon">🏢</div>
            <h3>Vítej na depu!</h3>
            
            <div className="story-content">
              <p>
                Je 6:00 ráno a právě jsi dorazil na logistické centrum. 
                Tvůj vedoucí tě zdraví a přiděluje ti dnešní trasu.
              </p>
              
              <div className="story-highlight">
                <div className="story-route-badge">
                  <strong>Tvá dnešní trasa:</strong>
                  <span className="route-label-big">{assignedRoute}</span>
                </div>
              </div>
              
              <p>
                <strong>Tvůj úkol:</strong> Na depu leží zásilky pro různé trasy. 
                Musíš správně vybrat a naložit do své dodávky <strong>pouze balíky 
                označené pro trasu {assignedRoute}</strong>.
              </p>
              
              <div className="story-tip">
                <strong>💡 Tip:</strong> Každý balík má na sobě štítek s označením trasy. 
                Pozorně je kontroluj, abys nepřevzal cizí zásilky!
              </div>
              
              <p>
                Správně naložené balíky zajistí spokojené zákazníky a efektivní 
                rozvoz. Jsi připraven?
              </p>
            </div>

            <div className="story-buttons">
              <button className="start-button" onClick={handleStartGame}>
                ✓ Rozumím, začít úkol
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
                <strong>Vaše trasa:</strong>
                <span className="route-label">{assignedRoute}</span>
              </div>
              <div className="instruction">
                Vyberte 4 balíky pro vaši trasu a přetáhněte je do dodávky
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
                      <div className="package-box">📦</div>
                      <div className="package-route">Trasa {pkg.route}</div>
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
                      <div className="package-box">📦</div>
                      <div className="package-route">Trasa {pkg.route}</div>
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
                <div className="score-big">{correctCount} / {REQUIRED_PACKAGES}</div>
                <div className="score-text">správně vybraných balíků</div>
              </div>
              
              {correctCount === REQUIRED_PACKAGES ? (
                <div className="result-message success">
                  🎉 Výborně! Všechny balíky jsou správné!
                  <br />
                  <small>Jsi připraven vyrazit na trasu.</small>
                </div>
              ) : correctCount >= 2 ? (
                <div className="result-message partial">
                  👍 Dobrý pokus! Ještě to chce zapracovat.
                  <br />
                  <small>Některé balíky patří na jinou trasu.</small>
                </div>
              ) : (
                <div className="result-message fail">
                  💪 Zkus to znovu, tentokrát to určitě půjde!
                  <br />
                  <small>Zkontroluj pozorně štítky na balících.</small>
                </div>
              )}

              <div className="result-buttons">
                <button className="play-again-button" onClick={handlePlayAgain}>
                  Hrát znovu
                </button>
                <button className="continue-button" onClick={onClose}>
                  Pokračovat ve hře
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


