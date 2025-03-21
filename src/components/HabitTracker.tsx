import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Habit} from '../types';
import colors from '../styles/colors';

interface HabitTrackerProps {
  habit: Habit;
  dates: string[];
  onToggleCompletion: (habitId: string, date: string) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({
  habit,
  dates,
  onToggleCompletion,
}) => {
  // Get the day of week (0-6, where 0 is Sunday)
  const getDayOfWeek = (dateStr: string): number => {
    return new Date(dateStr).getDay();
  };

  // Check if a habit is scheduled for a specific day of the week
  const isHabitScheduledForDay = (dayOfWeek: number): boolean => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return habit.frequency.includes(dayNames[dayOfWeek]);
  };

  // Check if a habit was completed on a specific date
  const isCompletedOnDate = (date: string): boolean => {
    return habit.completedDates.includes(date);
  };

  // Calculate completion rate for the current date range
  const getCompletionRate = (): string => {
    const scheduledDates = dates.filter(date => 
      isHabitScheduledForDay(getDayOfWeek(date))
    );
    
    if (scheduledDates.length === 0) return '0%';
    
    const completedCount = scheduledDates.filter(date => 
      isCompletedOnDate(date)
    ).length;
    
    return `${Math.round((completedCount / scheduledDates.length) * 100)}%`;
  };

  // Get streak (consecutive completed days)
  const getStreak = (): number => {
    let streak = 0;
    const sortedDates = [...dates].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    for (const date of sortedDates) {
      const dayOfWeek = getDayOfWeek(date);
      
      if (isHabitScheduledForDay(dayOfWeek)) {
        if (isCompletedOnDate(date)) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    return streak;
  };

  return (
    <View style={[styles.container, {borderLeftColor: habit.color || colors.primary}]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{habit.name}</Text>
        <View style={[styles.completionBadge, {backgroundColor: habit.color || colors.primary}]}>
          <Text style={styles.completionText}>{getCompletionRate()}</Text>
        </View>
      </View>
      
      {habit.description && (
        <Text style={styles.description}>{habit.description}</Text>
      )}
      
      <View style={styles.streakContainer}>
        <Text style={styles.streakLabel}>Current Streak</Text>
        <Text style={styles.streakValue}>{getStreak()} days</Text>
      </View>
      
      <View style={styles.daysContainer}>
        {dates.map(date => {
          const dayOfWeek = getDayOfWeek(date);
          const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
          const dayNumber = new Date(date).getDate();
          const isScheduled = isHabitScheduledForDay(dayOfWeek);
          const isCompleted = isCompletedOnDate(date);
          
          return (
            <TouchableOpacity
              key={date}
              style={[
                styles.dayButton,
                !isScheduled && styles.dayButtonDisabled,
                isScheduled && isCompleted && [styles.dayButtonCompleted, {backgroundColor: habit.color || colors.primary}]
              ]}
              onPress={() => {
                if (isScheduled) {
                  onToggleCompletion(habit.id, date);
                }
              }}
              disabled={!isScheduled}
            >
              <Text style={styles.dayName}>{dayNames[dayOfWeek]}</Text>
              <Text style={[
                styles.dayNumber,
                isScheduled && isCompleted && styles.dayNumberCompleted
              ]}>
                {dayNumber}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  completionBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  completionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginVertical: 8,
  },
  streakLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  streakValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayButton: {
    width: 36,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
  },
  dayButtonDisabled: {
    opacity: 0.3,
  },
  dayButtonCompleted: {
    backgroundColor: colors.primary,
  },
  dayName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  dayNumberCompleted: {
    color: colors.white,
  },
});

export default HabitTracker;
