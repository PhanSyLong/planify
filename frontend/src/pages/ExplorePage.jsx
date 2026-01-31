import React, { useState, useEffect, useCallback } from 'react';
import ExploreHeader from '../components/explore/ExploreHeader';
import ExploreTags from '../components/explore/ExploreTags';
import Carousel from '../components/plans/Carousel';
import UserCarousel from '../components/users/UserCarousel';
import PlanList from '../components/plans/PlanList';
import UserList from '../components/users/UserList';
import './ExplorePage.css';

import { usersApi } from '../api/users';
import { authApi } from '../api/auth';

const MOCK_PLANS = [
  { id: 'plan-1', title: 'IELTS Speaking Mastery', duration: '8 weeks • Advanced', category: 'english', isPublic: true },
  { id: 'plan-2', title: 'TOEFL Reading Pro', duration: '6 weeks • Intermediate', category: 'english', isPublic: true },
  { id: 'plan-3', title: 'Business English Essentials', duration: '10 weeks • All levels', category: 'english', isPublic: true },
  { id: 'plan-4', title: 'Academic Writing for IELTS', duration: '4 weeks • Band 7+', category: 'english', isPublic: true },
  { id: 'plan-5', title: 'Daily English Conversation', duration: '12 weeks • Beginner', category: 'english', isPublic: true },
  { id: 'plan-6', title: 'SAT Vocabulary Builder', duration: '8 weeks • High School', category: 'english', isPublic: true }
];

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('subject');
  const [pinnedTags, setPinnedTags] = useState([]);
  const [fullView, setFullView] = useState(null);
  const [explorePlans, setExplorePlans] = useState([]);
  const [exploreUsers, setExploreUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchExploreData = async () => {
      setLoading(true);

      try {
        // 1. Get current user info (to exclude self)
        let myId = null;
        try {
          const meResponse = await authApi.me();
          myId = meResponse?.data?.result?.id;
          if (myId && isMounted) {
            setCurrentUserId(myId);
          }
        } catch (meErr) {
          // Not logged in or error → we won't exclude self
          console.debug('Could not fetch current user info (possibly not logged in)', meErr);
        }

        // 2. Mock plans (you can replace with real API later)
        const plans = MOCK_PLANS;

        // 3. Fetch all users
        let users = [];
        try {
          const res = await usersApi.getAll();
          console.log('Raw response from usersApi.getAll():', res);

          const userList = res?.data?.result || [];

          // Filter out admins + current user (if logged in)
          const filteredUsers = userList.filter((u) => {
            // Exclude admins
            const isAdmin = Array.isArray(u.roles) && u.roles.some(
              (role) => role.toUpperCase() === 'ADMIN' || role === 'SCOPE_ADMIN'
            );
            if (isAdmin) return false;

            // Exclude current logged-in user (safest: compare by id)
            if (myId && u.id === myId) return false;

            return true;
          });

          // Map to the shape expected by UserCarousel / UserList
          users = filteredUsers.map((u) => ({
            id: u.id,
            username: u.username || (u.email ? u.email.split('@')[0] : 'User'),
            email: u.email,
            avatar: u.avatar,
            // followers: u.followers || 0,
            // plans: u.plans || 0,
            // isFollowing: u.isFollowing || false,
          }));
        } catch (userErr) {
          console.warn('Failed to fetch users list:', userErr);
          // users remains empty array → UI will show empty carousel
        }

        if (isMounted) {
          setExplorePlans(plans);
          setExploreUsers(users);
        }
      } catch (error) {
        console.error('Error in fetchExploreData:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExploreData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePinTag = useCallback((tag) => {
    setPinnedTags((prev) => {
      if (!prev.includes(tag)) {
        return [...prev, tag];
      }
      return prev;
    });
  }, []);

  const handleUnpinTag = useCallback((tag) => {
    setPinnedTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleViewMore = useCallback((title, items, type = 'plan') => {
    setFullView({ title, items, type });
  }, []);

  const handleBackFromFullView = useCallback(() => {
    setFullView(null);
  }, []);

  // ────────────────────────────────────────────────
  //                FULL VIEW MODE
  // ────────────────────────────────────────────────
  if (fullView) {
    if (fullView.type === 'plan') {
      return (
        <div className="explore-page">
          <PlanList
            initialPlans={fullView.items}
            isFullView={true}
            fullViewTitle={fullView.title}
            onBack={handleBackFromFullView}
          />
        </div>
      );
    }

    if (fullView.type === 'user') {
      return (
        <div className="explore-page">
          <UserList
            initialUsers={fullView.items}
            isFullView={true}
            fullViewTitle={fullView.title}
            onBack={handleBackFromFullView}
          />
        </div>
      );
    }
  }

  // ────────────────────────────────────────────────
  //                   LOADING STATE
  // ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="explore-page loading-container">
        <div className="spinner-wrapper">
          <div className="spinner" role="status" aria-label="Loading"></div>
          <p className="loading-text">Loading awesome content...</p>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  //                  MAIN EXPLORE VIEW
  // ────────────────────────────────────────────────
  return (
    <div className="explore-page">
      <ExploreHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <ExploreTags
        activeTab={activeTab}
        pinnedTags={pinnedTags}
        onPin={handlePinTag}
        onUnpin={handleUnpinTag}
      />

      <Carousel
        title="Popular Plans"
        items={explorePlans}
        type="plan"
        onViewMore={() => handleViewMore('All Plans', explorePlans, 'plan')}
      />

      <UserCarousel
        title="Teachers & Creators"
        users={exploreUsers}
        onViewMore={() => handleViewMore('All Teachers', exploreUsers, 'user')}
      />
    </div>
  );
};

export default ExplorePage;