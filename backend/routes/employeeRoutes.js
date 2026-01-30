import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

// ✅ GET all employees
router.get("/", async (req, res) => {
  try {
    const list = await Employee.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE employee
router.post("/", async (req, res) => {
  try {
    const { name, email, department, salary, phone, dateOfJoining } = req.body;

    if (!name || !email || !department || salary == null || !phone) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newEmp = new Employee({
      name,
      email,
      department,
      salary,
      phone,
      dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : new Date(),
    });

    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (err) {
    console.error("Error saving employee:", err);
    res.status(400).json({ message: "Failed to save employee" });
  }
});

// ✅ GET by ID
router.get("/:id", async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ PUT - Update employee
router.put("/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Employee not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE - Remove employee
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
