import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← Để redirect
import Eye from "../assets/icons/Eye.svg";
import EyeOff from "../assets/icons/Eye_off.svg";
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

  const [passwordError, setPasswordError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
    setPasswordError("");
    setErrorMsg("");
    setStatusMsg("");
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
    setErrorMsg("");
    setStatusMsg("");
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setStatusMsg("");
    setPasswordError("");

    if (signupData.password !== signupData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await authApi.signup({
        username: signupData.username.trim(),
        email: signupData.email.trim(),
        password: signupData.password,
      });
      setStatusMsg("Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
      setIsSignUp(false); // Chuyển về form login
      setSignupData({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMsg(
        err.response?.data?.message || err.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setStatusMsg("");
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

      // Gọi API me để lấy thông tin user (username, etc.)
      let username = loginData.username;
      try {
        const meRes = await authApi.me();
        username = meRes?.data?.result?.username || meRes?.data?.username || username;
      } catch (meErr) {
        console.warn("Không thể lấy thông tin user (me):", meErr);
        // Vẫn cho login nếu me thất bại (token vẫn hợp lệ)
      }

      setStatusMsg(`Đăng nhập thành công! Xin chào ${username}!`);
      setLoginData({ username: "", password: "" });

      // ← CHUYỂN HƯỚNG VỀ TRANG CHỦ
      setTimeout(() => {
        navigate("/home");
      }, 800); // Delay nhẹ để user thấy thông báo thành công
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(
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

        /* Messages */
        .message {
          font-size: 0.95rem;
          margin: 8px 0;
          text-align: center;
        }

        .error { color: red; }
        .success { color: green; }

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
      `}</style>

      <div className={`container ${isSignUp ? "active" : ""}`} id="container">
        {/* LOGIN FORM */}
        <div className="form-container login-container">
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>

            {statusMsg && <p className="message success">{statusMsg}</p>}
            {errorMsg && <p className="message error">{errorMsg}</p>}

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
              <img
                src={showLoginPassword ? EyeOff : Eye}
                alt="toggle password"
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

            {passwordError && <p className="message error">{passwordError}</p>}
            {errorMsg && <p className="message error">{errorMsg}</p>}
            {statusMsg && <p className="message success">{statusMsg}</p>}

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
              <img
                src={showSignupPassword ? EyeOff : Eye}
                alt="toggle password"
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
              <img
                src={showConfirmPassword ? EyeOff : Eye}
                alt="toggle confirm password"
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