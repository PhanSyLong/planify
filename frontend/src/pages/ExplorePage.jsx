// src/pages/ExplorePage.jsx (or wherever your ExplorePage is located)
import React, { useState, useEffect } from 'react';
import ExploreHeader from '../components/explore/ExploreHeader';
import ExploreTags from '../components/explore/ExploreTags';
import Carousel from '../components/myPlan/Carousel';           // For plans
import UserCarousel from '../components/users/UserCarousel';     // New: For users
import PlanList from '../components/myPlan/PlanList';
import UserList from '../components/users/UserList';
import './ExplorePage.css';

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('subject');
  const [pinnedTags, setPinnedTags] = useState([]);
  const [fullView, setFullView] = useState(null); // { title, items, type: 'plan' | 'user' }
  const [explorePlans, setExplorePlans] = useState([]);
  const [exploreUsers, setExploreUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch explore data from backend (simulated for now)
  useEffect(() => {
    const fetchExploreData = async () => {
      setLoading(true);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));

        // Mock Plans
        const mockPlans = [
          {
            id: 'plan-1',
            title: 'IELTS Speaking Mastery',
            duration: '8 weeks • Advanced',
            category: 'english',
            isPublic: true
          },
          {
            id: 'plan-2',
            title: 'TOEFL Reading Pro',
            duration: '6 weeks • Intermediate',
            category: 'english',
            isPublic: true
          },
          {
            id: 'plan-3',
            title: 'Business English Essentials',
            duration: '10 weeks • All levels',
            category: 'english',
            isPublic: true
          },
          {
            id: 'plan-4',
            title: 'Academic Writing for IELTS',
            duration: '4 weeks • Band 7+',
            category: 'english',
            isPublic: true
          },
          {
            id: 'plan-5',
            title: 'Daily English Conversation',
            duration: '12 weeks • Beginner',
            category: 'english',
            isPublic: true
          },
          {
            id: 'plan-6',
            title: 'SAT Vocabulary Builder',
            duration: '8 weeks • High School',
            category: 'english',
            isPublic: true
          }
        ];

        // Mock Users (Teachers / Creators)
        const mockUsers = [
          {
            id: 'user-1',
            name: 'Emma Johnson',
            description: 'IELTS 8.5 | Official Examiner & Mentor',
            avatar: null, // replace with real URL later
            followers: 2450,
            plans: 18,
            isFollowing: false
          },
          {
            id: 'user-2',
            name: 'Alex Chen',
            description: 'TOEFL 115+ | 12 years teaching experience',
            avatar: null,
            followers: 1890,
            plans: 14,
            isFollowing: true
          },
          {
            id: 'user-3',
            name: 'Sarah Williams',
            description: 'Helping students reach Band 7+ since 2015',
            avatar: null,
            followers: 3200,
            plans: 22,
            isFollowing: false
          },
          {
            id: 'user-4',
            name: 'Michael Park',
            description: 'Cambridge CELTA | Pronunciation specialist',
            avatar: null,
            followers: 980,
            plans: 9,
            isFollowing: false
          },
          {
            id: 'user-5',
            name: 'Lisa Nguyen',
            description: 'Business English & Job Interview Coach',
            avatar: null,
            followers: 1560,
            plans: 11,
            isFollowing: true
          },
          {
            id: 'user-6',
            name: 'David Brown',
            description: 'SAT/ACT Expert | Top 1% scorer',
            avatar: null,
            followers: 2100,
            plans: 16,
            isFollowing: false
          }
        ];

        setExplorePlans(mockPlans);
        setExploreUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching explore data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExploreData();
  }, []);

  const handlePinTag = (tag) => {
    if (!pinnedTags.includes(tag)) {
      setPinnedTags([...pinnedTags, tag]);
    }
  };

  const handleUnpinTag = (tag) => {
    setPinnedTags(pinnedTags.filter(t => t !== tag));
  };

  const handleViewMore = (title, items, type = 'plan') => {
    setFullView({ title, items, type });
  };

  // Full view mode
  if (fullView) {
    // For now, we're reusing PlanList only for plans.
    // Later you can create UserList if you want search/filter for users too.
    if (fullView.type === 'plan') {
      return (
        <div className="explore-page">
          <PlanList
            initialPlans={fullView.items}
            isFullView={true}
            fullViewTitle={fullView.title}
            onBack={() => setFullView(null)}
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
            onBack={() => setFullView(null)}
          />
        </div>
      );
    }

    // Simple fallback grid for users (you can enhance this later)
    return (
      <div className="explore-page">
        <div className="planlist-wrapper">
          <div className="planlist-container">
            <div className="planlist-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="back-btn" onClick={() => setFullView(null)}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <h1 className="page-title">{fullView.title}</h1>
            </div>

            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {fullView.items.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="explore-page loading-container">
        <div className="spinner-wrapper">
          <div className="spinner"></div>
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

      {/* Plans Carousel */}
      <Carousel
        title="Popular Plans"
        items={explorePlans}
        type="plan"
        onViewMore={() => handleViewMore('All Plans', explorePlans, 'plan')}
      />

      {/* Users Carousel */}
      <UserCarousel
        title="Users"
        users={exploreUsers}
        onViewMore={() => handleViewMore('All Users', exploreUsers, 'user')}
      />

      {/* You can add more carousels here later */}
    </div>
  );
};

export default ExplorePage;