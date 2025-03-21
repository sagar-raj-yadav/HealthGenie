// Basic health data types
export interface WaterIntake {
  id: string;
  amount: number; // in ml
  timestamp: string;
  date: string;
}

export interface StepCount {
  id: string;
  count: number;
  date: string;
  timestamp: string;
}

export interface Weight {
  id: string;
  value: number; // in kg
  date: string;
  timestamp: string;
  note?: string;
}

export interface BloodPressure {
  id: string;
  systolic: number;
  diastolic: number;
  date: string;
  timestamp: string;
  note?: string;
}

export interface HeartRate {
  id: string;
  bpm: number;
  date: string;
  timestamp: string;
  note?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: string[]; // days of week or specific days
  createdAt: string;
  completedDates: string[]; // dates when the habit was completed
  color?: string; // for categorization/display
}

// Aggregate type
export interface HealthData {
  waterIntake: WaterIntake[];
  stepCounts: StepCount[];
  weights: Weight[];
  bloodPressures: BloodPressure[];
  heartRates: HeartRate[];
  habits: Habit[];
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  WaterIntake: undefined;
  StepCount: undefined;
  Weight: undefined;
  BloodPressure: undefined;
  HeartRate: undefined;
  HabitTracking: undefined;
};
