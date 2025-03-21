import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {HealthContext} from '../../contexts/HealthContext';
import {colors} from '../../styles/colors';

const HeartRateTracker: React.FC = () => {
  const {addHeartRateEntry} = useContext(HealthContext);
  const [heartRate, setHeartRate] = useState('');

  const handleAddHeartRate = () => {
    const rate = parseInt(heartRate, 10);
    if (isNaN(rate) || rate <= 0) {
      Alert.alert('Invalid Entry', 'Please enter a valid heart rate');
      return;
    }

    if (rate < 30 || rate > 220) {
      Alert.alert(
        'Unusual Heart Rate',
        'The value you entered seems unusual. Are you sure it\'s correct?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes, Save It',
            onPress: () => {
              addHeartRateEntry(rate);
              setHeartRate('');
              Alert.alert('Success', 'Heart rate added successfully!');
            },
          },
        ],
      );
      return;
    }

    addHeartRateEntry(rate);
    setHeartRate('');
    Alert.alert('Success', 'Heart rate added successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Heart Rate Tracker</Text>
        <Icon name="activity" size={24} color={colors.primary} />
      </View>

      <Text style={styles.description}>
        Monitor your heart rate to keep track of your cardiovascular health
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter heart rate (BPM)"
          keyboardType="numeric"
          value={heartRate}
          onChangeText={setHeartRate}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddHeartRate}>
          <Text style={styles.addButtonText}>Add Heart Rate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Normal Resting Heart Rate:</Text>
        <Text style={styles.infoText}>
          • Adults: 60-100 beats per minute
        </Text>
        <Text style={styles.infoText}>
          • Well-trained athletes: 40-60 beats per minute
        </Text>
        <Text style={styles.infoNote}>
          Note: Heart rate can vary with activity, emotions, medications, and
          other factors.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  inputContainer: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 20,
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoNote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginTop: 8,
  },
});

export default HeartRateTracker;
