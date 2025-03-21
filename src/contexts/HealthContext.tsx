import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {
  saveWaterIntake,
  getWaterIntake,
  saveSteps,
  getSteps,
  saveWeight,
  getWeight,
  saveBloodPressure,
  getBloodPressure,
  saveHeartRate,
  getHeartRate,
  saveHabits,
  getHabits,
} from '../utils/storage';
import {
  WaterIntake,
  StepEntry,
  WeightEntry,
  BloodPressureEntry,
  HeartRateEntry,
  Habit,
} from '../types';
import {formatDate} from '../utils/dateUtils';

interface HealthContextProps {
  waterIntake: WaterIntake;
  updateWaterIntake: (amount: number) => void;
  resetWaterIntake: () => void;
  steps: StepEntry[];
  addSteps: (count: number) => void;
  weightEntries: WeightEntry[];
  addWeightEntry: (weight: number) => void;
  bloodPressureEntries: BloodPressureEntry[];
  addBloodPressureEntry: (systolic: number, diastolic: number) => void;
  heartRateEntries: HeartRateEntry[];
  addHeartRateEntry: (rate: number) => void;
  habits: Habit[];
  addHabit: (name: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
  loading: boolean;
}

export const HealthContext = createContext<HealthContextProps>({
  waterIntake: {current: 0, goal: 2000, date: ''},
  updateWaterIntake: () => {},
  resetWaterIntake: () => {},
  steps: [],
  addSteps: () => {},
  weightEntries: [],
  addWeightEntry: () => {},
  bloodPressureEntries: [],
  addBloodPressureEntry: () => {},
  heartRateEntries: [],
  addHeartRateEntry: () => {},
  habits: [],
  addHabit: () => {},
  toggleHabitCompletion: () => {},
  deleteHabit: () => {},
  loading: true,
});

interface HealthProviderProps {
  children: ReactNode;
}

export const HealthProvider: React.FC<HealthProviderProps> = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [waterIntake, setWaterIntake] = useState<WaterIntake>({
    current: 0,
    goal: 2000,
    date: formatDate(new Date()),
  });
  const [steps, setSteps] = useState<StepEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [bloodPressureEntries, setBloodPressureEntries] = useState<
    BloodPressureEntry[]
  >([]);
  const [heartRateEntries, setHeartRateEntries] = useState<HeartRateEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load water intake data
        const waterData = await getWaterIntake();
        if (waterData) {
          // If the saved date is not today, reset the counter but keep the goal
          if (waterData.date !== formatDate(new Date())) {
            setWaterIntake({
              current: 0,
              goal: waterData.goal,
              date: formatDate(new Date()),
            });
          } else {
            setWaterIntake(waterData);
          }
        }

        // Load steps data
        const stepsData = await getSteps();
        if (stepsData) {
          setSteps(stepsData);
        }

        // Load weight data
        const weightData = await getWeight();
        if (weightData) {
          setWeightEntries(weightData);
        }

        // Load blood pressure data
        const bpData = await getBloodPressure();
        if (bpData) {
          setBloodPressureEntries(bpData);
        }

        // Load heart rate data
        const hrData = await getHeartRate();
        if (hrData) {
          setHeartRateEntries(hrData);
        }

        // Load habits data
        const habitsData = await getHabits();
        if (habitsData) {
          setHabits(habitsData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateWaterIntake = async (amount: number) => {
    try {
      const currentDate = formatDate(new Date());
      
      // If it's a new day, reset the counter
      if (waterIntake.date !== currentDate) {
        const newWaterIntake = {
          current: amount,
          goal: waterIntake.goal,
          date: currentDate,
        };
        setWaterIntake(newWaterIntake);
        await saveWaterIntake(newWaterIntake);
        return;
      }

      const newWaterIntake = {
        ...waterIntake,
        current: waterIntake.current + amount,
      };
      setWaterIntake(newWaterIntake);
      await saveWaterIntake(newWaterIntake);
    } catch (error) {
      console.error('Error updating water intake:', error);
    }
  };

  const resetWaterIntake = async () => {
    try {
      const newWaterIntake = {
        ...waterIntake,
        current: 0,
      };
      setWaterIntake(newWaterIntake);
      await saveWaterIntake(newWaterIntake);
    } catch (error) {
      console.error('Error resetting water intake:', error);
    }
  };

  const addSteps = async (count: number) => {
    try {
      const newStep: StepEntry = {
        id: Date.now().toString(),
        count,
        date: new Date().toISOString(),
      };
      const updatedSteps = [...steps, newStep];
      setSteps(updatedSteps);
      await saveSteps(updatedSteps);
    } catch (error) {
      console.error('Error adding steps:', error);
    }
  };

  const addWeightEntry = async (weight: number) => {
    try {
      const newEntry: WeightEntry = {
        id: Date.now().toString(),
        weight,
        date: new Date().toISOString(),
      };
      const updatedEntries = [...weightEntries, newEntry];
      setWeightEntries(updatedEntries);
      await saveWeight(updatedEntries);
    } catch (error) {
      console.error('Error adding weight entry:', error);
    }
  };

  const addBloodPressureEntry = async (systolic: number, diastolic: number) => {
    try {
      const newEntry: BloodPressureEntry = {
        id: Date.now().toString(),
        systolic,
        diastolic,
        date: new Date().toISOString(),
      };
      const updatedEntries = [...bloodPressureEntries, newEntry];
      setBloodPressureEntries(updatedEntries);
      await saveBloodPressure(updatedEntries);
    } catch (error) {
      console.error('Error adding blood pressure entry:', error);
    }
  };

  const addHeartRateEntry = async (rate: number) => {
    try {
      const newEntry: HeartRateEntry = {
        id: Date.now().toString(),
        rate,
        date: new Date().toISOString(),
      };
      const updatedEntries = [...heartRateEntries, newEntry];
      setHeartRateEntries(updatedEntries);
      await saveHeartRate(updatedEntries);
    } catch (error) {
      console.error('Error adding heart rate entry:', error);
    }
  };

  const addHabit = async (name: string) => {
    try {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name,
        created: new Date().toISOString(),
        completedDates: [],
      };
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const toggleHabitCompletion = async (id: string, date: string) => {
    try {
      const updatedHabits = habits.map(habit => {
        if (habit.id === id) {
          const dateExists = habit.completedDates.includes(date);
          return {
            ...habit,
            completedDates: dateExists
              ? habit.completedDates.filter(d => d !== date)
              : [...habit.completedDates, date],
          };
        }
        return habit;
      });
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
    } catch (error) {
      console.error('Error toggling habit completion:', error);
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      const updatedHabits = habits.filter(habit => habit.id !== id);
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  return (
    <HealthContext.Provider
      value={{
        waterIntake,
        updateWaterIntake,
        resetWaterIntake,
        steps,
        addSteps,
        weightEntries,
        addWeightEntry,
        bloodPressureEntries,
        addBloodPressureEntry,
        heartRateEntries,
        addHeartRateEntry,
        habits,
        addHabit,
        toggleHabitCompletion,
        deleteHabit,
        loading,
      }}>
      {children}
    </HealthContext.Provider>
  );
};
