import { useState, useCallback, useMemo, useEffect } from 'react';

import ExploreHeader from '../components/explore/ExploreHeader.jsx';
import ExploreTags from '../components/explore/ExploreTags.jsx';
import Carousel from '../components/plans/Carousel.jsx';
import UserCarousel from '../components/users/UserCarousel.jsx';
import PlanList from '../components/plans/PlanList.jsx';
import { searchPlans } from '../api/plan.js';
import './ExplorePage.css';
import { usePlans } from '../queries/usePlans';

import { usersApi } from '../api/users';
import { authApi } from '../api/auth';

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('subject');
  const [pinnedTags, setPinnedTags] = useState([]);
  const [fullView, setFullView] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedPlans, setSearchedPlans] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(null);
  const [exploreUsers, setExploreUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: plans, isLoading } = usePlans();
  const currentUserId = Number(localStorage.getItem("userId"));
  const isSearching = searchTerm.length > 0 || pinnedTags.length > 0;
  //===================SearchPlan========================
  useEffect(() => {
    if (!isSearching) return;

    setLoadingSearch(true);

    searchPlans({
      query: searchTerm,
      tags: pinnedTags
    })
      .then(res => {
        setSearchedPlans(res.data.result ?? []);
      })
      .catch(console.error)
      .finally(() => setLoadingSearch(false));

  }, [searchTerm, pinnedTags]);

  const explorePlans = useMemo(() => {
    const source = isSearching ? searchedPlans : plans;

    return source.filter(plan => plan.ownerId !== currentUserId);
  }, [plans, searchedPlans, isSearching, currentUserId]);

  //=====================================================================

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

        // 2. Fetch all users
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

  // Loading state
  if (isLoading || loadingSearch) {
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
        onSearch={setSearchTerm}
      />

      <ExploreTags
        activeTab={activeTab}
        pinnedTags={pinnedTags}
        onPin={handlePinTag}
        onUnpin={handleUnpinTag}
      />

      <Carousel
        title="Community Plans"
        items={explorePlans}
        type="plan"
        onViewMore={() => handleViewMore('All Plans', explorePlans, 'plan')}
      />

      <UserCarousel
        title="Featured Teachers"
        users={exploreUsers}
        onViewMore={() => handleViewMore('All Teachers', exploreUsers, 'user')}
      />
    </div>
  );
};

export default ExplorePage;