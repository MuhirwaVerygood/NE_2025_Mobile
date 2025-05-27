import { Expense } from '@/types/expense';
import { Coffee, ShoppingBag, Brain as Train, Film, HeartPulse, Chrome as Home, GraduationCap, BookOpen, Video } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { LucideIcon } from 'lucide-react-native'; // Import the LucideIcon type

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
  if (lowerDesc.includes('hat') || lowerDesc.includes('chair') || lowerDesc.includes('keyboard')) {
    return 'shopping';
  }
  // Add more keyword-based rules as needed
  return 'other';
};

// Updated getCategoryIcon to use LucideIcon type
export const getCategoryIcon = (category: string): LucideIcon => {
  switch (category.toLowerCase()) {
    case 'food':
      return Coffee;
    case 'shopping':
      return ShoppingBag;
    case 'transport':
      return Train;
    case 'entertainment':
      return Film;
    case 'health':
      return HeartPulse;
    case 'housing':
      return Home;
    case 'education':
      return GraduationCap;
    default:
      return BookOpen;
  }
};

// Calculate total expenses, parsing amount if string
export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => {
    const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
};

// Group expenses by category, inferring category if missing
export const groupExpensesByCategory = (expenses: Expense[]) => {
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
    // Use category if present, otherwise infer from description
    const category = expense.category ? expense.category.toLowerCase() : inferCategoryFromDescription(expense.description);
    
    if (!acc[category]) {
      acc[category] = {
        amount: 0,
        color: categoryColors[category as keyof typeof categoryColors] || Colors.gray[500],
      };
    }
    
    const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
    acc[category].amount += isNaN(amount) ? 0 : amount;
    return acc;
  }, {});
};