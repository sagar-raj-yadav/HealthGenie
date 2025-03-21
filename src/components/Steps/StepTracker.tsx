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

const StepTracker: React.FC = () => {
  const {addSteps} = useContext(HealthContext);
  const [stepCount, setStepCount] = useState('');

  const handleAddSteps = () => {
    const count = parseInt(stepCount, 10);
    if (isNaN(count) || count <= 0) {
      Alert.alert('Invalid Entry', 'Please enter a valid number of steps');
      return;
    }

    addSteps(count);
    setStepCount('');
    Alert.alert('Success', 'Steps added successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Track Steps</Text>
        <Icon name="activity" size={24} color={colors.primary} />
      </View>

      <Text style={styles.description}>
        Keep track of your daily steps to maintain a healthy lifestyle
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter step count"
          keyboardType="numeric"
          value={stepCount}
          onChangeText={setStepCount}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddSteps}>
          <Text style={styles.addButtonText}>Add Steps</Text>
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

export default StepTracker;
