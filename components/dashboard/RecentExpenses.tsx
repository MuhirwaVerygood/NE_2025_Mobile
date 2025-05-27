import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Expense } from '@/types/expense';
import { formatDate } from '@/utils/expenseUtils';
import { ChevronRight } from 'lucide-react-native';

interface RecentExpensesProps {
  expenses: Expense[];
}

export default function RecentExpenses({ expenses }: RecentExpensesProps) {
  const handleViewAll = () => {
    router.push('/expenses');
  };

  const handleExpensePress = (expense: Expense) => {
    router.push(`/(modals)/expense-details?id=${expense.id}`);
  };

  if (expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No recent expenses</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-expense')}
        >
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.expenseItem}
            onPress={() => handleExpensePress(item)}
          >
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseTitle}>{item.name}</Text>
              <Text style={styles.expenseDate}>{formatDate(item.createdAt)}</Text>
            </View>
            
            <View style={styles.expenseAmount}>
              <Text style={styles.amountText}>
                ${parseFloat(item.amount).toFixed(2)}
              </Text>
              <ChevronRight size={16} color={Colors.gray[400]} />
            </View>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.gray[800],
  },
  viewAll: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary[600],
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  expenseDetails: {
    flex: 1,
  },
  expenseTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[800],
    marginBottom: 4,
  },
  expenseDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
  },
  expenseAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[900],
    marginRight: 4,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
});