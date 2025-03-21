import React, {useContext, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {HealthContext} from '../../contexts/HealthContext';
import {colors} from '../../styles/colors';
import {
  formatDateForDisplay,
  formatTimeForDisplay,
  getLastNDaysShort,
} from '../../utils/dateUtils';

const StepHistory: React.FC = () => {
  const {steps} = useContext(HealthContext);

  // Get steps for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaySteps = useMemo(() => {
    return steps.filter(step => {
      const stepDate = new Date(step.date);
      return stepDate >= today;
    });
  }, [steps]);
  
  const todayTotalSteps = useMemo(() => {
    return todaySteps.reduce((total, step) => total + step.count, 0);
  }, [todaySteps]);

  // Get last 7 days data for the chart
  const last7Days = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const daySteps = steps.filter(step => {
        const stepDate = new Date(step.date);
        return stepDate >= date && stepDate < nextDay;
      });
      
      const totalSteps = daySteps.reduce((total, step) => total + step.count, 0);
      
      result.push({
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        total: totalSteps,
      });
    }
    return result;
  }, [steps]);

  const maxSteps = Math.max(...last7Days.map(day => day.total), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step History</Text>
      
      <View style={styles.todayContainer}>
        <Text style={styles.todayLabel}>Today's Steps</Text>
        <Text style={styles.todaySteps}>{todayTotalSteps}</Text>
        <Text style={styles.target}>
          {todayTotalSteps >= 10000 
            ? '🎉 Reached daily goal of 10,000 steps!' 
            : `${10000 - todayTotalSteps} more steps to reach daily goal`}
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Last 7 Days</Text>
        <View style={styles.chart}>
          {last7Days.map((day, index) => (
            <View key={index} style={styles.chartBar}>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${Math.max((day.total / maxSteps) * 100, 3)}%`,
                      backgroundColor: day.total >= 10000 ? colors.success : colors.primary,
                    }
                  ]} 
                />
              </View>
              <Text style={styles.barLabel}>{day.date}</Text>
              <Text style={styles.barValue}>{day.total}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.recentTitle}>Recent Step Entries</Text>
      <ScrollView style={styles.entriesContainer}>
        {steps.length > 0 ? (
          steps
            .slice()
            .reverse()
            .slice(0, 10)
            .map(entry => (
              <View key={entry.id} style={styles.entryItem}>
                <View>
                  <Text style={styles.entryCount}>{entry.count} steps</Text>
                  <Text style={styles.entryDate}>
                    {formatDateForDisplay(entry.date)} at{' '}
                    {formatTimeForDisplay(entry.date)}
                  </Text>
                </View>
              </View>
            ))
        ) : (
          <Text style={styles.noData}>No step entries yet</Text>
        )}
      </ScrollView>
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
  todayContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
  },
  todayLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  todaySteps: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  target: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    width: '60%',
    height: '70%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  barValue: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  entriesContainer: {
    maxHeight: 240,
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  entryCount: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  entryDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  noData: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default StepHistory;
