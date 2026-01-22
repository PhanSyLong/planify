import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Carousel from '../components/plans/Carousel.jsx';
import PlanList from '../components/plans/PlanList.jsx';
import './MyPlan.css';

// ============================================================================
// MOCK BACKEND SERVICE
// ============================================================================
const PlanService = {
  async getUserPlans(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      recentlyOpened: [
        {
          id: 'my-recent-1',
          title: 'Morning Workout Routine',
          duration: '30 days • Fitness',
          authorId: userId,
          createdAt: new Date('2024-12-15'),
          lastOpened: new Date('2024-12-18')
        }
      ],
      inProgress: [
        {
          id: 'my-progress-1',
          title: 'Learn React Advanced',
          duration: '60 days • Programming',
          authorId: userId,
          createdAt: new Date('2024-12-10'),
          status: 'in-progress',
          progress: 45
        }
      ],
      allPlans: [
        {
          id: 'my-recent-1',
          title: 'Morning Workout Routine',
          duration: '30 days • Fitness',
          authorId: userId,
          createdAt: new Date('2024-12-15'),
          lastOpened: new Date('2024-12-18')
        },
        {
          id: 'my-progress-1',
          title: 'Learn React Advanced',
          duration: '60 days • Programming',
          authorId: userId,
          createdAt: new Date('2024-12-10'),
          status: 'in-progress',
          progress: 45
        },
        {
          id: 'my-all-1',
          title: 'Healthy Meal Planning',
          duration: '14 days • Nutrition',
          authorId: userId,
          createdAt: new Date('2024-12-05')
        }
      ]
    };
  }
};

const MyPlan = () => {
  const [fullView, setFullView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planData, setPlanData] = useState({
    recentlyOpened: [],
    inProgress: [],
    allPlans: []
  });

  const currentUserId = useMemo(() => 'user123', []);

  useEffect(() => {
    let isMounted = true;

    const fetchPlans = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await PlanService.getUserPlans(currentUserId);

        if (isMounted) {
          setPlanData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Failed to fetch plans:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPlans();

    return () => {
      isMounted = false;
    };
  }, [currentUserId]);

  const handleViewMore = useCallback((title, items) => {
    setFullView({ title, items });
  }, []);

  const handleBack = useCallback(() => {
    setFullView(null);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner" role="status" aria-label="Loading"></div>
          <p className="loading-text">Loading your plans...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <p className="loading-text" style={{ color: '#ef4444' }}>
            Failed to load plans. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Full view mode
  if (fullView) {
    return (
      <div className="explore-page">
        <PlanList
          initialPlans={fullView.items}
          isFullView={true}
          fullViewTitle={fullView.title}
          onBack={handleBack}
        />
      </div>
    );
  }

  // Main view - carousel sections
  return (
    <div className="myplan-container">
      <Carousel
        title="Recently Opened"
        items={planData.recentlyOpened}
        onViewMore={() => handleViewMore('Recently Opened', planData.recentlyOpened)}
      />

      <Carousel
        title="In Progress"
        items={planData.inProgress}
        onViewMore={() => handleViewMore('In Progress', planData.inProgress)}
      />

      <PlanList plans={planData.allPlans} />
    </div>
  );
};

export default MyPlan;