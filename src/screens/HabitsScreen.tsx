import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import HabitTracker from '../components/Habits/HabitTracker';
import HabitList from '../components/Habits/HabitList';
import {colors} from '../styles/colors';

const HabitsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <HabitTracker />
        <HabitList />
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

export default HabitsScreen;
