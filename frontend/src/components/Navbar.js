import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      <div>
        <h2 style={styles.logo}>FOSSEE</h2>

        <div style={styles.subLinks}>
          <span
            style={styles.subLink}
            onClick={() => navigate("/about")}
            onMouseEnter={(e) => e.target.style.color = "#38bdf8"}
            onMouseLeave={(e) => e.target.style.color = "#cbd5f5"}
          >
            About
          </span>

          <span
            style={styles.subLink}
            onClick={() => navigate("/contact")}
            onMouseEnter={(e) => e.target.style.color = "#38bdf8"}
            onMouseLeave={(e) => e.target.style.color = "#cbd5f5"}
          >
            Contact
          </span>

          <span
            style={styles.subLink}
            onClick={() => navigate("/terms")}
            onMouseEnter={(e) => e.target.style.color = "#38bdf8"}
            onMouseLeave={(e) => e.target.style.color = "#cbd5f5"}
          >
            Terms
          </span>
        </div>
      </div>

      <div style={styles.links}>
        {/* MAIN NAV */}
        <div
          style={styles.link}
          onClick={() => {
            if (user) navigate("/dashboard");
            else navigate("/");
          }}
        >
          Home
        </div>

        {user && (
          <>
            <div style={styles.link} onClick={() => navigate("/propose")}>
              Propose Workshop
            </div>

            <div style={styles.link} onClick={() => navigate("/status")}>
              Status
            </div>

            <div style={styles.link} onClick={() => navigate("/stats")}>
              📊 Stats
            </div>
          </>
        )}

        {/* AUTH */}
        {!user ? (
          <>
            <div style={styles.link} onClick={() => navigate("/login")}>
              Login
            </div>
            <div style={styles.link} onClick={() => navigate("/register")}>
              Register
            </div>
          </>
        ) : (
          <>
            <div
              style={styles.link}
              onClick={() => navigate("/profile")}
            >
              👤 {user}
            </div>

            <div style={styles.link} onClick={handleLogout}>
              Logout
            </div>
          </>
        )}

      </div>

    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    backgroundColor: "#0f172a",
    color: "white",
  },

  links: {
    display: "flex",
    gap: "25px",
  },

  link: {
    cursor: "pointer",
    fontSize: "16px",
  },

  logo: {
    cursor: "pointer",
  },
  subLinks: {
    display: "flex",
    gap: "20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#cbd5f5",
    marginTop: "5px"
  },

  subLink: {
    cursor: "pointer",
    transition: "0.2s"
  },
};

export default Navbar;