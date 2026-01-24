import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditPlan from './EditPlan';
import PreviewModal from '../createplan/Preview';
import StatusDropdown from '../../components/home/StatusDropdown';
import ReviewPlanPopup from './ReviewPlanPopUp';
import './ViewMyPlan.css';

// Backend-ready structure with subtask statuses and deadlines
const MOCK_PLANS = {
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
            subtasks: [
              {
                text: '10 min jog in place',
                status: 'DONE',
                deadline: '2026-01-15',
                completedAt: '2026-01-14'
              },
              {
                text: '3 sets of push-ups',
                status: 'IN_PROGRESS',
                deadline: '2026-01-20',
                completedAt: null
              }
            ],
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
            subtasks: [
              {
                text: 'useEffect for side effects',
                status: 'DONE',
                deadline: '2026-01-10',
                completedAt: '2026-01-12'
              },
              {
                text: 'useState for local state',
                status: 'CANCELLED',
                deadline: '2026-01-15',
                completedAt: null
              }
            ],
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
            subtasks: [
              {
                text: 'Choose veggies',
                status: 'INCOMPLETE',
                deadline: '2026-01-25',
                completedAt: null
              },
              {
                text: 'Select proteins',
                status: 'IN_PROGRESS',
                deadline: '2026-01-27',
                completedAt: null
              }
            ],
          },
        ],
      },
    ],
  },
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
            subtasks: [
              {
                text: 'Record yourself',
                status: 'DONE',
                deadline: '2026-01-15',
                completedAt: '2026-01-14'
              },
              {
                text: 'Note new vocabulary',
                status: 'IN_PROGRESS',
                deadline: '2026-01-20',
                completedAt: null
              },
              {
                text: 'Self-evaluate fluency',
                status: 'INCOMPLETE',
                deadline: '2026-01-25',
                completedAt: null
              }
            ],
          },
        ],
      },
    ],
  },
};

const ViewMyPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reviewBtnRef = useRef(null);

  const [plan, setPlan] = useState(null);
  const [originalPlan, setOriginalPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showReview, setShowReview] = useState(false);

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

  // Calculate review statistics
  const calculateReviewData = useCallback(() => {
    if (!plan) return {};

    let totalSubtasks = 0;
    let cancelled = 0;
    let completedOnTime = 0;
    let completedLate = 0;
    let inProgress = 0;
    let incomplete = 0;

    plan.stages.forEach(stage => {
      stage.tasks.forEach(task => {
        if (task.subtasks) {
          task.subtasks.forEach(subtask => {
            totalSubtasks++;

            switch (subtask.status) {
              case 'DONE':
                if (subtask.completedAt && subtask.deadline) {
                  const completed = new Date(subtask.completedAt);
                  const deadline = new Date(subtask.deadline);
                  if (completed <= deadline) {
                    completedOnTime++;
                  } else {
                    completedLate++;
                  }
                } else {
                  completedOnTime++;
                }
                break;
              case 'CANCELLED':
                cancelled++;
                break;
              case 'IN_PROGRESS':
                inProgress++;
                break;
              case 'INCOMPLETE':
                incomplete++;
                break;
              default:
                incomplete++;
            }
          });
        }
      });
    });

    return {
      totalSubtasks,
      cancelled,
      completedOnTime,
      completedLate,
      inProgress,
      incomplete,
    };
  }, [plan]);

  // Handle subtask status change
  const handleSubtaskStatusChange = useCallback((stageIdx, taskIdx, subtaskIdx, newStatus) => {
    setPlan(prevPlan => {
      const updatedPlan = JSON.parse(JSON.stringify(prevPlan));
      const subtask = updatedPlan.stages[stageIdx].tasks[taskIdx].subtasks[subtaskIdx];

      subtask.status = newStatus;

      // Set completedAt timestamp when marked as DONE
      if (newStatus === 'DONE' && !subtask.completedAt) {
        subtask.completedAt = new Date().toISOString().split('T')[0];
      } else if (newStatus !== 'DONE') {
        subtask.completedAt = null;
      }

      // TODO: Send update to backend API
      // await updateSubtaskStatus(planId, stageIdx, taskIdx, subtaskIdx, { status: newStatus, completedAt: subtask.completedAt });

      return updatedPlan;
    });
  }, []);

  const handleSave = useCallback(() => {
    console.log('Saved plan:', plan);
    setOriginalPlan(JSON.parse(JSON.stringify(plan)));
    setIsEditing(false);
    // TODO: Send to API
    // await savePlan(id, plan);
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
          <div ref={reviewBtnRef} style={{ position: 'relative' }}>
            <button className="btn-review" onClick={() => setShowReview(!showReview)}>
              Review
            </button>
            <ReviewPlanPopup
              isOpen={showReview}
              onClose={() => setShowReview(false)}
              containerRef={reviewBtnRef}
              reviewData={calculateReviewData()}
            />
          </div>
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
                          {task.subtasks.map((subtask, subtaskIdx) => (
                            <li key={subtaskIdx} className="subtask-item">
                              <span className="subtask-text">
                                {typeof subtask === 'string' ? subtask : subtask.text}
                              </span>
                              {typeof subtask === 'object' && (
                                <StatusDropdown
                                  value={subtask.status || 'INCOMPLETE'}
                                  onChange={(newStatus) =>
                                    handleSubtaskStatusChange(stageIdx, taskIdx, subtaskIdx, newStatus)
                                  }
                                />
                              )}
                            </li>
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