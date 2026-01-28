import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlanInfo from "../createplan/PlanInfo";
import PreviewModal from "../createplan/Preview.jsx";
import './ForkPlan.css';

// Mock data - in real app, replace with API call
const MOCK_PLANS = {
  'plan-1': {
    title: 'IELTS Speaking Mastery',
    description: 'A complete 8-week program designed to help you achieve Band 7+ in IELTS Speaking. Includes daily practice, feedback tips, and real exam simulations.',
    reviewUrl: null,
    categories: ['Language', 'Exam', 'English'],
    stages: [
      {
        title: 'Week 1-2: Fluency & Coherence',
        description: 'Build confidence and natural speaking flow.',
        tasks: [
          {
            title: 'Daily Topic Practice',
            description: 'Speak on 3 Part 1 topics every day.',
            duration: '14',
            subtasks: ['Record yourself', 'Note new vocabulary', 'Self-evaluate fluency'],
          },
          {
            title: 'Long Turn Practice',
            description: 'Practice Part 2 cue cards.',
            duration: '14',
            subtasks: ['Time yourself (2 min)', 'Use linking words'],
          },
        ],
      },
      {
        title: 'Week 3-4: Lexical Resource',
        description: 'Expand vocabulary and use idiomatic language.',
        tasks: [
          {
            title: 'Themed Vocabulary Lists',
            description: 'Learn 20 new words/phrases per theme.',
            duration: '14',
            subtasks: ['Environment', 'Technology', 'Education', 'Health'],
          },
        ],
      },
    ],
  },
  // Add more plans as needed
};

const ForkPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [originalPlan, setOriginalPlan] = useState(null);
  const [planData, setPlanData] = useState({
    title: '',
    description: '',
    categories: [],
    stages: [{ title: '', description: '', tasks: [] }],
    reviewUrl: null,
  });
  const [showPreview, setShowPreview] = useState(false);

  // Load original plan and pre-fill form
  useEffect(() => {
    const loadOriginalPlan = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // simulate network

        const foundPlan = MOCK_PLANS[id];

        if (!foundPlan) {
          alert('Plan not found');
          navigate('/plans', { replace: true });
          return;
        }

        setOriginalPlan(foundPlan);

        // Pre-fill with a copy, but change title to indicate it's a fork
        setPlanData({
          ...foundPlan,
          title: `Copy of ${foundPlan.title}`,
          // reviewUrl: foundPlan.reviewUrl, // keep original image (or set null if you prefer)
        });
      } catch (err) {
        console.error(err);
        alert('Failed to load plan');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadOriginalPlan();
  }, [id, navigate]);

  const handleCreate = useCallback(() => {
    if (!planData.title.trim()) {
      alert("Please enter a plan title");
      return;
    }

    console.log("✅ Forked plan created:", planData);
    console.log("   Original plan ID:", id);

    // TODO: Send to backend with forkedFrom: id
    // e.g. { ...planData, forkedFrom: id }

    alert("Plan forked successfully!");
    navigate('/my-plans'); // or wherever your user's plans are listed
  }, [planData, id, navigate]);

  const handlePreview = useCallback(() => {
    if (!planData.title.trim()) {
      alert("Please enter a plan title before previewing");
      return;
    }
    setShowPreview(true);
  }, [planData.title]);

  const updatePlanData = useCallback((updates) => {
    setPlanData(prev => ({ ...prev, ...updates }));
  }, []);

  if (loading) {
    return (
      <div className="createplan-page">
        <div className="viewplan-loading">
          <p>Loading plan to fork...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="createplan-page">
      <div className="createplan-header">

        {originalPlan && (
          <div className="fork-notice">
            Creating your personal copy of <strong>"{originalPlan.title}"</strong>
          </div>
        )}
      </div>

      <div className="createplan-content">
        <PlanInfo planData={planData} updatePlanData={updatePlanData} />
      </div>

      <div className="createplan-actions">
        <button className="review-btn" onClick={handlePreview}>
          Preview
        </button>
        <button className="create-btn" onClick={handleCreate}>
          Fork Plan
        </button>
      </div>

      {showPreview && (
        <PreviewModal
          planData={planData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default ForkPlan;