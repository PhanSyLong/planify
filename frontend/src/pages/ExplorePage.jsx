import { useState, useEffect, useCallback } from 'react';
import ExploreHeader from '../components/explore/ExploreHeader';
import ExploreTags from '../components/explore/ExploreTags';
import Carousel from '../components/plans/Carousel';
import UserCarousel from '../components/users/UserCarousel';
import PlanList from '../components/plans/PlanList';
import UserList from '../components/users/UserList';
import './ExplorePage.css';
import { usePlans } from '../context/PlanContext';

const MOCK_PLANS = [
  { id: 'plan-1', title: 'IELTS Speaking Mastery', duration: '8 weeks • Advanced', category: 'english', isPublic: true },
  { id: 'plan-2', title: 'TOEFL Reading Pro', duration: '6 weeks • Intermediate', category: 'english', isPublic: true },
  { id: 'plan-3', title: 'Business English Essentials', duration: '10 weeks • All levels', category: 'english', isPublic: true },
  { id: 'plan-4', title: 'Academic Writing for IELTS', duration: '4 weeks • Band 7+', category: 'english', isPublic: true },
  { id: 'plan-5', title: 'Daily English Conversation', duration: '12 weeks • Beginner', category: 'english', isPublic: true },
  { id: 'plan-6', title: 'SAT Vocabulary Builder', duration: '8 weeks • High School', category: 'english', isPublic: true }
];

const MOCK_USERS = [
  { id: 'user-1', name: 'Emma Johnson', description: 'IELTS 8.5 | Official Examiner & Mentor', avatar: null, followers: 2450, plans: 18, isFollowing: false },
  { id: 'user-2', name: 'Alex Chen', description: 'TOEFL 115+ | 12 years teaching experience', avatar: null, followers: 1890, plans: 14, isFollowing: true },
  { id: 'user-3', name: 'Sarah Williams', description: 'Helping students reach Band 7+ since 2015', avatar: null, followers: 3200, plans: 22, isFollowing: false },
  { id: 'user-4', name: 'Michael Park', description: 'Cambridge CELTA | Pronunciation specialist', avatar: null, followers: 980, plans: 9, isFollowing: false },
  { id: 'user-5', name: 'Lisa Nguyen', description: 'Business English & Job Interview Coach', avatar: null, followers: 1560, plans: 11, isFollowing: true },
  { id: 'user-6', name: 'David Brown', description: 'SAT/ACT Expert | Top 1% scorer', avatar: null, followers: 2100, plans: 16, isFollowing: false }
];

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('subject');
  const [pinnedTags, setPinnedTags] = useState([]);
  const [fullView, setFullView] = useState(null);
  const [explorePlans, setExplorePlans] = useState([]);
  const [exploreUsers, setExploreUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { plans } = usePlans();

  useEffect(() => {
    if (!plans) return;

      setLoading(true);

      const timer = setTimeout(() => {
        setExplorePlans(plans);
        setExploreUsers(MOCK_USERS);
        setLoading(false);
      }, 600);

      return () => clearTimeout(timer);
    }, [plans]);

  const handlePinTag = useCallback((tag) => {
    setPinnedTags(prev => {
      if (!prev.includes(tag)) {
        return [...prev, tag];
      }
      return prev;
    });
  }, []);

  const handleUnpinTag = useCallback((tag) => {
    setPinnedTags(prev => prev.filter(t => t !== tag));
  }, []);

  const handleViewMore = useCallback((title, items, type = 'plan') => {
    setFullView({ title, items, type });
  }, []);

  const handleBackFromFullView = useCallback(() => {
    setFullView(null);
  }, []);

  // Full view mode
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

  // Main Explore View
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
        title="Featured Teachers"
        users={exploreUsers}
        onViewMore={() => handleViewMore('All Teachers', exploreUsers, 'user')}
      />
    </div>
  );
};

export default ExplorePage;