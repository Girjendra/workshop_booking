import React from "react";

function Login() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <input type="text" placeholder="Enter Username" style={styles.input} />
        <input type="password" placeholder="Enter Password" style={styles.input} />

        <button style={styles.button}>Login</button>

        <p style={styles.link}>Forgot Password?</p>
        <p style={styles.link}>Don't have an account? Register</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  card: {
    width: "350px",
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
    button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s"
    },
    link: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#2563eb",
    cursor: "pointer",
    },
};

export default Login;