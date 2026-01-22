import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Carousel from '../components/plans/Carousel';
import PlanList from '../components/plans/PlanList';
import './SavedPlan.css';

const SavedPage = () => {
  const [fullView, setFullView] = useState(null);
  const [savedPlans, setSavedPlans] = useState({
    english: [],
    math: [],
    coding: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch saved plans from backend
  useEffect(() => {
    let isMounted = true;

    const fetchSavedPlans = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Replace with your actual API endpoint
        // const response = await fetch('/api/saved-plans');
        // if (!response.ok) throw new Error('Failed to fetch plans');
        // const data = await response.json();

        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockData = {
          english: [
            {
              id: 'eng-1',
              title: 'IELTS Speaking Practice',
              duration: '4 weeks • Intermediate',
              category: 'english'
            }
          ],
          math: [
            {
              id: 'math-1',
              title: 'Calculus Fundamentals',
              duration: '6 weeks • Advanced',
              category: 'math'
            }
          ],
          coding: [
            {
              id: 'code-1',
              title: 'React Development',
              duration: '8 weeks • Beginner',
              category: 'coding'
            }
          ]
        };

        if (isMounted) {
          setSavedPlans(mockData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Error fetching saved plans:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSavedPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoized handler to prevent unnecessary re-renders
  const handleViewMore = useCallback((category, title) => {
    setFullView({
      title,
      items: savedPlans[category]
    });
  }, [savedPlans]);

  const handleBack = useCallback(() => {
    setFullView(null);
  }, []);

  // Memoized full view content
  const fullViewContent = useMemo(() => {
    if (!fullView) return null;

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
  }, [fullView, handleBack]);

  // Full view mode
  if (fullView) {
    return fullViewContent;
  }

  // Loading state
  if (loading) {
    return (
      <div className="saved-page loading-container">
        <div className="spinner-wrapper">
          <div className="spinner" role="status" aria-label="Loading"></div>
          <p className="loading-text">Loading saved plans...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="saved-page loading-container">
        <div className="spinner-wrapper">
          <p className="loading-text" style={{ color: '#ef4444' }}>
            Failed to load plans. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Main view - carousel sections
  return (
    <div className="saved-page">
      <Carousel
        title="English"
        items={savedPlans.english}
        type="plan"
        onViewMore={() => handleViewMore('english', 'English')}
      />

      <Carousel
        title="Math"
        items={savedPlans.math}
        type="plan"
        onViewMore={() => handleViewMore('math', 'Math')}
      />

      <Carousel
        title="Coding"
        items={savedPlans.coding}
        type="plan"
        onViewMore={() => handleViewMore('coding', 'Coding')}
      />
    </div>
  );
};

export default SavedPage;