'use client';

import { useState } from 'react';

const moods = [
  { emoji: '🤩', label: 'Amazing', color: '#F97316', value: 5 },
  { emoji: '😊', label: 'Good', color: '#8B5CF6', value: 4 },
  { emoji: '😐', label: 'Okay', color: '#6B7280', value: 3 },
  { emoji: '😔', label: 'Bad', color: '#3B82F6', value: 2 },
  { emoji: '😤', label: 'Terrible', color: '#EF4444', value: 1 },
];

interface MoodSelectorProps {
  onSelect?: (mood: typeof moods[0]) => void;
  selected?: number | null;
}

export default function MoodSelector({ onSelect, selected }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(selected ?? null);

  const handleSelect = (index: number) => {
    setSelectedMood(index);
    onSelect?.(moods[index]);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {moods.map((mood, index) => (
        <button
          key={mood.label}
          onClick={() => handleSelect(index)}
          className={`
            relative p-6 rounded-2xl transition-all duration-300 transform
            ${selectedMood === index 
              ? 'scale-110 bg-white shadow-2xl' 
              : 'bg-white/20 hover:bg-white/30 hover:scale-105'
            }
          `}
          style={{
            boxShadow: selectedMood === index ? `0 0 30px ${mood.color}40` : undefined
          }}
        >
          <span className="text-5xl block mb-2">{mood.emoji}</span>
          <span 
            className="text-sm font-medium block"
            style={{ color: selectedMood === index ? mood.color : 'white' }}
          >
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}