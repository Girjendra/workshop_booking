import { useEffect, useState } from "react";
import axios from "axios";

function Statistics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/stats/")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!stats) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>📊 Workshop Statistics</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}>
        <div style={card}>Total: {stats.total}</div>
        <div style={card}>✅ Accepted: {stats.accepted}</div>
        <div style={card}>⏳ Pending: {stats.pending}</div>
        <div style={card}>❌ Rejected: {stats.rejected}</div>
      </div>
    </div>
  );
}

const card = {
  padding: "20px",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  textAlign: "center",
  fontSize: "18px"
};

export default Statistics;