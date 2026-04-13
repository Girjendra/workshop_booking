import { useEffect, useState } from "react";
import axios from "axios";

const handleStatusChange = async (id, status) => {
  const user = localStorage.getItem("user");   // 👈 ADD THIS

  try {
    await axios.post(`http://127.0.0.1:8000/api/workshops/${id}/status/`, {
      status: status,
      username: user   // 👈 ADD THIS
    });

    alert("Status updated!");
    window.location.reload();

  } catch (err) {
    console.log(err);
  }
};

function Status() {
  const [workshops, setWorkshops] = useState([]);
  const user = localStorage.getItem("user");
  // 🔥 simple logic (adjust if needed)
  const isAdmin = user === "admin";

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/workshops/")
      .then((res) => setWorkshops(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Workshop Status</h2>

      {workshops.map((w) => (
        <div
          key={w.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
            <h3>{w.title}</h3>
            <p>{w.description}</p>

            <p>
            <b>Status:</b>{" "}
            <span
                style={{
                color:
                    w.status_display === "Accepted"
                    ? "green"
                    : w.status_display === "Rejected"
                    ? "red"
                    : "orange"
                }}
            >
                {w.status_display}
            </span>
            </p>

            {isAdmin && w.status_display === "Pending" && (
                <div style={{ marginTop: "10px" }}>
                    <button
                        onClick={() => handleStatusChange(w.id, 1)}
                        style={{
                            marginRight: "10px",
                            padding: "6px 10px",
                            background: "green",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                        >
                        ✅ Accept
                    </button>

                    <button
                        onClick={() => handleStatusChange(w.id, 2)}
                        style={{
                            padding: "6px 10px",
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                        >
                        ❌ Reject
                    </button>

                </div>
            )}
        </div>
      ))}
    </div>
  );
}

export default Status;