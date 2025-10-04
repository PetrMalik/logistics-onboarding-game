import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

const QUEST_STORAGE_KEY = 'logistics-game-quests'

export interface Quest {
  id: string
  title: string
  description: string
  completed: boolean
  locked: boolean
}

interface QuestContextType {
  quests: Quest[]
  currentQuest: Quest | null
  completeCurrentQuest: () => void
  resetQuests: () => void
  courierPin: string | null
  generateCourierPin: () => string
}

const QuestContext = createContext<QuestContextType | undefined>(undefined)

interface QuestProviderProps {
  children: ReactNode
}

// Definice všech úkolů ve hře
const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: 'Přijeď na depo',
    description: 'Najdi depot a naskladni zásilky do dodávky',
    completed: false,
    locked: false // První úkol je odemčený
  },
  {
    id: 'quest-2',
    title: 'Doruč zásilku na výdejní box',
    description: 'Doruč zásilku jako kurýr do výdejního boxu',
    completed: false,
    locked: true
  },
  {
    id: 'quest-3',
    title: 'Vydej balíky v trafice',
    description: 'Vydej správné balíky podle čísel v trafice',
    completed: false,
    locked: true
  },
  {
    id: 'quest-4',
    title: 'Vrať se na depo - Závěrečný test',
    description: 'Ukaž, co ses naučil! Odpověz na 5 otázek během 60 sekund',
    completed: false,
    locked: true
  }
]

export function QuestProvider({ children }: QuestProviderProps) {
  const [quests, setQuests] = useState<Quest[]>(() => {
    // Načíst questy z localStorage při inicializaci
    const stored = localStorage.getItem(QUEST_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return INITIAL_QUESTS
      }
    }
    return INITIAL_QUESTS
  })

  // State pro kurýrní PIN
  const [courierPin, setCourierPin] = useState<string | null>(null)

  // Automatické ukládání do localStorage při změně
  useEffect(() => {
    localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(quests))
  }, [quests])

  // Najít aktuální (aktivní) quest - první nesplněný
  const currentQuest = quests.find(q => !q.completed && !q.locked) || null

  /**
   * Dokončí aktuální quest a odemkne další
   */
  const completeCurrentQuest = () => {
    setQuests(prevQuests => {
      const currentIndex = prevQuests.findIndex(q => !q.completed && !q.locked)
      
      if (currentIndex === -1) return prevQuests // Žádný aktivní quest
      
      const newQuests = [...prevQuests]
      
      // Označit aktuální jako dokončený
      newQuests[currentIndex] = {
        ...newQuests[currentIndex],
        completed: true
      }
      
      // Odemknout další quest, pokud existuje
      if (currentIndex + 1 < newQuests.length) {
        newQuests[currentIndex + 1] = {
          ...newQuests[currentIndex + 1],
          locked: false
        }
      }
      
      return newQuests
    })
  }

  /**
   * Resetuje všechny questy na výchozí stav
   */
  const resetQuests = () => {
    localStorage.removeItem(QUEST_STORAGE_KEY) // Vymazat uložený stav
    setQuests(INITIAL_QUESTS)
    setCourierPin(null)
  }

  /**
   * Vygeneruje náhodný 4místný PIN pro kurýra
   */
  const generateCourierPin = (): string => {
    const pin = Array.from({ length: 4 }, () => 
      Math.floor(Math.random() * 10)
    ).join('')
    setCourierPin(pin)
    return pin
  }

  const value = {
    quests,
    currentQuest,
    completeCurrentQuest,
    resetQuests,
    courierPin,
    generateCourierPin
  }

  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
}

/**
 * Hook pro použití quest systému v komponentách
 * Musí být použit uvnitř QuestProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useQuest() {
  const context = useContext(QuestContext)
  if (context === undefined) {
    throw new Error('useQuest must be used within a QuestProvider')
  }
  return context
}

