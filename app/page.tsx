
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const moods = [
  { emoji: '🤩', label: 'Amazing', color: '#8B5CF6' },
  { emoji: '😊', label: 'Happy', color: '#EC4899' },
  { emoji: '😐', label: 'Okay', color: '#F97316' },
  { emoji: '😔', label: 'Sad', color: '#6366F1' },
  { emoji: '😤', label: 'Frustrated', color: '#EF4444' },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#F97316] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
            MoodFlow
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
            Track your emotions, understand your patterns, and flow through life with greater self-awareness
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 text-center">
            How are you feeling today?
          </h2>

          <div className="grid grid-cols-5 gap-4 md:gap-6 mb-8">
            {moods.map((mood, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(index)}
                className={`backdrop-blur-lg rounded-2xl p-4 md:p-6 transition-all duration-300 border-2 ${
                  selectedMood === index
                    ? 'bg-white/30 border-white shadow-lg'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="text-4xl md:text-5xl mb-2">{mood.emoji}</div>
                <div className="text-xs md:text-sm text-white font-medium">
                  {mood.label}
                </div>
              </motion.button>
            ))}
          </div>

          {selectedMood !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 border border-white/30"
            >
              <p className="text-white text-center text-lg">
                You're feeling{' '}
                <span className="font-bold">{moods[selectedMood].label}</span>{' '}
                <span className="text-3xl ml-2">{moods[selectedMood].emoji}</span>
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          {[
            { title: 'Daily Tracking', desc: 'Log your mood every day' },
            { title: 'Insights', desc: 'Discover emotional patterns' },
            { title: 'Growth', desc: 'Improve your wellbeing' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 text-center"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/80 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}


