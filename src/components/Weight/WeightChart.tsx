import React, {useContext, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {HealthContext} from '../../contexts/HealthContext';
import {colors} from '../../styles/colors';
import {formatDateForDisplay} from '../../utils/dateUtils';

const WeightChart: React.FC = () => {
  const {weightEntries} = useContext(HealthContext);

  // Sort entries by date
  const sortedEntries = useMemo(() => {
    return [...weightEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [weightEntries]);

  // Calculate stats
  const stats = useMemo(() => {
    if (sortedEntries.length === 0) {
      return {
        current: 0,
        lowest: 0,
        highest: 0,
        average: 0,
        trend: 'neutral',
      };
    }

    const current = sortedEntries[sortedEntries.length - 1].weight;
    const lowest = Math.min(...sortedEntries.map(e => e.weight));
    const highest = Math.max(...sortedEntries.map(e => e.weight));
    const average =
      sortedEntries.reduce((acc, curr) => acc + curr.weight, 0) /
      sortedEntries.length;

    // Determine trend (comparing last two entries)
    let trend = 'neutral';
    if (sortedEntries.length >= 2) {
      const lastEntry = sortedEntries[sortedEntries.length - 1];
      const previousEntry = sortedEntries[sortedEntries.length - 2];
      if (lastEntry.weight < previousEntry.weight) {
        trend = 'down';
      } else if (lastEntry.weight > previousEntry.weight) {
        trend = 'up';
      }
    }

    return {
      current,
      lowest,
      highest,
      average: parseFloat(average.toFixed(1)),
      trend,
    };
  }, [sortedEntries]);

  // Get chart data for visualization
  const chartData = useMemo(() => {
    // Take last 7 entries or all if less than 7
    const chartEntries = sortedEntries.slice(-7);
    
    if (chartEntries.length === 0) return [];

    const minWeight = Math.min(...chartEntries.map(e => e.weight));
    const maxWeight = Math.max(...chartEntries.map(e => e.weight));
    const range = Math.max(maxWeight - minWeight, 1); // Prevent division by zero

    return chartEntries.map(entry => ({
      id: entry.id,
      weight: entry.weight,
      date: formatDateForDisplay(entry.date),
      percentage: ((entry.weight - minWeight) / range) * 70, // Use 70% of the height for better visualization
    }));
  }, [sortedEntries]);

  const renderTrendIcon = () => {
    if (stats.trend === 'up') {
      return <Text style={[styles.trendIcon, styles.trendUp]}>▲</Text>;
    } else if (stats.trend === 'down') {
      return <Text style={[styles.trendIcon, styles.trendDown]}>▼</Text>;
    }
    return <Text style={styles.trendIcon}>─</Text>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Trends</Text>

      {weightEntries.length > 0 ? (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.current}</Text>
              <Text style={styles.statLabel}>Current</Text>
              {renderTrendIcon()}
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.lowest}</Text>
              <Text style={styles.statLabel}>Lowest</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.highest}</Text>
              <Text style={styles.statLabel}>Highest</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.average}</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
          </View>

          {chartData.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>
                {chartData.length > 1
                  ? 'Weight History'
                  : 'Add more entries to see a chart'}
              </Text>
              <View style={styles.chart}>
                {chartData.map((item, index) => (
                  <View key={item.id} style={styles.chartBarContainer}>
                    <View style={styles.chartLabelContainer}>
                      <Text style={styles.chartValue}>{item.weight}</Text>
                    </View>
                    <View style={styles.barOuterContainer}>
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height: `${30 + item.percentage}%`,
                            backgroundColor:
                              index === chartData.length - 1
                                ? colors.primary
                                : colors.secondary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.chartDate}>{item.date}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <Text style={styles.historyTitle}>Weight History</Text>
          <ScrollView style={styles.historyContainer}>
            {sortedEntries
              .slice()
              .reverse()
              .map(entry => (
                <View key={entry.id} style={styles.historyItem}>
                  <Text style={styles.historyWeight}>{entry.weight} kg</Text>
                  <Text style={styles.historyDate}>
                    {formatDateForDisplay(entry.date)}
                  </Text>
                </View>
              ))}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.noData}>No weight entries yet</Text>
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
    paddingVertical: 12,
    marginBottom: 20,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    paddingHorizontal: 8,
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
  trendIcon: {
    fontSize: 12,
    marginTop: 2,
    color: colors.textSecondary,
  },
  trendUp: {
    color: colors.danger, // Red for weight gain (typically not desired)
  },
  trendDown: {
    color: colors.success, // Green for weight loss
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
    paddingTop: 20,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  chartLabelContainer: {
    position: 'absolute',
    top: -20,
    zIndex: 10,
  },
  chartValue: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  barOuterContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '50%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
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
    maxHeight: 180,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyWeight: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  historyDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  noData: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginVertical: 20,
  },
});

export default WeightChart;
