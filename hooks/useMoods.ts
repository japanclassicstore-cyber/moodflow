'use client';

import { useState, useEffect, useCallback } from 'react';
import { MoodEntry, MoodType, MOOD_VALUES } from '@/types/mood';

const STORAGE_KEY = 'moodflow_entries';

export function useMoods() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse moods:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const addEntry = useCallback((mood: MoodType, note: string, tags: string[] = []) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      note,
      timestamp: Date.now(),
      tags,
    };
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const getTodayEntries = useCallback(() => {
    const today = new Date().toDateString();
    return entries.filter(e => new Date(e.timestamp).toDateString() === today);
  }, [entries]);

  const getWeeklyStats = useCallback(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weekEntries = entries.filter(e => e.timestamp > weekAgo);
    
    if (weekEntries.length === 0) return null;

    const avgMood = weekEntries.reduce((sum, e) => sum + MOOD_VALUES[e.mood], 0) / weekEntries.length;
    const moodCounts: Record<MoodType, number> = { amazing: 0, good: 0, okay: 0, bad: 0, terrible: 0 };
    weekEntries.forEach(e => moodCounts[e.mood]++);
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0] as MoodType;

    return { average: avgMood, count: weekEntries.length, dominantMood, moodCounts };
  }, [entries]);

  const getChartData = useCallback(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(date => {
      const dayEntries = entries.filter(e => 
        new Date(e.timestamp).toISOString().split('T')[0] === date
      );
      const avgMood = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + MOOD_VALUES[e.mood], 0) / dayEntries.length
        : 0;
      return { date: date.slice(5), mood: avgMood, count: dayEntries.length };
    });
  }, [entries]);

  return {
    entries,
    isLoaded,
    addEntry,
    deleteEntry,
    getTodayEntries,
    getWeeklyStats,
    getChartData,
  };
}