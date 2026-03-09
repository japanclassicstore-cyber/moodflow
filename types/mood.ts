```typescript
// Mood Types
export type MoodType = 'amazing' | 'good' | 'okay' | 'bad' | 'terrible';

// Mood Interface
export interface Mood {
  id: MoodType;
  emoji: string;
  label: string;
  color: string;
}

// Mood Entry Interface
export interface MoodEntry {
  id: string;
  mood: MoodType;
  note?: string;
  timestamp: Date;
  tags?: string[];
}

// Moods Data
export const MOODS: Mood[] = [
  {
    id: 'amazing',
    emoji: '🤩',
    label: 'Amazing',
    color: '#10b981', // green-500
  },
  {
    id: 'good',
    emoji: '😊',
    label: 'Good',
    color: '#3b82f6', // blue-500
  },
  {
    id: 'okay',
    emoji: '😐',
    label: 'Okay',
    color: '#f59e0b', // amber-500
  },
  {
    id: 'bad',
    emoji: '😞',
    label: 'Bad',
    color: '#f97316', // orange-500
  },
  {
    id: 'terrible',
    emoji: '😢',
    label: 'Terrible',
    color: '#ef4444', // red-500
  },
];
```