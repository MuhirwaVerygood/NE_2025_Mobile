import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface BudgetProgressProps {
  totalSpent: number;
  budgetLimit: number;
}

export default function BudgetProgress({ totalSpent, budgetLimit }: BudgetProgressProps) {
  const percentage = Math.min(100, (totalSpent / budgetLimit) * 100);
  const remaining = budgetLimit - totalSpent;
  
  let statusColor = Colors.success[500];
  let statusText = 'On Track';
  
  if (percentage >= 90) {
    statusColor = Colors.error[500];
    statusText = 'Over Budget';
  } else if (percentage >= 75) {
    statusColor = Colors.warning[500];
    statusText = 'Approaching Limit';
  }

  return (
    <View style={styles.container}>
      <View style={styles.budgetInfo}>
        <View>
          <Text style={styles.budgetLabel}>Monthly Budget</Text>
          <Text style={styles.budgetAmount}>${budgetLimit.toFixed(2)}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: statusColor
              }
            ]} 
          />
        </View>
        
        <View style={styles.progressLabels}>
          <Text style={styles.spentText}>
            ${totalSpent.toFixed(2)} <Text style={styles.spentLabel}>spent</Text>
          </Text>
          <Text style={styles.remainingText}>
            ${remaining.toFixed(2)} <Text style={styles.remainingLabel}>left</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 4,
  },
  budgetAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.gray[900],
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[700],
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  spentText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[900],
  },
  spentLabel: {
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
  remainingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[900],
  },
  remainingLabel: {
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
});