const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET /api/employees (Lấy danh sách hoặc tìm kiếm theo ?search=...)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/employees/:id (Lấy thông tin 1 nhân viên theo id hoặc employeeId)
router.get('/:id', async (req, res) => {
  try {
    const emp = await Employee.findOne({ 
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { employeeId: req.params.id }] 
    });
    if (!emp) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/employees (Thêm nhân viên mới)
router.post('/', async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;
    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ message: 'Thiếu các trường bắt buộc (employeeId, fullName, email)' });
    }
    const existing = await Employee.findOne({ employeeId });
    if (existing) {
      return res.status(400).json({ message: 'Mã nhân viên đã tồn tại' });
    }
    const newEmp = new Employee(req.body);
    const savedEmp = await newEmp.save();
    res.status(201).json(savedEmp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/employees/:id (Cập nhật nhân viên)
router.put('/:id', async (req, res) => {
  try {
    const updatedEmp = await Employee.findOneAndUpdate(
      { $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { employeeId: req.params.id }] },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmp) return res.status(404).json({ message: 'Không tìm thấy nhân viên để cập nhật' });
    res.json(updatedEmp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/employees/:id (Xóa nhân viên)
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmp = await Employee.findOneAndDelete(
      { $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { employeeId: req.params.id }] }
    );
    if (!deletedEmp) return res.status(404).json({ message: 'Không tìm thấy nhân viên để xóa' });
    res.json({ message: 'Đã xóa nhân viên thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
