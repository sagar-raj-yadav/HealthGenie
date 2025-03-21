import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {HealthContext} from '../../contexts/HealthContext';
import {colors} from '../../styles/colors';

const WaterProgress: React.FC = () => {
  const {waterIntake} = useContext(HealthContext);
  const progress = Math.min((waterIntake.current / waterIntake.goal) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Water Intake</Text>
        <Text style={styles.date}>{waterIntake.date}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{waterIntake.current} ml</Text>
          <Text style={styles.statLabel}>Current</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{waterIntake.goal} ml</Text>
          <Text style={styles.statLabel}>Goal</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {width: `${progress}%`},
              progress >= 100 ? styles.progressComplete : {},
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      <Text style={styles.helpText}>
        {progress < 50
          ? 'You need to drink more water today!'
          : progress < 100
          ? 'Keep going, you\'re on track!'
          : 'Great job! You\'ve reached your water goal!'}
      </Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBackground: {
    height: 20,
    backgroundColor: colors.backgroundLight,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  progressComplete: {
    backgroundColor: colors.success,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default WaterProgress;
