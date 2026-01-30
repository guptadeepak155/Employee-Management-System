import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Form.css";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [emp, setEmp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/employees/${id}`)
      .then(res => setEmp(res.data))
      .catch(() => setEmp(null));
  }, [id]);

  if (!emp) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;

  return (
    <div className="details-container">
      <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
      <div className="profile-card">
        <h2>{emp.name}</h2>
        <p><strong>Department:</strong> {emp.department}</p>
        <p><strong>Email:</strong> <h3>{emp.email}</h3></p>
        <p><strong>Phone:</strong> {emp.phone}</p>
        <p><strong>Salary:</strong> ₹{emp.salary}</p>
        <p>
          <strong>Date of Joining:</strong>{" "}
          {emp.dateOfJoining
            ? new Date(emp.dateOfJoining).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Not available"}
        </p>
        <button className="edit-btns"onClick={() => navigate(`/edit/${emp._id}`)}>Edit</button>
      </div>
    </div>
  );
};

export default EmployeeDetails;
