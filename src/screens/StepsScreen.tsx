import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import StepTracker from '../components/Steps/StepTracker';
import StepHistory from '../components/Steps/StepHistory';
import {colors} from '../styles/colors';

const StepsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <StepTracker />
        <StepHistory />
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

export default StepsScreen;
