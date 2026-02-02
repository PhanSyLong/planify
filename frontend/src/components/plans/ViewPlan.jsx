import { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton.jsx';        // ← Đã thêm import
import './ViewPlan.css';
import { useHydratedPlan } from '../../queries/useHydratedPlan';
import httpPublic from '../../api/httpPublic';

const ViewPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: fullPlan, isLoading, error, isError } = useHydratedPlan(id);

  const trackRecentPlan = (plan) => {
    const raw = localStorage.getItem("recentPlans");
    const plans = raw ? JSON.parse(raw) : [];

    const filtered = plans.filter(p => p.id !== plan.id);

    const updated = [
      fullPlan,
      ...filtered,
    ].slice(0, 6);  // Maximum of 6 recent plans

    localStorage.setItem("recentPlans", JSON.stringify(updated));
  };

  useEffect(() => {
    if (fullPlan){
      trackRecentPlan(fullPlan);
    }
  });

  // console.log("Viewing plan: ", fullPlan)
  const handleForkClick = useCallback(async() => {
    // console.log('Fork Plan clicked - feature in development');
    navigate(`/plans/${id}/fork`);
  }, [id, navigate]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="viewplan-loading">
        <div className="spinner" role="status" aria-label="Loading"></div>
        <p>Loading plan...</p>
      </div>
    );
  }

  if (isError || !fullPlan) {
    return (
      <div className="viewplan-error">
        <h2>{'Plan not found (Status code: ' + error.message.match(/\d+/g) + ')'}</h2>
        <button onClick={handleGoBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="viewplan-container">
      <div className="viewplan-header">
        <button className="viewplan-back-btn" onClick={handleGoBack}>
          ← Back
        </button>

        <div className="viewplan-actions">
          <button className="btn-fork" onClick={handleForkClick}>
            Fork Plan
          </button>
          <LikeButton
            itemId={Number(id)}
            type='plan'
          />
        </div>
      </div>

      <h1 className="viewplan-title">{fullPlan.title}</h1>

      <div className="viewplan-main">
        <div className="viewplan-sidebar">
          <div className="viewplan-image">
            {fullPlan.picture ? (
              <img src={`${httpPublic.defaults.baseURL}${fullPlan.picture}`} alt={fullPlan.title} />
            ) : (
              <div className="placeholder-image">
                <div className="landscape-icon"></div>
              </div>
            )}
          </div>

          <div className="viewplan-info">
            <div className="info-section">
              <strong>Description</strong>
              <p>{fullPlan.description}</p>
            </div>

            <div className="info-section">
              <strong>Tags</strong>
              <div className="category-tags">
                {(fullPlan.categories || []).map((cat, i) => (
                  <span key={i} className="category-tag">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className='plan-duration'>
              <strong>Duration</strong>
              <p>{fullPlan.duration} Days</p>
            </div>
          </div>
        </div>

        <div className="viewplan-stages">
          {(fullPlan.stages || []).map((stage, stageIdx) => (
            <div key={stageIdx} className="viewplan-stage">
              <div className="stage-header">
                <h3 className="stage-title">
                  Stage {stageIdx + 1}: {stage.title || 'Untitled Stage'}
                </h3>
              </div>

              {stage.description && (
                <p className="stage-description">{stage.description}</p>
              )}

              {stage.duration && (
                <p className="stage-duration">Duration: {stage.duration} Days</p>
              )}

              <div className="stage-tasks">
                {(stage.tasks || []).map((task, taskIdx) => (
                  <div key={taskIdx} className="viewplan-task">
                    <div className="task-header">
                      <h4 className="task-title">
                        Task {taskIdx + 1}: {task.description || 'Untitled Task'}
                      </h4>
                    </div>

                    {task.duration && (
                      <p className="task-duration">
                        Duration: {task.duration} Days
                      </p>
                    )}

                    {(task.subtasks?.length || 0) > 0 && (
                      <div className="subtasks">
                        <strong>Subtasks:</strong>
                        <ul>
                          {(task.subtasks || []).map((sub, i) => (
                            <li key={i}>
                              <div className="subtask-title">{sub.title}</div>
                              {sub.description && (
                                <div className="subtask-description">{sub.description}</div>
                              )}
                              {sub.duration && (
                                <div className="subtask-duration">Duration: {sub.duration} Days</div>
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

          {(fullPlan.stages || []).length === 0 && (
            <p className="no-stages">No stages defined yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPlan;