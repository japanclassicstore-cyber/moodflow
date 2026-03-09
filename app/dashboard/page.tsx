'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Zap, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: number;
  value: number;
}

export default function Dashboard() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('moodflow_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const stats = {
    total: entries.length,
    avg: entries.length > 0 
      ? (entries.reduce((sum, e) => sum + (e.value || 3), 0) / entries.length).toFixed(1)
      : '0',
    streak: calculateStreak(entries),
    thisWeek: entries.filter(e => {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return e.timestamp > weekAgo;
    }).length
  };

  const chartData = generateChartData(entries);

  function calculateStreak(entries: MoodEntry[]) {
    if (entries.length === 0) return 0;
    const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const entry of sorted) {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);
      const diff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === streak) {
        streak++;
        currentDate = entryDate;
      } else if (diff > streak) {
        break;
      }
    }
    return streak;
  }

  function generateChartData(entries: MoodEntry[]) {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayEntries = entries.filter(e => {
        const entryDate = new Date(e.timestamp);
        return entryDate.toDateString() === date.toDateString();
      });
      
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, e) => sum + (e.value || 3), 0) / dayEntries.length
        : 0;
      
      data.push({ date: dateStr, mood: avgMood > 0 ? avgMood : null });
    }
    return data;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your emotional journey</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, label: 'Average Mood', value: stats.avg, color: 'text-purple-500' },
            { icon: Calendar, label: 'Total Entries', value: stats.total, color: 'text-pink-500' },
            { icon: Zap, label: 'Day Streak', value: stats.streak, color: 'text-orange-500' },
            { icon: Clock, label: 'This Week', value: stats.thisWeek, color: 'text-blue-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mood Trend (30 Days)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis domain={[0, 5]} stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)', 
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="url(#gradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                  connectNulls={false}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Entries</h2>
          <div className="space-y-4">
            {entries.slice(0, 5).map((entry) => (
              <div 
                key={entry.id} 
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
              >
                <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">{entry.note || 'No note'}</p>
                  <p className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {entries.length === 0 && (
              <p className="text-gray-500 text-center py-8">No entries yet. Start tracking your mood!</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getMoodEmoji(mood: string) {
  const map: Record<string, string> = {
    amazing: '🤩', good: '😊', okay: '😐', bad: '😔', terrible: '😤'
  };
  return map[mood] || '😐';
}