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
import {validateBloodPressure} from '../utils/validation';
import {getTodayDate, getTimestamp, formatDateForDisplay} from '../utils/dateUtils';
import colors from '../styles/colors';

const BloodPressureScreen: React.FC = () => {
  const {bloodPressures, addBloodPressure} = useHealthData();
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddBloodPressure = () => {
    // Validate input
    const validationError = validateBloodPressure(systolic, diastolic);
    if (validationError) {
      setError(validationError);
      return;
    }

    const systolicValue = parseInt(systolic, 10);
    const diastolicValue = parseInt(diastolic, 10);
    const today = getTodayDate();
    const timestamp = getTimestamp();

    // Add blood pressure reading
    addBloodPressure({
      id: `bp-${timestamp}`,
      systolic: systolicValue,
      diastolic: diastolicValue,
      date: today,
      timestamp,
      note: note.trim() || undefined,
    }).then(() => {
      setSystolic('');
      setDiastolic('');
      setNote('');
      setError(null);
      Alert.alert('Success', 'Blood pressure reading added successfully!');
    }).catch(err => {
      Alert.alert('Error', 'Failed to save blood pressure reading.');
      console.error(err);
    });
  };

  const getLatestReading = () => {
    if (bloodPressures.length === 0) return null;
    
    return [...bloodPressures].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  };

  const getBloodPressureCategory = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) {
      return {category: 'Normal', color: colors.success};
    } else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
      return {category: 'Elevated', color: colors.warning};
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return {category: 'High (Stage 1)', color: colors.warning};
    } else if (systolic >= 140 || diastolic >= 90) {
      return {category: 'High (Stage 2)', color: colors.error};
    } else if (systolic > 180 || diastolic > 120) {
      return {category: 'Hypertensive Crisis', color: colors.error};
    }
    return {category: 'Unknown', color: colors.textSecondary};
  };

  const latestReading = getLatestReading();
  const category = latestReading 
    ? getBloodPressureCategory(latestReading.systolic, latestReading.diastolic) 
    : null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Blood Pressure Monitor</Text>
      
      {latestReading && (
        <View style={styles.latestContainer}>
          <Text style={styles.latestTitle}>Latest Reading</Text>
          <View style={styles.readingDisplay}>
            <Text style={styles.readingValue}>
              {latestReading.systolic}/{latestReading.diastolic}
            </Text>
            <Text style={styles.readingUnit}>mmHg</Text>
          </View>
          <Text style={[styles.categoryText, {color: category?.color}]}>
            {category?.category}
          </Text>
          <Text style={styles.dateText}>
            {formatDateForDisplay(latestReading.date)} at {new Date(latestReading.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      )}

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Healthy Ranges</Text>
        <View style={styles.rangeItem}>
          <View style={[styles.rangeColor, {backgroundColor: colors.success}]} />
          <Text style={styles.rangeText}>Normal: &lt;120/80 mmHg</Text>
        </View>
        <View style={styles.rangeItem}>
          <View style={[styles.rangeColor, {backgroundColor: colors.warning}]} />
          <Text style={styles.rangeText}>Elevated: 120-129/&lt;80 mmHg</Text>
        </View>
        <View style={styles.rangeItem}>
          <View style={[styles.rangeColor, {backgroundColor: colors.warning}]} />
          <Text style={styles.rangeText}>High (Stage 1): 130-139/80-89 mmHg</Text>
        </View>
        <View style={styles.rangeItem}>
          <View style={[styles.rangeColor, {backgroundColor: colors.error}]} />
          <Text style={styles.rangeText}>High (Stage 2): &gt;=140/&gt;=90 mmHg</Text>
        </View>
        <View style={styles.rangeItem}>
          <View style={[styles.rangeColor, {backgroundColor: colors.error}]} />
          <Text style={styles.rangeText}>Crisis: &gt;180/&gt;120 mmHg</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.bpInputRow}>
          <View style={styles.bpInputColumn}>
            <Text style={styles.label}>Systolic (mmHg):</Text>
            <TextInput
              style={styles.input}
              value={systolic}
              onChangeText={setSystolic}
              keyboardType="number-pad"
              placeholder="120"
            />
          </View>
          <View style={styles.bpInputColumn}>
            <Text style={styles.label}>Diastolic (mmHg):</Text>
            <TextInput
              style={styles.input}
              value={diastolic}
              onChangeText={setDiastolic}
              keyboardType="number-pad"
              placeholder="80"
            />
          </View>
        </View>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <Text style={styles.label}>Note (optional):</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note about your reading"
          multiline
        />
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddBloodPressure}>
          <Text style={styles.addButtonText}>Add Blood Pressure Reading</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>History</Text>
        {bloodPressures.length > 0 ? (
          [...bloodPressures]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10)
            .map((entry) => {
              const entryCategory = getBloodPressureCategory(entry.systolic, entry.diastolic);
              return (
                <View key={entry.id} style={styles.historyItem}>
                  <View>
                    <Text style={styles.historyDate}>{formatDateForDisplay(entry.date)}</Text>
                    {entry.note && <Text style={styles.historyNote}>{entry.note}</Text>}
                  </View>
                  <View style={styles.historyValuesContainer}>
                    <Text style={styles.historyValues}>
                      {entry.systolic}/{entry.diastolic}
                    </Text>
                    <Text style={[styles.historyCategory, {color: entryCategory.color}]}>
                      {entryCategory.category}
                    </Text>
                  </View>
                </View>
              );
            })
        ) : (
          <Text style={styles.emptyText}>No blood pressure records yet</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  readingUnit: {
    fontSize: 16,
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
  chartTitle: {
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
  bpInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bpInputColumn: {
    flex: 1,
    marginRight: 8,
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

export default BloodPressureScreen;
