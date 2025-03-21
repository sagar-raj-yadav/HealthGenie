// Validate water intake input
export const validateWaterIntake = (amount: string): string | null => {
  const value = parseFloat(amount);
  if (isNaN(value)) {
    return 'Please enter a valid number';
  }
  if (value <= 0) {
    return 'Water intake must be greater than 0';
  }
  if (value > 10000) {
    return 'Water intake cannot exceed 10 liters (10,000 ml)';
  }
  return null; // No error
};

// Validate step count input
export const validateStepCount = (steps: string): string | null => {
  const value = parseInt(steps, 10);
  if (isNaN(value)) {
    return 'Please enter a valid number';
  }
  if (value < 0) {
    return 'Step count cannot be negative';
  }
  if (value > 100000) {
    return 'Step count seems too high';
  }
  return null; // No error
};

// Validate weight input
export const validateWeight = (weight: string): string | null => {
  const value = parseFloat(weight);
  if (isNaN(value)) {
    return 'Please enter a valid number';
  }
  if (value <= 0) {
    return 'Weight must be greater than 0';
  }
  if (value > 500) {
    return 'Weight seems too high';
  }
  return null; // No error
};

// Validate blood pressure input
export const validateBloodPressure = (
  systolic: string,
  diastolic: string
): string | null => {
  const systolicValue = parseInt(systolic, 10);
  const diastolicValue = parseInt(diastolic, 10);

  if (isNaN(systolicValue) || isNaN(diastolicValue)) {
    return 'Please enter valid numbers';
  }
  if (systolicValue <= 0 || diastolicValue <= 0) {
    return 'Blood pressure values must be greater than 0';
  }
  if (systolicValue < diastolicValue) {
    return 'Systolic should be higher than diastolic';
  }
  if (systolicValue > 300) {
    return 'Systolic value seems too high';
  }
  if (diastolicValue > 200) {
    return 'Diastolic value seems too high';
  }
  return null; // No error
};

// Validate heart rate input
export const validateHeartRate = (heartRate: string): string | null => {
  const value = parseInt(heartRate, 10);
  if (isNaN(value)) {
    return 'Please enter a valid number';
  }
  if (value <= 0) {
    return 'Heart rate must be greater than 0';
  }
  if (value > 250) {
    return 'Heart rate seems too high';
  }
  return null; // No error
};

// Validate habit name
export const validateHabitName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Habit name cannot be empty';
  }
  if (name.length > 50) {
    return 'Habit name is too long (max 50 characters)';
  }
  return null; // No error
};
