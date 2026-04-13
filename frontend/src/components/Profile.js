import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
    const user = localStorage.getItem("user");
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(true);

    const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    institute: "",
    department: "",
    location: "",
    });

    useEffect(() => {
      axios.get("http://127.0.0.1:8000/api/profile/")
        .then(res => {
          if (res.data.message === "No profile") {
            setIsEditing(true);
          } else {
            setProfile(res.data);
            setIsEditing(false);
          }
        })
        .catch(err => console.log(err));
    }, []);

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
              setProfile(form);
              setIsEditing(false);
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

        {isEditing ? (
          <>
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
          </>
        ) : (
          <>
            <h2>Your Profile</h2>

            <p><b>Name:</b> {profile.first_name} {profile.last_name}</p>
            <p><b>Phone:</b> {profile.phone}</p>
            <p><b>Institute:</b> {profile.institute}</p>
            <p><b>Department:</b> {profile.department}</p>
            <p><b>Location:</b> {profile.location}</p>

            <br />

            <button onClick={() => setIsEditing(true)}>
              ✏️ Update Profile
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Profile;