/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

// Add web support
if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('app-root');
  AppRegistry.runApplication(appName, { rootTag });
}
