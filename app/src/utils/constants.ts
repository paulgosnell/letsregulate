import { MoodType } from '../types';
import {
  Smile,
  Frown,
  Angry,
  CloudRain,
  Heart,
  Sparkles,
  AlertCircle,
  type LucideIcon
} from 'lucide-react';

export const MOOD_ICONS: Record<MoodType, LucideIcon> = {
  happy: Smile,
  sad: Frown,
  angry: Angry,
  worried: CloudRain,
  calm: Heart,
  excited: Sparkles,
  scared: AlertCircle
};

export const MOOD_COLORS: Record<MoodType, string> = {
  happy: '#FFB4A2', // peach
  sad: '#A4CAFE', // sky
  angry: '#FF8BB8', // rose
  worried: '#C4A7E7', // lavender
  calm: '#A8E6CF', // mint
  excited: '#FFB3D1', // rose-light
  scared: '#6FA3E0' // sky-dark
};

export const MOOD_LABELS: Record<MoodType, string> = {
  happy: 'Happy',
  sad: 'Sad',
  angry: 'Angry',
  worried: 'Worried',
  calm: 'Calm',
  excited: 'Excited',
  scared: 'Scared'
};

export const AFFIRMATIONS = [
  'I am calm and strong',
  'I can handle my feelings',
  'I am safe and loved',
  'I choose to feel peaceful',
  'I am brave and kind',
  'I can take deep breaths to feel better',
  'I am doing my best',
  'It\'s okay to feel my emotions',
  'I am in control of my thoughts',
  'I am worthy of care and kindness'
];

export const MOVEMENT_STEPS = [
  'Stretch your arms up high like a tree',
  'Roll your shoulders back slowly',
  'Touch your toes gently',
  'Twist left, then right',
  'Shake out your hands',
  'Take a deep breath and smile'
];

export const BREATHING_CYCLE_DURATION = 4; // seconds for each phase
export const BREATHING_CYCLES_TOTAL = 5;
export const MOVEMENT_STEP_DURATION = 10; // seconds per step

export const STARS_PER_TOOL_COMPLETION = 5;
