import React from 'react';
import {View, Text, StyleSheet, Animated, Easing} from 'react-native';
import colors from '../styles/colors';

interface HeartRateMonitorProps {
  bpm: number;
  timestamp?: string;
}

const HeartRateMonitor: React.FC<HeartRateMonitorProps> = ({
  bpm,
  timestamp,
}) => {
  // Determine heart rate category
  const getCategory = () => {
    // These are general categories and may vary by age, fitness level, etc.
    if (bpm < 60) {
      return {
        name: 'Resting',
        color: colors.secondary,
        description: 'Your heart rate is lower than average resting rate.',
      };
    } else if (bpm >= 60 && bpm <= 100) {
      return {
        name: 'Normal',
        color: colors.success,
        description: 'Your heart rate is within the normal resting range.',
      };
    } else if (bpm > 100 && bpm <= 140) {
      return {
        name: 'Elevated',
        color: colors.warning,
        description: 'Your heart rate is elevated, possibly due to activity or stress.',
      };
    } else {
      return {
        name: 'High',
        color: colors.error,
        description: 'Your heart rate is high. This might be due to exercise or could indicate a health issue.',
      };
    }
  };

  // Create a pulsing animation for the heart
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    // Calculate duration based on heart rate (60 / bpm gives seconds per beat)
    const beatDuration = (60 / bpm) * 1000;
    
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: beatDuration / 2,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: beatDuration / 2,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      })
    ]);
    
    Animated.loop(pulse).start();
    
    return () => {
      pulseAnim.stopAnimation();
    };
  }, [bpm, pulseAnim]);

  const category = getCategory();

  return (
    <View style={styles.container}>
      <View style={styles.heartContainer}>
        <Animated.View 
          style={[
            styles.heart,
            {
              transform: [{scale: pulseAnim}],
              backgroundColor: category.color,
            }
          ]}
        />
      </View>
      
      <View style={styles.readingContainer}>
        <Text style={styles.readingValue}>{bpm}</Text>
        <Text style={styles.readingUnit}>BPM</Text>
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
      
      <View style={styles.rangesContainer}>
        <Text style={styles.rangesTitle}>Heart Rate Ranges:</Text>
        <Text style={styles.rangeText}>• Resting: &lt;60 BPM</Text>
        <Text style={styles.rangeText}>• Normal: 60-100 BPM</Text>
        <Text style={styles.rangeText}>• Elevated: 101-140 BPM</Text>
        <Text style={styles.rangeText}>• High: &gt;140 BPM</Text>
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
  heartContainer: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heart: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.error,
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
  rangesContainer: {
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rangesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  rangeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});

export default HeartRateMonitor;
