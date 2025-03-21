import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import BloodPressureTracker from '../components/BloodPressure/BloodPressureTracker';
import BloodPressureHistory from '../components/BloodPressure/BloodPressureHistory';
import {colors} from '../styles/colors';

const BloodPressureScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <BloodPressureTracker />
        <BloodPressureHistory />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
});

export default BloodPressureScreen;
