import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useHealthData} from '../contexts/HealthDataContext';
import {validateStepCount} from '../utils/validation';
import {getTodayDate, getTimestamp, formatDateForDisplay, getDateRange} from '../utils/dateUtils';
import {ProgressChart} from '../components/ProgressChart';
import colors from '../styles/colors';

const StepCountScreen: React.FC = () => {
  const {stepCounts, addStepCount} = useHealthData();
  const [stepCount, setStepCount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dailyGoal, setDailyGoal] = useState('10000'); // Default 10,000 steps
  const [todaySteps, setTodaySteps] = useState(0);

  useEffect(() => {
    calculateTodaySteps();
  }, [stepCounts]);

  const calculateTodaySteps = () => {
    const today = getTodayDate();
    const todayEntries = stepCounts.filter(entry => entry.date === today);
    if (todayEntries.length > 0) {
      // Get the latest entry for today
      const sortedEntries = [...todayEntries].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setTodaySteps(sortedEntries[0].count);
    } else {
      setTodaySteps(0);
    }
  };

  const handleAddStepCount = () => {
    // Validate input
    const validationError = validateStepCount(stepCount);
    if (validationError) {
      setError(validationError);
      return;
    }

    const stepsValue = parseInt(stepCount, 10);
    const today = getTodayDate();
    const timestamp = getTimestamp();

    // Add step count
    addStepCount({
      id: `steps-${timestamp}`,
      count: stepsValue,
      date: today,
      timestamp,
    }).then(() => {
      setStepCount('');
      setError(null);
      Alert.alert('Success', 'Step count updated successfully!');
    }).catch(err => {
      Alert.alert('Error', 'Failed to save step count.');
      console.error(err);
    });
  };

  const getWeeklyData = () => {
    const last7Days = getDateRange(7);
    const data = last7Days.map(date => {
      const entriesForDay = stepCounts.filter(entry => entry.date === date);
      if (entriesForDay.length > 0) {
        // Get the latest entry for this day
        const sortedEntries = [...entriesForDay].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        return {
          date,
          value: sortedEntries[0].count,
          label: date.split('-')[2], // Just the day
        };
      }
      return {
        date,
        value: 0,
        label: date.split('-')[2], // Just the day
      };
    });
    return data;
  };

  const progress = Math.min(todaySteps / parseInt(dailyGoal, 10), 1);
  const weeklyData = getWeeklyData();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Step Counter</Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>{todaySteps}</Text>
          <Text style={styles.progressLabel}>steps today</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
        </View>
        <Text style={styles.goalText}>
          Goal: {dailyGoal} steps ({Math.round(progress * 100)}%)
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Last 7 Days</Text>
        <ProgressChart data={weeklyData} goalValue={parseInt(dailyGoal, 10)} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Daily Goal:</Text>
        <TextInput
          style={styles.input}
          value={dailyGoal}
          onChangeText={setDailyGoal}
          keyboardType="number-pad"
          placeholder="Set your daily step goal"
        />
        
        <Text style={styles.label}>Current Step Count:</Text>
        <TextInput
          style={styles.input}
          value={stepCount}
          onChangeText={setStepCount}
          keyboardType="number-pad"
          placeholder="Enter today's step count"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddStepCount}>
          <Text style={styles.addButtonText}>Update Step Count</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>History</Text>
        {stepCounts.length > 0 ? (
          [...stepCounts]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 7)
            .map((entry) => (
              <View key={entry.id} style={styles.historyItem}>
                <Text style={styles.historyDate}>{formatDateForDisplay(entry.date)}</Text>
                <Text style={styles.historySteps}>{entry.count} steps</Text>
              </View>
            ))
        ) : (
          <Text style={styles.emptyText}>No step count records yet</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  progressContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  progressCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  goalText: {
    fontSize: 16,
    color: colors.text,
  },
  chartContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  inputContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: colors.inputBackground,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
  },
  historyDate: {
    color: colors.textSecondary,
  },
  historySteps: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginVertical: 20,
    fontStyle: 'italic',
  },
});

export default StepCountScreen;
