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
import {validateWaterIntake} from '../utils/validation';
import {getTodayDate, getTimestamp, formatDateForDisplay} from '../utils/dateUtils';
import WaterIntakeTracker from '../components/WaterIntakeTracker';
import colors from '../styles/colors';

const WaterIntakeScreen: React.FC = () => {
  const {waterIntake, addWaterIntake} = useHealthData();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dailyGoal, setDailyGoal] = useState('2000'); // Default 2000ml (2L)
  const [todayIntake, setTodayIntake] = useState(0);

  useEffect(() => {
    calculateTodayIntake();
  }, [waterIntake]);

  const calculateTodayIntake = () => {
    const today = getTodayDate();
    const todayEntries = waterIntake.filter(entry => entry.date === today);
    const total = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
    setTodayIntake(total);
  };

  const handleAddWaterIntake = () => {
    // Validate input
    const validationError = validateWaterIntake(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    const amountValue = parseFloat(amount);
    const today = getTodayDate();
    const timestamp = getTimestamp();

    // Add water intake
    addWaterIntake({
      id: `water-${timestamp}`,
      amount: amountValue,
      date: today,
      timestamp,
    }).then(() => {
      setAmount('');
      setError(null);
      Alert.alert('Success', 'Water intake added successfully!');
    }).catch(err => {
      Alert.alert('Error', 'Failed to save water intake.');
      console.error(err);
    });
  };

  const getRecentEntries = () => {
    return [...waterIntake]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  };

  const progress = Math.min(todayIntake / parseInt(dailyGoal, 10), 1);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Water Intake Tracker</Text>
      
      <WaterIntakeTracker 
        progress={progress} 
        current={todayIntake} 
        goal={parseInt(dailyGoal, 10)} 
      />

      <View style={styles.goalContainer}>
        <Text style={styles.label}>Daily Goal (ml):</Text>
        <TextInput
          style={styles.goalInput}
          value={dailyGoal}
          onChangeText={setDailyGoal}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Add Water (ml):</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount in ml"
          keyboardType="number-pad"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <View style={styles.quickButtons}>
          <TouchableOpacity 
            style={styles.quickButton} 
            onPress={() => setAmount('250')}>
            <Text style={styles.quickButtonText}>+250ml</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickButton} 
            onPress={() => setAmount('500')}>
            <Text style={styles.quickButtonText}>+500ml</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickButton} 
            onPress={() => setAmount('1000')}>
            <Text style={styles.quickButtonText}>+1L</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddWaterIntake}>
          <Text style={styles.addButtonText}>Add Water Intake</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Recent Entries</Text>
        {getRecentEntries().length > 0 ? (
          getRecentEntries().map((entry, index) => (
            <View key={entry.id} style={styles.historyItem}>
              <Text style={styles.historyDate}>
                {formatDateForDisplay(entry.date)} at {new Date(entry.timestamp).toLocaleTimeString()}
              </Text>
              <Text style={styles.historyAmount}>{entry.amount} ml</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No water intake records yet</Text>
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
    marginBottom: 10,
  },
  errorText: {
    color: colors.error,
    marginBottom: 10,
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickButtonText: {
    color: colors.white,
    fontWeight: 'bold',
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
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  goalInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: colors.inputBackground,
    marginLeft: 10,
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
  historyAmount: {
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

export default WaterIntakeScreen;
