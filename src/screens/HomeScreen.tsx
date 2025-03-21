import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import {useHealthData} from '../contexts/HealthDataContext';
import {getTodayDate, formatDateForDisplay} from '../utils/dateUtils';
import colors from '../styles/colors';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    waterIntake,
    stepCounts,
    weights,
    bloodPressures,
    heartRates,
    habits,
    isLoading,
  } = useHealthData();

  const today = getTodayDate();

  // Get today's summary data
  const getTodayWaterIntake = () => {
    const todayEntries = waterIntake.filter(entry => entry.date === today);
    return todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
  };

  const getTodaySteps = () => {
    const todayEntries = stepCounts.filter(entry => entry.date === today);
    if (todayEntries.length === 0) return 0;
    
    // Get the latest entry
    const latestEntry = [...todayEntries].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    return latestEntry.count;
  };

  const getLatestWeight = () => {
    if (weights.length === 0) return null;
    
    const latestEntry = [...weights].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    return latestEntry.value;
  };

  const getLatestBloodPressure = () => {
    if (bloodPressures.length === 0) return null;
    
    const latestEntry = [...bloodPressures].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    return `${latestEntry.systolic}/${latestEntry.diastolic}`;
  };

  const getLatestHeartRate = () => {
    if (heartRates.length === 0) return null;
    
    const latestEntry = [...heartRates].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    return latestEntry.bpm;
  };

  const getHabitsForToday = () => {
    return habits.filter(habit => {
      const dayOfWeek = new Date(today).getDay();
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
      return habit.frequency.includes(dayName);
    });
  };

  const getCompletedHabitsCount = () => {
    const todayHabits = getHabitsForToday();
    return todayHabits.filter(habit => habit.completedDates.includes(today)).length;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your health data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Health Tracker</Text>
      <Text style={styles.date}>{formatDateForDisplay(today)}</Text>
      
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, styles.waterCard]}
          onPress={() => navigation.navigate('WaterIntake')}>
          <Text style={styles.cardTitle}>Water</Text>
          <Text style={styles.cardValue}>{getTodayWaterIntake()} ml</Text>
          <Text style={styles.cardSubtitle}>Daily Goal: 2000 ml</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.card, styles.stepsCard]}
          onPress={() => navigation.navigate('StepCount')}>
          <Text style={styles.cardTitle}>Steps</Text>
          <Text style={styles.cardValue}>{getTodaySteps()}</Text>
          <Text style={styles.cardSubtitle}>Daily Goal: 10,000</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.card, styles.weightCard]}
          onPress={() => navigation.navigate('Weight')}>
          <Text style={styles.cardTitle}>Weight</Text>
          <Text style={styles.cardValue}>
            {getLatestWeight() ? `${getLatestWeight()} kg` : 'Not set'}
          </Text>
          <Text style={styles.cardSubtitle}>Latest measurement</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.card, styles.bpCard]}
          onPress={() => navigation.navigate('BloodPressure')}>
          <Text style={styles.cardTitle}>Blood Pressure</Text>
          <Text style={styles.cardValue}>
            {getLatestBloodPressure() || 'Not set'}
          </Text>
          <Text style={styles.cardSubtitle}>Latest measurement</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.card, styles.heartCard]}
          onPress={() => navigation.navigate('HeartRate')}>
          <Text style={styles.cardTitle}>Heart Rate</Text>
          <Text style={styles.cardValue}>
            {getLatestHeartRate() ? `${getLatestHeartRate()} BPM` : 'Not set'}
          </Text>
          <Text style={styles.cardSubtitle}>Latest measurement</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.card, styles.habitCard]}
          onPress={() => navigation.navigate('HabitTracking')}>
          <Text style={styles.cardTitle}>Habits</Text>
          <View style={styles.habitProgress}>
            <Text style={styles.habitCount}>
              {getCompletedHabitsCount()}/{getHabitsForToday().length}
            </Text>
            <Text style={styles.habitLabel}>Completed Today</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Health Tips</Text>
        <Text style={styles.tip}>• Drink at least 8 glasses of water daily</Text>
        <Text style={styles.tip}>• Aim for 10,000 steps every day</Text>
        <Text style={styles.tip}>• Regular heart rate monitoring helps track fitness</Text>
        <Text style={styles.tip}>• Monitor blood pressure weekly for heart health</Text>
        <Text style={styles.tip}>• Consistency in habits leads to better health outcomes</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  waterCard: {
    borderTopColor: '#2196F3',
    borderTopWidth: 4,
  },
  stepsCard: {
    borderTopColor: '#4CAF50',
    borderTopWidth: 4,
  },
  weightCard: {
    borderTopColor: '#9C27B0',
    borderTopWidth: 4,
  },
  bpCard: {
    borderTopColor: '#F44336',
    borderTopWidth: 4,
  },
  heartCard: {
    borderTopColor: '#E91E63',
    borderTopWidth: 4,
  },
  habitCard: {
    borderTopColor: '#FF9800',
    borderTopWidth: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  habitProgress: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  habitCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  habitLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tipsContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default HomeScreen;
