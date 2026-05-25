export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member';
  joinDate: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'info' | 'alert';
}

export interface Contribution {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  month: string;
  year: number;
  status: 'paid' | 'pending' | 'late';
  paymentDate?: string;
}

export interface Cagnote {
  id: string;
  month: string;
  year: number;
  targetAmount: number;
  collectedAmount: number;
  membersCount: number;
  status: 'active' | 'completed' | 'upcoming';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'normal' | 'important' | 'urgent';
}
