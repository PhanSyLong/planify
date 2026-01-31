import { useState, useCallback, useMemo } from 'react';
import ExploreHeader from '../components/explore/ExploreHeader';
import ExploreTags from '../components/explore/ExploreTags';
import Carousel from '../components/plans/Carousel';
import PlanList from '../components/plans/PlanList';
import './ExplorePage.css';
import { usePlans } from '../queries/usePlans';


const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('subject');
  const [pinnedTags, setPinnedTags] = useState([]);
  const [fullView, setFullView] = useState(null);
  const { data: plans, isLoading } = usePlans();

  const currentUserId = Number(localStorage.getItem("userId"));
  
  const explorePlans = useMemo(() => {
    if (isLoading) return [];
    return plans.filter(plan => plan.ownerId !== currentUserId)
  }, [plans, isLoading]);
  

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

    // if (fullView.type === 'user') {
    //   return (
    //     <div className="explore-page">
    //       <UserList
    //         initialUsers={fullView.items}
    //         isFullView={true}
    //         fullViewTitle={fullView.title}
    //         onBack={handleBackFromFullView}
    //       />
    //     </div>
    //   );
    // }
  }

  // Loading state
  if (isLoading) {
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
        title="Community Plans"
        items={explorePlans}
        type="plan"
        onViewMore={() => handleViewMore('All Plans', explorePlans, 'plan')}
      />

      {/* <UserCarousel
        title="Featured Teachers"
        users={exploreUsers}
        onViewMore={() => handleViewMore('All Teachers', exploreUsers, 'user')}
      /> */}
    </div>
  );
};

export default ExplorePage;