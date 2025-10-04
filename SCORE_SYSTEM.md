# Score Systém - Dokumentace

## Přehled

Hra obsahuje globální score systém, který sleduje body hráče napříč všemi minihrami. Score se automaticky ukládá do localStorage a zobrazuje v pravém horním rohu obrazovky.

## Implementace

### 1. Context `ScoreContext` a Provider

**Soubor:** `src/contexts/ScoreContext.tsx`

Context API pro správu globálního skóre s automatickou persistencí do localStorage. Používá React Context pro sdílení stavu mezi všemi komponentami.

#### Setup v App.tsx:

```typescript
import { ScoreProvider } from './contexts/ScoreContext'

function App() {
  return (
    <ScoreProvider>
      {/* Všechny komponenty aplikace */}
    </ScoreProvider>
  )
}
```

#### API v komponentách:

```typescript
import { useScore } from '../contexts/ScoreContext'

const {
  score,                // aktuální celkové skóre (number)
  miniGamesCompleted,   // počet dokončených miniher (number)
  lastUpdated,          // timestamp poslední aktualizace (number)
  addScore,             // funkce pro přidání bodů
  resetScore,           // funkce pro resetování skóre
  setScore,             // funkce pro nastavení konkrétního skóre
  scoreData             // kompletní data objektu
} = useScore()
```

#### Použití:

```typescript
// Přidání bodů (minihra nedokončena)
addScore(50)

// Přidání bodů + inkrementace počtu dokončených miniher
addScore(100, true)

// Resetování skóre
resetScore()

// Nastavení konkrétního skóre
setScore(500)
```

**Důležité:** Hook `useScore()` musí být vždy volán uvnitř `<ScoreProvider>`. Jinak dostaneš error.

### 2. Komponenta `ScoreDisplay`

**Soubor:** `src/components/ScoreDisplay.tsx`

Komponenta zobrazující aktuální skóre v pravém horním rohu obrazovky.

**Vlastnosti:**
- Automaticky načítá aktuální skóre z `useScore` hooku
- Zobrazuje trofej emoji, počet bodů a počet dokončených miniher
- Responzivní design s animacemi
- Gradient background pro vizuální atraktivitu

### 3. Integrace do minihry

**Příklad:** `src/components/PackageSortingGame.tsx`

```typescript
// 1. Import hooku
import { useScore } from '../contexts/ScoreContext'

// 2. Definice bodování
const POINTS_PER_CORRECT_PACKAGE = 25

// 3. Použití hooku v komponentě
export function PackageSortingGame({ onClose }) {
  const { addScore } = useScore()
  const [earnedPoints, setEarnedPoints] = useState(0)
  
  // 4. Výpočet a přidání bodů při dokončení
  const handleCheckResult = () => {
    const correct = selectedPackages.filter(p => p.route === assignedRoute).length
    const points = correct * POINTS_PER_CORRECT_PACKAGE
    
    setEarnedPoints(points)
    addScore(points, correct > 0) // přidat body + označit jako dokončenou
  }
  
  // 5. Zobrazení získaných bodů ve výsledcích
  return (
    <div className="earned-points">
      <div className="points-icon">⭐</div>
      <div className="points-value">+{earnedPoints}</div>
      <div className="points-label">bodů</div>
    </div>
  )
}
```

## Přidání score systému do nové minihry

### Krok 0: Ujisti se, že je aplikace zabalená v ScoreProvider
```typescript
// V App.tsx nebo main.tsx
import { ScoreProvider } from './contexts/ScoreContext'

<ScoreProvider>
  <YourApp />
</ScoreProvider>
```

### Krok 1: Import hooku
```typescript
import { useScore } from '../contexts/ScoreContext'
```

### Krok 2: Definice bodovacího systému
```typescript
const POINTS_FOR_WIN = 100
const POINTS_FOR_BONUS = 50
// ... další konstanty
```

### Krok 3: Použití v komponentě
```typescript
export function YourMiniGame({ onClose }) {
  const { addScore } = useScore()
  
  const handleGameComplete = () => {
    const earnedPoints = calculatePoints() // vaše logika
    addScore(earnedPoints, true) // true = minihra dokončena
  }
}
```

### Krok 4: UI pro zobrazení získaných bodů
Můžeš použít stejný CSS jako v `PackageSortingGame.css`:
```css
.earned-points {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
  animation: slideIn 0.5s ease-out;
}
```

## Bodovací doporučení

### PackageSortingGame
- **25 bodů** za každý správně vybraný balík
- Maximum: 100 bodů (4 správné balíky)

### Budoucí minihry
Doporučené škály:
- **Jednoduchá minihra:** 50-100 bodů
- **Střední obtížnost:** 100-200 bodů
- **Obtížná minihra:** 200-500 bodů
- **Bonusy:** +10-50 bodů (čas, přesnost, combo)

## LocalStorage

Score se automaticky ukládá do localStorage pod klíčem:
```
logistics-game-score
```

Struktura uložených dat:
```json
{
  "totalScore": 1250,
  "miniGamesCompleted": 5,
  "lastUpdated": 1709584320000
}
```

## Styling

### ScoreDisplay
- Pozice: `position: absolute; top: 20px; right: 20px`
- Z-index: `100` (nad 3D scénou)
- Gradient: `#667eea` → `#764ba2`
- Animace: pulse na ikoně, fadeIn při načtení

### EarnedPoints (v minihrách)
- Gradient background matching ScoreDisplay
- Animace slideIn při zobrazení
- Rotující emoji ikona

## Rozšíření systému

### Možné budoucí featury:
1. **Leaderboard** - globální žebříček hráčů
2. **Achievementy** - odznaky za splnění úkolů
3. **Streak systém** - bonusy za série úspěchů
4. **Time bonusy** - extra body za rychlé dokončení
5. **Combo multiplier** - násobení bodů při perfektním skóre
6. **Level systém** - postupování úrovněmi podle skóre
7. **Daily challenges** - denní výzvy s bonusovými body

## Testování

Pro testování můžeš použít:
```typescript
// V konzoli prohlížeče
localStorage.getItem('logistics-game-score')

// Nebo resetovat skóre
localStorage.removeItem('logistics-game-score')
```

Nebo použít `resetScore()` funkci z hooku v Development módu.

