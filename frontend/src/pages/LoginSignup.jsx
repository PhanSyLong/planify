import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { authApi } from "../api/auth";

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
        err.response?.data?.message || err.message || "Đăng ký thất bại. Vui lòng thử lại."
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
        throw new Error("Không nhận được token từ server");
      }

      localStorage.setItem("accessToken", token);

      let username = loginData.username;
      let detectedRole = data?.result?.role || data?.role || "";

      try {
        const meRes = await authApi.me();
        username = meRes?.data?.result?.username || meRes?.data?.username || username;
        detectedRole = meRes?.data?.result?.role || meRes?.data?.role || detectedRole;
      } catch (meErr) {
        console.warn("Không thể lấy thông tin user (me):", meErr);
      }

      if (!detectedRole) {
        detectedRole = username?.toLowerCase() === "admin" ? "admin" : "user";
      }

      localStorage.setItem("role", detectedRole);

      addToast("success", `Đăng nhập thành công! Xin chào ${username}!`);
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
        err.response?.data?.message || err.message || "Đăng nhập thất bại. Kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* Reset & base */
        * {
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }

        body {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff;
        }

        /* Main container */
        .container {
          position: relative;
          width: 800px;
          height: 500px;
          display: flex;
          overflow: hidden;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          background-color: #fff;
        }

        /* Form containers */
        .form-container {
          position: absolute;
          width: 50%;
          height: 100%;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: transform 0.7s ease-in-out, opacity 0.4s ease-in-out;
          background-color: white;
          z-index: 2;
        }

        .form-container form {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .form-container input {
          margin: 10px 0;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 5px;
          outline: none;
        }

        .form-container button {
          margin-top: 20px;
          padding: 12px;
          background: #0b2c59;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }

        .form-container button:hover {
          background: #133c7a;
        }

        .form-container button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Positioning */
        .login-container {
          left: 0;
          transform: translateX(0);
        }

        .signup-container {
          right: 0;
          transform: translateX(0);
        }

        /* Cover */
        .cover {
          position: absolute;
          left: 50%;
          width: 50%;
          height: 100%;
          background: #0b2c59;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: left 0.7s ease-in-out;
          z-index: 1;
          border-radius: 0 20px 20px 0;
          overflow: hidden;
          pointer-events: none;
        }

        .cover h2 {
          font-size: 2rem;
          text-align: center;
          padding: 20px;
        }

        /* Active state */
        .container.active .cover {
          left: 0;
          border-radius: 20px 0 0 20px;
        }

        /* Form visibility & animation */
        .container .login-container {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }

        .container .signup-container {
          opacity: 0;
          transform: translateX(100%);
          pointer-events: none;
        }

        .container.active .login-container {
          opacity: 0;
          transform: translateX(-100%);
          pointer-events: none;
        }

        .container.active .signup-container {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }

        /* Password wrapper & eye icon */
        .password-wrapper {
          position: relative;
          width: 100%;
          margin-bottom: 10px;
        }

        .password-wrapper input {
          width: 100%;
          padding: 12px 40px 12px 12px;
          box-sizing: border-box;
        }

        .eye-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s ease;
          color: #666;
        }

        .eye-icon:hover {
          opacity: 1;
        }

        /* Links */
        p a {
          color: #0b2c59;
          text-decoration: none;
          font-weight: bold;
        }

        p a:hover {
          text-decoration: underline;
        }

        /* TOAST NOTIFICATIONS */
        .toasts {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .toast {
          min-width: 300px;
          padding: 14px 18px;
          border-radius: 8px;
          color: white;
          font-size: 0.95rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          animation: slideIn 0.4s ease-out;
        }

        .toast.error {
          background-color: #e74c3c;
        }

        .toast.success {
          background-color: #27ae60;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* MODAL SUCCESS */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background: white;
          padding: 30px 40px;
          border-radius: 12px;
          text-align: center;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }

        .modal-content h2 {
          margin-bottom: 15px;
          color: #27ae60;
          font-size: 1.8rem;
        }

        .modal-content p {
          margin-bottom: 30px;
          color: #333;
          font-size: 1rem;
        }

        .modal-content button {
          padding: 12px 32px;
          background: #0b2c59;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          font-size: 1rem;
          transition: background 0.3s;
        }

        .modal-content button:hover {
          background: #133c7a;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

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
            <h2>Đăng ký thành công!</h2>
            <p>Bạn đã tạo tài khoản thành công.<br />Hãy đăng nhập để tiếp tục.</p>
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
              {loading ? "Đang xử lý..." : "Login"}
            </button>

            <p>
              Chưa có tài khoản?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); }}>
                Đăng ký ngay
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
              {loading ? "Đang xử lý..." : "Sign Up"}
            </button>

            <p>
              Đã có tài khoản?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); }}>
                Đăng nhập
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