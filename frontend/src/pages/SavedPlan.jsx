// SavedPage.jsx
import React, { useState, useEffect } from 'react';
import Carousel from '../components/myPlan/Carousel';
import PlanList from '../components/myPlan/PlanList';
import './SavedPlan.css';

const SavedPage = () => {
  const [fullView, setFullView] = useState(null);
  const [savedPlans, setSavedPlans] = useState({
    english: [],
    math: [],
    coding: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch saved plans from backend
  useEffect(() => {
    const fetchSavedPlans = async () => {
      setLoading(true);

      try {
        // TODO: Replace with your actual API endpoint
        // const response = await fetch('/api/saved-plans');
        // const data = await response.json();

        // Simulated API call with demo data
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

        setSavedPlans(mockData);
      } catch (error) {
        console.error('Error fetching saved plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPlans();
  }, []);

  // Handle view more click
  const handleViewMore = (category, title) => {
    setFullView({
      title: title,
      items: savedPlans[category]
    });
  };

  // Full view mode - show all plans in a category
  if (fullView) {
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

  // Loading state
  if (loading) {
    return (
      <div className="saved-page loading-container">
        <div className="spinner-wrapper">
          <div className="spinner"></div>
          <p className="loading-text">Đang tải...</p>
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