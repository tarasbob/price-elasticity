'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Good {
  good: string;
  demandElasticity: number;
  supplyElasticity: number;
}

interface QuizStats {
  score: number;
  totalQuestions: number;
  streak: number;
  bestStreak: number;
  recentGuesses: Array<{ 
    demandGuess: number; 
    demandActual: number; 
    supplyGuess: number;
    supplyActual: number;
    taxIncidence: number;
  }>;
}

type QuizStage = 'demand' | 'supply' | 'result';

const ElasticityExplanation = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <span className="text-gray-600 text-xl">×</span>
          </button>
          
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Understanding Economic Elasticities & Tax Incidence
          </h2>
          
          <div className="space-y-6 text-gray-700">
            {/* Demand Elasticity Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-3 text-gray-800">📉 Price Elasticity of Demand</h3>
              <p className="leading-relaxed mb-3">
                Measures how much consumers change their purchasing when prices change. Think of it as "consumer sensitivity to price."
              </p>
              <div className="bg-white/50 rounded-xl p-4 space-y-2 text-sm">
                <p>• <strong>Always negative</strong> (higher price → lower quantity demanded)</p>
                <p>• <strong>-0.1 to -0.5:</strong> Inelastic (necessities, addictions)</p>
                <p>• <strong>-0.5 to -1.5:</strong> Moderate elasticity</p>
                <p>• <strong>-1.5 to -5:</strong> Very elastic (luxuries, many substitutes)</p>
              </div>
            </div>
            
            {/* Supply Elasticity Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-3 text-gray-800">📈 Price Elasticity of Supply</h3>
              <p className="leading-relaxed mb-3">
                Measures how much producers change their output when prices change. Think of it as "producer flexibility."
              </p>
              <div className="bg-white/50 rounded-xl p-4 space-y-2 text-sm">
                <p>• <strong>Always positive</strong> (higher price → more quantity supplied)</p>
                <p>• <strong>0 to 0.5:</strong> Inelastic (hard to increase production)</p>
                <p>• <strong>0.5 to 1.5:</strong> Moderate elasticity</p>
                <p>• <strong>1.5+:</strong> Very elastic (easy to ramp up production)</p>
              </div>
            </div>

            {/* Tax Incidence Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-3 text-gray-800">⚖️ Tax Incidence (Who Really Pays?)</h3>
              <p className="leading-relaxed mb-3">
                When a tariff or tax is imposed, who actually bears the cost? The formula:
              </p>
              <div className="bg-white/70 rounded-xl p-4 text-center mb-4">
                <p className="text-lg font-mono">
                  Buyer's Share = Supply Elasticity ÷ (|Demand Elasticity| + Supply Elasticity)
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <p>• <strong>Result = 80%:</strong> Importers/buyers pay 80% of the tariff through higher prices</p>
                <p>• <strong>Result = 20%:</strong> Importers only pay 20% (exporters absorb 80%)</p>
                <p className="italic text-gray-600">The less flexible party (lower elasticity) bears more of the tax burden!</p>
              </div>
            </div>
            
            {/* Real World Examples */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-3 text-gray-800">🌍 Real World Example</h3>
              <p className="mb-3">
                <strong>Oil tariff:</strong> Demand elasticity = -0.4, Supply elasticity = 0.15
              </p>
              <p className="mb-2">
                Tax incidence = 0.15 ÷ (0.4 + 0.15) = 27%
              </p>
              <p className="text-sm">
                → Importers only pay 27% of the tariff. Oil producers (exporters) absorb 73% because they have limited flexibility to reduce production!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
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
  const [stats, setStats] = useState<QuizStats>({
    score: 0,
    totalQuestions: 0,
    streak: 0,
    bestStreak: 0,
    recentGuesses: []
  });

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
    
    // Calculate tax incidence
    const taxIncidence = supplyActual / (Math.abs(demandActual) + supplyActual);
    
    const demandDiff = Math.abs(demandGuessNum - demandActual);
    const supplyDiff = Math.abs(supplyGuessNum - supplyActual);
    
    setStats(prev => {
      const newTotalQuestions = prev.totalQuestions + 1;
      const isCorrect = demandDiff <= 0.1 && supplyDiff <= 0.1;
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newBestStreak = Math.max(newStreak, prev.bestStreak);
      
      const newRecentGuesses = [
        { 
          demandGuess: demandGuessNum, 
          demandActual, 
          supplyGuess: supplyGuessNum,
          supplyActual,
          taxIncidence
        },
        ...prev.recentGuesses.slice(0, 4)
      ];
      
      return {
        score: newScore,
        totalQuestions: newTotalQuestions,
        streak: newStreak,
        bestStreak: newBestStreak,
        recentGuesses: newRecentGuesses
      };
    });
  };

  const nextQuestion = () => {
    if (currentGood) {
      setUsedGoods(prev => new Set([...prev, currentGood.good]));
    }
    setCurrentStage('demand');
    setDemandGuess('');
    setSupplyGuess('');
    selectRandomGood(goods, usedGoods);
  };

  const getAccuracyInfo = (guess: number, actual: number) => {
    const difference = Math.abs(guess - actual);
    
    if (difference <= 0.1) return { 
      color: 'from-green-500 to-emerald-500', 
      message: 'Excellent!', 
      emoji: '🎯' 
    };
    if (difference <= 0.3) return { 
      color: 'from-yellow-500 to-amber-500', 
      message: 'Very close!', 
      emoji: '⭐' 
    };
    if (difference <= 0.5) return { 
      color: 'from-orange-500 to-orange-600', 
      message: 'Good try!', 
      emoji: '👍' 
    };
    return { 
      color: 'from-red-500 to-rose-500', 
      message: 'Keep practicing!', 
      emoji: '💪' 
    };
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

  const demandAccuracy = currentStage === 'result' ? getAccuracyInfo(parseFloat(demandGuess), currentGood!.demandElasticity) : null;
  const supplyAccuracy = currentStage === 'result' ? getAccuracyInfo(parseFloat(supplyGuess), currentGood!.supplyElasticity) : null;
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

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Stats Panel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-4"
            >
              {/* Score Cards */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <h3 className="text-white/80 font-semibold mb-4 text-center">Your Progress</h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-2xl p-4 border border-blue-400/20">
                    <p className="text-blue-300 text-sm">Score</p>
                    <p className="text-3xl font-bold text-white">{stats.score}/{stats.totalQuestions}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 rounded-2xl p-4 border border-green-400/20">
                    <p className="text-green-300 text-sm">Accuracy</p>
                    <p className="text-3xl font-bold text-white">
                      {stats.totalQuestions > 0 ? Math.round((stats.score / stats.totalQuestions) * 100) : 0}%
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 rounded-2xl p-4 border border-purple-400/20">
                    <p className="text-purple-300 text-sm">Current Streak</p>
                    <p className="text-3xl font-bold text-white">{stats.streak} 🔥</p>
                  </div>
                  <div className="bg-gradient-to-r from-pink-600/20 to-pink-500/20 rounded-2xl p-4 border border-pink-400/20">
                    <p className="text-pink-300 text-sm">Best Streak</p>
                    <p className="text-3xl font-bold text-white">{stats.bestStreak} ⭐</p>
                  </div>
                </div>
              </div>

              {/* Recent Guesses */}
              {stats.recentGuesses.length > 0 && (
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                  <h3 className="text-white/80 font-semibold mb-4">Recent Attempts</h3>
                  <div className="space-y-3">
                    {stats.recentGuesses.map((guess, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-sm space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Demand:</span>
                          <span className="text-white">
                            {guess.demandGuess.toFixed(2)} → {guess.demandActual.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Supply:</span>
                          <span className="text-white">
                            {guess.supplyGuess.toFixed(2)} → {guess.supplyActual.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Tax on buyer:</span>
                          <span className="text-yellow-400 font-semibold">
                            {(guess.taxIncidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="border-t border-white/10 mt-1"></div>
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
                        {/* Overall Performance */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className={`bg-gradient-to-r ${demandAccuracy!.color} rounded-2xl p-6 text-center`}>
                            <p className="text-3xl mb-2">{demandAccuracy!.emoji}</p>
                            <p className="text-xl font-bold text-white">Demand: {demandAccuracy!.message}</p>
                          </div>
                          <div className={`bg-gradient-to-r ${supplyAccuracy!.color} rounded-2xl p-6 text-center`}>
                            <p className="text-3xl mb-2">{supplyAccuracy!.emoji}</p>
                            <p className="text-xl font-bold text-white">Supply: {supplyAccuracy!.message}</p>
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
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tax Incidence Calculation */}
                        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-6 border border-orange-400/20">
                          <h3 className="text-xl font-bold text-white mb-4">⚖️ Tax Incidence Analysis</h3>
                          
                          <div className="bg-white/10 rounded-xl p-4 mb-4">
                            <p className="text-sm text-gray-300 mb-2">If a tariff or tax is imposed on this good:</p>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">Importers/Buyers pay:</span>
                                <span className="text-2xl font-bold text-orange-400">
                                  {(taxIncidence * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300">Exporters/Sellers absorb:</span>
                                <span className="text-2xl font-bold text-red-400">
                                  {((1 - taxIncidence) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-gray-300 space-y-2">
                            <p>
                              <strong>Why this split?</strong> The party that's less flexible (lower elasticity) 
                              bears more of the tax burden.
                            </p>
                            {taxIncidence > 0.6 ? (
                              <p>
                                In this case, <span className="text-orange-400 font-semibold">buyers are less flexible</span> than 
                                sellers, so they end up paying most of the tariff through higher prices.
                              </p>
                            ) : taxIncidence < 0.4 ? (
                              <p>
                                In this case, <span className="text-red-400 font-semibold">sellers are less flexible</span> than 
                                buyers, so they absorb most of the tariff by accepting lower prices.
                              </p>
                            ) : (
                              <p>
                                In this case, both parties have similar flexibility, so the tax burden is 
                                <span className="text-yellow-400 font-semibold"> relatively evenly split</span>.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Market Insights */}
                        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl p-6 border border-indigo-400/20">
                          <h3 className="text-lg font-bold text-white mb-3">💡 Market Insights</h3>
                          <div className="space-y-3 text-sm text-gray-300">
                            {Math.abs(currentGood.demandElasticity) < 0.5 && (
                              <p>
                                • <strong className="text-blue-400">Inelastic demand:</strong> Consumers need this product 
                                and have few alternatives. Price increases won't significantly reduce consumption.
                              </p>
                            )}
                            {Math.abs(currentGood.demandElasticity) >= 1.5 && (
                              <p>
                                • <strong className="text-blue-400">Elastic demand:</strong> Consumers are very price-sensitive. 
                                Small price increases lead to large drops in consumption.
                              </p>
                            )}
                            {currentGood.supplyElasticity < 0.5 && (
                              <p>
                                • <strong className="text-green-400">Inelastic supply:</strong> Producers can't easily 
                                adjust production. It might be due to limited resources or production capacity.
                              </p>
                            )}
                            {currentGood.supplyElasticity >= 1.5 && (
                              <p>
                                • <strong className="text-green-400">Elastic supply:</strong> Producers can easily 
                                increase or decrease production in response to price changes.
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
                          Next Question →
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>

          {/* Tips Section */}
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
                <p>Less flexible party pays more tax</p>
              </div>
            </div>
          </motion.div>
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