const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Kết nối MongoDB Atlas thành công!'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Endpoint kiểm tra trạng thái
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server đang hoạt động bình thường' });
});

// Sử dụng Routes nhân viên
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
