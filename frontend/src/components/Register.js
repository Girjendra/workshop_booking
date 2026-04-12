import { useState } from "react";

function Register() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    institute: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    let newErrors = {};

    if (!form.username) {
      newErrors.username = "Username is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    if (!form.phone || !form.institute) {
      alert("Please fill all fields");
      return;
    }

    alert("Registration Successful 🚀");
  };

  return (
    <>
    <div style={styles.stepContainer}>
      <div style={step === 1 ? styles.activeStep : styles.step}>1</div>
      <div style={styles.line}></div>
      <div style={step === 2 ? styles.activeStep : styles.step}>2</div>
    </div>

    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {step === 1 && (
          <div style={styles.formSection}>
            <div style={styles.inputGroup}>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  border: errors.username ? "1px solid red" : "1px solid #ccc"
                }}
              />
              <label
                style={
                  form.username
                  ? {...styles.label, top: "-8px", fontSize: "12px", color: "#0f172a"}
                  : styles.label
                }
              >
              Username
              </label>
            </div>

            {errors.username && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.username}
              </p>
            )}

            <div style={styles.inputGroup}>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  border: errors.email ? "1px solid red" : "1px solid #ccc"
                }}
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

            {errors.email && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.email}
              </p>
            )}

            <div style={styles.inputGroup}>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  border: errors.password ? "1px solid red" : "1px solid #ccc"
                }}
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

            {errors.password && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.password}
              </p>
            )}

            <button style={styles.button} onClick={handleNext}> Next → </button>
          </div>
        )}


        {step === 2 && (
          <div>
            <div style={styles.inputGroup}>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  border: errors.phone ? "1px solid red" : "#ccc"
                }}
              />
              <label
                style={
                  form.phone
                    ? { ...styles.label, top: "-8px", fontSize: "12px" }
                    : styles.label
                }
              >
                Phone Number
              </label>
            </div>
            {errors.phone && <p style={{ color: "red", fontSize: "12px" }}>{errors.phone}</p>}


            <div style={styles.inputGroup}>
              <input
                name="institute"
                value={form.institute}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  border: errors.institute ? "1px solid red" : "#ccc"
                }}
              />
              <label
                style={
                  form.institute
                    ? { ...styles.label, top: "-8px", fontSize: "12px" }
                    : styles.label
                }
              >
                Institute Name
              </label>
            </div>
            {errors.institute && <p style={{ color: "red", fontSize: "12px" }}>{errors.institute}</p>}

            <button style={styles.button} onClick={handleSubmit}>
              Register
            </button>

            <p style={styles.back} onClick={() => setStep(1)}>
              ← Back
            </p>
          </div>
        )}
      </div>
    </div>
  </>
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
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px"
  },

  input: {
    width: "100%",
    padding: "14px 10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  back: {
    marginTop: "10px",
    textAlign: "center",
    cursor: "pointer",
    color: "#2563eb"
  },

  stepContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },

  step: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },

  activeStep: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },

  line: {
    width: "40px",
    height: "3px",
    backgroundColor: "#ccc",
  },

  formSection: {
    transition: "all 0.3s ease",
  },
  
  inputGroup: {
    position: "relative",
    marginBottom: "20px",
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
















};

export default Register;