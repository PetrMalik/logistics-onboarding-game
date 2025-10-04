import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
    title: 'Kompletní rozvozová trasa',
    description: 'Dokonči celou rozvozovou trasu',
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
    setQuests(INITIAL_QUESTS)
  }

  const value = {
    quests,
    currentQuest,
    completeCurrentQuest,
    resetQuests
  }

  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
}

/**
 * Hook pro použití quest systému v komponentách
 * Musí být použit uvnitř QuestProvider
 */
export function useQuest() {
  const context = useContext(QuestContext)
  if (context === undefined) {
    throw new Error('useQuest must be used within a QuestProvider')
  }
  return context
}

