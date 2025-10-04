import { useState, useEffect } from 'react'
import { useScore } from '../contexts/ScoreContext'
import { useQuest } from '../contexts/QuestContext'
import './QuizGame.css'

interface QuizGameProps {
  onClose: () => void
}

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number // index správné odpovědi (0-2)
}

type GameStep = 'storytelling' | 'quiz' | 'result'

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Kde začíná cesta balíku?',
    options: ['U zákazníka', 'Na depu', 'Ve výdejním boxu'],
    correctAnswer: 1
  },
  {
    question: 'Co je parcel number?',
    options: ['Adresa příjemce', 'Jedinečné číslo balíku', 'Jméno kurýra'],
    correctAnswer: 1
  },
  {
    question: 'Co se děje na výdejním místě?',
    options: ['Balíky čekají na zákazníky', 'Balíky se vyrábějí', 'Balíky mění trasu'],
    correctAnswer: 0
  },
  {
    question: 'Jak si zákazník vyzvedne balík na boxu?',
    options: ['Pomocí kódu, který otevře přihrádku', 'Přímou fyzickou žádostí u pracovníka', 'Pošle e-mail pracovníkovi depa'],
    correctAnswer: 0
  },
  {
    question: 'Co musí kurýr udělat na cestě k zákazníkovi?',
    options: ['Roztřídit balíky do depa', 'Doručit balíky podle plánované trasy', 'Kontrolovat skladové zásoby'],
    correctAnswer: 1
  }
]

const TIME_LIMIT = 60 // 60 sekund
const POINTS_PER_CORRECT = 20 // 20 bodů za správnou odpověď
const MAX_TIME_BONUS = 50 // maximální time bonus

export function QuizGame({ onClose }: QuizGameProps) {
  const [currentStep, setCurrentStep] = useState<GameStep>('storytelling')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT)
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const { addScore } = useScore()
  const { completeCurrentQuest, currentQuest } = useQuest()

  // Časovač
  useEffect(() => {
    if (currentStep !== 'quiz') return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Čas vypršel - automaticky vyhodnotit
          handleQuizEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentStep])

  // Start kvízu
  const handleStartQuiz = () => {
    setCurrentStep('quiz')
    setQuizStartTime(Date.now())
  }

  // Výběr odpovědi
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  // Další otázka
  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Poslední otázka - vyhodnotit
      handleQuizEnd()
    }
  }

  // Předchozí otázka
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Ukončení a vyhodnocení kvízu
  const handleQuizEnd = () => {
    // Spočítat správné odpovědi
    let correct = 0
    QUIZ_QUESTIONS.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    setCorrectCount(correct)

    // Spočítat body
    const basePoints = correct * POINTS_PER_CORRECT
    
    // Time bonus: čím víc času zbývá, tím vyšší bonus
    // 60s = 50 bodů, 0s = 0 bodů
    const timeBonus = Math.round((timeRemaining / TIME_LIMIT) * MAX_TIME_BONUS)
    
    const totalPoints = basePoints + timeBonus
    setEarnedPoints(totalPoints)
    addScore(totalPoints)

    // Dokončit quest pouze pokud je to quest-4
    if (currentQuest?.id === 'quest-4') {
      completeCurrentQuest()
    }

    setCurrentStep('result')
  }

  // Formátování času
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined
  const allAnswered = selectedAnswers.length === QUIZ_QUESTIONS.length && 
                      selectedAnswers.every(a => a !== undefined)

  return (
    <div className="quiz-game-overlay">
      <div className="quiz-game-modal">
        {/* STORYTELLING */}
        {currentStep === 'storytelling' && (
          <div className="quiz-storytelling">
            <h2>🎓 Závěrečný test</h2>
            <div className="quiz-story">
              <p>
                <strong>Dobrá práce!</strong>
              </p>
              <p>
                Prošel jsi základním onboardingem a teď je čas ověřit, co ses naučil.
              </p>
              <p>
                <strong>Odpověz na 5 otázek během 60 sekund.</strong>
              </p>
              <p>
                Získáš body za správné odpovědi a bonusové body za rychlost!
              </p>
            </div>
            <button onClick={handleStartQuiz} className="quiz-start-btn">
              Začít test →
            </button>
          </div>
        )}

        {/* QUIZ */}
        {currentStep === 'quiz' && (
          <div className="quiz-container">
            <div className="quiz-header">
              <div className="quiz-progress">
                Otázka {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}
              </div>
              <div className={`quiz-timer ${timeRemaining <= 10 ? 'timer-warning' : ''}`}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
            </div>

            <div className="quiz-question">
              <h3>{currentQuestion.question}</h3>
            </div>

            <div className="quiz-options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`quiz-option ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>

            <div className="quiz-navigation">
              <button 
                onClick={handlePrevQuestion} 
                disabled={currentQuestionIndex === 0}
                className="quiz-nav-btn"
              >
                ← Předchozí
              </button>

              {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? (
                <button 
                  onClick={handleNextQuestion}
                  disabled={!isAnswered}
                  className="quiz-nav-btn primary"
                >
                  Další →
                </button>
              ) : (
                <button 
                  onClick={handleQuizEnd}
                  disabled={!allAnswered}
                  className="quiz-nav-btn primary finish"
                >
                  Dokončit test ✓
                </button>
              )}
            </div>

            {/* Indikátor odpovězených otázek */}
            <div className="quiz-dots">
              {QUIZ_QUESTIONS.map((_, index) => (
                <div
                  key={index}
                  className={`quiz-dot ${index === currentQuestionIndex ? 'active' : ''} ${selectedAnswers[index] !== undefined ? 'answered' : ''}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                />
              ))}
            </div>
          </div>
        )}

        {/* RESULT */}
        {currentStep === 'result' && (
          <div className="quiz-result">
            <h2>📊 Výsledky testu</h2>
            
            <div className="quiz-score-summary">
              <div className="quiz-final-score">
                <div className="score-label">Celkové skóre</div>
                <div className="score-value">{earnedPoints} bodů</div>
              </div>
            </div>

            <div className="quiz-breakdown">
              <div className="breakdown-item">
                <span>Správné odpovědi:</span>
                <strong>{correctCount} / {QUIZ_QUESTIONS.length}</strong>
              </div>
              <div className="breakdown-item">
                <span>Body za odpovědi:</span>
                <strong>{correctCount * POINTS_PER_CORRECT} bodů</strong>
              </div>
              <div className="breakdown-item">
                <span>Časový bonus:</span>
                <strong>{earnedPoints - (correctCount * POINTS_PER_CORRECT)} bodů</strong>
              </div>
              <div className="breakdown-item">
                <span>Zbývající čas:</span>
                <strong>{formatTime(timeRemaining)}</strong>
              </div>
            </div>

            {/* Přehled odpovědí */}
            <div className="quiz-review">
              <h3>Přehled odpovědí:</h3>
              {QUIZ_QUESTIONS.map((question, index) => {
                const isCorrect = selectedAnswers[index] === question.correctAnswer
                return (
                  <div key={index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-question">
                      {index + 1}. {question.question}
                    </div>
                    <div className="review-answer">
                      {isCorrect ? '✓' : '✗'} Tvá odpověď: {question.options[selectedAnswers[index]]}
                      {!isCorrect && (
                        <div className="correct-answer">
                          Správně: {question.options[question.correctAnswer]}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="quiz-result-message">
              {correctCount === QUIZ_QUESTIONS.length && (
                <div className="perfect-score">
                  🎉 <strong>Perfektní!</strong> Odpověděl jsi na všechny otázky správně!
                </div>
              )}
              {correctCount >= 4 && correctCount < QUIZ_QUESTIONS.length && (
                <div className="good-score">
                  👏 <strong>Výborně!</strong> Zvládl jsi test s velmi dobrým výsledkem!
                </div>
              )}
              {correctCount >= 3 && correctCount < 4 && (
                <div className="ok-score">
                  👍 <strong>Dobře!</strong> Základy ovládáš, ale je co zlepšovat.
                </div>
              )}
              {correctCount < 3 && (
                <div className="poor-score">
                  💪 <strong>Zkus to znovu!</strong> Projdi si školení ještě jednou.
                </div>
              )}
            </div>

            <button onClick={onClose} className="quiz-close-btn">
              Zavřít
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

