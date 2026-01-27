import React from 'react';
import './AboutUs.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">About Planify</h1>
        <p className="hero-subtitle">
          Turning learning intentions into real achievements — one plan at a time.
        </p>
      </section>

      {/* Our Story */}
      <section className="section story">
        <div className="container">
          <div className="grid two-columns reverse-on-mobile">
            <div className="story-text">
              <h2 className="section-title">Our Story</h2>
              <p>
                Planify was born from a simple but relatable struggle: we all know how easy it is to create a study plan,
                but how hard it is to actually stick to it.
              </p>
              <p>
                As students ourselves, we've experienced the initial excitement of setting ambitious learning goals — only
                to watch motivation fade without proper tracking, reminders, or feedback. We realized that self-learning
                in today's fast-changing world requires more than just willpower; it needs structure, accountability,
                and a supportive community.
              </p>
              <p>
                That's why we created <strong>Planify</strong> — a blend of "Plan" and "Simplify."
              </p>
            </div>
            <div className="story-image text-center">
              <img
                src="https://via.placeholder.com/500x400?text=Planify+Team"
                alt="Planify Team"
                className="image-rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="section cards bg-light">
        <div className="container">
          <div className="grid three-columns">
            <div className="card text-center">
              <div className="card-icon">🎯</div>
              <h3 className="card-title">Our Mission</h3>
              <p className="card-text">
                To empower self-learners worldwide by making study planning simple, sustainable, and community-driven.
              </p>
            </div>
            <div className="card text-center">
              <div className="card-icon">🌟</div>
              <h3 className="card-title">Our Vision</h3>
              <p className="card-text">
                A world where everyone can consistently achieve their learning goals with confidence and enjoyment.
              </p>
            </div>
            <div className="card text-center">
              <div className="card-icon">💡</div>
              <h3 className="card-title">Core Values</h3>
              <p className="card-text">
                Simplicity • Accountability • Community • Continuous Improvement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features">
        <div className="container">
          <h2 className="section-title text-center">What Makes Planify Special</h2>
          <div className="grid two-columns">
            <div className="feature-item">
              <strong>📅 Flexible Planning:</strong> Build detailed plans with stages, tasks, and subtasks
            </div>
            <div className="feature-item">
              <strong>🔔 Smart Reminders:</strong> Daily notifications to keep you on track
            </div>
            <div className="feature-item">
              <strong>📊 Honest Analytics:</strong> Daily, weekly, and overall performance insights
            </div>
            <div className="feature-item">
              <strong>🌍 Community Sharing:</strong> Explore, like, and adopt proven plans from others
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <section className="section cta text-center bg-light">
        <div className="container">
          <p className="lead">
            Planify is proudly developed by a passionate team of students as part of <strong>Group Project B3</strong>,<br />
            using modern technologies: React.js, Spring Boot, MySQL, and Agile methodology.
          </p>
          <p style={{ marginTop: '32px' }}>
            Ready to simplify your learning journey?<br /><br />
            <a href="/logout" className="btn-primary">
              Join Planify Today
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;