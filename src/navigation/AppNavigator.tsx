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
import AIScreen from '../screens/AIScreen';
import AICHAT from '../screens/AIchat';

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
        case 'aiscreen':
          return (
            <View style={styles.iconCircle}>
              <View style={styles.aiBrainIcon} />
            </View>
          );
        
          case 'aichat':
            return (
              <View style={styles.iconCircle}>
                <View style={styles.chatBubbleIcon} />
              </View>
            );
          
      default:
        return <View style={styles.iconCircle} />;
    }
  };

  return (
    <View style={styles.tabIcon}>
      {getIconContent()}
    </View>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
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
    headerShown: false, // Hide the header for all screens
  })}
>

<Tab.Screen 
  name="Home" 
  component={HomeScreen} 
  options={{  headerShown: false }} 
/>

      <Tab.Screen 
        name="WaterIntake" 
        component={WaterIntakeScreen} 
        options={{headerShown: false}}
      />
      <Tab.Screen 
        name="StepCount" 
        component={StepCountScreen} 
        options={{ headerShown: false}}
      />
      <Tab.Screen 
        name="Weight" 
        component={WeightScreen} 
        options={{headerShown: false}}
      />
      <Tab.Screen 
        name="BloodPressure" 
        component={BloodPressureScreen} 
        options={{headerShown: false}}
      />
      <Tab.Screen 
        name="HeartRate" 
        component={HeartRateScreen} 
        options={{ headerShown: false}}
      />
      <Tab.Screen 
        name="HabitTracking" 
        component={HabitTrackingScreen} 
        options={{ headerShown: false}}
      />
      <Tab.Screen 
        name="aiscreen" 
        component={AIScreen} 
        options={{ headerShown: false}}
      />
      <Tab.Screen 
        name="aichat" 
        component={AICHAT} 
        options={{ headerShown: false}}
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
  chatBubbleIcon: {
    width: 14,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 4,
    position: 'relative',
  },
  aiBrainIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.cardBackground,
  },
  chatBubbleTail: {
    position: 'absolute',
    bottom: -3,
    left: 5,
    width: 6,
    height: 6,
    backgroundColor: colors.primary,
    transform: [{ rotate: '45deg' }],
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
