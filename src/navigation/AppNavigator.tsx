import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import HomeScreen from '../screens/HomeScreen';
import WaterIntakeScreen from '../screens/WaterIntakeScreen';
import StepCountScreen from '../screens/StepCountScreen';
import WeightScreen from '../screens/WeightScreen';
import BloodPressureScreen from '../screens/BloodPressureScreen';
import HeartRateScreen from '../screens/HeartRateScreen';
import HabitTrackingScreen from '../screens/HabitTrackingScreen';
import colors from '../styles/colors';
import {View, Text, StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Simple custom tab icons
const TabIcon: React.FC<{name: string; focused: boolean}> = ({name, focused}) => {
  // Get the appropriate icon based on the tab name
  const getIconContent = () => {
    switch (name) {
      case 'Home':
        return (
          <View style={styles.iconCircle}>
            <View style={styles.homeIcon} />
          </View>
        );
      case 'WaterIntake':
        return (
          <View style={styles.iconCircle}>
            <View style={styles.waterDropTop} />
            <View style={styles.waterDropBottom} />
          </View>
        );
      case 'StepCount':
        return (
          <View style={styles.iconCircle}>
            <View style={styles.stepIcon}>
              <View style={styles.stepLine1} />
              <View style={styles.stepLine2} />
            </View>
          </View>
        );
      case 'Weight':
        return (
          <View style={styles.iconCircle}>
            <View style={styles.weightIcon} />
          </View>
        );
      case 'BloodPressure':
        return (
          <View style={styles.iconCircle}>
            <View style={styles.bpIcon} />
          </View>
        );
      case 'HeartRate':
        return (
          <View style={styles.iconCircle}>
            <View style={styles.heartShape} />
          </View>
        );
      case 'HabitTracking':
        return (
          <View style={styles.iconCircle}>
            <View style={styles.habitIcon}>
              <View style={styles.checkmark} />
            </View>
          </View>
        );
      default:
        return <View style={styles.iconCircle} />;
    }
  };

  return (
    <View style={styles.tabIcon}>
      {getIconContent()}
      <Text
        style={[
          styles.tabLabel,
          {color: focused ? colors.primary : colors.textSecondary},
        ]}>
        {name === 'WaterIntake'
          ? 'Water'
          : name === 'StepCount'
          ? 'Steps'
          : name === 'BloodPressure'
          ? 'BP'
          : name === 'HeartRate'
          ? 'Heart'
          : name === 'HabitTracking'
          ? 'Habits'
          : name}
      </Text>
    </View>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
        headerStyle: {
          backgroundColor: colors.cardBackground,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{title: 'Health Tracker'}}
      />
      <Tab.Screen 
        name="WaterIntake" 
        component={WaterIntakeScreen} 
        options={{title: 'Water Intake'}}
      />
      <Tab.Screen 
        name="StepCount" 
        component={StepCountScreen} 
        options={{title: 'Step Counter'}}
      />
      <Tab.Screen 
        name="Weight" 
        component={WeightScreen} 
        options={{title: 'Weight Tracker'}}
      />
      <Tab.Screen 
        name="BloodPressure" 
        component={BloodPressureScreen} 
        options={{title: 'Blood Pressure'}}
      />
      <Tab.Screen 
        name="HeartRate" 
        component={HeartRateScreen} 
        options={{title: 'Heart Rate'}}
      />
      <Tab.Screen 
        name="HabitTracking" 
        component={HabitTrackingScreen} 
        options={{title: 'Habit Tracker'}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  // Home icon
  homeIcon: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 2,
  },
  // Water icon
  waterDropTop: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primary,
    transform: [{rotate: '180deg'}],
  },
  waterDropBottom: {
    position: 'absolute',
    bottom: 0,
    width: 12,
    height: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: colors.primary,
  },
  // Step icon
  stepIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
  },
  stepLine1: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: colors.primary,
    transform: [{rotate: '45deg'}],
  },
  stepLine2: {
    position: 'absolute',
    width: 10,
    height: 2,
    backgroundColor: colors.primary,
    left: -2,
    bottom: 2,
    transform: [{rotate: '-45deg'}],
  },
  // Weight icon
  weightIcon: {
    width: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  // Blood pressure icon
  bpIcon: {
    width: 8,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  // Heart rate icon
  heartShape: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    transform: [{rotate: '45deg'}],
  },
  // Habit tracking icon
  habitIcon: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 8,
    height: 5,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.primary,
    transform: [{rotate: '-45deg'}],
    marginTop: -2,
  },
});

export default AppNavigator;
