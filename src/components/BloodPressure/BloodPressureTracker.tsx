import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {HealthContext} from '../../contexts/HealthContext';
import {colors} from '../../styles/colors';

const BloodPressureTracker: React.FC = () => {
  const {addBloodPressureEntry} = useContext(HealthContext);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');

  const handleAddReading = () => {
    const systolicValue = parseInt(systolic, 10);
    const diastolicValue = parseInt(diastolic, 10);

    if (
      isNaN(systolicValue) ||
      isNaN(diastolicValue) ||
      systolicValue <= 0 ||
      diastolicValue <= 0
    ) {
      Alert.alert('Invalid Entry', 'Please enter valid blood pressure values');
      return;
    }

    if (systolicValue < diastolicValue) {
      Alert.alert(
        'Invalid Entry',
        'Systolic pressure should be higher than diastolic pressure',
      );
      return;
    }

    addBloodPressureEntry(systolicValue, diastolicValue);
    setSystolic('');
    setDiastolic('');
    Alert.alert('Success', 'Blood pressure reading added successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Blood Pressure Tracker</Text>
        <Icon name="heart" size={24} color={colors.primary} />
      </View>

      <Text style={styles.description}>
        Track your blood pressure readings to monitor your cardiovascular health
      </Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Systolic (mmHg)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 120"
              keyboardType="numeric"
              value={systolic}
              onChangeText={setSystolic}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Diastolic (mmHg)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 80"
              keyboardType="numeric"
              value={diastolic}
              onChangeText={setDiastolic}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddReading}>
          <Text style={styles.addButtonText}>Add Reading</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Blood Pressure Categories:</Text>
        <View style={styles.infoItem}>
          <View style={[styles.categoryDot, {backgroundColor: colors.success}]} />
          <Text style={styles.categoryText}>Normal: Less than 120/80 mmHg</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={[styles.categoryDot, {backgroundColor: colors.warning}]} />
          <Text style={styles.categoryText}>
            Elevated: 120-129 systolic and less than 80 diastolic
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={[styles.categoryDot, {backgroundColor: colors.danger}]} />
          <Text style={styles.categoryText}>
            High: 130/80 mmHg or higher
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  inputContainer: {
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputWrapper: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 20,
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
});

export default BloodPressureTracker;
