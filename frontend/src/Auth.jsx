
import { useState } from "react";

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? "login" : "register";

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            isLogin
              ? {
                  email: formData.email,
                  password: formData.password
                }
              : formData
          )
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful!");

        onAuthSuccess(data.user);
      } else {
        alert("Registration successful! Please login.");

        setIsLogin(true);
        setFormData({
          name: "",
          email: formData.email,
          password: ""
        });
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>
          ApplyTrack <span style={{ color: "#2563eb" }}>Pro</span>
        </h1>

        <h2>{isLogin ? "Welcome Back!" : "Create Your Account"}</h2>

        <p style={styles.subtitle}>
          {isLogin
            ? "Login to manage your job applications."
            : "Register to start tracking your career journey."}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </>
          )}

          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            style={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p style={styles.switchText}>
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            style={styles.switchButton}
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({
                name: "",
                email: "",
                password: ""
              });
            }}
          >
            {isLogin ? " Register" : " Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
  },
  logo: {
    textAlign: "center",
    marginBottom: "25px"
  },
  subtitle: {
    color: "#64748b",
    marginBottom: "25px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "18px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "15px"
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "7px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px"
  },
  switchText: {
    textAlign: "center",
    marginTop: "22px"
  },
  switchButton: {
    border: "none",
    background: "none",
    color: "#2563eb",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Auth;
