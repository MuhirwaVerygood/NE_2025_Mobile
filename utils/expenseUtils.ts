import { Expense } from '@/types/expense';
import { Colors } from '@/constants/Colors';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Infer category from description keywords
const inferCategoryFromDescription = (description: string): string => {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes('hat') || lowerDesc.includes('chair') || lowerDesc.includes('keyboard') || lowerDesc.includes('ball')) {
    return 'shopping';
  }
  // Add more keyword-based rules as needed
  return 'other';
};


// Calculate total expenses, parsing string amounts
export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => {
    const amount = parseFloat(expense.amount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
};

// Group expenses by category, inferring category from description
export const groupExpensesByCategory = (expenses: Expense[]): Record<string, { amount: number; color: string }> => {
  const categoryColors = {
    food: Colors.blue[500],
    shopping: Colors.purple[500],
    transport: Colors.green[500],
    entertainment: Colors.pink[500],
    health: Colors.red[500],
    housing: Colors.yellow[600],
    education: Colors.indigo[500],
    other: Colors.gray[500],
  };

  return expenses.reduce((acc: Record<string, { amount: number; color: string }>, expense) => {
    const category = inferCategoryFromDescription(expense.description);
    
    if (!acc[category]) {
      acc[category] = {
        amount: 0,
        color: categoryColors[category as keyof typeof categoryColors] || Colors.gray[500],
      };
    }
    
    const amount = parseFloat(expense.amount);
    acc[category].amount += isNaN(amount) ? 0 : amount;
    return acc;
  }, {});
};