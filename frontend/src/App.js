import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import { useNavigate } from "react-router-dom";
import Workshops from "./components/Workshops";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import WorkshopDetails from "./components/WorkshopDetails";

function Home() {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to FOSSEE Workshop Portal</h1>
      <p style={{ color: "#555", marginBottom: "30px" }}>
        Learn, explore and participate in technical workshops organized by FOSSEE.
      </p>

      <div style={styles.cardContainer}>

        {/* Register */}
        <div
          style={styles.card}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <h3>Register for Workshop</h3>
          <p>Join upcoming workshops easily</p>

          <button
            onClick={() => navigate(user ? "/dashboard" : "/register")}
            style={styles.button}
          >
            {user ? "Go to Dashboard" : "Register"}
          </button>
        </div>

        {/* Login */}
        <div
          style={styles.card}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <h3>Login</h3>
          <p>Access your dashboard</p>

          <button
            onClick={() => navigate(user ? "/dashboard" : "/login")}
            style={styles.button}
          >
            {user ? "Go to Dashboard" : "Login"}
          </button>
        </div>

        {/* Explore */}
        <div
          style={styles.card}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <h3>Explore Workshops</h3>
          <p>Browse all available workshops</p>

          <button
            onClick={() => navigate("/workshops")}
            style={styles.button}
          >
            Explore
          </button>
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/workshop/:id" element={<WorkshopDetails />} />
      </Routes>
    </Router>
  );
}

export default App;



const styles = {

  container: {
    textAlign: "center",
    padding: "50px",
  },

  title: {
    marginBottom: "40px",
  },

  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "250px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "0.3s",
    cursor: "pointer",
  },

  button: {
    marginTop: "15px",
    padding: "10px 15px",
    backgroundColor: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },

  cardHover: {
    transform: "scale(1.05)",
  }
};