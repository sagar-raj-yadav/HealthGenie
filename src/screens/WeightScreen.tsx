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
import {validateWeight} from '../utils/validation';
import {getTodayDate, getTimestamp, formatDateForDisplay, getDateRange} from '../utils/dateUtils';
import {ProgressChart} from '../components/ProgressChart';
import colors from '../styles/colors';

const WeightScreen: React.FC = () => {
  const {weights, addWeight} = useHealthData();
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [goalWeight, setGoalWeight] = useState('');
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');

  useEffect(() => {
    // Set initial goal weight based on latest entry if available
    if (weights.length > 0 && !goalWeight) {
      const sortedWeights = [...weights].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setGoalWeight((sortedWeights[0].value * 0.9).toFixed(1)); // 10% less than current as a default goal
    }
  }, [weights]);

  const handleAddWeight = () => {
    // Validate input
    const validationError = validateWeight(weight);
    if (validationError) {
      setError(validationError);
      return;
    }

    const weightValue = parseFloat(weight);
    const today = getTodayDate();
    const timestamp = getTimestamp();

    // Add weight
    addWeight({
      id: `weight-${timestamp}`,
      value: weightValue,
      date: today,
      timestamp,
      note: note.trim() || undefined,
    }).then(() => {
      setWeight('');
      setNote('');
      setError(null);
      Alert.alert('Success', 'Weight record added successfully!');
    }).catch(err => {
      Alert.alert('Error', 'Failed to save weight record.');
      console.error(err);
    });
  };

  const getLatestWeight = (): number | null => {
    if (weights.length === 0) return null;
    
    const sortedWeights = [...weights].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return sortedWeights[0].value;
  };

  const getTrendData = () => {
    const days = timeframe === 'week' ? 7 : 30;
    const dateRange = getDateRange(days);
    
    // Create a map with the latest weight entry for each date
    const weightByDate = new Map<string, number>();
    
    weights.forEach(entry => {
      if (!weightByDate.has(entry.date) || 
          new Date(entry.timestamp).getTime() > 
          new Date(weights.find(w => w.date === entry.date)?.timestamp || 0).getTime()) {
        weightByDate.set(entry.date, entry.value);
      }
    });
    
    // Create data points for the chart
    const data = dateRange.map(date => {
      return {
        date,
        value: weightByDate.get(date) || 0,
        label: date.split('-')[2], // Just the day
      };
    });
    
    // Filter out days without data
    return data.filter(item => item.value > 0);
  };

  const latestWeight = getLatestWeight();
  const trendData = getTrendData();
  const isGoalReached = latestWeight !== null && goalWeight !== '' && latestWeight <= parseFloat(goalWeight);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weight Tracker</Text>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Current</Text>
          <Text style={styles.summaryValue}>
            {latestWeight !== null ? `${latestWeight} kg` : '-'}
          </Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Goal</Text>
          <TextInput
            style={styles.goalInput}
            value={goalWeight}
            onChangeText={setGoalWeight}
            keyboardType="numeric"
            placeholder="Set goal"
          />
        </View>
        
        {latestWeight !== null && goalWeight !== '' && (
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>To Go</Text>
            <Text style={[
              styles.summaryValue,
              isGoalReached ? styles.goalReached : styles.goalNotReached
            ]}>
              {isGoalReached ? 'Goal reached!' : `${(latestWeight - parseFloat(goalWeight)).toFixed(1)} kg`}
            </Text>
          </View>
        )}
      </View>

      {trendData.length > 0 && (
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weight Trend</Text>
            <View style={styles.timeframeButtons}>
              <TouchableOpacity
                style={[
                  styles.timeframeButton,
                  timeframe === 'week' ? styles.timeframeButtonActive : null,
                ]}
                onPress={() => setTimeframe('week')}>
                <Text style={timeframe === 'week' ? styles.timeframeTextActive : styles.timeframeText}>
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeframeButton,
                  timeframe === 'month' ? styles.timeframeButtonActive : null,
                ]}
                onPress={() => setTimeframe('month')}>
                <Text style={timeframe === 'month' ? styles.timeframeTextActive : styles.timeframeText}>
                  Month
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <ProgressChart 
            data={trendData} 
            goalValue={goalWeight ? parseFloat(goalWeight) : undefined}
            isWeight={true}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Record Weight (kg):</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="Enter your weight in kg"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <Text style={styles.label}>Note (optional):</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note about your weight"
          multiline
        />
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddWeight}>
          <Text style={styles.addButtonText}>Add Weight Record</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>History</Text>
        {weights.length > 0 ? (
          [...weights]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10)
            .map((entry) => (
              <View key={entry.id} style={styles.historyItem}>
                <View>
                  <Text style={styles.historyDate}>{formatDateForDisplay(entry.date)}</Text>
                  {entry.note && <Text style={styles.historyNote}>{entry.note}</Text>}
                </View>
                <Text style={styles.historyWeight}>{entry.value} kg</Text>
              </View>
            ))
        ) : (
          <Text style={styles.emptyText}>No weight records yet</Text>
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
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    justifyContent: 'space-around',
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  goalInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: colors.inputBackground,
  },
  goalReached: {
    color: colors.success,
  },
  goalNotReached: {
    color: colors.warning,
  },
  chartContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  timeframeButtons: {
    flexDirection: 'row',
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  timeframeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeframeText: {
    color: colors.textSecondary,
  },
  timeframeTextActive: {
    color: colors.white,
    fontWeight: 'bold',
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
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
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
    color: colors.text,
    fontWeight: '500',
  },
  historyNote: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    maxWidth: 250,
  },
  historyWeight: {
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

export default WeightScreen;
