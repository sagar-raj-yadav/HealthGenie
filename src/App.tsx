import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './components/Navigation';
import {HealthProvider} from './contexts/HealthContext';
import {colors} from './styles/colors';

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <HealthProvider>
          <Navigation />
        </HealthProvider>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
