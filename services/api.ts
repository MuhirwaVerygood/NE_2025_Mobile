import axios from 'axios';
import { User } from '@/types/user';
import { Expense } from '@/types/expense';

// Base API URL
const BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1';
// const BASE_URL = 'https://683571bbcd78db2058c184d8.mockapi.io/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.message || 'Server error');
  } else if (error.request) {
    throw new Error('Network error. Please check your connection and try again.');
  } else {
    throw new Error('Invalid email or password.');
  }
};

// Auth API
export const login = async (username: string, password: string): Promise<User> => {
  try {
    const response = await api.get(`/users`, {
      params: { username }
    });
    
    const users = response.data;
    if (users.length === 0) {
      throw new Error('User not found');
    }
    
    const user = users[0];
    if (user.password !== password) {
      throw new Error('Incorrect password');
    }
    
    return user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('User not found');
    }
    handleError(error);
    throw error;
  }
};

// Expenses API
export const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await api.get('/expenses');
    return response.data.map((expense: any) => ({
      ...expense,
      amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount
    }));
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getExpenseById = async (id: string): Promise<Expense> => {
  try {
    const response = await api.get(`/expenses/${id}`);
    const expense = response.data;
    return {
      ...expense,
      amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const createExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  try {
    const response = await api.post('/expenses', expense);
    console.log(response.data);
    
    return response.data;

  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updateExpense = async (id: string, expense: Partial<Expense>): Promise<Expense> => {
  try {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  try {
    await api.delete(`/expenses/${id}`);
  } catch (error) {
    handleError(error);
    throw error;
  }
};