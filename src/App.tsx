import React, { useState, useEffect } from 'react';
import { SplashAndAuth } from './components/SplashAndAuth';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfile, ResourceItem, QuizItem, NotificationItem } from './types';
import { 
  INITIAL_RESOURCES, 
  INITIAL_USERS, 
  INITIAL_QUIZZES, 
  INITIAL_NOTIFICATIONS, 
  ANNOUNCEMENTS, 
  LEADERBOARD 
} from './data';

export default function App() {
  // Global user session state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('current_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Global dynamic users list state (persisted)
  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('campusvault_users_catalog');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Global dynamic study materials / resources state (persisted)
  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('campusvault_resources_catalog');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  // Global dynamic notices / announcements state (persisted)
  const [announcements, setAnnouncements] = useState<any[]>(() => {
    const saved = localStorage.getItem('campusvault_announcements');
    return saved ? JSON.parse(saved) : ANNOUNCEMENTS;
  });

  // Global quizzes state
  const [quizzes, setQuizzes] = useState<QuizItem[]>(() => {
    const saved = localStorage.getItem('campusvault_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  // Global notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('campusvault_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync session with local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('current_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('current_user_session');
    }
  }, [user]);

  // Sync databases with local storage
  useEffect(() => {
    localStorage.setItem('campusvault_users_catalog', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('campusvault_resources_catalog', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('campusvault_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('campusvault_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('campusvault_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Logout session
  const handleLogout = () => {
    setUser(null);
  };

  // Profile metadata modification trigger
  const handleUpdateCurrentUserProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    
    // Also sync back to our global usersList catalog so changes persist there
    const updatedCatalog = usersList.map(u => {
      if (u.uid === updatedUser.uid) {
        return updatedUser;
      }
      return u;
    });
    setUsersList(updatedCatalog);
  };

  // Add notification wrapper
  const pushNotification = (title: string, description: string) => {
    const newNotif: NotificationItem = {
      notificationId: `notif-${Date.now()}`,
      title,
      description,
      createdAt: new Date().toISOString()
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Callback when a teacher posts an announcement
  const handlePostAnnouncement = (title: string, content: string) => {
    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      postedBy: user ? user.name : 'Facilitator',
      createdAt: new Date().toISOString()
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    
    // Also broadcast a notifications alert to students
    pushNotification(`Announcement: ${title}`, content);
  };

  // Callback when resources are modified (uploaded, updated, or deleted)
  const handleUpdateResources = (updatedResources: ResourceItem[]) => {
    setResources(updatedResources);
    
    // If a new resource was uploaded, notify student dashboards
    if (updatedResources.length > resources.length) {
      const added = updatedResources[0];
      pushNotification(
        `New Material: ${added.title}`,
        `Prof. uploaded "${added.title}" for subject: ${added.subject}. Sem: ${added.semester}.`
      );
    }
  };

  return (
    <div className="bg-[#050816] min-h-screen text-white select-none">
      {!user ? (
        <SplashAndAuth 
          onAuthComplete={(authenticatedUser) => {
            setUser(authenticatedUser);
            // Add user to catalog if they are registered freshly
            if (!usersList.some(u => u.uid === authenticatedUser.uid)) {
              setUsersList([...usersList, authenticatedUser]);
            }
          }} 
        />
      ) : (
        <>
          {user.role === 'Student' && (
            <StudentDashboard 
              user={user}
              resources={resources}
              quizzes={quizzes}
              notifications={notifications}
              announcements={announcements}
              leaderboard={LEADERBOARD}
              onUpdateUser={handleUpdateCurrentUserProfile}
              onLogout={handleLogout}
              onUpdateResources={handleUpdateResources}
            />
          )}

          {user.role === 'Teacher' && (
            <TeacherDashboard 
              user={user}
              resources={resources}
              onLogout={handleLogout}
              onUpdateResources={handleUpdateResources}
              onPostAnnouncement={handlePostAnnouncement}
              studentCount={usersList.filter(u => u.role === 'Student').length}
            />
          )}

          {user.role === 'Admin' && (
            <AdminDashboard 
              user={user}
              resources={resources}
              usersList={usersList}
              onLogout={handleLogout}
              onUpdateUsersList={setUsersList}
              onUpdateResources={handleUpdateResources}
            />
          )}
        </>
      )}
    </div>
  );
}
