import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Home.css";

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const navigate = useNavigate();

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
      toast.success("Employee deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // Filter + Sort logic
  const filtered = employees
    .filter((emp) => {
      const query = search.trim().toLowerCase();
      if (!query) return true;

      const name = (emp.name || "").trim().toLowerCase();
      const dept = (emp.department || "").trim().toLowerCase();
      const phone = (emp.phone || "").trim();

      return name.includes(query) || dept.includes(query) || phone.includes(query);
    })
    .filter((emp) => {
      const min = Number(minSalary) || -Infinity;
      const max = Number(maxSalary) || Infinity;
      return emp.salary >= min && emp.salary <= max;
    })
    .sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      if (sort === "salary-asc") return a.salary - b.salary;
      if (sort === "salary-desc") return b.salary - a.salary;
      return 0;
    });

  return (
    <div className="container">
      <h1>Employee Management System</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name, department, or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="name-asc">Name (A → Z)</option>
          <option value="name-desc">Name (Z → A)</option>
          <option value="salary-asc">Salary (Low → High)</option>
          <option value="salary-desc">Salary (High → Low)</option>
        </select>

        <input
          type="number"
          placeholder="Min Salary"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Salary"
          value={maxSalary}
          onChange={(e) => setMaxSalary(e.target.value)}
        />

        <Link to="/add" className="add-btn">+ Add Employee</Link>
      </div>

      <div className="employee-list">
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No employees found.
          </p>
        ) : (
          filtered.map((emp) => (
            <div key={emp._id} className="employee-card">
              <div className="employee-info">
                <h3>{emp.name}</h3>
                <p><strong>Dept:</strong> {emp.department}</p>
                <p><strong>Phone:</strong> {emp.phone}</p>
                <p><strong>Salary:</strong> ₹{emp.salary}</p>
              </div>

              <div className="actions">
                <button
                  className="view-btn"
                  onClick={() => navigate(`/details/${emp._id}`)}
                >
                  View
                </button>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit/${emp._id}`)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(emp._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
