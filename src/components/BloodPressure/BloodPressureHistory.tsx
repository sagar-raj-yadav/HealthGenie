import React, {useContext, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {HealthContext} from '../../contexts/HealthContext';
import {colors} from '../../styles/colors';
import {formatDateTimeForDisplay} from '../../utils/dateUtils';

const BloodPressureHistory: React.FC = () => {
  const {bloodPressureEntries} = useContext(HealthContext);

  // Sort entries by date (newest first)
  const sortedEntries = useMemo(() => {
    return [...bloodPressureEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [bloodPressureEntries]);

  // Calculate average for the latest readings (last 5)
  const averages = useMemo(() => {
    if (sortedEntries.length === 0) {
      return {systolic: 0, diastolic: 0};
    }

    const recentEntries = sortedEntries.slice(0, Math.min(5, sortedEntries.length));
    const totalSystolic = recentEntries.reduce((acc, entry) => acc + entry.systolic, 0);
    const totalDiastolic = recentEntries.reduce((acc, entry) => acc + entry.diastolic, 0);

    return {
      systolic: Math.round(totalSystolic / recentEntries.length),
      diastolic: Math.round(totalDiastolic / recentEntries.length),
    };
  }, [sortedEntries]);

  // Determine status based on latest averages
  const getBPStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) {
      return {
        status: 'Normal',
        color: colors.success,
        icon: 'smile',
      };
    } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
      return {
        status: 'Elevated',
        color: colors.warning,
        icon: 'alert-circle',
      };
    } else {
      return {
        status: 'High',
        color: colors.danger,
        icon: 'alert-triangle',
      };
    }
  };

  const statusInfo = getBPStatus(averages.systolic, averages.diastolic);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blood Pressure History</Text>

      {sortedEntries.length > 0 ? (
        <>
          <View style={styles.averageContainer}>
            <View style={styles.averageHeader}>
              <Text style={styles.averageTitle}>Recent Average</Text>
              <Text style={styles.averageSubtitle}>(last 5 readings)</Text>
            </View>
            <View style={styles.averageValues}>
              <Text style={styles.averageReading}>
                {averages.systolic}/{averages.diastolic}
              </Text>
              <Text style={styles.mmHg}>mmHg</Text>
            </View>
            <View
              style={[styles.statusContainer, {borderColor: statusInfo.color}]}>
              <Icon name={statusInfo.icon} size={16} color={statusInfo.color} />
              <Text style={[styles.statusText, {color: statusInfo.color}]}>
                {statusInfo.status}
              </Text>
            </View>
          </View>

          <Text style={styles.historyTitle}>Reading History</Text>
          <ScrollView style={styles.historyContainer}>
            {sortedEntries.map(entry => {
              const entryStatus = getBPStatus(entry.systolic, entry.diastolic);
              return (
                <View key={entry.id} style={styles.historyItem}>
                  <View style={styles.readingContainer}>
                    <Text style={styles.reading}>
                      {entry.systolic}/{entry.diastolic}
                    </Text>
                    <Text style={styles.readingUnit}>mmHg</Text>
                  </View>
                  <View style={styles.readingInfo}>
                    <Text style={styles.readingDate}>
                      {formatDateTimeForDisplay(entry.date)}
                    </Text>
                    <View style={styles.readingStatus}>
                      <View
                        style={[
                          styles.statusDot,
                          {backgroundColor: entryStatus.color},
                        ]}
                      />
                      <Text style={styles.statusLabel}>{entryStatus.status}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.noData}>No blood pressure readings yet</Text>
      )}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  averageContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  averageHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  averageTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  averageSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  averageValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  averageReading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  mmHg: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 16,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  historyContainer: {
    maxHeight: 280,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  readingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  reading: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  readingUnit: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  readingInfo: {
    alignItems: 'flex-end',
  },
  readingDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  readingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  noData: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginVertical: 20,
  },
});

export default BloodPressureHistory;
