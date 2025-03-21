import React, {useContext, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {HealthContext} from '../../contexts/HealthContext';
import {colors} from '../../styles/colors';
import {formatDateTimeForDisplay} from '../../utils/dateUtils';

const HeartRateHistory: React.FC = () => {
  const {heartRateEntries} = useContext(HealthContext);

  // Sort entries by date (newest first)
  const sortedEntries = useMemo(() => {
    return [...heartRateEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [heartRateEntries]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (sortedEntries.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        latest: 0,
      };
    }

    const rates = sortedEntries.map(entry => entry.rate);
    const average = rates.reduce((acc, rate) => acc + rate, 0) / rates.length;
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const latest = sortedEntries[0].rate;

    return {
      average: Math.round(average),
      min,
      max,
      latest,
    };
  }, [sortedEntries]);

  // Get heart rate category
  const getHeartRateCategory = (rate: number) => {
    if (rate < 60) {
      return {
        category: 'Below Normal',
        color: colors.warning,
      };
    } else if (rate >= 60 && rate <= 100) {
      return {
        category: 'Normal',
        color: colors.success,
      };
    } else {
      return {
        category: 'Above Normal',
        color: colors.danger,
      };
    }
  };

  // Process data for visualization
  const chartData = useMemo(() => {
    // Take the last 10 entries but display them oldest to newest
    return sortedEntries.slice(0, 10).reverse();
  }, [sortedEntries]);

  // Find the min and max for chart scaling
  const chartRange = useMemo(() => {
    if (chartData.length === 0) return {min: 0, max: 100};
    
    const rates = chartData.map(entry => entry.rate);
    let min = Math.min(...rates);
    let max = Math.max(...rates);
    
    // Add some padding to the range
    min = Math.max(0, min - 10);
    max = max + 10;
    
    return {min, max};
  }, [chartData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heart Rate History</Text>

      {sortedEntries.length > 0 ? (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.latest}</Text>
              <Text style={styles.statLabel}>Latest</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.average}</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.min}</Text>
              <Text style={styles.statLabel}>Minimum</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.max}</Text>
              <Text style={styles.statLabel}>Maximum</Text>
            </View>
          </View>

          {chartData.length > 1 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Recent Heart Rate Trend</Text>
              <View style={styles.chart}>
                {chartData.map((entry, index) => {
                  const range = chartRange.max - chartRange.min;
                  const heightPercentage = range > 0 
                    ? ((entry.rate - chartRange.min) / range) * 70 
                    : 0;
                    
                  const category = getHeartRateCategory(entry.rate);
                  
                  return (
                    <View key={entry.id} style={styles.chartPoint}>
                      <View style={styles.chartBarContainer}>
                        <Text style={styles.chartValue}>{entry.rate}</Text>
                        <View 
                          style={[
                            styles.chartBar, 
                            {
                              height: `${20 + heightPercentage}%`,
                              backgroundColor: category.color
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.chartDate}>
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <Text style={styles.historyTitle}>Reading History</Text>
          <ScrollView style={styles.historyContainer}>
            {sortedEntries.map(entry => {
              const category = getHeartRateCategory(entry.rate);
              return (
                <View key={entry.id} style={styles.historyItem}>
                  <View style={styles.rateContainer}>
                    <Text style={styles.rateValue}>{entry.rate}</Text>
                    <Text style={styles.rateUnit}>BPM</Text>
                  </View>
                  <View style={styles.rateInfo}>
                    <Text style={styles.rateDate}>
                      {formatDateTimeForDisplay(entry.date)}
                    </Text>
                    <View
                      style={[
                        styles.categoryBadge,
                        {backgroundColor: category.color},
                      ]}>
                      <Text style={styles.categoryText}>{category.category}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.noData}>No heart rate readings yet</Text>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
  },
  chartPoint: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartValue: {
    position: 'absolute',
    top: 0,
    fontSize: 12,
    fontWeight: '500',
  },
  chartBar: {
    width: 8,
    borderRadius: 4,
  },
  chartDate: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  historyContainer: {
    maxHeight: 200,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  rateUnit: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  rateInfo: {
    alignItems: 'flex-end',
  },
  rateDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '500',
  },
  noData: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginVertical: 20,
  },
});

export default HeartRateHistory;
