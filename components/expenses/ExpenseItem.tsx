import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Expense } from '@/types/expense';
import { formatDate } from '@/utils/expenseUtils';
import { Trash2 } from 'lucide-react-native';

interface ExpenseItemProps {
  expense: Expense;
  onPress: () => void;
  onDelete: () => void;
}

export default function ExpenseItem({ expense, onPress, onDelete }: ExpenseItemProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{expense.name}</Text>
        <Text style={styles.date}>{formatDate(expense.createdAt)}</Text>
      </View>
      
      <View style={styles.rightContainer}>
        <Text style={styles.amount}>${parseFloat(expense.amount).toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={16} color={Colors.error[500]} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.gray[900],
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.gray[900],
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
});