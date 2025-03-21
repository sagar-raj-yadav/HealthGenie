import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../styles/colors';

interface WeightTrackerProps {
  currentWeight: number | null;
  goalWeight?: number | null;
  previousWeight?: number | null;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({
  currentWeight,
  goalWeight,
  previousWeight,
}) => {
  // Calculate change from previous weight if available
  const weightChange = 
    currentWeight && previousWeight 
      ? currentWeight - previousWeight 
      : null;
  
  // Calculate progress towards goal if both current and goal weights are available
  const goalProgress = 
    currentWeight && goalWeight && currentWeight > goalWeight
      ? Math.min(1, (previousWeight ? previousWeight : currentWeight) / currentWeight - goalWeight / currentWeight)
      : null;
  
  const isGoalReached = 
    currentWeight && goalWeight && currentWeight <= goalWeight;

  return (
    <View style={styles.container}>
      <View style={styles.currentWeightContainer}>
        <Text style={styles.label}>Current Weight</Text>
        <Text style={styles.weightValue}>
          {currentWeight ? `${currentWeight} kg` : 'Not recorded'}
        </Text>
      </View>
      
      {weightChange !== null && (
        <View style={styles.changeContainer}>
          <Text style={styles.label}>Change</Text>
          <Text style={[
            styles.changeValue,
            weightChange < 0 ? styles.weightLoss : 
            weightChange > 0 ? styles.weightGain : styles.noChange
          ]}>
            {weightChange === 0 
              ? 'No change' 
              : `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg`}
          </Text>
        </View>
      )}
      
      {goalWeight && (
        <View style={styles.goalContainer}>
          <Text style={styles.label}>Goal Weight</Text>
          <Text style={styles.goalValue}>
            {goalWeight} kg
          </Text>
          
          {isGoalReached ? (
            <View style={styles.goalReachedBadge}>
              <Text style={styles.goalReachedText}>Goal Reached!</Text>
            </View>
          ) : (
            goalProgress !== null && (
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      {width: `${goalProgress * 100}%`}
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {(goalProgress * 100).toFixed(0)}% to goal
                </Text>
              </View>
            )
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  currentWeightContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  changeContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  changeValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  weightLoss: {
    color: colors.success,
  },
  weightGain: {
    color: colors.error,
  },
  noChange: {
    color: colors.textSecondary,
  },
  goalContainer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  goalValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  goalReachedBadge: {
    backgroundColor: colors.success,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  goalReachedText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default WeightTracker;
