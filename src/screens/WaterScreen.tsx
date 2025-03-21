import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import WaterProgress from '../components/WaterIntake/WaterProgress';
import WaterTracker from '../components/WaterIntake/WaterTracker';
import {colors} from '../styles/colors';

const WaterScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <WaterProgress />
        <WaterTracker />
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

export default WaterScreen;
