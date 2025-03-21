import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {HealthContext} from '../../contexts/HealthContext';
import {colors} from '../../styles/colors';

const predefinedAmounts = [50, 100, 200, 250, 500];

const WaterTracker: React.FC = () => {
  const {waterIntake, updateWaterIntake, resetWaterIntake} = useContext(HealthContext);
  const [customAmount, setCustomAmount] = useState('');

  const handleAddWater = (amount: number) => {
    if (amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a positive number');
      return;
    }
    updateWaterIntake(amount);
    setCustomAmount('');
  };

  const handleCustomAmountSubmit = () => {
    const amount = parseInt(customAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid number');
      return;
    }
    handleAddWater(amount);
  };

  const handleResetWater = () => {
    Alert.alert(
      'Reset Water Intake',
      'Are you sure you want to reset your water intake for today?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => resetWaterIntake(),
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Water Intake (ml)</Text>
        <TouchableOpacity onPress={handleResetWater} style={styles.resetButton}>
          <Icon name="refresh-cw" size={18} color={colors.danger} />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.predefinedContainer}>
        {predefinedAmounts.map(amount => (
          <TouchableOpacity
            key={amount}
            style={styles.amountButton}
            onPress={() => handleAddWater(amount)}>
            <View style={styles.amountButtonInner}>
              <Icon name="plus" size={16} color={colors.white} />
              <Text style={styles.amountButtonText}>{amount} ml</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.customContainer}>
        <TextInput
          style={styles.customInput}
          placeholder="Custom amount (ml)"
          keyboardType="numeric"
          value={customAmount}
          onChangeText={setCustomAmount}
        />
        <TouchableOpacity
          style={styles.customButton}
          onPress={handleCustomAmountSubmit}>
          <Text style={styles.customButtonText}>Add</Text>
        </TouchableOpacity>
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
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.danger,
  },
  predefinedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    width: '48%',
    marginBottom: 8,
  },
  amountButtonInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  amountButtonText: {
    color: colors.white,
    fontWeight: '500',
    marginLeft: 4,
  },
  customContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  customButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  customButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
});

export default WaterTracker;
