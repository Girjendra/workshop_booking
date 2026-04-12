import { useState } from "react";

function Profile() {
    const user = localStorage.getItem("user");

    const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    institute: "",
    department: "",
    location: "",
    });

    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const user = localStorage.getItem("user");

        try {
            const res = await fetch("http://127.0.0.1:8000/api/profile/update/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: user,
                ...form,
            }),
            });

            const data = await res.json();

            if (res.ok) {
            alert("Profile Updated ✅");
            } else {
            alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>👤 Profile</h1>
      <h3>Welcome, {user}</h3>

      <div style={{ marginTop: "30px" }}>
        <h2>Complete Your Profile</h2>

        <input name="first_name" placeholder="First Name" onChange={handleChange} />
        <br /><br />

        <input name="last_name" placeholder="Last Name" onChange={handleChange} />
        <br /><br />

        <input name="phone" placeholder="Phone Number" onChange={handleChange} />
        <br /><br />

        <input name="institute" placeholder="Institute" onChange={handleChange} />
        <br /><br />

        <input name="department" placeholder="Department" onChange={handleChange} />
        <br /><br />

        <input name="location" placeholder="Location" onChange={handleChange} />
        <br /><br />

        <button onClick={handleSubmit}>Save Profile</button>
      </div>
    </div>
  );
}

export default Profile;