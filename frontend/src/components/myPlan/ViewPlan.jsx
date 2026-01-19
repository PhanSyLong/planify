// ViewPlan.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ViewPlan.css";

const ViewPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 600));

        const mockPlans = {
          "plan-1": {
            title: "IELTS Speaking Mastery",
            description:
              "A complete 8-week program designed to help you achieve Band 7+ in IELTS Speaking. Includes daily practice, feedback tips, and real exam simulations.",
            imageUrl: null,
            categories: ["Language", "Exam", "English"],
            stages: [
              {
                title: "Week 1-2: Fluency & Coherence",
                description: "Build confidence and natural speaking flow.",
                tasks: [
                  {
                    title: "Daily Topic Practice",
                    description: "Speak on 3 Part 1 topics every day.",
                    duration: "14",
                    subtasks: ["Record yourself", "Note new vocabulary", "Self-evaluate fluency"],
                  },
                  {
                    title: "Long Turn Practice",
                    description: "Practice Part 2 cue cards.",
                    duration: "14",
                    subtasks: ["Time yourself (2 min)", "Use linking words"],
                  },
                ],
              },
              {
                title: "Week 3-4: Lexical Resource",
                description: "Expand vocabulary and use idiomatic language.",
                tasks: [
                  {
                    title: "Themed Vocabulary Lists",
                    description: "Learn 20 new words/phrases per theme.",
                    duration: "14",
                    subtasks: ["Environment", "Technology", "Education", "Health"],
                  },
                ],
              },
            ],
          },
        };

        const foundPlan = mockPlans[id] || null;

        if (!foundPlan) {
          setError("Plan not found");
        } else {
          setPlan(foundPlan);
        }
      } catch (err) {
        setError("Failed to load plan");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleForkClick = () => {
    // Tạm thời chưa làm gì - có thể thêm alert hoặc console.log để test
    console.log("Fork Plan clicked - chức năng sẽ được triển khai sau");
    // alert("Tính năng Fork Plan đang được phát triển!");
  };

  if (loading) {
    return (
      <div className="viewplan-loading">
        <div className="spinner"></div>
        <p>Loading plan...</p>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="viewplan-error">
        <h2>{error || "Plan not found"}</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="viewplan-container">
      {/* Header */}
      <div className="viewplan-header">
        <button className="viewplan-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="viewplan-actions">
          <button className="btn-fork" onClick={handleForkClick}>
            Fork Plan
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="viewplan-title">{plan.title}</h1>

      <div className="viewplan-main">
        {/* Sidebar */}
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

        {/* Stages */}
        <div className="viewplan-stages">
          {plan.stages.map((stage, stageIdx) => (
            <div key={stageIdx} className="viewplan-stage">
              <div className="stage-header">
                <h3 className="stage-title">
                  Stage {stageIdx + 1}: {stage.title || "Untitled Stage"}
                </h3>
              </div>

              {stage.description && <p className="stage-description">{stage.description}</p>}

              <div className="stage-tasks">
                {stage.tasks.map((task, taskIdx) => (
                  <div key={taskIdx} className="viewplan-task">
                    <div className="task-header">
                      <h4 className="task-title">
                        Task {taskIdx + 1}: {task.title || "Untitled Task"}
                      </h4>
                    </div>

                    {task.description && <p className="task-description">{task.description}</p>}

                    {task.duration && (
                      <p className="task-duration">
                        Duration: <strong>{task.duration} Days</strong>
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

          {plan.stages.length === 0 && <p className="no-stages">No stages defined yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default ViewPlan;