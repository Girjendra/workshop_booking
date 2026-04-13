import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function WorkshopDetails() {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/workshops/${id}/`)
      .then((res) => setWorkshop(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!workshop) return <h3>Loading...</h3>; 

  return (
    <div style={{
      padding: "40px",
      display: "flex",
      justifyContent: "center"
    }}>
      <div style={{
        width: "500px",
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>
        <h2>{workshop.title}</h2>

        <p><b>Description:</b> {workshop.description}</p>

        <p><b>Date:</b> {workshop.date}</p>

        <p><b>Price:</b> ₹ {workshop.price}</p>

        {/* 🔥 NEW FIELDS */}
        <p><b>Status:</b> {workshop.status}</p>

        <p><b>Workshop Type:</b> {workshop.workshop_type}</p>

        <p><b>Coordinator:</b> {workshop.coordinator}</p>

        <p><b>Instructor:</b> {workshop.instructor}</p>

        <p><b>T&C Accepted:</b> {workshop.tnc ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}

export default WorkshopDetails;