import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditPlan from './EditPlan';
import PreviewModal from '../createplan/Preview';
import './ViewMyPlan.css';

const MOCK_PLANS = {
  'plan-1': {
    title: 'IELTS Speaking Mastery',
    description: 'A complete 8-week program designed to help you achieve Band 7+ in IELTS Speaking.',
    imageUrl: null,
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
        ],
      },
    ],
  },
  'my-progress-1': {
    title: 'Learn React Advanced',
    description: 'Master advanced React concepts.',
    imageUrl: null,
    categories: ['Programming', 'Web Development', 'React'],
    stages: [
      {
        title: 'Week 1: Hooks Fundamentals',
        description: 'Deep dive into React Hooks.',
        tasks: [
          {
            title: 'Custom Hooks Practice',
            description: 'Create reusable custom hooks.',
            duration: '7',
            subtasks: ['useEffect for side effects', 'useState for local state'],
          },
        ],
      },
    ],
  },
  'my-recent-1': {
    title: 'Morning Workout Routine',
    description: 'Build a sustainable morning habit.',
    imageUrl: null,
    categories: ['Fitness', 'Health'],
    stages: [
      {
        title: 'Week 1: Basics',
        description: 'Get started with simple routines.',
        tasks: [
          {
            title: 'Warm-up & Push-ups',
            description: 'Basic warm-up and strength building.',
            duration: '7',
            subtasks: ['10 min jog in place', '3 sets of push-ups'],
          },
        ],
      },
    ],
  },
  'my-all-1': {
    title: 'Healthy Meal Planning',
    description: 'Plan nutritious meals for better health.',
    imageUrl: null,
    categories: ['Nutrition', 'Health'],
    stages: [
      {
        title: 'Week 1: Planning Basics',
        description: 'Learn to plan weekly meals.',
        tasks: [
          {
            title: 'Grocery List Creation',
            description: 'Make a healthy shopping list.',
            duration: '7',
            subtasks: ['Choose veggies', 'Select proteins'],
          },
        ],
      },
    ],
  },
};

const ViewMyPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [originalPlan, setOriginalPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 600));

        const foundPlan = MOCK_PLANS[id];

        if (isMounted) {
          if (!foundPlan) {
            setError('Plan not found');
          } else {
            setPlan(foundPlan);
            setOriginalPlan(JSON.parse(JSON.stringify(foundPlan)));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load plan');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPlan();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSave = useCallback(() => {
    console.log('Saved plan:', plan);
    setOriginalPlan(JSON.parse(JSON.stringify(plan)));
    setIsEditing(false);
    // TODO: Send to API
  }, [plan]);

  const handleCancel = useCallback(() => {
    setPlan(JSON.parse(JSON.stringify(originalPlan)));
    setIsEditing(false);
  }, [originalPlan]);

  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (loading) {
    return (
      <div className="viewplan-loading">
        <div className="spinner" role="status" aria-label="Loading"></div>
        <p>Loading plan...</p>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="viewplan-error">
        <h2>{error || 'Plan not found'}</h2>
        <button onClick={handleGoBack}>Go Back</button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <>
        <EditPlan
          plan={plan}
          setPlan={setPlan}
          onPreview={handlePreview}
          onSave={handleSave}
          onCancel={handleCancel}
        />
        {showPreview && (
          <PreviewModal
            planData={plan}
            onClose={() => setShowPreview(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="viewplan-container">
      <div className="viewplan-header">
        <button className="viewplan-back-btn" onClick={handleGoBack}>
          ← Back
        </button>

        <div className="viewplan-actions">
          <button className="btn-edit" onClick={() => setIsEditing(true)}>
            Edit Plan
          </button>
        </div>
      </div>

      <h1 className="viewplan-title">{plan.title}</h1>

      <div className="viewplan-main">
        <div className="viewplan-sidebar">
          <div className="viewplan-image">
            {plan.imageUrl ? (
              <img src={plan.imageUrl} alt={plan.title} />
            ) : (
              <div className="placeholder-image">
                <div className="landscape-icon"></div>
              </div>
            )}
          </div>

          <div className="viewplan-info">
            <div className="info-section">
              <strong>Description</strong>
              <p>{plan.description}</p>
            </div>

            <div className="info-section">
              <strong>Tags</strong>
              <div className="category-tags">
                {plan.categories.map((cat, i) => (
                  <span key={i} className="category-tag">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="viewplan-stages">
          {plan.stages.map((stage, stageIdx) => (
            <div key={stageIdx} className="viewplan-stage">
              <div className="stage-header">
                <h3 className="stage-title">
                  Stage {stageIdx + 1}: {stage.title || 'Untitled Stage'}
                </h3>
              </div>

              {stage.description && (
                <p className="stage-description">{stage.description}</p>
              )}

              <div className="stage-tasks">
                {stage.tasks.map((task, taskIdx) => (
                  <div key={taskIdx} className="viewplan-task">
                    <div className="task-header">
                      <h4 className="task-title">
                        Task {taskIdx + 1}: {task.title || 'Untitled Task'}
                      </h4>
                    </div>

                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}

                    {task.duration && (
                      <p className="task-duration">
                        Duration: {task.duration} Days
                      </p>
                    )}

                    {task.subtasks?.length > 0 && (
                      <div className="subtasks">
                        <strong>Subtasks:</strong>
                        <ul>
                          {task.subtasks.map((sub, i) => (
                            <li key={i}>{sub}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {plan.stages.length === 0 && (
            <p className="no-stages">No stages defined yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewMyPlan;