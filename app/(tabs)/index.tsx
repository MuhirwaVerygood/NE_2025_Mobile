import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import RecentExpenses from '@/components/dashboard/RecentExpenses';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import { fetchExpenses } from '@/services/api';
import { Expense } from '@/types/expense';
import { calculateTotalExpenses, groupExpensesByCategory } from '@/utils/expenseUtils';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadExpenses = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const totalExpenses = calculateTotalExpenses(expenses);
  const expensesByCategory = groupExpensesByCategory(expenses);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary[600]} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary[600]]} />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
        </View>

        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Total Expenses</Text>
          <Text style={styles.overviewAmount}>${totalExpenses.toFixed(2)}</Text>
          <Text style={styles.overviewPeriod}>This Month</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Spending Overview</Text>
              <ExpenseChart expenses={expensesByCategory} />
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Budget Progress</Text>
              <BudgetProgress totalSpent={totalExpenses} budgetLimit={2000} />
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <RecentExpenses expenses={expenses.slice(0, 5)} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  headerContainer: {
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.gray[900],
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
  },
  overviewCard: {
    backgroundColor: Colors.primary[600],
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  overviewTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary[100],
    marginBottom: 8,
  },
  overviewAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: Colors.white,
    marginBottom: 4,
  },
  overviewPeriod: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.primary[100],
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.gray[800],
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: Colors.error[50],
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.error[700],
  },
});