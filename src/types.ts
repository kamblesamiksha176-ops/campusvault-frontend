export type UserRole = 'Student' | 'Teacher' | 'Admin';
export type ResourceType = 'PDF' | 'PPT' | 'Video' | 'Assignment' | 'Question Paper';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  college?: string;
  branch?: string;
  semester?: string;
  role: UserRole;
  subscription: 'Free' | 'Premium';
  emailVerified: boolean;
  createdAt: string;
}

export interface ResourceItem {
  documentId: string;
  title: string;
  description: string;
  subject: string;
  branch: string;
  semester: string;
  type: ResourceType;
  fileName: string;
  fileUrl: string;
  thumbnail?: string;
  uploadedBy: string;
  uploaderId: string;
  premium: boolean;
  downloads: number;
  views: number;
  createdAt: string;
}

export interface QuizQuestion {
  questionId: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface QuizItem {
  quizId: string;
  title: string;
  questions: QuizQuestion[];
  branch: string;
  semester: string;
  createdAt?: string;
}

export interface NotificationItem {
  notificationId: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface SubscriptionItem {
  userId: string;
  plan: 'Free' | 'Premium';
  expiry: string;
  status: 'Active' | 'Expired';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  createdAt: string;
}
