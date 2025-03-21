import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import HeartRateTracker from '../components/HeartRate/HeartRateTracker';
import HeartRateHistory from '../components/HeartRate/HeartRateHistory';
import {colors} from '../styles/colors';

const HeartRateScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <HeartRateTracker />
        <HeartRateHistory />
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

export default HeartRateScreen;
