import { useEffect, useState } from "react";

function Workshops() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/workshops/")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>Available Workshops</h2>

      {data.length === 0 ? (
        <p>No workshops available</p>
      ) : (
        data.map((w, i) => (
          <div key={i}>
            <h3>{w.title}</h3>
          </div>
        ))
      )}
    </div>
  );
}

export default Workshops;