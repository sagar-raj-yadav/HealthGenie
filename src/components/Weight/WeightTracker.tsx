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

const WeightTracker: React.FC = () => {
  const {addWeightEntry} = useContext(HealthContext);
  const [weight, setWeight] = useState('');

  const handleAddWeight = () => {
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      Alert.alert('Invalid Entry', 'Please enter a valid weight');
      return;
    }

    addWeightEntry(weightValue);
    setWeight('');
    Alert.alert('Success', 'Weight entry added successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Track Weight</Text>
        <Icon name="bar-chart-2" size={24} color={colors.primary} />
      </View>

      <Text style={styles.description}>
        Keep track of your weight to monitor your progress over time
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddWeight}>
          <Text style={styles.addButtonText}>Add Weight</Text>
        </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
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
});

export default WeightTracker;
