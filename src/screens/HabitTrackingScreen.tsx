import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import {useHealthData} from '../contexts/HealthDataContext';
import {validateHabitName} from '../utils/validation';
import {getTodayDate, formatDateForDisplay, getDaysOfCurrentWeek, getDayOfWeek} from '../utils/dateUtils';
import colors from '../styles/colors';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HabitTrackingScreen: React.FC = () => {
  const {habits, addHabit, updateHabit, deleteHabit, toggleHabitCompletion} = useHealthData();
  const [habitName, setHabitName] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [habitColor, setHabitColor] = useState(colors.primary);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [weekDays, setWeekDays] = useState<string[]>([]);

  useEffect(() => {
    setWeekDays(getDaysOfCurrentWeek());
  }, []);

  const resetForm = () => {
    setHabitName('');
    setHabitDescription('');
    setSelectedDays([]);
    setHabitColor(colors.primary);
    setError(null);
    setEditMode(false);
    setEditingHabitId(null);
  };

  const handleSaveHabit = () => {
    // Validate input
    const validationError = validateHabitName(habitName);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (selectedDays.length === 0) {
      setError('Please select at least one day for the habit');
      return;
    }

    const timestamp = new Date().toISOString();

    if (editMode && editingHabitId) {
      // Update existing habit
      updateHabit(editingHabitId, {
        name: habitName,
        description: habitDescription.trim() || undefined,
        frequency: selectedDays,
        color: habitColor,
      }).then(() => {
        resetForm();
        setShowModal(false);
        Alert.alert('Success', 'Habit updated successfully!');
      }).catch(err => {
        Alert.alert('Error', 'Failed to update habit.');
        console.error(err);
      });
    } else {
      // Add new habit
      addHabit({
        id: `habit-${timestamp}`,
        name: habitName,
        description: habitDescription.trim() || undefined,
        frequency: selectedDays,
        createdAt: timestamp,
        completedDates: [],
        color: habitColor,
      }).then(() => {
        resetForm();
        setShowModal(false);
        Alert.alert('Success', 'Habit added successfully!');
      }).catch(err => {
        Alert.alert('Error', 'Failed to save habit.');
        console.error(err);
      });
    }
  };

  const handleEditHabit = (habit: any) => {
    setHabitName(habit.name);
    setHabitDescription(habit.description || '');
    setSelectedDays(habit.frequency);
    setHabitColor(habit.color || colors.primary);
    setEditingHabitId(habit.id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDeleteHabit = (habitId: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteHabit(habitId).then(() => {
              Alert.alert('Success', 'Habit deleted successfully!');
            }).catch(err => {
              Alert.alert('Error', 'Failed to delete habit.');
              console.error(err);
            });
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleToggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleToggleHabitCompletion = (habitId: string, date: string) => {
    toggleHabitCompletion(habitId, date).catch(err => {
      Alert.alert('Error', 'Failed to update habit completion status.');
      console.error(err);
    });
  };

  const isHabitCompletedForDate = (habit: any, date: string) => {
    return habit.completedDates.includes(date);
  };

  const isHabitScheduledForDay = (habit: any, dayOfWeek: number) => {
    return habit.frequency.includes(DAYS_OF_WEEK[dayOfWeek]);
  };

  const renderColorOption = (color: string) => (
    <TouchableOpacity
      key={color}
      style={[
        styles.colorOption,
        {backgroundColor: color},
        habitColor === color && styles.colorOptionSelected,
      ]}
      onPress={() => setHabitColor(color)}
    />
  );

  const colorOptions = [
    colors.primary,
    colors.secondary,
    colors.success,
    colors.warning,
    colors.error,
    '#9C27B0', // Purple
    '#2196F3', // Blue
    '#607D8B', // Blue Grey
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Tracker</Text>
      
      <View style={styles.weekContainer}>
        {DAYS_OF_WEEK.map(day => (
          <View key={day} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>
      
      <ScrollView style={styles.habitsContainer}>
        {habits.length > 0 ? (
          habits.map(habit => (
            <View 
              key={habit.id} 
              style={[styles.habitItem, {borderLeftColor: habit.color || colors.primary}]}
            >
              <View style={styles.habitHeader}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <View style={styles.habitActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditHabit(habit)}>
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteHabit(habit.id)}>
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {habit.description && (
                <Text style={styles.habitDescription}>{habit.description}</Text>
              )}
              
              <View style={styles.habitFrequency}>
                <Text style={styles.frequencyLabel}>Frequency: </Text>
                <Text style={styles.frequencyDays}>
                  {habit.frequency.join(', ')}
                </Text>
              </View>
              
              <View style={styles.completionGrid}>
                {weekDays.map((date, index) => {
                  const dayOfWeek = getDayOfWeek(date);
                  const isScheduled = isHabitScheduledForDay(habit, dayOfWeek);
                  const isCompleted = isHabitCompletedForDate(habit, date);
                  
                  return (
                    <TouchableOpacity
                      key={date}
                      style={[
                        styles.completionCell,
                        !isScheduled && styles.completionCellDisabled,
                        isScheduled && isCompleted && styles.completionCellCompleted,
                      ]}
                      onPress={() => isScheduled && handleToggleHabitCompletion(habit.id, date)}
                      disabled={!isScheduled}
                    >
                      <Text style={styles.completionCellText}>
                        {date.split('-')[2]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            No habits added yet. Create your first habit by tapping the "Add Habit" button below.
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setShowModal(true);
        }}>
        <Text style={styles.addButtonText}>Add Habit</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editMode ? 'Edit Habit' : 'Add New Habit'}
            </Text>
            
            <Text style={styles.label}>Habit Name:</Text>
            <TextInput
              style={styles.input}
              value={habitName}
              onChangeText={setHabitName}
              placeholder="Enter habit name"
            />
            
            <Text style={styles.label}>Description (optional):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={habitDescription}
              onChangeText={setHabitDescription}
              placeholder="Enter a description"
              multiline
            />
            
            <Text style={styles.label}>Frequency:</Text>
            <View style={styles.daysContainer}>
              {DAYS_OF_WEEK.map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.dayButtonSelected,
                  ]}
                  onPress={() => handleToggleDay(day)}>
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day) && styles.dayButtonTextSelected,
                    ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.label}>Color:</Text>
            <View style={styles.colorsContainer}>
              {colorOptions.map(color => renderColorOption(color))}
            </View>
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  resetForm();
                  setShowModal(false);
                }}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveHabit}>
                <Text style={styles.modalButtonText}>
                  {editMode ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  weekContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    elevation: 2,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontWeight: 'bold',
    color: colors.text,
  },
  habitsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  habitItem: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    elevation: 2,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  habitActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: colors.secondary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
  },
  habitDescription: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  habitFrequency: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  frequencyLabel: {
    color: colors.text,
    fontWeight: '500',
  },
  frequencyDays: {
    color: colors.textSecondary,
  },
  completionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completionCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
  },
  completionCellDisabled: {
    opacity: 0.3,
  },
  completionCellCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  completionCellText: {
    fontSize: 12,
    color: colors.text,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginVertical: 30,
    fontStyle: 'italic',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayButtonText: {
    color: colors.text,
  },
  dayButtonTextSelected: {
    color: colors.white,
  },
  colorsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: colors.text,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HabitTrackingScreen;
