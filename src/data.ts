import { ResourceItem, QuizItem, UserProfile, NotificationItem } from './types';

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    documentId: 'res-1',
    title: 'Data Structures & Algorithms Premium Lecture Notes',
    description: 'Comprehensive hand-written notes covering Trees, Graphs, Sorting Algorithms, and Dynamic Programming. Specifically tailored for MSBTE and engineering semesters.',
    subject: 'Data Structures & Algorithms',
    branch: 'Computer Engineering',
    semester: '3rd Semester',
    type: 'PDF',
    fileName: 'DSA_Premium_Notes_v2.pdf',
    fileUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
    uploadedBy: 'Prof. Ramesh Patil',
    uploaderId: 'teach-1',
    premium: true,
    downloads: 324,
    views: 1205,
    createdAt: '2026-07-10T12:00:00Z'
  },
  {
    documentId: 'res-2',
    title: 'Basic Electrical & Electronics Engineering PPT',
    description: 'Visual slides covering AC circuits, DC machines, transformer operations, and semiconductor devices. Perfect for quick exam revision.',
    subject: 'Basic Electrical Engineering',
    branch: 'Electrical Engineering',
    semester: '1st Semester',
    type: 'PPT',
    fileName: 'BEEE_Unit_1_to_5.pptx',
    fileUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400',
    uploadedBy: 'Dr. Sunita Deshmukh',
    uploaderId: 'teach-2',
    premium: false,
    downloads: 512,
    views: 1845,
    createdAt: '2026-07-11T09:30:00Z'
  },
  {
    documentId: 'res-3',
    title: 'Theory of Computation - Complete Video Lectures Playlist',
    description: 'Step-by-step video tutorials on Finite Automata, Context-Free Grammars, Turing Machines, and Decidability, with solved exam questions.',
    subject: 'Theory of Computation',
    branch: 'Computer Engineering',
    semester: '5th Semester',
    type: 'Video',
    fileName: 'TOC_Full_Video_Series',
    fileUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400',
    uploadedBy: 'Prof. Ramesh Patil',
    uploaderId: 'teach-1',
    premium: true,
    downloads: 142,
    views: 890,
    createdAt: '2026-07-08T15:45:00Z'
  },
  {
    documentId: 'res-4',
    title: 'Digital Electronics Lab Assignment 1 & 2 Solutions',
    description: 'Detailed solutions for Logic Gates design, K-Map simplification, and implementation of Adder/Subtractor circuits in hardware simulator.',
    subject: 'Digital Electronics',
    branch: 'Electronics & Telecommunication',
    semester: '3rd Semester',
    type: 'Assignment',
    fileName: 'DE_Assignment_1_2_Solutions.pdf',
    fileUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400',
    uploadedBy: 'Prof. Alok Mehta',
    uploaderId: 'teach-3',
    premium: false,
    downloads: 289,
    views: 742,
    createdAt: '2026-07-12T14:10:00Z'
  },
  {
    documentId: 'res-5',
    title: 'Fluid Mechanics - Summer 2025 Previous Year Question Paper',
    description: 'Official board previous year question paper with detailed step-by-step solutions for Bernoulli equation, pipe flow, and boundary layers.',
    subject: 'Fluid Mechanics',
    branch: 'Mechanical Engineering',
    semester: '4th Semester',
    type: 'Question Paper',
    fileName: 'Fluid_Mechanics_Summer_2025_Solved.pdf',
    fileUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
    uploadedBy: 'Prof. Sanjay Kale',
    uploaderId: 'teach-4',
    premium: false,
    downloads: 410,
    views: 1102,
    createdAt: '2026-07-05T10:00:00Z'
  },
  {
    documentId: 'res-6',
    title: 'Advanced Java Programming Notes for Diploma Students',
    description: 'Premium chapter-wise short notes on JDBC, Servlets, JSP, Event Handling, and AWT/Swing framework controls.',
    subject: 'Advanced Java Programming',
    branch: 'Computer Engineering',
    semester: '5th Semester',
    type: 'PDF',
    fileName: 'Adv_Java_Diploma_Notes.pdf',
    fileUrl: '#',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400',
    uploadedBy: 'Dr. Sunita Deshmukh',
    uploaderId: 'teach-2',
    premium: true,
    downloads: 215,
    views: 680,
    createdAt: '2026-07-13T11:00:00Z'
  }
];

export const INITIAL_QUIZZES: QuizItem[] = [
  {
    quizId: 'quiz-1',
    title: 'Data Structures MCQ - Array & Linked List',
    branch: 'Computer Engineering',
    semester: '3rd Semester',
    questions: [
      {
        questionId: 'q1-1',
        questionText: 'What is the time complexity of searching an element in a sorted array of size N using binary search?',
        options: ['O(N)', 'O(log N)', 'O(N log N)', 'O(1)'],
        correctAnswerIndex: 1,
        explanation: 'Binary search splits the search interval in half at each step, resulting in a logarithmic time complexity of O(log N).'
      },
      {
        questionId: 'q1-2',
        questionText: 'In a singly linked list, what is the time complexity to insert a new node at the beginning?',
        options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
        correctAnswerIndex: 0,
        explanation: 'Inserting at the beginning only requires updating the new node\'s next pointer and the head pointer, which takes constant time O(1).'
      },
      {
        questionId: 'q1-3',
        questionText: 'Which of the following application uses Stack data structure?',
        options: ['Undo-Redo in Editors', 'Arithmetic Expression Evaluation', 'Function Calls Management', 'All of the above'],
        correctAnswerIndex: 3,
        explanation: 'Stacks work on Last-In-First-Out (LIFO) order, which is the exact requirement for undo-redo operations, expression parsers, and system activation records.'
      }
    ]
  },
  {
    quizId: 'quiz-2',
    title: 'Basic Electrical - Kirchhoff\'s Laws Practice',
    branch: 'Electrical Engineering',
    semester: '1st Semester',
    questions: [
      {
        questionId: 'q2-1',
        questionText: 'Kirchhoff\'s Current Law (KCL) is based on the law of conservation of:',
        options: ['Energy', 'Charge', 'Momentum', 'Mass'],
        correctAnswerIndex: 1,
        explanation: 'KCL states that total current entering a junction equals total current leaving, which is a statement of conservation of electric charge.'
      },
      {
        questionId: 'q2-2',
        questionText: 'Kirchhoff\'s Voltage Law (KVL) is based on the law of conservation of:',
        options: ['Energy', 'Charge', 'Magnetic Flux', 'Power'],
        correctAnswerIndex: 0,
        explanation: 'KVL states that the sum of voltages around a closed loop is zero, representing conservation of energy.'
      }
    ]
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'stud-1',
    name: 'Amit Sharma',
    email: 'student@campusvault.com',
    phone: '+91 98765 43210',
    college: 'Government Polytechnic, Pune',
    branch: 'Computer Engineering',
    semester: '3rd Semester',
    role: 'Student',
    subscription: 'Premium',
    emailVerified: true,
    createdAt: '2026-06-15T08:00:00Z'
  },
  {
    uid: 'stud-2',
    name: 'Pooja Verma',
    email: 'pooja@campusvault.com',
    phone: '+91 87654 32109',
    college: 'V.J.T.I, Mumbai',
    branch: 'Computer Engineering',
    semester: '5th Semester',
    role: 'Student',
    subscription: 'Free',
    emailVerified: true,
    createdAt: '2026-07-01T10:30:00Z'
  },
  {
    uid: 'teach-1',
    name: 'Prof. Ramesh Patil',
    email: 'teacher@campusvault.com',
    phone: '+91 76543 21098',
    college: 'COEP Technological University',
    branch: 'Computer Engineering',
    semester: '3rd Semester',
    role: 'Teacher',
    subscription: 'Free',
    emailVerified: true,
    createdAt: '2026-05-10T09:00:00Z'
  },
  {
    uid: 'admin-1',
    name: 'Vault Administrator',
    email: 'admin@campusvault.com',
    phone: '+91 99999 88888',
    college: 'CampusVault Headquarters',
    branch: 'All Branches',
    semester: 'All Semesters',
    role: 'Admin',
    subscription: 'Premium',
    emailVerified: true,
    createdAt: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    notificationId: 'notif-1',
    title: 'New Premium Notes Uploaded',
    description: 'Data Structures and Algorithms unit-wise handmade premium notes are now available for Computer students!',
    createdAt: '2026-07-13T10:00:00Z'
  },
  {
    notificationId: 'notif-2',
    title: 'Upcoming Mock Test Schedule',
    description: 'Next Engineering Mathematics online mock test is scheduled for Friday evening. Prepare well!',
    createdAt: '2026-07-14T11:30:00Z'
  },
  {
    notificationId: 'notif-3',
    title: 'Vault AI Updated to v2.5',
    description: 'Vault AI can now generate step-by-step career roadmaps and exam preparation plans tailored to your branch.',
    createdAt: '2026-07-14T15:00:00Z'
  }
];

export const ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Mid-Semester Exam Notice',
    content: 'All engineering students must submit their Lab Journals before July 20th to qualify for continuous internal assessment scores.',
    postedBy: 'Admin Team',
    createdAt: '2026-07-12T09:00:00Z'
  },
  {
    id: 'ann-2',
    title: 'Free Webinar: Placements and Career Guidance',
    content: 'Prof. Patil is hosting a live webinar on "How to Crack Off-Campus Placements as a Diploma or Engineering Student" this Sunday at 11 AM.',
    postedBy: 'Prof. Ramesh Patil',
    createdAt: '2026-07-14T10:00:00Z'
  }
];

export const LEADERBOARD = [
  { rank: 1, name: 'Amit Sharma', points: 1250, college: 'GP Pune', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' },
  { rank: 2, name: 'Snehal Deshmukh', points: 1120, college: 'COEP Pune', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  { rank: 3, name: 'Rahul Kadam', points: 980, college: 'G.P. Solapur', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  { rank: 4, name: 'Priya Joshi', points: 870, college: 'VJTI Mumbai', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
  { rank: 5, name: 'Prasad Patil', points: 750, college: 'G.P. Pune', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' }
];
