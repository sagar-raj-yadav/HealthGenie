import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  WaterIntake,
  StepEntry,
  WeightEntry,
  BloodPressureEntry,
  HeartRateEntry,
  Habit,
} from '../types';

// Storage keys
const WATER_INTAKE_KEY = '@health_tracker_water_intake';
const STEPS_KEY = '@health_tracker_steps';
const WEIGHT_KEY = '@health_tracker_weight';
const BLOOD_PRESSURE_KEY = '@health_tracker_blood_pressure';
const HEART_RATE_KEY = '@health_tracker_heart_rate';
const HABITS_KEY = '@health_tracker_habits';

// Water intake functions
export const saveWaterIntake = async (data: WaterIntake): Promise<void> => {
  try {
    await AsyncStorage.setItem(WATER_INTAKE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving water intake data:', error);
    throw error;
  }
};

export const getWaterIntake = async (): Promise<WaterIntake | null> => {
  try {
    const data = await AsyncStorage.getItem(WATER_INTAKE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting water intake data:', error);
    throw error;
  }
};

// Steps functions
export const saveSteps = async (data: StepEntry[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STEPS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving steps data:', error);
    throw error;
  }
};

export const getSteps = async (): Promise<StepEntry[] | null> => {
  try {
    const data = await AsyncStorage.getItem(STEPS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting steps data:', error);
    throw error;
  }
};

// Weight functions
export const saveWeight = async (data: WeightEntry[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(WEIGHT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving weight data:', error);
    throw error;
  }
};

export const getWeight = async (): Promise<WeightEntry[] | null> => {
  try {
    const data = await AsyncStorage.getItem(WEIGHT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting weight data:', error);
    throw error;
  }
};

// Blood pressure functions
export const saveBloodPressure = async (
  data: BloodPressureEntry[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(BLOOD_PRESSURE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving blood pressure data:', error);
    throw error;
  }
};

export const getBloodPressure = async (): Promise<
  BloodPressureEntry[] | null
> => {
  try {
    const data = await AsyncStorage.getItem(BLOOD_PRESSURE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting blood pressure data:', error);
    throw error;
  }
};

// Heart rate functions
export const saveHeartRate = async (
  data: HeartRateEntry[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(HEART_RATE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving heart rate data:', error);
    throw error;
  }
};

export const getHeartRate = async (): Promise<HeartRateEntry[] | null> => {
  try {
    const data = await AsyncStorage.getItem(HEART_RATE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting heart rate data:', error);
    throw error;
  }
};

// Habits functions
export const saveHabits = async (data: Habit[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving habits data:', error);
    throw error;
  }
};

export const getHabits = async (): Promise<Habit[] | null> => {
  try {
    const data = await AsyncStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting habits data:', error);
    throw error;
  }
};

// Clear all data - useful for debugging or resetting
export const clearAllData = async (): Promise<void> => {
  try {
    const keys = [
      WATER_INTAKE_KEY,
      STEPS_KEY,
      WEIGHT_KEY,
      BLOOD_PRESSURE_KEY,
      HEART_RATE_KEY,
      HABITS_KEY,
    ];
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
