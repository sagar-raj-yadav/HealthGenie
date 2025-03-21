import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../styles/colors';

interface StepCounterProps {
  steps: number;
  goal: number;
}

const StepCounter: React.FC<StepCounterProps> = ({steps, goal}) => {
  const progress = Math.min(steps / goal, 1);
  const progressAngle = progress * 360;
  
  return (
    <View style={styles.container}>
      <View style={styles.progressCircle}>
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Text style={styles.stepsText}>{steps}</Text>
            <Text style={styles.labelText}>steps</Text>
          </View>
        </View>
        {/* This would ideally be a SVG circular progress, but we're using styled View as per requirements */}
        <View style={[styles.progressArc, { width: progressAngle }]} />
      </View>
      
      <View style={styles.goalContainer}>
        <Text style={styles.goalText}>
          Goal: {goal} steps ({Math.round(progress * 100)}%)
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    borderWidth: 10,
    borderColor: colors.lightGray,
  },
  outerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
  },
  progressArc: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 0,
    height: 10,
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderColor: colors.primary,
    borderRadius: 100,
  },
  stepsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  labelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  goalContainer: {
    width: '100%',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
});

export default StepCounter;
