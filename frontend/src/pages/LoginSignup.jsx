import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { authApi } from "../api/auth";
import "./LoginSignup.css"

const LoginSignup = () => {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // Toast notifications (error, login success, etc.)
  const [toasts, setToasts] = useState([]);

  // Modal success sau đăng ký
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      addToast("error", "Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await authApi.signup({
        username: signupData.username.trim(),
        email: signupData.email.trim(),
        password: signupData.password,
      });

      setShowSuccessModal(true);

      setSignupData({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      console.error("Signup error:", err);
      addToast(
        "error",
        err.response?.data?.message || err.message || "Signup failed! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    setIsSignUp(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authApi.login({
        username: loginData.username.trim(),
        password: loginData.password,
      });

      const token = data?.result?.token || data?.token;
      if (!token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("accessToken", token);

      let username = loginData.username;
      let detectedRole = data?.result?.role || data?.role || "";

      try {
        const meRes = await authApi.me();
        username = meRes?.data?.result?.username || meRes?.data?.username || username;
        detectedRole = meRes?.data?.result?.role || meRes?.data?.role || detectedRole;
      } catch (meErr) {
        console.warn("Unable to retrieve user info (me):", meErr);
      }

      if (!detectedRole) {
        detectedRole = username?.toLowerCase() === "admin" ? "admin" : "user";
      }

      localStorage.setItem("role", detectedRole);

      addToast("success", `Login successful! Welcome ${username}!`);
      setLoginData({ username: "", password: "" });

      // Kiểm tra role và chuyển hướng phù hợp
      const userRole = localStorage.getItem("role");

      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      addToast(
        "error",
        err.response?.data?.message || err.message || "Login failed! Please check your information."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast notifications */}
      <div className="toasts">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>

      {/* Modal thành công đăng ký */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <h2>Signup successful!</h2>
            <p>You have successfully created an account.<br />Please Login to continue.</p>
            <button onClick={handleModalOk}>OK</button>
          </div>
        </div>
      )}

      <div className={`container ${isSignUp ? "active" : ""}`} id="container">
        {/* LOGIN FORM */}
        <div className="form-container login-container">
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>

            <input
              type="text"
              placeholder="Username"
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              required
              disabled={loading}
            />

            <div className="password-wrapper">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                disabled={loading}
              />
              <FontAwesomeIcon
                icon={showLoginPassword ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>

            <p>
              Don't have an account yet?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); }}>
                Sign In
              </a>
            </p>
          </form>
        </div>

        {/* SIGN UP FORM */}
        <div className="form-container signup-container">
          <form onSubmit={handleSignupSubmit}>
            <h1>Sign Up</h1>

            <input
              type="text"
              placeholder="Username"
              name="username"
              value={signupData.username}
              onChange={handleSignupChange}
              required
              disabled={loading}
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
              disabled={loading}
            />

            <div className="password-wrapper">
              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
                disabled={loading}
              />
              <FontAwesomeIcon
                icon={showSignupPassword ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
              />
            </div>

            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                required
                disabled={loading}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Sign Up"}
            </button>

            <p>
              Already have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); }}>
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
    </>
  );
};

export default LoginSignup;