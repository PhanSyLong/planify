import React, { useState } from "react";
import "./login_signup.css";

const LoginSignup = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className={`container ${isSignUp ? "active" : ""}`} id="container">
      {/* Login */}
      <div className="form-container login-container">
        <form>
          <h1>Login</h1>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <a href="#" className="forgot-password">
            Forgot your password?
          </a>
          <button type="submit">Login</button>
          <p>
            Don’t have an account?{" "}
            <a href="#" onClick={() => setIsSignUp(true)}>
              Sign Up
            </a>
          </p>
        </form>
      </div>

      {/* Sign In */}
      <div className="form-container signin-container">
        <form>
          <h1>Sign In</h1>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />

          <label className="checkbox">
            <input type="checkbox" required />
            <span>
              I have read and agree to the{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </span>
          </label>

          <button type="submit">Sign In</button>
          <p>
            Already have an account?{" "}
            <a href="#" onClick={() => setIsSignUp(false)}>
              Log In
            </a>
          </p>
        </form>
      </div>

      {/* Sliding Cover */}
      <div className="cover">
        <h2>WELCOME!</h2>
      </div>
    </div>
  );
};

export default LoginSignup;
