import { useState } from "react";
import axios from "axios";

function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/reset-password/", {
        email: email
      });

      alert("Reset link sent to email ✅");
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "80px auto",
      padding: "30px",
      borderRadius: "12px",
      background: "#f8fafc",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ marginBottom: "20px" }}>
        🔑 Reset Password
      </h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "15px"
        }}
      />

      <button
        onClick={handleReset}
        style={{
          width: "100%",
          padding: "12px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Send Reset Link
      </button>
    </div>
  );
}

export default ResetPassword;