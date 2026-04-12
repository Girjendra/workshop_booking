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
    <div style={{ padding: "30px" }}>
      <h2>{workshop.title}</h2>
      <p>{workshop.description}</p>
      <p><b>Date:</b> {workshop.date}</p>
      <p><b>Price:</b> ₹ {workshop.price}</p>
    </div>
  );
}

export default WorkshopDetails;