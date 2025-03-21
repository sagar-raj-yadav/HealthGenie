import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthData } from '../types';

// Storage Keys
const HEALTH_DATA_KEY = 'healthData';

// Get all health data
export const getHealthData = async (): Promise<HealthData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HEALTH_DATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting health data:', e);
    return null;
  }
};

// Save all health data
export const saveHealthData = async (data: HealthData): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(HEALTH_DATA_KEY, jsonValue);
    return true;
  } catch (e) {
    console.error('Error saving health data:', e);
    return false;
  }
};

// Clear all health data (useful for debugging/testing)
export const clearHealthData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(HEALTH_DATA_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing health data:', e);
    return false;
  }
};

// Get data for a specific date
export const getDataForDate = async (
  date: string,
  dataType: keyof HealthData
): Promise<any[]> => {
  try {
    const healthData = await getHealthData();
    if (!healthData) return [];

    return (healthData[dataType] as any[]).filter((item) => item.date === date);
  } catch (e) {
    console.error(`Error getting ${dataType} for date ${date}:`, e);
    return [];
  }
};
