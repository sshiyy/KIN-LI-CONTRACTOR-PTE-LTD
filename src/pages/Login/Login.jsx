import "./Login.css";
import logo from "../../assets/LOGO-small.svg";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="KIN LI Logo" className="login-logo" />

        <h1>KIN LI</h1>
        <p>Worker Management System</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <span className="login-error">{error}</span>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;