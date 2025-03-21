import React, {useState} from 'react';
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
import {validateHeartRate} from '../utils/validation';
import {getTodayDate, getTimestamp, formatDateForDisplay, getDateRange} from '../utils/dateUtils';
import {ProgressChart} from '../components/ProgressChart';
import colors from '../styles/colors';

const HeartRateScreen: React.FC = () => {
  const {heartRates, addHeartRate} = useHealthData();
  const [heartRate, setHeartRate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'day' | 'week'>('day');

  const handleAddHeartRate = () => {
    // Validate input
    const validationError = validateHeartRate(heartRate);
    if (validationError) {
      setError(validationError);
      return;
    }

    const bpmValue = parseInt(heartRate, 10);
    const today = getTodayDate();
    const timestamp = getTimestamp();

    // Add heart rate reading
    addHeartRate({
      id: `hr-${timestamp}`,
      bpm: bpmValue,
      date: today,
      timestamp,
      note: note.trim() || undefined,
    }).then(() => {
      setHeartRate('');
      setNote('');
      setError(null);
      Alert.alert('Success', 'Heart rate reading added successfully!');
    }).catch(err => {
      Alert.alert('Error', 'Failed to save heart rate reading.');
      console.error(err);
    });
  };

  const getLatestReading = () => {
    if (heartRates.length === 0) return null;
    
    return [...heartRates].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  };

  const getHeartRateCategory = (bpm: number) => {
    // These are general categories and may vary by age, fitness level, etc.
    if (bpm < 60) {
      return {category: 'Resting', color: colors.secondary};
    } else if (bpm >= 60 && bpm <= 100) {
      return {category: 'Normal', color: colors.success};
    } else if (bpm > 100 && bpm <= 140) {
      return {category: 'Elevated', color: colors.warning};
    } else {
      return {category: 'High', color: colors.error};
    }
  };

  const getChartData = () => {
    let filteredHeartRates;
    const today = getTodayDate();
    
    if (timeframe === 'day') {
      // Get today's heart rates
      filteredHeartRates = heartRates.filter(hr => hr.date === today);
    } else {
      // Get last 7 days heart rates
      const last7Days = getDateRange(7);
      filteredHeartRates = heartRates.filter(hr => last7Days.includes(hr.date));
    }
    
    // Sort by timestamp
    filteredHeartRates.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Format data for the chart
    return filteredHeartRates.map(hr => ({
      date: hr.date,
      value: hr.bpm,
      label: timeframe === 'day' 
        ? new Date(hr.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
        : hr.date.split('-')[2], // Just the day
    }));
  };

  const latestReading = getLatestReading();
  const category = latestReading 
    ? getHeartRateCategory(latestReading.bpm) 
    : null;
  const chartData = getChartData();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Heart Rate Monitor</Text>
      
      {latestReading && (
        <View style={styles.latestContainer}>
          <Text style={styles.latestTitle}>Latest Reading</Text>
          <View style={styles.readingDisplay}>
            <Text style={styles.readingValue}>
              {latestReading.bpm}
            </Text>
            <Text style={styles.readingUnit}>BPM</Text>
          </View>
          <Text style={[styles.categoryText, {color: category?.color}]}>
            {category?.category}
          </Text>
          <Text style={styles.dateText}>
            {formatDateForDisplay(latestReading.date)} at {new Date(latestReading.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      )}

      {chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Heart Rate Trend</Text>
            <View style={styles.timeframeButtons}>
              <TouchableOpacity
                style={[
                  styles.timeframeButton,
                  timeframe === 'day' ? styles.timeframeButtonActive : null,
                ]}
                onPress={() => setTimeframe('day')}>
                <Text style={timeframe === 'day' ? styles.timeframeTextActive : styles.timeframeText}>
                  Today
                </Text>
              </TouchableOpacity>
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
            </View>
          </View>
          <ProgressChart data={chartData} isHeartRate={true} />
        </View>
      )}

      <View style={styles.rangesContainer}>
        <Text style={styles.rangesTitle}>Heart Rate Ranges</Text>
        <View style={styles.rangeItem}>
          <View style={[styles.rangeColor, {backgroundColor: colors.secondary}]} />
          <Text style={styles.rangeText}>Resting: &lt;60 BPM</Text>
        </View>
        <View style={styles.rangeItem}>
          <View style={[styles.rangeColor, {backgroundColor: colors.success}]} />
          <Text style={styles.rangeText}>Normal: 60-100 BPM</Text>
        </View>
        <View style={styles.rangeItem}>
          <View style={[styles.rangeColor, {backgroundColor: colors.warning}]} />
          <Text style={styles.rangeText}>Elevated: 101-140 BPM</Text>
        </View>
        <View style={styles.rangeItem}>
          <View style={[styles.rangeColor, {backgroundColor: colors.error}]} />
          <Text style={styles.rangeText}>High: &gt;140 BPM</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Heart Rate (BPM):</Text>
        <TextInput
          style={styles.input}
          value={heartRate}
          onChangeText={setHeartRate}
          keyboardType="number-pad"
          placeholder="Enter beats per minute"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <Text style={styles.label}>Note (optional):</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note about your reading (e.g., after exercise)"
          multiline
        />
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddHeartRate}>
          <Text style={styles.addButtonText}>Add Heart Rate Reading</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>History</Text>
        {heartRates.length > 0 ? (
          [...heartRates]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10)
            .map((entry) => {
              const entryCategory = getHeartRateCategory(entry.bpm);
              return (
                <View key={entry.id} style={styles.historyItem}>
                  <View>
                    <Text style={styles.historyDate}>
                      {formatDateForDisplay(entry.date)} at {new Date(entry.timestamp).toLocaleTimeString()}
                    </Text>
                    {entry.note && <Text style={styles.historyNote}>{entry.note}</Text>}
                  </View>
                  <View style={styles.historyValuesContainer}>
                    <Text style={styles.historyValues}>
                      {entry.bpm} BPM
                    </Text>
                    <Text style={[styles.historyCategory, {color: entryCategory.color}]}>
                      {entryCategory.category}
                    </Text>
                  </View>
                </View>
              );
            })
        ) : (
          <Text style={styles.emptyText}>No heart rate records yet</Text>
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
  latestContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  latestTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  readingDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 5,
  },
  readingValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.primary,
  },
  readingUnit: {
    fontSize: 18,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
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
  rangesContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  rangesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  rangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  rangeText: {
    fontSize: 14,
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
    maxWidth: 200,
  },
  historyValuesContainer: {
    alignItems: 'flex-end',
  },
  historyValues: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 16,
  },
  historyCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginVertical: 20,
    fontStyle: 'italic',
  },
});

export default HeartRateScreen;
