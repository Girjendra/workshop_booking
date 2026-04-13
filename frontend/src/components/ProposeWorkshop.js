import { useState } from "react";
import axios from "axios";

function ProposeWorkshop() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/workshops/create/", {
        title,
        description,
        price,
        date,
        workshop_type: 1
        });

      alert("✅ Workshop submitted!");
      
      // reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setDate("");

    }
    catch (err) {
        console.log("ERROR:", err.response?.data);
        alert(JSON.stringify(err.response?.data));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center" }}>🚀 Propose Workshop</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <textarea
            placeholder="Description"
            style={{
                ...inputStyle,
                minHeight: "20px",   // 🔥 controlled height
                resize: "vertical",    // optional (nice UX)
                background: "#fff"
            }}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyle}
        />

        <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
                width: "100%",   // 🔥 FULL WIDTH
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "15px"
            }}
        />

        <button
            style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "0.3s"
            }}
            onClick={handleSubmit} 
            onMouseEnter={(e) => e.target.style.opacity = "0.9"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
            >
            Submit
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    background: "#f4f6f9"
  },
  card: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "15px",
    background: "#f8fafc",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
};
  const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "15px",
  fontSize: "14px"
};

export default ProposeWorkshop;