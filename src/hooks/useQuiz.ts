import { useState, useEffect, useCallback } from 'react';
import { Question, QuestionType, generateQuestion } from '../services/geminiService';
import { Category, Subcategory, quizCategories, allTerms } from '../data/quizData';
import { storage } from '../lib/storage';

export const useQuiz = (
  updateTermStats: (term: string, isCorrect: boolean) => void,
  updateStats: (id: string, score: number) => void,
  gameState: any,
  setGameState: (state: any) => void,
  selectedSubcategory: Subcategory | null,
  setSelectedSubcategory: (sub: Subcategory | null) => void,
  isDailyChallenge: boolean,
  setIsDailyChallenge: (val: boolean) => void,
  getDailyId: () => string,
  setLastDailyChallengeId: (id: string) => void,
  setDailyStreak: (val: number | ((prev: number) => number)) => void,
  setHasBonusTicket: (val: boolean) => void,
  setQuizCount: (val: number | ((prev: number) => number)) => void,
  setSpeedStarMaxCombo: (val: number | ((prev: number) => number)) => void,
  setSpeedStarMaxCorrect: (val: number | ((prev: number) => number)) => void,
  setSpeedStarChallenges: (val: number | ((prev: number) => number)) => void,
  clearGachaState: () => void,
  hasBonusTicket: boolean,
  speedStarProgress: number,
  setSpeedStarProgress: (val: number | ((prev: number) => number)) => void
) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [penaltyActive, setPenaltyActive] = useState(false);
  const [penaltyTime, setPenaltyTime] = useState(0);
  
  // Speed Star specific state
  const [speedStarCorrectCount, setSpeedStarCorrectCount] = useState(0);
  const [speedStarRequiredForNext, setSpeedStarRequiredForNext] = useState(3);
  const [speedStarNextIncrement, setSpeedStarNextIncrement] = useState(4);

  const handleAnswer = useCallback((answer: string, gameState: string) => {
    if (penaltyActive) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    setUserAnswer(answer);
    
    if (gameState === 'SPEED_STAR') {
      updateTermStats(currentQuestion.term, isCorrect);
      const nextCombo = isCorrect ? combo + 1 : 0;
      const nextMaxCombo = Math.max(maxCombo, nextCombo);
      const nextCorrectCount = speedStarCorrectCount + (isCorrect ? 1 : 0);

      if (isCorrect) {
        setScore(prev => prev + 200);
        setSpeedStarCorrectCount(nextCorrectCount);
        setCombo(nextCombo);
        setMaxCombo(nextMaxCombo);
        setTimeLeft(prev => Math.min(30, prev + 2));
        setFeedback('CORRECT');
      } else {
        setCombo(0);
        setTimeLeft(prev => Math.max(0, prev - 5));
        setFeedback('WRONG');
      }
      
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer(null);
        if (currentQuestionIndex < questions.length - 1 && timeLeft > 0) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          setSpeedStarMaxCombo(prev => Math.max(prev, nextMaxCombo));
          setSpeedStarMaxCorrect(prev => Math.max(prev, nextCorrectCount));
          setGameState('RESULT');
        }
      }, 500);
      return;
    }

    let nextScore = score;
    const nextCorrectCount = correctCount + (isCorrect ? 1 : 0);
    if (isCorrect) {
      updateTermStats(currentQuestion.term, true);
      const timeBonus = Math.floor(timeLeft * 2.5);
      const comboBonus = combo * 20;
      nextScore = score + 100 + timeBonus + comboBonus;
      setScore(nextScore);
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));
      setCorrectCount(nextCorrectCount);
      setFeedback('CORRECT');
    } else {
      updateTermStats(currentQuestion.term, false);
      setCombo(0);
      setFeedback('WRONG');
      setPenaltyActive(true);
      setPenaltyTime(5);
    }

    const delay = isCorrect ? 1000 : 5000;

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(60);
      } else {
        if (selectedSubcategory && selectedSubcategory.id !== 'weakness') {
          updateStats(selectedSubcategory.id, nextScore);
        }
        
        if (isDailyChallenge) {
          const dailyId = getDailyId();
          setLastDailyChallengeId(dailyId);
          
          const yesterday = new Date();
          const now = new Date();
          const offset = now.getHours() < 5 ? 1 : 0;
          yesterday.setDate(now.getDate() - 1 - offset);
          const yesterdayId = yesterday.toISOString().split('T')[0];
          
          setDailyStreak(prev => {
            const lastId = storage.getItem('it_quiz_last_daily_id');
            if (lastId === yesterdayId) return prev + 1;
            return 1;
          });
        }
        
        setQuizCount(prev => prev + 1);

        // Speed Star Bonus Ticket Logic
        if (gameState === 'QUIZ' && selectedSubcategory?.id !== 'weakness') {
          const isCleared = (nextCorrectCount / questions.length) >= 0.5;
          if (isCleared && !hasBonusTicket) {
            let increment = 0;
            if (questions.length === 5) increment = 1;
            else if (questions.length === 10) increment = 2;
            else if (questions.length === 20) increment = 4;

            if (increment > 0) {
              const newProgress = speedStarProgress + increment;
              setSpeedStarProgress(newProgress);
              
              let probability = newProgress * 0.1;
              // Add bonus probability for 10 or 20 question quizzes based on correct answers
              if (questions.length === 10 || questions.length === 20) {
                probability += (nextCorrectCount * 0.01);
              }
              probability = Math.min(probability, 1.0);

              if (Math.random() < probability) {
                setHasBonusTicket(true);
              }
            }
          }
        }

        setGameState('RESULT');
      }
    }, delay);
  }, [penaltyActive, questions, currentQuestionIndex, combo, maxCombo, speedStarCorrectCount, timeLeft, selectedSubcategory, isDailyChallenge, score, correctCount, hasBonusTicket, speedStarProgress, updateTermStats, updateStats, setGameState, setSpeedStarMaxCombo, setSpeedStarMaxCorrect, setQuizCount, setLastDailyChallengeId, setDailyStreak, getDailyId, setSpeedStarProgress, setHasBonusTicket]);

  const resetQuizState = useCallback(() => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(60);
    setUserAnswer(null);
    setFeedback(null);
    setCorrectCount(0);
    setPenaltyActive(false);
    setPenaltyTime(0);
    setQuestions([]);
    setIsDailyChallenge(false);
    setSpeedStarCorrectCount(0);
  }, [setIsDailyChallenge]);

  // Timer logic
  useEffect(() => {
    let timer: number;
    if ((gameState === 'QUIZ' || gameState === 'SPEED_STAR') && timeLeft > 0 && !feedback) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 0.1));
      }, 100);
    } else if (timeLeft <= 0 && (gameState === 'QUIZ' || gameState === 'SPEED_STAR') && !feedback) {
      if (gameState === 'SPEED_STAR') {
        setSpeedStarMaxCombo(prev => Math.max(prev, maxCombo));
        setSpeedStarMaxCorrect(prev => Math.max(prev, speedStarCorrectCount));
        setGameState('RESULT');
      } else {
        handleAnswer('', gameState); // Time out for regular quiz
      }
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, feedback, maxCombo, speedStarCorrectCount, handleAnswer, setGameState, setSpeedStarMaxCombo, setSpeedStarMaxCorrect]);

  // Penalty timer logic
  useEffect(() => {
    let timer: number;
    if (penaltyActive && penaltyTime > 0) {
      timer = window.setInterval(() => {
        setPenaltyTime(prev => Math.max(0, prev - 0.1));
      }, 100);
    } else if (penaltyTime <= 0 && penaltyActive) {
      setPenaltyActive(false);
    }
    return () => clearInterval(timer);
  }, [penaltyActive, penaltyTime]);

  const startQuiz = async (item: Subcategory | Category) => {
    if (isLoading) return;
    setIsLoading(true);
    resetQuizState();
    clearGachaState();

    let quizTerms: any[] = [];
    let selectedItem: any = item;
    let targetCount = 5;

    if ('subcategories' in item) {
      // It's a Category - include all terms from all subcategories
      quizTerms = item.subcategories.flatMap(sub => sub.terms);
      targetCount = 10;
      // Create a dummy subcategory for the UI
      selectedItem = {
        id: item.id,
        title: `${item.title} (全単元)`,
        terms: quizTerms
      };
    } else {
      quizTerms = item.terms;
      targetCount = 5;
      selectedItem = item;
    }

    // Shuffle and slice to target count
    const shuffledTerms = [...quizTerms].sort(() => 0.5 - Math.random());
    const selectedTerms = shuffledTerms.slice(0, targetCount);

    setSelectedSubcategory(selectedItem);

    try {
      const generatedQuestions = await Promise.all(
        selectedTerms.map(term => 
          generateQuestion(term.name, quizTerms.map(t => t.name), allTerms)
        )
      );

      setQuestions(generatedQuestions);
      setGameState('QUIZ');
    } catch (error) {
      console.error("Failed to start quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startWeaknessQuiz = async (termStats: any) => {
    if (isLoading) return;
    setIsLoading(true);
    resetQuizState();
    clearGachaState();
    setSelectedSubcategory({ id: 'weakness', title: '苦手克服', terms: [] });

    const allQuizTerms = quizCategories.flatMap(cat => cat.subcategories).flatMap(sub => sub.terms);

    let candidates = Object.entries(termStats)
      .filter(([name, stat]: [string, any]) => stat.total > 0 && stat.correct < stat.total)
      .map(([name, stat]: [string, any]) => ({ name, wrongRate: (stat.total - stat.correct) / stat.total }))
      .sort((a, b) => b.wrongRate - a.wrongRate);

    const topCandidates = candidates.slice(0, 15).sort(() => 0.5 - Math.random());
    let selectedNames = topCandidates.slice(0, 5).map(c => c.name);

    if (selectedNames.length < 5) {
      const remainingNeeded = 5 - selectedNames.length;
      const otherTerms = allQuizTerms
        .filter(t => !selectedNames.includes(t.name))
        .sort(() => 0.5 - Math.random())
        .slice(0, remainingNeeded);
      selectedNames = [...selectedNames, ...otherTerms.map(t => t.name)];
    }

    try {
      const generatedQuestions = await Promise.all(
        selectedNames.map(name => 
          generateQuestion(name, allQuizTerms.map(t => t.name), allTerms)
        )
      );

      setQuestions(generatedQuestions);
      setGameState('QUIZ');
    } catch (error) {
      console.error("Failed to start weakness quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startComprehensiveQuiz = async (title: string) => {
    if (isLoading) return;
    setIsLoading(true);
    resetQuizState();
    clearGachaState();
    setSelectedSubcategory({ id: 'all', title, terms: [] });

    const allSubcategories = quizCategories.flatMap(cat => cat.subcategories);
    const selectedQuestionsData = [];
    for (let i = 0; i < 20; i++) {
      const randomSub = allSubcategories[Math.floor(Math.random() * allSubcategories.length)];
      const randomTerm = randomSub.terms[Math.floor(Math.random() * randomSub.terms.length)];
      selectedQuestionsData.push({ term: randomTerm, subTerms: randomSub.terms });
    }

    try {
      const generatedQuestions = [];
      let consecutiveDescToTerm = 0;
      
      for (const data of selectedQuestionsData) {
        let forcedType: QuestionType | undefined = undefined;
        if (consecutiveDescToTerm >= 3) {
          forcedType = 'TERM_TO_DESC';
        }
        
        const q = await generateQuestion(data.term.name, data.subTerms.map(t => t.name), allTerms, forcedType);
        
        if (q.type === 'DESC_TO_TERM') {
          consecutiveDescToTerm++;
        } else {
          consecutiveDescToTerm = 0;
        }
        
        generatedQuestions.push(q);
      }

      setQuestions(generatedQuestions);
      setGameState('QUIZ');
    } catch (error) {
      console.error("Failed to start comprehensive quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startDailyChallenge = async () => {
    if (isLoading) return;
    setIsLoading(true);
    resetQuizState();
    clearGachaState();
    setIsDailyChallenge(true);
    
    const allSubcategories = quizCategories.flatMap(cat => cat.subcategories);
    const randomSub = allSubcategories[Math.floor(Math.random() * allSubcategories.length)];
    setSelectedSubcategory(randomSub);

    try {
      const shuffledTerms = [...randomSub.terms].sort(() => 0.5 - Math.random());
      const selectedTerms = shuffledTerms.slice(0, 5);

      const generatedQuestions = await Promise.all(
        selectedTerms.map(term => 
          generateQuestion(term.name, randomSub.terms.map(t => t.name), allTerms)
        )
      );

      setQuestions(generatedQuestions);
      setGameState('QUIZ');
    } catch (error) {
      console.error("Failed to start daily challenge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSpeedStar = async () => {
    if (isLoading) return;
    setIsLoading(true);
    resetQuizState();
    clearGachaState();
    setSelectedSubcategory(null);
    setSpeedStarCorrectCount(0);
    setSpeedStarRequiredForNext(3);
    setSpeedStarNextIncrement(4);
    setSpeedStarChallenges(prev => prev + 1);
    setSpeedStarProgress(0);
    
    try {
      const allSubcategories = quizCategories.flatMap(cat => cat.subcategories);
      const selectedQuestionsData = [];
      for (let i = 0; i < 100; i++) {
        const randomSub = allSubcategories[Math.floor(Math.random() * allSubcategories.length)];
        const randomTerm = randomSub.terms[Math.floor(Math.random() * randomSub.terms.length)];
        selectedQuestionsData.push({ term: randomTerm, subTerms: randomSub.terms });
      }
      
      const ssQuestions = await Promise.all(
        selectedQuestionsData.map(data => generateQuestion(data.term.name, data.subTerms.map(t => t.name), allTerms, 'DESC_TO_TERM', 4))
      );
      
      setQuestions(ssQuestions);
      setTimeLeft(30);
      setGameState('SPEED_STAR');
      setHasBonusTicket(false);
    } catch (error) {
      console.error("Failed to start Speed Star:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questions, setQuestions,
    currentQuestionIndex, setCurrentQuestionIndex,
    score, setScore,
    combo, setCombo,
    maxCombo, setMaxCombo,
    timeLeft, setTimeLeft,
    userAnswer, setUserAnswer,
    feedback, setFeedback,
    correctCount, setCorrectCount,
    isLoading, setIsLoading,
    penaltyActive, setPenaltyActive,
    penaltyTime, setPenaltyTime,
    speedStarCorrectCount,
    startQuiz,
    startComprehensiveQuiz,
    startDailyChallenge,
    startSpeedStar,
    startWeaknessQuiz,
    handleAnswer,
    resetQuizState
  };
};
