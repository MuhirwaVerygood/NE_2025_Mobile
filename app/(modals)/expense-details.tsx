import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { getExpenseById, deleteExpense } from '@/services/api';
import { Expense } from '@/types/expense';
import { formatDate } from '@/utils/expenseUtils';
import { ArrowLeft, Calendar, FilePenLine, Pencil, Trash2 } from 'lucide-react-native';

export default function ExpenseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No expense ID provided');
      setLoading(false);
      return;
    }

    const fetchExpenseDetails = async () => {
      try {
        setLoading(true);
        const data = await getExpenseById(id);
        setExpense(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load expense details');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseDetails();
  }, [id]);

  const handleDelete = () => {
    if (!expense) return;

    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expense.id);
              router.back();
            } catch (err: any) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ],
    );
  };

  const handleEdit = () => {
    if (!expense) return;
router.push({
  pathname: '/edit-expense/[id]',
  params: { id: expense.id }
});
  }
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary[600]} />
      </View>
    );
  }

  if (error || !expense) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.gray[700]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={styles.placeholderRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Expense not found'}</Text>
          <TouchableOpacity style={styles.backToListButton} onPress={() => router.back()}>
            <Text style={styles.backToListText}>Back to List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.gray[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Details</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Pencil size={20} color={Colors.primary[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>${parseFloat(expense.amount).toFixed(2)}</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <FilePenLine size={20} color={Colors.gray[600]} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{expense.name}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Calendar size={20} color={Colors.gray[600]} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(expense.createdAt)}</Text>
            </View>
          </View>

          {expense.description && (
            <View style={[styles.detailRow, styles.detailRow_last]}>
              <View style={styles.detailIcon}>
                <FilePenLine size={20} color={Colors.gray[600]} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{expense.description}</Text>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={20} color={Colors.white} />
          <Text style={styles.deleteButtonText}>Delete Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.gray[900],
  },
  editButton: {
    padding: 8,
  },
  placeholderRight: {
    width: 36,
  },
  scrollContainer: {
    flex: 1,
  },
  amountContainer: {
    backgroundColor: Colors.primary[600],
    padding: 24,
    alignItems: 'center',
  },
  amountLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary[100],
    marginBottom: 8,
  },
  amountValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: Colors.white,
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  detailRow_last: {
    borderBottomWidth: 0,
  },
  detailIcon: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.gray[900],
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: Colors.error[600],
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.error[600],
    textAlign: 'center',
    marginBottom: 16,
  },
  backToListButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToListText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
  },
})