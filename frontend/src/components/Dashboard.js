import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

function Dashboard() {
  const [workshops, setWorkshops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();
  
  const handleRefresh = () => {
    let result = workshops;

    if (search) {
      result = result.filter(w =>
        w.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter(w =>
        w.workshop_type_name?.toLowerCase() === category.toLowerCase()
      );
    }

    if (price === "free") {
      result = result.filter(w => w.price === 0);
    }

    if (price === "paid") {
      result = result.filter(w => w.price > 0);
    }

    setFiltered(result);
  };

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        let url = "http://127.0.0.1:8000/api/workshops/?";

        if (category) url += `category=${category}&`;
        if (price) url += `price=${price}&`;

        const res = await axios.get(url);
        setWorkshops(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWorkshops();
  }, []);

  // 🔍 filter logic
  useEffect(() => {
    const result = workshops.filter(w =>
      w.title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, workshops]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>📊 Dashboard</h1>

      {/*FILTERS*/}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "25px",
        flexWrap: "wrap"
      }}>
        <input
          type="text"
          placeholder="Search workshops..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <select onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
          <option value="">All Categories</option>
          <option value="AI">AI</option>
          <option value="Web">Web</option>
          <option value="Web">data science</option>
        </select>

        <select onChange={(e) => setPrice(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
          <option value="">All</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        <input
          type="date"
          onChange={(e) => {
            const selected = e.target.value;
            const result = workshops.filter(w => w.date === selected);
            setFiltered(result);
          }}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

          {/* RIGHT SIDE → refresh button */}
        <button
          onClick={handleRefresh}
          style={{
            padding: "8px 14px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/*WORKSHOP CARDS*/}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {filtered.map((w) => (
          <div
            key={w.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "0.3s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
            }}
          >
            <h3>{w.title}</h3>
            <p>{w.description}</p>
            <p><b>Date:</b> {w.date}</p>
            <p><b>Price:</b> ₹ {w.price}</p>

            {/*View Details*/}
            <button
              onClick={() => navigate(`/workshop/${w.id}`)}
              style={{
                marginTop: "10px",
                padding: "6px 10px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              View Details
            </button>

          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ marginTop: "20px" }}>
            <p>No workshops found 😕</p>
          </div>
        )}
      </div>
    </div>
  );
}


export default Dashboard;