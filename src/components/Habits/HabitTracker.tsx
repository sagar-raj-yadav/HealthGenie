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

const HabitTracker: React.FC = () => {
  const {addHabit} = useContext(HealthContext);
  const [habitName, setHabitName] = useState('');

  const handleAddHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Empty Habit', 'Please enter a habit name');
      return;
    }

    addHabit(habitName.trim());
    setHabitName('');
    Alert.alert('Success', 'Habit added successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Habit</Text>
        <Icon name="check-square" size={24} color={colors.primary} />
      </View>

      <Text style={styles.description}>
        Add habits you want to track daily to improve your health
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter habit name (e.g., Take vitamins)"
          value={habitName}
          onChangeText={setHabitName}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
          <Text style={styles.addButtonText}>Add Habit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Tips for Building Habits:</Text>
        <View style={styles.tipItem}>
          <Icon name="check" size={14} color={colors.success} />
          <Text style={styles.tipText}>Be specific about what you want to achieve</Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="check" size={14} color={colors.success} />
          <Text style={styles.tipText}>Start with small, achievable habits</Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="check" size={14} color={colors.success} />
          <Text style={styles.tipText}>Track your progress consistently</Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="check" size={14} color={colors.success} />
          <Text style={styles.tipText}>
            It takes about 21 days to form a new habit
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
  tipsContainer: {
    marginTop: 20,
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});

export default HabitTracker;
