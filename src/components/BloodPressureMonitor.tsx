import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../styles/colors';

interface BloodPressureMonitorProps {
  systolic: number;
  diastolic: number;
  timestamp?: string;
}

const BloodPressureMonitor: React.FC<BloodPressureMonitorProps> = ({
  systolic,
  diastolic,
  timestamp,
}) => {
  // Determine blood pressure category
  const getCategory = () => {
    if (systolic < 120 && diastolic < 80) {
      return {
        name: 'Normal',
        color: colors.success,
        description: 'Your blood pressure is within normal range.',
      };
    } else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
      return {
        name: 'Elevated',
        color: colors.warning,
        description: 'Your blood pressure is slightly elevated. Consider lifestyle changes.',
      };
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return {
        name: 'High Blood Pressure (Stage 1)',
        color: colors.warning,
        description: 'You have stage 1 hypertension. Consult with your doctor.',
      };
    } else if (systolic >= 140 || diastolic >= 90) {
      return {
        name: 'High Blood Pressure (Stage 2)',
        color: colors.error,
        description: 'You have stage 2 hypertension. Medical attention is recommended.',
      };
    } else if (systolic > 180 || diastolic > 120) {
      return {
        name: 'Hypertensive Crisis',
        color: colors.error,
        description: 'Seek emergency medical attention immediately!',
      };
    }
    return {
      name: 'Unknown',
      color: colors.textSecondary,
      description: 'Unable to determine blood pressure category.',
    };
  };

  const category = getCategory();

  return (
    <View style={styles.container}>
      <View style={styles.readingContainer}>
        <Text style={styles.readingValue}>
          {systolic}/{diastolic}
        </Text>
        <Text style={styles.readingUnit}>mmHg</Text>
      </View>
      
      <View style={[styles.categoryBadge, {backgroundColor: category.color}]}>
        <Text style={styles.categoryText}>{category.name}</Text>
      </View>
      
      <Text style={styles.description}>{category.description}</Text>
      
      {timestamp && (
        <Text style={styles.timestamp}>
          Recorded: {new Date(timestamp).toLocaleString()}
        </Text>
      )}
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Systolic</Text>
          <Text style={styles.infoValue}>{systolic}</Text>
          <Text style={styles.infoDescription}>Upper number</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Diastolic</Text>
          <Text style={styles.infoValue}>{diastolic}</Text>
          <Text style={styles.infoDescription}>Lower number</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  readingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  readingValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  readingUnit: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  description: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  separator: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default BloodPressureMonitor;
