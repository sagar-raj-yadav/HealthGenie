import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../styles/colors';
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

interface WaterIntakeTrackerProps {
  progress: number; // 0 to 1
  current: number;
  goal: number;
}

const WaterIntakeTracker: React.FC<WaterIntakeTrackerProps> = ({
  progress,
  current,
  goal,
}) => {
  // Calculate the wave height based on progress
  // When progress is 0, wave is at the bottom (100%)
  // When progress is 1, wave is at the top (0%)
  const waveHeight = `${100 - progress * 100}%`;

  return (
    <View style={styles.container}>

      <View style={styles.waterBottle}>
        <View style={styles.bottleOutline}>
          <View style={[styles.water, {height: waveHeight}]} />
          <View style={styles.cap} />
          <View style={styles.contentContainer}>
            <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            <Text style={styles.amountText}>{current} / {goal} ml</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{current}</Text>
          <Text style={styles.infoLabel}>Current (ml)</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{goal}</Text>
          <Text style={styles.infoLabel}>Goal (ml)</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{goal - current}</Text>
          <Text style={styles.infoLabel}>Remaining (ml)</Text>
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
  waterBottle: {
    width: width*0.5,
    height: height*0.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  bottleOutline: {
    width: '100%',
    height: '100%',
    borderWidth: 6,
    borderColor: colors.secondary,
    borderRadius: "50%",
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  water: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(33, 150, 243, 0.7)',
    borderRadius: 16,
  },
  cap: {
    position: 'absolute',
    top: -15,
    width: 40,
    height: 20,
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    borderRadius: 5,
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  amountText: {
    fontSize: 15,
    color: "white",
    marginTop: 5,
    fontWeight:"bold"
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  infoLabel: {
    fontSize: 12,
    color: "white",
    marginTop: 4,
  },
});

export default WaterIntakeTracker;
