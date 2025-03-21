import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import WaterScreen from '../screens/WaterScreen';
import StepsScreen from '../screens/StepsScreen';
import WeightScreen from '../screens/WeightScreen';
import BloodPressureScreen from '../screens/BloodPressureScreen';
import HeartRateScreen from '../screens/HeartRateScreen';
import HabitsScreen from '../screens/HabitsScreen';
import {colors} from '../styles/colors';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tab.Screen
        name="Water"
        component={WaterScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="droplet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Steps"
        component={StepsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="activity" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Weight"
        component={WeightScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="bar-chart-2" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Blood Pressure"
        component={BloodPressureScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Heart Rate"
        component={HeartRateScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="activity" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="check-square" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
