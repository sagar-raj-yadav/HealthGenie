import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import WeightTracker from '../components/Weight/WeightTracker';
import WeightChart from '../components/Weight/WeightChart';
import {colors} from '../styles/colors';

const WeightScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <WeightTracker />
        <WeightChart />
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

export default WeightScreen;
