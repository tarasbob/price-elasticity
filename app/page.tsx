'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Good {
  good: string;
  elasticity: number;
}

interface QuizStats {
  score: number;
  totalQuestions: number;
  streak: number;
  bestStreak: number;
  recentGuesses: Array<{ guess: number; actual: number; difference: number }>;
}

const ElasticityExplanation = ({ onClose }: { onClose: () => void }) => {
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
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
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
            Understanding Price Elasticity of Demand
          </h2>
          
          <div className="space-y-6 text-gray-700">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-3 text-gray-800">What is it?</h3>
              <p className="leading-relaxed">
                Price elasticity of demand measures how much people change their buying habits when prices change. 
                It&apos;s like a sensitivity meter - some products are very sensitive to price changes, while others aren&apos;t.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-3 text-gray-800">The Numbers Explained</h3>
              <div className="space-y-3">
                <p>• The number is always negative (people buy less when prices go up)</p>
                <p>• Closer to 0 = Less sensitive to price (inelastic)</p>
                <p>• Closer to -5 = Very sensitive to price (elastic)</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-3 text-orange-800">Inelastic Examples (-0.5 to 0)</h4>
                <ul className="space-y-2 text-sm">
                  <li>🚬 Cigarettes: People addicted buy them regardless of price</li>
                  <li>⛽ Gasoline: People need it to get to work</li>
                  <li>💊 Medicine: Health necessities</li>
                  <li>🥚 Basic foods: Essential for survival</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <h4 className="font-bold text-lg mb-3 text-purple-800">Elastic Examples (-1.5 to -5)</h4>
                <ul className="space-y-2 text-sm">
                  <li>🥤 Specific soft drinks: Easy to switch brands</li>
                  <li>✈️ Vacation travel: Can be postponed</li>
                  <li>🎬 Entertainment: Not essential</li>
                  <li>🚗 Luxury cars: Many alternatives</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-3 text-gray-800">Real World Example</h3>
              <p className="mb-3">
                If Coca-Cola has an elasticity of -3.8, it means:
              </p>
              <p className="font-semibold text-indigo-700">
                A 10% price increase → 38% decrease in sales!
              </p>
              <p className="mt-3 text-sm">
                That&apos;s why Coke rarely raises prices - people would just buy Pepsi instead.
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
  const [userGuess, setUserGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGuess || showResult) return;
    
    setShowResult(true);
    
    const guess = parseFloat(userGuess);
    const actual = currentGood!.elasticity;
    const difference = Math.abs(guess - actual);
    
    setStats(prev => {
      const newTotalQuestions = prev.totalQuestions + 1;
      const isCorrect = difference <= 0.1;
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newBestStreak = Math.max(newStreak, prev.bestStreak);
      
      const newRecentGuesses = [
        { guess, actual, difference },
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
    setShowResult(false);
    setUserGuess('');
    selectRandomGood(goods, usedGoods);
  };

  const getAccuracyInfo = () => {
    if (!userGuess || !currentGood) return { color: '', message: '', emoji: '' };
    const guess = parseFloat(userGuess);
    const actual = currentGood.elasticity;
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

  const accuracyInfo = showResult ? getAccuracyInfo() : null;

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
                Price Elasticity Quiz
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Master the art of understanding market dynamics
            </p>
            <button
              onClick={() => setShowExplanation(true)}
              className="mt-4 px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              What is Price Elasticity? 🤔
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
                  <div className="space-y-2">
                    {stats.recentGuesses.map((guess, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-400">
                          {guess.guess.toFixed(2)} → {guess.actual.toFixed(2)}
                        </span>
                        <span className={`font-semibold ${
                          guess.difference <= 0.1 ? 'text-green-400' :
                          guess.difference <= 0.3 ? 'text-yellow-400' :
                          guess.difference <= 0.5 ? 'text-orange-400' :
                          'text-red-400'
                        }`}>
                          ±{guess.difference.toFixed(2)}
                        </span>
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
                    {!showResult ? (
                      <motion.div
                        key="question"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <h2 className="text-2xl font-semibold text-white mb-6">
                          What is the price elasticity of demand for:
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div>
                            <label className="block text-gray-300 font-medium mb-3">
                              Enter your guess:
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={userGuess}
                              onChange={(e) => setUserGuess(e.target.value)}
                              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white text-xl font-medium placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                              placeholder="e.g., -0.45"
                            />
                            <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                              <span>💡 Remember: Always negative</span>
                              <span>Range: 0 to -5</span>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={!userGuess}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                          >
                            Submit Answer
                          </motion.button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        <div className={`bg-gradient-to-r ${accuracyInfo!.color} rounded-2xl p-6 text-center`}>
                          <p className="text-5xl mb-2">{accuracyInfo!.emoji}</p>
                          <p className="text-3xl font-bold text-white">{accuracyInfo!.message}</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Your Guess:</span>
                            <span className="text-2xl font-bold text-white">
                              {parseFloat(userGuess).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Actual Value:</span>
                            <span className="text-2xl font-bold text-green-400">
                              {currentGood.elasticity.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Difference:</span>
                            <span className="text-2xl font-bold text-yellow-400">
                              {Math.abs(parseFloat(userGuess) - currentGood.elasticity).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl p-4 border border-indigo-400/20">
                          <p className="text-gray-300 text-center">
                            {Math.abs(currentGood.elasticity) < 0.5 ? 
                              "This good is inelastic - people need it regardless of price!" :
                              Math.abs(currentGood.elasticity) < 1 ?
                              "This good has moderate elasticity - some sensitivity to price changes." :
                              "This good is elastic - people are very sensitive to price changes!"
                            }
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={nextQuestion}
                          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
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
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="flex items-start space-x-2">
                <span className="text-blue-400">🎯</span>
                <p>Necessities (medicine, gas) are usually inelastic (-0.1 to -0.5)</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-400">💎</span>
                <p>Luxuries and specific brands are elastic (-1.5 to -5)</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-pink-400">🔄</span>
                <p>More substitutes = more elastic (easier to switch)</p>
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