import React, {useContext, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {HealthContext} from '../../contexts/HealthContext';
import {colors} from '../../styles/colors';
import {formatDate, getCurrentWeekDates} from '../../utils/dateUtils';

const HabitList: React.FC = () => {
  const {habits, toggleHabitCompletion, deleteHabit} = useContext(HealthContext);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  // Get the current week dates for the top date selector
  const weekDates = useMemo(() => getCurrentWeekDates(), []);

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', {weekday: 'short'}),
      date: date.getDate(),
      isToday:
        date.toDateString() === new Date().toDateString(),
    };
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleToggleHabit = (habitId: string) => {
    toggleHabitCompletion(habitId, selectedDate);
  };

  const handleDeleteHabit = (habitId: string, habitName: string) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habitName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteHabit(habitId),
          style: 'destructive',
        },
      ],
    );
  };

  // Calculate streak for each habit
  const getHabitStreak = (completedDates: string[]) => {
    if (completedDates.length === 0) return 0;

    // Sort dates in descending order
    const sortedDates = [...completedDates].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from yesterday
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);

    // Check if today's date is completed
    const todayFormatted = formatDate(today);
    const isTodayCompleted = sortedDates.includes(todayFormatted);
    if (isTodayCompleted) {
      streak = 1;
    }

    // Check consecutive days
    while (true) {
      const dateToCheck = formatDate(checkDate);
      if (sortedDates.includes(dateToCheck)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Your Habits</Text>

      {/* Date selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateScrollView}>
        {weekDates.map(date => {
          const {day, date: dateNum, isToday} = formatDisplayDate(date);
          const isSelected = date === selectedDate;

          return (
            <TouchableOpacity
              key={date}
              style={[
                styles.dateItem,
                isSelected && styles.selectedDateItem,
                isToday && styles.todayDateItem,
              ]}
              onPress={() => handleDateSelect(date)}>
              <Text
                style={[
                  styles.dateDay,
                  isSelected && styles.selectedDateText,
                ]}>
                {day}
              </Text>
              <Text
                style={[
                  styles.dateNum,
                  isSelected && styles.selectedDateText,
                ]}>
                {dateNum}
              </Text>
              {isToday && <View style={styles.todayIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Habits list */}
      {habits.length > 0 ? (
        <ScrollView style={styles.habitsContainer}>
          {habits.map(habit => {
            const isCompleted = habit.completedDates.includes(selectedDate);
            const streak = getHabitStreak(habit.completedDates);

            return (
              <View key={habit.id} style={styles.habitItem}>
                <TouchableOpacity
                  style={styles.habitCheckContainer}
                  onPress={() => handleToggleHabit(habit.id)}>
                  <View
                    style={[
                      styles.habitCheck,
                      isCompleted && styles.habitCheckCompleted,
                    ]}>
                    {isCompleted && (
                      <Icon name="check" size={16} color={colors.white} />
                    )}
                  </View>
                  <View style={styles.habitDetails}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    <View style={styles.streakContainer}>
                      <Icon name="flame" size={14} color={colors.warning} />
                      <Text style={styles.streakText}>
                        {streak} day{streak !== 1 ? 's' : ''} streak
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteHabit(habit.id, habit.name)}>
                  <Icon name="trash-2" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="clipboard" size={48} color={colors.border} />
          <Text style={styles.emptyText}>No habits added yet</Text>
          <Text style={styles.emptySubtext}>
            Add habits to track your daily progress
          </Text>
        </View>
      )}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  dateScrollView: {
    marginBottom: 16,
  },
  dateItem: {
    width: 50,
    height: 70,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: colors.backgroundLight,
  },
  selectedDateItem: {
    backgroundColor: colors.primary,
  },
  todayDateItem: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dateDay: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dateNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 4,
  },
  selectedDateText: {
    color: colors.white,
  },
  todayIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 6,
  },
  habitsContainer: {
    maxHeight: 350,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  habitCheckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitCheckCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

export default HabitList;
