import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import colors from '../styles/colors';

interface DatePickerProps {
  selectedDate: string; // Format: 'YYYY-MM-DD'
  onDateChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  label?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  minDate,
  maxDate,
  label = 'Select Date',
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    // Initialize with the selected date's month or current month
    const date = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  // Parse dates
  const selected = selectedDate ? new Date(selectedDate) : null;
  const min = minDate ? new Date(minDate) : new Date(1900, 0, 1);
  const max = maxDate ? new Date(maxDate) : new Date(2100, 11, 31);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  };

  const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMonthDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Find the first day of the week (0 = Sunday)
    const startDay = firstDay.getDay();
    
    // Build an array of day objects for the calendar
    const days = [];
    
    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push({ day: 0, date: null });
    }
    
    // Add the actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        date: formatDate(date),
        disabled: date < min || date > max,
      });
    }
    
    return days;
  };

  const changeMonth = (increment: number) => {
    const newMonth = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() + increment,
      1
    );
    setDisplayedMonth(newMonth);
  };

  const monthYearString = displayedMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const days = getMonthDays(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth()
  );

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.dateText}>
          {selected ? formatDisplayDate(selectedDate) : 'Select a date'}
        </Text>
      </TouchableOpacity>
      
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.navigationButton}
                onPress={() => changeMonth(-1)}>
                <Text style={styles.navigationButtonText}>{'<'}</Text>
              </TouchableOpacity>
              
              <Text style={styles.monthText}>{monthYearString}</Text>
              
              <TouchableOpacity
                style={styles.navigationButton}
                onPress={() => changeMonth(1)}>
                <Text style={styles.navigationButtonText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.weekdaysContainer}>
              {weekDays.map(day => (
                <Text key={day} style={styles.weekdayText}>
                  {day}
                </Text>
              ))}
            </View>
            
            <View style={styles.calendarGrid}>
              {days.map((item, index) => (
                <TouchableOpacity
                  key={`${item.date || 'empty'}-${index}`}
                  style={[
                    styles.dayButton,
                    !item.date && styles.emptyDay,
                    item.disabled && styles.disabledDay,
                    selectedDate === item.date && styles.selectedDay,
                  ]}
                  disabled={!item.date || item.disabled}
                  onPress={() => {
                    if (item.date) {
                      onDateChange(item.date);
                      setModalVisible(false);
                    }
                  }}>
                  {item.day > 0 && (
                    <Text
                      style={[
                        styles.dayText,
                        item.disabled && styles.disabledDayText,
                        selectedDate === item.date && styles.selectedDayText,
                      ]}>
                      {item.day}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.footerButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.footerButton, styles.todayButton]}
                onPress={() => {
                  const today = formatDate(new Date());
                  const todayDate = new Date(today);
                  
                  if (todayDate >= min && todayDate <= max) {
                    onDateChange(today);
                    setModalVisible(false);
                    
                    // Update displayed month to show current month
                    setDisplayedMonth(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1));
                  }
                }}>
                <Text style={[styles.footerButtonText, styles.todayButtonText]}>
                  Today
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text,
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: colors.inputBackground,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navigationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
  },
  navigationButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    width: 30,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayButton: {
    width: 30,
    height: 30,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  disabledDay: {
    opacity: 0.3,
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
  },
  disabledDayText: {
    color: colors.textSecondary,
  },
  selectedDayText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  footerButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  todayButton: {
    backgroundColor: colors.inputBackground,
  },
  todayButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default DatePicker;
