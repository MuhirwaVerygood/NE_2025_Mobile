import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/Colors';

type ExpensesByCategory = {
  [key: string]: {
    amount: number;
    color: string;
  };
};

interface ExpenseChartProps {
  expenses: ExpensesByCategory;
}

const screenWidth = Dimensions.get('window').width - 40;

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const chartData = Object.entries(expenses).map(([name, data]) => ({
    name,
    amount: data.amount,
    color: data.color,
    legendFontColor: Colors.gray[700],
    legendFontSize: 12,
  }));

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No expense data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  emptyContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[500],
  },
});