'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Tag } from 'lucide-react';
import MoodSelector from '@/components/MoodSelector';

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: number;
  value: number;
  tags: string[];
}

const availableTags = ['Work', 'Family', 'Health', 'Social', 'Sleep', 'Exercise', 'Food'];

export default function Journal() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMood, setSelectedMood] = useState<{label: string, value: number} | null>(null);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('moodflow_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moodflow_entries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood.label.toLowerCase(),
      note,
      timestamp: Date.now(),
      value: selectedMood.value,
      tags: selectedTags
    };

    setEntries([newEntry, ...entries]);
    setNote('');
    setSelectedMood(null);
    setSelectedTags([]);
    setShowForm(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const filteredEntries = entries.filter(entry => 
    entry.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.mood.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Journal</h1>
          <p className="text-gray-600 dark:text-gray-400">Record your thoughts and feelings</p>
        </motion.div>

        {/* Search and Add */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            New Entry
          </button>
        </div>

        {/* Add Entry Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How are you feeling?</h3>
              
              <MoodSelector onSelect={setSelectedMood} />
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTags(prev => 
                          prev.includes(tag) 
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedMood}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Entry
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries List */}
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{getMoodEmoji(entry.mood)}</span>
                  <div>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {entry.note || <span className="text-gray-400 italic">No note</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {entry.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full"
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          
          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">{searchTerm ? 'No entries found' : 'Start journaling your moods!'}</p>
            </div>
          )}
        </div>
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