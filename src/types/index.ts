export interface WaterIntake {
  current: number;
  goal: number;
  date: string;
}

export interface StepEntry {
  id: string;
  count: number;
  date: string;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

export interface BloodPressureEntry {
  id: string;
  systolic: number;
  diastolic: number;
  date: string;
}

export interface HeartRateEntry {
  id: string;
  rate: number;
  date: string;
}

export interface Habit {
  id: string;
  name: string;
  created: string;
  completedDates: string[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}
