import { useState, useRef, useCallback } from 'react';
import { allTerms, allTermsMap, quizCategories, Rarity, Subcategory } from '../data/quizData';

export const useGacha = (
  ownedCards: Record<string, number>,
  getScore: () => number,
  selectedSubcategory: Subcategory | null,
  saveCollection: (newCollection: Record<string, number>) => void,
  jumpToCollection: (termName: string) => void
) => {
  const [isGachaRolling, setIsGachaRolling] = useState(false);
  const [gachaResults, setGachaResults] = useState<string[]>([]);
  const [gachaQueue, setGachaQueue] = useState<number>(0);
  const [currentGachaCard, setCurrentGachaCard] = useState<{
    term: string;
    initialRarity: Rarity;
    redrawsUsed: number;
    maxRedraws: number;
    isDuplicate: boolean;
  } | null>(null);
  const [gachaHistory, setGachaHistory] = useState<string[]>([]);
  
  const gachaTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const drawSingleCard = useCallback((currentCollection: Record<string, number>) => {
    const score = getScore();
    // Rarity weights based on score
    let weights = { UR: 1, SR: 5, R: 20, C: 74 };
    if (score > 3000) weights = { UR: 10, SR: 25, R: 40, C: 25 };
    else if (score > 2000) weights = { UR: 5, SR: 15, R: 40, C: 40 };
    else if (score > 1000) weights = { UR: 2, SR: 10, R: 30, C: 58 };

    const allTermsList = allTerms;
    
    // Determine rarity first
    const rand = Math.random() * 100;
    let selectedRarity: Rarity = 'C';
    let cumulative = 0;
    for (const [rarity, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (rand <= cumulative) {
        selectedRarity = rarity as Rarity;
        break;
      }
    }

    // Determine the base pool of terms
    let baseTerms = allTermsList;
    if (selectedSubcategory && Math.random() < 0.9) {
      const parentCategory = quizCategories.find(cat => 
        cat.subcategories.some(sub => sub.id === selectedSubcategory.id)
      );
      if (parentCategory) {
        baseTerms = parentCategory.subcategories.flatMap(sub => sub.terms.map(t => t.name));
      }
    }

    // Filter terms by rarity
    let possibleTerms = baseTerms.filter(term => (allTermsMap[term]?.rarity || 'C') === selectedRarity);
    
    // Fallback if no terms of this rarity exist in the restricted pool
    if (possibleTerms.length === 0) {
      possibleTerms = allTermsList.filter(term => (allTermsMap[term]?.rarity || 'C') === selectedRarity);
    }
    
    // Bias: 70% chance to pick from unowned if available in this rarity
    const unownedInRarity = possibleTerms.filter(term => !currentCollection[term]);
    if (unownedInRarity.length > 0 && Math.random() < 0.7) {
      possibleTerms = unownedInRarity;
    }

    // Apply 1.3x weight to terms in the current subcategory
    const currentSubcategoryTerms = selectedSubcategory?.terms.map(t => t.name) || [];
    const weightedTerms = possibleTerms.map(term => ({
      term,
      weight: currentSubcategoryTerms.includes(term) ? 1.3 : 1.0
    }));

    const totalWeight = weightedTerms.reduce((sum, item) => sum + item.weight, 0);
    let randWeight = Math.random() * totalWeight;
    let resultTerm = possibleTerms[0];

    for (const item of weightedTerms) {
      randWeight -= item.weight;
      if (randWeight <= 0) {
        resultTerm = item.term;
        break;
      }
    }
    
    return { term: resultTerm, rarity: selectedRarity };
  }, [getScore, selectedSubcategory]);

  const getGachaPullCount = useCallback((speedStarCorrectCount: number, questionsCount: number, correctCount: number, isDailyChallenge: boolean) => {
    if (!selectedSubcategory && questionsCount === 100) {
      // Speed Star Mode
      if (speedStarCorrectCount === 0) return 0;
      let count = 1; // Base 1 pull for 1+ correct
      let tempCorrect = speedStarCorrectCount;
      let currentRequired = 3;
      let nextInc = 4;
      while (tempCorrect >= currentRequired) {
        count++;
        tempCorrect -= currentRequired;
        currentRequired = nextInc;
        nextInc++;
      }
      return count;
    }
    
    // Regular Quiz Modes
    if (questionsCount === 20) return 5;
    if (questionsCount === 10) return 2;
    if (questionsCount === 5) {
      if (isDailyChallenge) {
        return (correctCount / questionsCount) >= 0.5 ? 2 : 1;
      }
      return (correctCount / questionsCount) >= 0.5 ? 1 : 0;
    }
    return 0;
  }, [selectedSubcategory]);

  const clearGachaState = useCallback(() => {
    if (gachaTimeoutRef.current) {
      clearTimeout(gachaTimeoutRef.current);
      gachaTimeoutRef.current = null;
    }
    setIsGachaRolling(false);
    setCurrentGachaCard(null);
    setGachaQueue(0);
    setGachaHistory([]);
    setGachaResults([]);
  }, []);

  const pullGacha = useCallback((speedStarCorrectCount: number, questionsCount: number, correctCount: number, isDailyChallenge: boolean) => {
    if (isGachaRolling) return;
    
    const pullCount = getGachaPullCount(speedStarCorrectCount, questionsCount, correctCount, isDailyChallenge);
    if (pullCount === 0) return;
    
    setGachaQueue(pullCount - 1);
    setGachaHistory([]);
    setIsGachaRolling(true);
    
    const firstDraw = drawSingleCard(ownedCards);
    const isDuplicate = (ownedCards[firstDraw.term] || 0) > 0;
    const maxRedraws = firstDraw.rarity === 'UR' ? 3 : firstDraw.rarity === 'SR' ? 2 : 1;
    
    gachaTimeoutRef.current = setTimeout(() => {
      setCurrentGachaCard({
        term: firstDraw.term,
        initialRarity: firstDraw.rarity,
        redrawsUsed: 0,
        maxRedraws,
        isDuplicate
      });
      setIsGachaRolling(false);
    }, 3000);
  }, [isGachaRolling, getGachaPullCount, ownedCards, drawSingleCard]);

  const confirmGachaCard = useCallback((action: 'next' | 'close' | 'collection' = 'next') => {
    if (!currentGachaCard) return;
    
    const currentCount = ownedCards[currentGachaCard.term] || 0;
    const newCollection = { ...ownedCards, [currentGachaCard.term]: Math.min(currentCount + 1, 3) };
    saveCollection(newCollection);
    
    const newHistory = [...gachaHistory, currentGachaCard.term];
    setGachaHistory(newHistory);
    
    if (gachaQueue > 0) {
      setGachaQueue(prev => prev - 1);
      setIsGachaRolling(true);
      setCurrentGachaCard(null);
      
      const nextDraw = drawSingleCard(newCollection);
      const isDuplicate = (newCollection[nextDraw.term] || 0) > 0;
      const maxRedraws = nextDraw.rarity === 'UR' ? 3 : nextDraw.rarity === 'SR' ? 2 : 1;
      
      gachaTimeoutRef.current = setTimeout(() => {
        setCurrentGachaCard({
          term: nextDraw.term,
          initialRarity: nextDraw.rarity,
          redrawsUsed: 0,
          maxRedraws,
          isDuplicate
        });
        setIsGachaRolling(false);
      }, 3000);
    } else {
      setGachaResults(newHistory);
      setCurrentGachaCard(null);
      setGachaHistory([]);
      if (action === 'collection' && currentGachaCard) {
        jumpToCollection(currentGachaCard.term);
      }
    }
  }, [currentGachaCard, ownedCards, saveCollection, gachaHistory, gachaQueue, jumpToCollection, drawSingleCard]);

  const redrawGachaCard = useCallback(() => {
    if (!currentGachaCard || currentGachaCard.redrawsUsed >= currentGachaCard.maxRedraws) return;
    
    setIsGachaRolling(true);
    setCurrentGachaCard(null);
    
    const redraw = drawSingleCard(ownedCards);
    const isDuplicate = (ownedCards[redraw.term] || 0) > 0;
    
    gachaTimeoutRef.current = setTimeout(() => {
      setCurrentGachaCard({
        term: redraw.term,
        initialRarity: currentGachaCard.initialRarity,
        redrawsUsed: currentGachaCard.redrawsUsed + 1,
        maxRedraws: currentGachaCard.maxRedraws,
        isDuplicate
      });
      setIsGachaRolling(false);
    }, 3000);
  }, [currentGachaCard, ownedCards, drawSingleCard]);

  return {
    isGachaRolling,
    gachaResults,
    setGachaResults,
    gachaQueue,
    currentGachaCard,
    gachaHistory,
    pullGacha,
    confirmGachaCard,
    redrawGachaCard,
    getGachaPullCount,
    clearGachaState
  };
};
