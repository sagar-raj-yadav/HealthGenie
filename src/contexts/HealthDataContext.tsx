import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  WaterIntake,
  StepCount,
  Weight,
  BloodPressure,
  HeartRate,
  Habit,
  HealthData,
} from '../types';

interface HealthDataContextType {
  healthData: HealthData;
  waterIntake: WaterIntake[];
  stepCounts: StepCount[];
  weights: Weight[];
  bloodPressures: BloodPressure[];
  heartRates: HeartRate[];
  habits: Habit[];
  addWaterIntake: (intake: WaterIntake) => Promise<void>;
  addStepCount: (steps: StepCount) => Promise<void>;
  addWeight: (weight: Weight) => Promise<void>;
  addBloodPressure: (bp: BloodPressure) => Promise<void>;
  addHeartRate: (hr: HeartRate) => Promise<void>;
  addHabit: (habit: Habit) => Promise<void>;
  updateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  toggleHabitCompletion: (habitId: string, date: string) => Promise<void>;
  isLoading: boolean;
}

const defaultHealthData: HealthData = {
  waterIntake: [],
  stepCounts: [],
  weights: [],
  bloodPressures: [],
  heartRates: [],
  habits: [],
};

const HealthDataContext = createContext<HealthDataContextType | undefined>(
  undefined,
);

export const HealthDataProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [healthData, setHealthData] = useState<HealthData>(defaultHealthData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem('healthData');
        if (data) {
          setHealthData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Failed to load health data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const saveHealthData = async (data: HealthData) => {
    try {
      await AsyncStorage.setItem('healthData', JSON.stringify(data));
      setHealthData(data);
    } catch (error) {
      console.error('Failed to save health data:', error);
    }
  };

  const addWaterIntake = async (intake: WaterIntake) => {
    const updatedData = {
      ...healthData,
      waterIntake: [...healthData.waterIntake, intake],
    };
    await saveHealthData(updatedData);
  };

  const addStepCount = async (steps: StepCount) => {
    const updatedData = {
      ...healthData,
      stepCounts: [...healthData.stepCounts, steps],
    };
    await saveHealthData(updatedData);
  };

  const addWeight = async (weight: Weight) => {
    const updatedData = {
      ...healthData,
      weights: [...healthData.weights, weight],
    };
    await saveHealthData(updatedData);
  };

  const addBloodPressure = async (bp: BloodPressure) => {
    const updatedData = {
      ...healthData,
      bloodPressures: [...healthData.bloodPressures, bp],
    };
    await saveHealthData(updatedData);
  };

  const addHeartRate = async (hr: HeartRate) => {
    const updatedData = {
      ...healthData,
      heartRates: [...healthData.heartRates, hr],
    };
    await saveHealthData(updatedData);
  };

  const addHabit = async (habit: Habit) => {
    const updatedData = {
      ...healthData,
      habits: [...healthData.habits, habit],
    };
    await saveHealthData(updatedData);
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    const updatedHabits = healthData.habits.map((habit) =>
      habit.id === habitId ? {...habit, ...updates} : habit,
    );
    const updatedData = {
      ...healthData,
      habits: updatedHabits,
    };
    await saveHealthData(updatedData);
  };

  const deleteHabit = async (habitId: string) => {
    const updatedHabits = healthData.habits.filter(
      (habit) => habit.id !== habitId,
    );
    const updatedData = {
      ...healthData,
      habits: updatedHabits,
    };
    await saveHealthData(updatedData);
  };

  const toggleHabitCompletion = async (habitId: string, date: string) => {
    const updatedHabits = healthData.habits.map((habit) => {
      if (habit.id === habitId) {
        const completedDates = habit.completedDates || [];
        const dateIndex = completedDates.indexOf(date);
        
        if (dateIndex >= 0) {
          // Remove the date if it's already there (toggle off)
          return {
            ...habit,
            completedDates: [
              ...completedDates.slice(0, dateIndex),
              ...completedDates.slice(dateIndex + 1),
            ],
          };
        } else {
          // Add the date if it's not there (toggle on)
          return {
            ...habit,
            completedDates: [...completedDates, date],
          };
        }
      }
      return habit;
    });

    const updatedData = {
      ...healthData,
      habits: updatedHabits,
    };
    await saveHealthData(updatedData);
  };

  const value: HealthDataContextType = {
    healthData,
    waterIntake: healthData.waterIntake,
    stepCounts: healthData.stepCounts,
    weights: healthData.weights,
    bloodPressures: healthData.bloodPressures,
    heartRates: healthData.heartRates,
    habits: healthData.habits,
    addWaterIntake,
    addStepCount,
    addWeight,
    addBloodPressure,
    addHeartRate,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    isLoading,
  };

  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (context === undefined) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};
