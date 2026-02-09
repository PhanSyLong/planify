import { useState, useCallback, useMemo } from 'react';
import Carousel from '../components/plans/Carousel.jsx';
import PlanList from '../components/plans/PlanList.jsx';
import './MyPlan.css';
import { usePlans } from '../queries/usePlans.js';

const MyPlan = () => {
  const [fullView, setFullView] = useState(null);
  const { data: plans, isLoading, isError } = usePlans();
  const currentUserId = Number(localStorage.getItem("userId"));

  const allPlans = useMemo(() => {
    if (isLoading) return [];
    return plans.filter(plan => plan.ownerId === currentUserId);
  }, [plans, currentUserId, isLoading]);

  const inProgressPlans = useMemo(() => {
    if (isLoading) return [];
    return allPlans.filter(plan => plan.status === "incompleted");
  }, [allPlans, isLoading]);

  const recentPlans = useMemo (() => {
    const raw = localStorage.getItem("recentPlans");
    return raw ? JSON.parse(raw).filter((plan => plans.includes(plan))) : [];
  });

  const handleViewMore = useCallback((title, items) => {
    setFullView({ title, items });
  }, []);

  const handleBack = useCallback(() => {
    setFullView(null);
  }, []);

  // Loading state
  if (isLoading) {
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
  if (isError) {
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
        items={recentPlans}
        onViewMore={() => handleViewMore('Recently Opened', recentPlans)}
      />

      <Carousel
        title="In Progress"
        items={inProgressPlans}
        onViewMore={() => handleViewMore('In Progress', inProgressPlans)}
      />

      <PlanList plans={allPlans} />
    </div>
  );
};

export default MyPlan;