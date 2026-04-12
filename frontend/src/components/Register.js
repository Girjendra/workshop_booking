import { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration Successful 🚀");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        <div style={styles.formSection}>

          {/* Username */}
          <div style={styles.inputGroup}>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              style={styles.input}
            />
            <label
              style={
                form.username
                  ? { ...styles.label, top: "-8px", fontSize: "12px", color: "#0f172a" }
                  : styles.label
              }
            >
              Username
            </label>
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
            />
            <label
              style={
                form.email
                  ? { ...styles.label, top: "-8px", fontSize: "12px", color: "#0f172a" }
                  : styles.label
              }
            >
              Email
            </label>                    
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
            />
            <label
              style={
                form.password
                  ? { ...styles.label, top: "-8px", fontSize: "12px", color: "#0f172a" }
                  : styles.label
              }
            >
              Password
            </label>  
          </div>

          {/* ✅ REGISTER BUTTON */}
          <button style={styles.button} onClick={handleSubmit}>
            Register
          </button>

        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
    backgroundColor: "#f3f4f6"
  },

  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
  },

  title: {
    textAlign: "center",
    marginBottom: "25px"
  },

  formSection: {
    display: "flex",
    flexDirection: "column",
  },

  inputGroup: {
    position: "relative",
    marginBottom: "22px",
  },

  input: {
    width: "100%",
    padding: "14px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
  },

  label: {
    position: "absolute",
    top: "50%",
    left: "12px",
    transform: "translateY(-50%)",
    backgroundColor: "#fff",
    padding: "0 6px",
    color: "#888",
    fontSize: "14px",
    transition: "0.2s ease",
    pointerEvents: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "15px",
    fontWeight: "500",
  },

  back: {
    marginTop: "12px",
    textAlign: "center",
    cursor: "pointer",
    color: "#2563eb"
  },
};

export default Register;