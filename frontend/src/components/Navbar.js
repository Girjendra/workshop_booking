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
      <h2 style={styles.logo}>FOSSEE</h2>

      <div style={styles.links}>
        <div
          style={styles.link}
          onClick={() => {
            if (user) navigate("/dashboard");
            else navigate("/");
          }}
        >
          Home
        </div>

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
              onClick={() => {
                navigate("/profile");
              }}
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
};

export default Navbar;