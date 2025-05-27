export interface Expense {
  id: string;
  createdAt: string;
  name: string;
  amount: string ; // Changed to string to match API data
  description: string;
  category: string
  title? : string, 

 }