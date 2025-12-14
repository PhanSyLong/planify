import React, { useState } from "react";
import Eye from "../assets/icons/Eye.svg";
import EyeOff from "../assets/icons/Eye_off.svg";
import { authApi } from "../api/auth";

const LoginSignup = () => {
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

    if (signupData.password !== signupData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    setPasswordError("");
    setLoading(true);
    try {
      await authApi.signup({
        username: signupData.username.trim(),
        email: signupData.email.trim(),
        password: signupData.password,
      });
      setStatusMsg("Đăng ký thành công, hãy đăng nhập.");
      setIsSignUp(false);
      setSignupData({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setErrorMsg(err.message || "Đăng ký thất bại");
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

      const token = data?.result?.token;
      if (!token) {
        throw new Error("Không nhận được token");
      }
      localStorage.setItem("accessToken", token);

      const meRes = await authApi.me();
      const username = meRes?.data?.result?.username || loginData.username;
      setStatusMsg(`Đăng nhập thành công. Xin chào ${username}!`);
      setLoginData({ username: "", password: "" });
    } catch (err) {
      setErrorMsg(err.message || "Đăng nhập thất bại");
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
          margin-top: 10px;
          margin-bottom: 10px;
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

        /* Headings */
        h1 {
          align-self: center;
          margin-bottom: 20px;
          color: #000;
        }

        /* Paragraphs & links */
        p {
          color: #000;
          text-align: center;
          margin-top: 10px;
        }

        p a {
          color: #0b2c59;
          text-decoration: none;
          font-weight: bold;
        }

        p a:hover {
          text-decoration: underline;
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
          pointer-events: auto;
          user-select: none;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }

        .eye-icon:hover {
          opacity: 1;
        }
      `}</style>

      <div className={`container ${isSignUp ? "active" : ""}`} id="container">
        {/* LOGIN FORM */}
        <div className="form-container login-container">
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>

            {statusMsg && <p style={{ color: "green", fontSize: "0.95rem", margin: "8px 0" }}>{statusMsg}</p>}
            {errorMsg && <p style={{ color: "red", fontSize: "0.95rem", margin: "8px 0" }}>{errorMsg}</p>}

            <input
              type="text"
              placeholder="Username"
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              required
            />

            <div className="password-wrapper">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
              <img
                src={showLoginPassword ? EyeOff : Eye}
                alt="toggle password"
                className="eye-icon"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Login"}
            </button>

            <p>
              Don't have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); }}>
                Sign Up
              </a>
            </p>
          </form>
        </div>

        {/* SIGN UP FORM */}
        <div className="form-container signup-container">
          <form onSubmit={handleSignupSubmit}>
            <h1>Sign Up</h1>

            {passwordError && (
              <p style={{ color: "red", fontSize: "0.9rem", margin: "8px 0" }}>
                {passwordError}
              </p>
            )}
            {errorMsg && <p style={{ color: "red", fontSize: "0.95rem", margin: "8px 0" }}>{errorMsg}</p>}
            {statusMsg && <p style={{ color: "green", fontSize: "0.95rem", margin: "8px 0" }}>{statusMsg}</p>}

            <input
              type="text"
              placeholder="Username"
              name="username"
              value={signupData.username}
              onChange={handleSignupChange}
              required
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
            />

            <div className="password-wrapper">
              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
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
              />
              <img
                src={showConfirmPassword ? EyeOff : Eye}
                alt="toggle confirm password"
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Sign Up"}
            </button>

            <p>
              Already have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); }}>
                Login
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