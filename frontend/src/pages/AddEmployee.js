import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./Form.css";

const initial = { name: "", email: "", department: "", salary: "", phone: "", dateOfJoining: "" };

const AddEmployee = () => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/employees/${id}`)
        .then(res => setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          department: res.data.department || "",
          salary: res.data.salary || "",
          phone: res.data.phone || "",
          dateOfJoining: res.data.dateOfJoining ? res.data.dateOfJoining.split("T")[0] : ""
        }))
        .catch(() => toast.error("Failed to load employee"));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 11); // allow up to 11 (for leading 0)
      setForm(prev => ({ ...prev, phone: cleaned }));
      return;
    }
    if (name === "salary") {
      const num = value === "" ? "" : Number(value);
      setForm(prev => ({ ...prev, salary: num }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) { toast.error("Name is required"); return false; }
    if (!form.department.trim()) { toast.error("Department is required"); return false; }
    if (form.salary === "" || Number(form.salary) <= 0) { toast.error("Salary must be > 0"); return false; }
    if (!/^(0[6-9]\d{9}|[6-9]\d{9})$/.test(String(form.phone).trim())) {
      toast.error("Enter a valid 10-digit Indian phone number");
      return false;
    }
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) { toast.error("Enter a valid email"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.dateOfJoining) payload.dateOfJoining = new Date();

      if (id) {
        await axios.put(`http://localhost:5000/api/employees/${id}`, payload);
        toast.success("Employee updated");
      } else {
        await axios.post("http://localhost:5000/api/employees", payload);
        toast.success("Employee added");
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{id ? "Edit Employee" : "Add Employee"}</h2>
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone (with or without 0)" value={form.phone} onChange={handleChange} />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        <input name="salary" placeholder="Salary" type="number" value={form.salary} onChange={handleChange} />
        <input type="date" name="dateOfJoining" value={form.dateOfJoining} onChange={handleChange} />

        <div className="form-actions">
          <button type="submit" className="submit-btn">{loading ? "Saving..." : id ? "Update" : "Add"}</button>
          <button type="button" className="cancel-btn" onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
