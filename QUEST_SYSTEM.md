# Quest Systém - Dokumentace

## Přehled

Hra obsahuje quest/mission systém, který vede hráče postupně přes různé úkoly. Úkoly jsou sekvencí, ukládají se do localStorage a automaticky se dokončují po splnění podmínek.

## Vlastnosti

✅ **Sekvenční postup** - hráč musí plnit úkoly postupně (1→2→3)  
✅ **Vizuální stav** - aktivní úkol zvýrazněný, dokončené zaškrtnuté, zamčené šedivé  
✅ **Automatické dokončení** - quest se splní po dokončení minihry  
✅ **Persistence** - ukládání do localStorage  
✅ **Jednoduchý design** - čitelný seznam vlevo nahoře  

## Implementace

### 1. Context `QuestContext` a Provider

**Soubor:** `src/contexts/QuestContext.tsx`

Context API pro správu questů s automatickou persistencí do localStorage.

#### Setup v App.tsx:

```typescript
import { QuestProvider } from './contexts/QuestContext'

function App() {
  return (
    <QuestProvider>
      {/* Všechny komponenty aplikace */}
    </QuestProvider>
  )
}
```

#### API v komponentách:

```typescript
import { useQuest } from '../contexts/QuestContext'

const {
  quests,                  // pole všech questů
  currentQuest,            // aktuální aktivní quest (nebo null)
  completeCurrentQuest,    // funkce pro dokončení aktuálního questu
  resetQuests              // funkce pro reset všech questů
} = useQuest()
```

#### Quest Interface:

```typescript
interface Quest {
  id: string           // unikátní identifikátor
  title: string        // název úkolu (zobrazený)
  description: string  // popis úkolu
  completed: boolean   // je dokončený?
  locked: boolean      // je zamčený?
}
```

### 2. Komponenta `QuestList`

**Soubor:** `src/components/QuestList.tsx`

Komponenta zobrazující seznam questů vlevo nahoře na obrazovce.

**Vlastnosti:**
- Automaticky načítá questy z `useQuest` hooku
- Zvýrazňuje aktivní quest (gradient background + pulsing animace)
- Zobrazuje ✓ u dokončených questů
- Zobrazuje 🔒 u zamčených questů
- Zobrazuje popis jen u aktivního questu

### 3. Definice Questů

**V souboru:** `src/contexts/QuestContext.tsx`

```typescript
const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: 'Přijeď na depo',
    description: 'Najdi depot a naskladni zásilky',
    completed: false,
    locked: false // První quest je vždy odemčený
  },
  {
    id: 'quest-2',
    title: 'Doruč zásilku na Box',
    description: 'Přiveď zásilku k bodu výdeje Box',
    completed: false,
    locked: true
  },
  {
    id: 'quest-3',
    title: 'Kompletní rozvozová trasa',
    description: 'Dokonči celou rozvozovou trasu',
    completed: false,
    locked: true
  }
]
```

### 4. Integrace do minihry

**Příklad:** `src/components/PackageSortingGame.tsx`

```typescript
import { useQuest } from '../contexts/QuestContext'

export function PackageSortingGame({ onClose }) {
  const { completeCurrentQuest, currentQuest } = useQuest()
  
  const handleCheckResult = () => {
    // ... výpočet výsledků
    
    // Dokončit quest při splnění podmínky
    if (correct === REQUIRED_PACKAGES && currentQuest?.id === 'quest-1') {
      completeCurrentQuest()
    }
  }
}
```

## Přidání nového questu

### Krok 1: Přidej quest do INITIAL_QUESTS

```typescript
const INITIAL_QUESTS: Quest[] = [
  // ... existující questy
  {
    id: 'quest-4',
    title: 'Nový úkol',
    description: 'Popis nového úkolu',
    completed: false,
    locked: true  // Nové questy začínají zamčené
  }
]
```

### Krok 2: Připoj dokončení questu k minihuře nebo akci

```typescript
// V komponentě minihry nebo jiné logice
const { completeCurrentQuest, currentQuest } = useQuest()

const handleSuccess = () => {
  if (currentQuest?.id === 'quest-4') {
    completeCurrentQuest()
  }
}
```

## Jak funguje sekvenční postup

1. **Začátek:** První quest (`quest-1`) je odemčený (`locked: false`)
2. **Dokončení:** Po zavolání `completeCurrentQuest()`:
   - Aktuální quest se označí jako `completed: true`
   - Další quest v pořadí se odemkne (`locked: false`)
3. **Další quest:** Nový aktivní quest je další v pořadí
4. **Konec:** Když jsou všechny questy dokončené, `currentQuest` je `null`

## LocalStorage

Questy se automaticky ukládají do localStorage pod klíčem:
```
logistics-game-quests
```

Struktura uložených dat:
```json
[
  {
    "id": "quest-1",
    "title": "Přijeď na depo",
    "description": "Najdi depot a naskladni zásilky",
    "completed": true,
    "locked": false
  },
  {
    "id": "quest-2",
    "title": "Doruč zásilku na Box",
    "description": "Přiveď zásilku k bodu výdeje Box",
    "completed": false,
    "locked": false
  }
]
```

## Styling

### QuestList
- Pozice: `position: absolute; top: 20px; left: 20px`
- Z-index: `100` (nad 3D scénou)
- Background: `rgba(255, 255, 255, 0.95)` (poloprůhledné bílé)
- Animace: slideInLeft při načtení

### Aktivní quest
- Gradient: `#667eea` → `#764ba2` (stejný jako ScoreDisplay)
- Animace: pulsing box-shadow efekt
- Barva textu: bílá

### Dokončený quest
- Background: `#e8f5e9` (světle zelená)
- Barva: `#2e7d32` (tmavě zelená)
- Ikona: ✓ (zelený check)
- Opacity: 0.8

### Zamčený quest
- Background: `#f5f5f5` (světle šedá)
- Barva: `#999` (šedá)
- Ikona: 🔒 (zámek)
- Opacity: 0.6

## Pokročilé použití

### Podmíněné dokončení

```typescript
// Dokončit quest jen při perfektním skóre
if (score === maxScore && currentQuest?.id === 'quest-3') {
  completeCurrentQuest()
}
```

### Získání specifického questu

```typescript
const { quests } = useQuest()
const specificQuest = quests.find(q => q.id === 'quest-2')
```

### Kontrola, jestli jsou všechny questy dokončené

```typescript
const { quests } = useQuest()
const allCompleted = quests.every(q => q.completed)

if (allCompleted) {
  // Konec hry, zobraz vitěznou obrazovku
}
```

## Rozšíření systému

### Možné budoucí featury:

1. **Sub-questy** - vnořené úkoly (např. quest-1a, quest-1b)
2. **Volitelné questy** - side quests mimo hlavní linii
3. **Quest rewards** - speciální odměny za splnění
4. **Quest timer** - časový limit na dokončení
5. **Quest progress bar** - ukazatel postupu (např. "2/5 balíků")
6. **Daily quests** - denní úkoly obnovující se každý den
7. **Achievement system** - propojení s achievementy
8. **Quest hints** - nápovědy pro obtížné questy
9. **Multi-path quests** - různé cesty skrz hru
10. **Quest dialogue** - NPC poskytující questy

## Příklady integrace

### Dokončení questu při dosažení lokace

```typescript
// V komponentě 3D scény
const { completeCurrentQuest, currentQuest } = useQuest()

useEffect(() => {
  if (playerPosition.near(targetLocation) && currentQuest?.id === 'quest-2') {
    completeCurrentQuest()
  }
}, [playerPosition])
```

### Dokončení questu po kolekci předmětů

```typescript
const [collectedItems, setCollectedItems] = useState(0)
const { completeCurrentQuest, currentQuest } = useQuest()

useEffect(() => {
  if (collectedItems >= 5 && currentQuest?.id === 'quest-3') {
    completeCurrentQuest()
  }
}, [collectedItems])
```

## Testování

Pro testování můžeš použít:

```typescript
// V konzoli prohlížeče
localStorage.getItem('logistics-game-quests')

// Nebo resetovat questy
localStorage.removeItem('logistics-game-quests')
```

Nebo použít `resetQuests()` funkci z hooku v Development módu:

```typescript
// Přidej tlačítko pro debug
<button onClick={resetQuests}>Reset Quests</button>
```

## Integrace se Score systémem

Quest a Score systémy fungují nezávisle, ale lze je propojit:

```typescript
const { addScore } = useScore()
const { completeCurrentQuest } = useQuest()

const handleQuestComplete = () => {
  completeCurrentQuest()
  addScore(500) // Bonus za dokončení questu
}
```

