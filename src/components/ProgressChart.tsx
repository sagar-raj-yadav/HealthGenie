import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import colors from '../styles/colors';
interface ChartDataPoint {
  date: string;
  value: number;
  label: string;
}

interface ProgressChartProps {
  data: ChartDataPoint[];
  goalValue?: number;
  isWeight?: boolean;
  isHeartRate?: boolean;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  goalValue,
  isWeight = false,
  isHeartRate = false,
}) => {
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data to display</Text>
      </View>
    );
  }

  // Find the max value to scale the chart
  const values = data.map(item => item.value);
  const maxValue = Math.max(...values) * 1.1; // Add 10% padding to top
  
  // For weight charts, reverse the goal line position if goal is lower than current weight
  const isWeightLossGoal = isWeight && goalValue && goalValue < Math.max(...values);
  
  // Calculate different chart colors based on the type
  const getBarColor = (value: number) => {
    if (isHeartRate) {
      // Heart rate color based on ranges
      if (value < 60) return colors.secondary;
      if (value <= 100) return colors.success;
      if (value <= 140) return colors.warning;
      return colors.error;
    }
    
    if (isWeight && goalValue) {
      // Weight color based on goal (assuming lower is the goal)
      return value <= goalValue ? colors.success : colors.primary;
    }
    
    return colors.primary;
  };

  return (
    <View style={styles.container}>
      {/* Y-axis values */}
      <View style={styles.yAxisContainer}>
        <Text style={styles.axisText}>{maxValue.toFixed(0)}</Text>
        <Text style={styles.axisText}>{(maxValue / 2).toFixed(0)}</Text>
        <Text style={styles.axisText}>0</Text>
      </View>
      
      {/* Chart area */}
      <View style={styles.chartContainer}>
        {/* Goal line if provided */}
        {goalValue && goalValue <= maxValue && (
          <View 
            style={[
              styles.goalLine,
              {
                bottom: `${(goalValue / maxValue) * 100}%`,
                borderColor: isWeightLossGoal ? colors.success : colors.warning
              }
            ]}
          >
            <Text style={[
              styles.goalText,
              {color: isWeightLossGoal ? colors.success : colors.warning}
            ]}>
              Goal: {goalValue}
            </Text>
          </View>
        )}
        
        {/* Data bars */}
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            const barColor = getBarColor(item.value);
            
            return (
              <View key={`${item.date}-${index}`} style={styles.barWrapper}>
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barValue}>{item.value}</Text>
                </View>
                <View style={styles.barBackground}>
                  <View 
                    style={[
                      styles.bar, 
                      {
                        height: `${barHeight}%`,
                        backgroundColor: barColor
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>
        
        {/* X-axis line */}
        <View style={styles.xAxis} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    flexDirection: 'row',
    marginVertical: 16,
  },
  emptyContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  yAxisContainer: {
    width: 40,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    paddingVertical: 8,
  },
  axisText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  chartContainer: {
    flex: 1,
    height: '100%',
    position: 'relative',
    paddingVertical: 8,
    paddingBottom: 20, // Space for x-axis labels
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  goalText: {
    position: 'absolute',
    right: 0,
    top: -16,
    fontSize: 10,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barLabelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  barValue: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  barBackground: {
    width: '60%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  xAxis: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border,
  },
});
