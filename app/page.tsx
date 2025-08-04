'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Good {
  good: string;
  demandElasticity: number;
  supplyElasticity: number;
}

interface QuestionResult {
  questionNumber: number;
  good: string;
  demandPoints: number;
  supplyPoints: number;
  taxIncidencePoints: number;
  totalPoints: number;
  demandGuess: number;
  demandActual: number;
  supplyGuess: number;
  supplyActual: number;
  taxIncidenceGuess: number;
  taxIncidenceActual: number;
}

interface SessionStats {
  totalPoints: number;
  questionsCompleted: number;
  questionResults: QuestionResult[];
}

type QuizStage = 'demand' | 'supply' | 'result' | 'sessionComplete';

const ElasticityExplanation = ({ onClose }: { onClose: () => void }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="relative p-4 md:p-6 pb-4 md:pb-6 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 group hover:shadow-lg"
          >
            <span className="text-gray-600 text-xl md:text-2xl group-hover:rotate-90 transition-transform duration-200">×</span>
          </button>
          
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pr-10 md:pr-12">
            Understanding Economic Elasticities & Tax Incidence
          </h2>
        </div>
        
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-4 md:px-6 pb-4 md:pb-6">
          <div className="space-y-4 md:space-y-6 text-gray-700 mt-4">
            {/* Demand Elasticity Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3 text-gray-800">📉 Price Elasticity of Demand</h3>
              <p className="leading-relaxed mb-3 text-sm md:text-base">
                Measures how much consumers change their purchasing when prices change. Think of it as "consumer sensitivity to price."
              </p>
              <div className="bg-white/50 rounded-lg md:rounded-xl p-3 md:p-4 space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <p>• <strong>Always negative</strong> (higher price → lower quantity demanded)</p>
                <p>• <strong>-0.1 to -0.5:</strong> Inelastic (necessities, addictions)</p>
                <p>• <strong>-0.5 to -1.5:</strong> Moderate elasticity</p>
                <p>• <strong>-1.5 to -5:</strong> Very elastic (luxuries, many substitutes)</p>
              </div>
            </div>
            
            {/* Supply Elasticity Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3 text-gray-800">📈 Price Elasticity of Supply</h3>
              <p className="leading-relaxed mb-3 text-sm md:text-base">
                Measures how much producers change their output when prices change. Think of it as "producer flexibility."
              </p>
              <div className="bg-white/50 rounded-lg md:rounded-xl p-3 md:p-4 space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <p>• <strong>Always positive</strong> (higher price → more quantity supplied)</p>
                <p>• <strong>0 to 0.5:</strong> Inelastic (hard to increase production)</p>
                <p>• <strong>0.5 to 1.5:</strong> Moderate elasticity</p>
                <p>• <strong>1.5+:</strong> Very elastic (easy to ramp up production)</p>
              </div>
            </div>

            {/* Tax Incidence Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3 text-gray-800">⚖️ Tax Incidence (Who Really Pays?)</h3>
              <p className="leading-relaxed mb-3 text-sm md:text-base">
                When a tariff or tax is imposed, who actually bears the cost? The formula:
              </p>
              <div className="bg-white/70 rounded-lg md:rounded-xl p-3 md:p-4 text-center mb-3 md:mb-4">
                <p className="text-sm md:text-lg font-mono break-all">
                  Buyer's Share = Supply Elasticity ÷ (|Demand Elasticity| + Supply Elasticity)
                </p>
              </div>
              <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                <p>• <strong>Result = 80%:</strong> Importers/buyers pay 80% of the tariff through higher prices</p>
                <p>• <strong>Result = 20%:</strong> Importers only pay 20% (exporters absorb 80%)</p>
                <p className="italic text-gray-600">The less flexible party (lower elasticity) bears more of the tax burden!</p>
              </div>
            </div>
            
            {/* Scoring System */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3 text-gray-800">🏆 Scoring System</h3>
              <p className="mb-3 text-sm md:text-base">
                Points are awarded using an exponential decay formula based on accuracy:
              </p>
              <div className="bg-white/50 rounded-lg md:rounded-xl p-3 md:p-4 space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <p>• <strong>Demand Elasticity:</strong> Up to 2,000 points</p>
                <p>• <strong>Supply Elasticity:</strong> Up to 2,000 points</p>
                <p>• <strong>Tax Incidence:</strong> Up to 1,000 points</p>
                <p>• <strong>Total per question:</strong> Up to 5,000 points</p>
                <p className="italic text-gray-600 mt-2">The closer your guess, the more points you earn!</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Exponential decay scoring function
const calculatePoints = (difference: number, maxPoints: number, scaleFactor: number = 2): number => {
  return Math.round(maxPoints * Math.exp(-difference * scaleFactor));
};

export default function Home() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [currentGood, setCurrentGood] = useState<Good | null>(null);
  const [demandGuess, setDemandGuess] = useState('');
  const [supplyGuess, setSupplyGuess] = useState('');
  const [currentStage, setCurrentStage] = useState<QuizStage>('demand');
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usedGoods, setUsedGoods] = useState<Set<string>>(new Set());
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalPoints: 0,
    questionsCompleted: 0,
    questionResults: []
  });
  const [currentQuestionPoints, setCurrentQuestionPoints] = useState({
    demand: 0,
    supply: 0,
    taxIncidence: 0,
    total: 0
  });

  const SESSION_LENGTH = 10;

  useEffect(() => {
    fetch('/dataset.json')
      .then(res => res.json())
      .then(data => {
        setGoods(data);
        setLoading(false);
        selectRandomGood(data, new Set());
      })
      .catch(err => {
        console.error('Error loading dataset:', err);
        setLoading(false);
      });
  }, []);

  const selectRandomGood = (goodsList: Good[], usedSet: Set<string>) => {
    const availableGoods = goodsList.filter(g => !usedSet.has(g.good));
    
    if (availableGoods.length === 0) {
      setUsedGoods(new Set());
      selectRandomGood(goodsList, new Set());
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableGoods.length);
    setCurrentGood(availableGoods[randomIndex]);
  };

  const handleDemandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demandGuess || currentStage !== 'demand') return;
    
    setCurrentStage('supply');
  };

  const handleSupplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplyGuess || currentStage !== 'supply') return;
    
    setCurrentStage('result');
    
    const demandGuessNum = parseFloat(demandGuess);
    const supplyGuessNum = parseFloat(supplyGuess);
    const demandActual = currentGood!.demandElasticity;
    const supplyActual = currentGood!.supplyElasticity;
    
    // Calculate points for each component
    const demandDiff = Math.abs(demandGuessNum - demandActual);
    const supplyDiff = Math.abs(supplyGuessNum - supplyActual);
    
    const demandPoints = calculatePoints(demandDiff, 2000);
    const supplyPoints = calculatePoints(supplyDiff, 2000);
    
    // Calculate tax incidence
    const actualTaxIncidence = supplyActual / (Math.abs(demandActual) + supplyActual);
    const guessTaxIncidence = supplyGuessNum / (Math.abs(demandGuessNum) + supplyGuessNum);
    const taxIncidenceDiff = Math.abs(guessTaxIncidence - actualTaxIncidence);
    
    // Tax incidence points (scale factor of 10 because differences are smaller)
    const taxIncidencePoints = calculatePoints(taxIncidenceDiff, 1000, 10);
    
    const totalPoints = demandPoints + supplyPoints + taxIncidencePoints;
    
    setCurrentQuestionPoints({
      demand: demandPoints,
      supply: supplyPoints,
      taxIncidence: taxIncidencePoints,
      total: totalPoints
    });
    
    // Update session stats
    const questionResult: QuestionResult = {
      questionNumber: sessionStats.questionsCompleted + 1,
      good: currentGood!.good,
      demandPoints,
      supplyPoints,
      taxIncidencePoints,
      totalPoints,
      demandGuess: demandGuessNum,
      demandActual,
      supplyGuess: supplyGuessNum,
      supplyActual,
      taxIncidenceGuess: guessTaxIncidence,
      taxIncidenceActual: actualTaxIncidence
    };
    
    setSessionStats(prev => ({
      totalPoints: prev.totalPoints + totalPoints,
      questionsCompleted: prev.questionsCompleted + 1,
      questionResults: [...prev.questionResults, questionResult]
    }));
  };

  const nextQuestion = () => {
    if (sessionStats.questionsCompleted >= SESSION_LENGTH) {
      setCurrentStage('sessionComplete');
      return;
    }
    
    if (currentGood) {
      setUsedGoods(prev => new Set([...prev, currentGood.good]));
    }
    setCurrentStage('demand');
    setDemandGuess('');
    setSupplyGuess('');
    selectRandomGood(goods, usedGoods);
  };

  const startNewSession = () => {
    setSessionStats({
      totalPoints: 0,
      questionsCompleted: 0,
      questionResults: []
    });
    setUsedGoods(new Set());
    setCurrentStage('demand');
    setDemandGuess('');
    setSupplyGuess('');
    selectRandomGood(goods, new Set());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-20 h-20 border-4 border-pink-400 border-b-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  const taxIncidence = currentStage === 'result' ? 
    currentGood!.supplyElasticity / (Math.abs(currentGood!.demandElasticity) + currentGood!.supplyElasticity) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000" />
      </div>

      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                Economic Elasticity Quiz
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Master supply, demand, and tax incidence
            </p>
            <button
              onClick={() => setShowExplanation(true)}
              className="mt-4 px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              What are elasticities? 🤔
            </button>
          </motion.div>

          {/* Session Complete Screen */}
          {currentStage === 'sessionComplete' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <h2 className="text-4xl font-bold text-white text-center mb-8">
                  Session Complete! 🎉
                </h2>
                
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-center">
                  <p className="text-white/80 text-xl mb-2">Total Score</p>
                  <p className="text-6xl font-bold text-white">
                    {sessionStats.totalPoints.toLocaleString()}
                  </p>
                  <p className="text-white/80 text-lg mt-2">
                    out of {(SESSION_LENGTH * 5000).toLocaleString()} possible points
                  </p>
                  <p className="text-2xl text-white mt-4">
                    {Math.round((sessionStats.totalPoints / (SESSION_LENGTH * 5000)) * 100)}% Accuracy
                  </p>
                </div>

                <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
                  <h3 className="text-xl font-semibold text-white mb-4">Question Breakdown</h3>
                  {sessionStats.questionResults.map((result, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/5 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold">
                          Q{result.questionNumber}: {result.good}
                        </h4>
                        <span className="text-2xl font-bold text-yellow-400">
                          {result.totalPoints.toLocaleString()} pts
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-gray-300">
                          <span className="text-blue-400">Demand:</span> {result.demandPoints} pts
                        </div>
                        <div className="text-gray-300">
                          <span className="text-green-400">Supply:</span> {result.supplyPoints} pts
                        </div>
                        <div className="text-gray-300">
                          <span className="text-orange-400">Tax:</span> {result.taxIncidencePoints} pts
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startNewSession}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                >
                  Start New Session
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Main Quiz Content */
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Stats Panel */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1 space-y-4"
              >
                {/* Session Progress */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                  <h3 className="text-white/80 font-semibold mb-4 text-center">Session Progress</h3>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-2xl p-4 border border-blue-400/20">
                      <p className="text-blue-300 text-sm">Question</p>
                      <p className="text-3xl font-bold text-white">
                        {sessionStats.questionsCompleted + 1}/{SESSION_LENGTH}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 rounded-2xl p-4 border border-purple-400/20">
                      <p className="text-purple-300 text-sm">Total Points</p>
                      <p className="text-3xl font-bold text-white">
                        {sessionStats.totalPoints.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 rounded-2xl p-4 border border-green-400/20">
                      <p className="text-green-300 text-sm">Average Score</p>
                      <p className="text-3xl font-bold text-white">
                        {sessionStats.questionsCompleted > 0 
                          ? Math.round(sessionStats.totalPoints / sessionStats.questionsCompleted).toLocaleString()
                          : '0'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Questions */}
                {sessionStats.questionResults.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                    <h3 className="text-white/80 font-semibold mb-4">Recent Questions</h3>
                    <div className="space-y-3">
                      {sessionStats.questionResults.slice(-3).reverse().map((result, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-white/5 rounded-xl p-3"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-300 truncate mr-2">
                              {result.good}
                            </span>
                            <span className="text-lg font-bold text-yellow-400">
                              {result.totalPoints}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>D: {result.demandPoints}</span>
                            <span>S: {result.supplyPoints}</span>
                            <span>T: {result.taxIncidencePoints}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Quiz Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                {currentGood && (
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                    <AnimatePresence mode="wait">
                      {currentStage === 'demand' && (
                        <motion.div
                          key="demand"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <h2 className="text-2xl font-semibold text-white mb-6">
                            Step 1: What is the price elasticity of <span className="text-blue-400">demand</span> for:
                          </h2>
                          
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl"
                          >
                            <p className="text-3xl md:text-4xl font-bold text-white text-center">
                              {currentGood.good}
                            </p>
                          </motion.div>

                          <form onSubmit={handleDemandSubmit} className="space-y-6">
                            <div>
                              <label className="block text-gray-300 font-medium mb-3">
                                Enter demand elasticity:
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={demandGuess}
                                onChange={(e) => setDemandGuess(e.target.value)}
                                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white text-xl font-medium placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                                placeholder="e.g., -0.45"
                                autoFocus
                              />
                              <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                                <span>💡 Always negative</span>
                                <span>Range: 0 to -5</span>
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit"
                              disabled={!demandGuess}
                              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                              Next: Supply Elasticity →
                            </motion.button>
                          </form>
                        </motion.div>
                      )}

                      {currentStage === 'supply' && (
                        <motion.div
                          key="supply"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <h2 className="text-2xl font-semibold text-white mb-6">
                            Step 2: What is the price elasticity of <span className="text-green-400">supply</span> for:
                          </h2>
                          
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 shadow-2xl"
                          >
                            <p className="text-3xl md:text-4xl font-bold text-white text-center">
                              {currentGood.good}
                            </p>
                          </motion.div>

                          <form onSubmit={handleSupplySubmit} className="space-y-6">
                            <div>
                              <label className="block text-gray-300 font-medium mb-3">
                                Enter supply elasticity:
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={supplyGuess}
                                onChange={(e) => setSupplyGuess(e.target.value)}
                                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white text-xl font-medium placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all duration-300"
                                placeholder="e.g., 1.2"
                                autoFocus
                              />
                              <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                                <span>💡 Always positive</span>
                                <span>Range: 0 to 5+</span>
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit"
                              disabled={!supplyGuess}
                              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                              Submit & See Results
                            </motion.button>
                          </form>
                        </motion.div>
                      )}

                      {currentStage === 'result' && (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-6"
                        >
                          {/* Points Earned */}
                          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 text-center">
                            <p className="text-white/80 text-lg mb-2">Points Earned</p>
                            <p className="text-6xl font-bold text-white mb-4">
                              {currentQuestionPoints.total.toLocaleString()}
                            </p>
                            <div className="flex justify-center space-x-6 text-sm">
                              <div>
                                <span className="text-white/70">Demand:</span>
                                <span className="text-white font-bold ml-1">{currentQuestionPoints.demand}</span>
                              </div>
                              <div>
                                <span className="text-white/70">Supply:</span>
                                <span className="text-white font-bold ml-1">{currentQuestionPoints.supply}</span>
                              </div>
                              <div>
                                <span className="text-white/70">Tax:</span>
                                <span className="text-white font-bold ml-1">{currentQuestionPoints.taxIncidence}</span>
                              </div>
                            </div>
                          </div>

                          {/* Detailed Results */}
                          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                            <h3 className="text-xl font-bold text-white mb-4">📊 Your Results</h3>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <h4 className="text-blue-400 font-semibold">Demand Elasticity</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Your Guess:</span>
                                    <span className="text-xl font-bold text-white">
                                      {parseFloat(demandGuess).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Actual:</span>
                                    <span className="text-xl font-bold text-blue-400">
                                      {currentGood.demandElasticity.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-2xl font-bold text-yellow-400">
                                      +{currentQuestionPoints.demand} pts
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="text-green-400 font-semibold">Supply Elasticity</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Your Guess:</span>
                                    <span className="text-xl font-bold text-white">
                                      {parseFloat(supplyGuess).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Actual:</span>
                                    <span className="text-xl font-bold text-green-400">
                                      {currentGood.supplyElasticity.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-2xl font-bold text-yellow-400">
                                      +{currentQuestionPoints.supply} pts
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Tax Incidence Analysis */}
                          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-6 border border-orange-400/20">
                            <h3 className="text-xl font-bold text-white mb-4">⚖️ Tax Incidence Analysis</h3>
                            
                            <div className="bg-white/10 rounded-xl p-4 mb-4">
                              <p className="text-sm text-gray-300 mb-3">If a tariff or tax is imposed on this good:</p>
                              
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-gray-400 text-sm mb-1">Based on your guesses:</p>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-gray-300">Buyers pay:</span>
                                      <span className="text-lg font-bold text-orange-400">
                                        {(parseFloat(supplyGuess) / (Math.abs(parseFloat(demandGuess)) + parseFloat(supplyGuess)) * 100).toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-gray-400 text-sm mb-1">Actual incidence:</p>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-gray-300">Buyers pay:</span>
                                      <span className="text-lg font-bold text-orange-400">
                                        {(taxIncidence * 100).toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-center pt-3 border-t border-white/10">
                                <span className="text-2xl font-bold text-yellow-400">
                                  +{currentQuestionPoints.taxIncidence} pts
                                </span>
                                <p className="text-sm text-gray-400 mt-1">for tax incidence accuracy</p>
                              </div>
                            </div>

                            <div className="text-sm text-gray-300">
                              {taxIncidence > 0.6 ? (
                                <p>
                                  Buyers are less flexible than sellers, so they bear most of the tax burden.
                                </p>
                              ) : taxIncidence < 0.4 ? (
                                <p>
                                  Sellers are less flexible than buyers, so they absorb most of the tax burden.
                                </p>
                              ) : (
                                <p>
                                  Both parties have similar flexibility, so the tax burden is relatively evenly split.
                                </p>
                              )}
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={nextQuestion}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                          >
                            {sessionStats.questionsCompleted < SESSION_LENGTH - 1 
                              ? `Next Question (${sessionStats.questionsCompleted + 2}/${SESSION_LENGTH})` 
                              : 'Complete Session'}
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Tips Section */}
          {currentStage !== 'sessionComplete' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
            >
              <h3 className="text-white font-semibold mb-3">Quick Tips:</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400">📉</span>
                  <p>Demand: Necessities are inelastic (-0.1 to -0.5)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400">💎</span>
                  <p>Demand: Luxuries are elastic (-1.5 to -5)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">🏭</span>
                  <p>Supply: Fixed capacity → inelastic (0 to 0.5)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-orange-400">⚖️</span>
                  <p>Tax incidence gives bonus points!</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Explanation Modal */}
      <AnimatePresence>
        {showExplanation && (
          <ElasticityExplanation onClose={() => setShowExplanation(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}