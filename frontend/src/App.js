import React, { useState, useEffect } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from './services/api';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    status: 'Đang làm việc'
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployees();
      setEmployees(res.data || []);
      setError('');
    } catch (err) {
      setError('Lỗi khi tải dữ liệu từ API!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map 'name' thành 'fullName' để khớp với yêu cầu của Backend
      const payload = {
        ...formData,
        fullName: formData.name
      };

      if (editingId) {
        await updateEmployee(editingId, payload);
        alert('Cập nhật nhân viên thành công!');
      } else {
        await createEmployee(payload);
        alert('Thêm nhân viên mới thành công!');
      }
      resetForm();
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setFormData({
      employeeId: emp.employeeId || '',
      name: emp.name || emp.fullName || '',
      department: emp.department || '',
      position: emp.position || '',
      email: emp.email || '',
      phone: emp.phone || '',
      status: emp.status || 'Đang làm việc'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await deleteEmployee(id);
        alert('Xóa thành công!');
        fetchEmployees();
      } catch (err) {
        alert('Lỗi khi xóa!');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      employeeId: '',
      name: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      status: 'Đang làm việc'
    });
  };

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    const empName = emp.name || emp.fullName || '';
    const idMatch = (emp.employeeId || '').toLowerCase().includes(term);
    const nameMatch = empName.toLowerCase().includes(term);
    return idMatch || nameMatch;
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Quản lý Nhân sự - MSSV: 237502</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>{editingId ? 'Cập nhật thông tin nhân viên' : 'Thêm nhân viên mới'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input name="employeeId" placeholder="Mã nhân viên" value={formData.employeeId} onChange={handleChange} required />
          <input name="name" placeholder="Họ tên" value={formData.name} onChange={handleChange} required />
          <input name="department" placeholder="Phòng ban" value={formData.department} onChange={handleChange} required />
          <input name="position" placeholder="Chức vụ" value={formData.position} onChange={handleChange} required />
          <input 
            type="email" 
            name="email" 
            placeholder="Email (vd: name@gmail.com)" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Tạm nghỉ">Tạm nghỉ</option>
            <option value="Đã nghỉ việc">Đã nghỉ việc</option>
          </select>
          <button type="submit" style={{ background: editingId ? 'orange' : 'green', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>
            {editingId ? 'Cập nhật' : 'Thêm'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ background: 'gray', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>
              Hủy
            </button>
          )}
        </form>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo mã hoặc họ tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px', padding: '5px' }}
        />
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e0e0e0' }}>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Phòng ban</th>
              <th>Chức vụ</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name || emp.fullName || '(Chưa cập nhật)'}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.status}</td>
                  <td>
                    <button onClick={() => handleEdit(emp)} style={{ marginRight: '5px', background: 'blue', color: 'white', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(emp._id)} style={{ background: 'red', color: 'white', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  Không có dữ liệu nhân viên
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;