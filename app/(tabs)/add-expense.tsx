import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { createExpense } from '@/services/api';
import { Calendar, DollarSign, FilePenLine } from 'lucide-react-native';

const ExpenseSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  amount: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number (e.g., 10 or 10.99)')
    .required('Amount is required'),
  createdAt: Yup.date().required('Please select a valid date'),
  description: Yup.string().optional(),
});

export default function AddExpenseScreen() {
  const [submitting, setSubmitting] = useState(false);

  const handleAddExpense = async (values: any) => {
    try {
      setSubmitting(true);
      await createExpense({
        name: values.name,
        amount: values.amount,
        description: values.description || '',
        // Remove createdAt if your API doesn't expect it
      });
      
      Alert.alert(
        'Success',
        'Expense added successfully',
        [{ text: 'OK', onPress: () => router.push('/expenses') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.screenTitle}>Add New Expense</Text>
          
          <Formik
            initialValues={{
              name: '',
              amount: '',
              createdAt: new Date(),
              description: '',
            }}
            validationSchema={ExpenseSchema}
            onSubmit={handleAddExpense}
          >
            {({
              handleChange,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <FilePenLine size={20} color={Colors.gray[600]} />
                    <Text style={styles.label}>Name</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Expense name"
                    value={values.name}
                    onChangeText={handleChange('name')}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <DollarSign size={20} color={Colors.gray[600]} />
                    <Text style={styles.label}>Amount</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    value={values.amount}
                    onChangeText={handleChange('amount')}
                    keyboardType="decimal-pad"
                  />
                  {touched.amount && errors.amount && (
                    <Text style={styles.errorText}>{errors.amount}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Calendar size={20} color={Colors.gray[600]} />
                    <Text style={styles.label}>Date</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => {
                      // Placeholder for date picker
                    }}
                  >
                    <Text style={styles.dateText}>
                      {values.createdAt.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  {touched.createdAt && errors.createdAt && (
                    <Text style={styles.errorText}>{String(errors.createdAt)}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <FilePenLine size={20} color={Colors.gray[600]} />
                    <Text style={styles.label}>Description (Optional)</Text>
                  </View>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Add details about this expense"
                    value={values.description}
                    onChangeText={handleChange('description')}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  {touched.description && errors.description && (
                    <Text style={styles.errorText}>{errors.description}</Text>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.back()}
                    disabled={submitting}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => handleSubmit()}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <Text style={styles.submitButtonText}>Save Expense</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  screenTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.gray[900],
    marginBottom: 24,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.gray[600],
    marginLeft: 8,
  },
  input: {
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[900],
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.error[600],
    marginTop: 4,
  },
  dateButton: {
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[900],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.gray[700],
  },
  submitButton: {
    flex: 2,
    backgroundColor: Colors.primary[600],
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  submitButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
  },
});