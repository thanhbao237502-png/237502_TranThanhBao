import React, { useState, useEffect } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from './services/api';

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ maNv: '', hoTen: '', phongBan: '', chucVu: '', email: '', dienThoai: '', trangThai: 'Đang làm việc' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      setEmployees(res.data);
      setMessage('');
    } catch (err) {
      setMessage('Lỗi khi tải dữ liệu từ API!');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEmployee(editingId, form);
        setMessage('Cập nhật nhân viên thành công!');
      } else {
        await createEmployee(form);
        setMessage('Thêm nhân viên thành công!');
      }
      setForm({ maNv: '', hoTen: '', phongBan: '', chucVu: '', email: '', dienThoai: '', trangThai: 'Đang làm việc' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setMessage('Dữ liệu không hợp lệ hoặc lỗi API!');
    }
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
      try {
        await deleteEmployee(id);
        setMessage('Xóa nhân viên thành công!');
        fetchData();
      } catch (err) {
        setMessage('Lỗi khi xóa nhân viên!');
      }
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.maNv.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.hoTen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Quản lý Nhân sự - MSSV: 237502</h2>
      {message && <p style={{ color: 'blue', fontWeight: 'bold' }}>{message}</p>}
      {loading && <p>Đang tải dữ liệu...</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', background: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
        <h3>{editingId ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h3>
        <input placeholder="Mã nhân viên" value={form.maNv} onChange={e => setForm({...form, maNv: e.target.value})} required style={{marginRight: '10px', marginBottom: '10px'}} />
        <input placeholder="Họ tên" value={form.hoTen} onChange={e => setForm({...form, hoTen: e.target.value})} required style={{marginRight: '10px', marginBottom: '10px'}} />
        <input placeholder="Phòng ban" value={form.phongBan} onChange={e => setForm({...form, phongBan: e.target.value})} required style={{marginRight: '10px', marginBottom: '10px'}} />
        <input placeholder="Chức vụ" value={form.chucVu} onChange={e => setForm({...form, chucVu: e.target.value})} required style={{marginRight: '10px', marginBottom: '10px'}} /><br/>
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{marginRight: '10px', marginBottom: '10px'}} />
        <input placeholder="Số điện thoại" value={form.dienThoai} onChange={e => setForm({...form, dienThoai: e.target.value})} required style={{marginRight: '10px', marginBottom: '10px'}} />
        <select value={form.trangThai} onChange={e => setForm({...form, trangThai: e.target.value})} style={{marginRight: '10px', marginBottom: '10px'}}>
          <option value="Đang làm việc">Đang làm việc</option>
          <option value="Đã nghỉ việc">Đã nghỉ việc</option>
        </select>
        <button type="submit" style={{background: 'green', color: 'white', padding: '5px 15px'}}>{editingId ? 'Cập nhật' : 'Thêm'}</button>
        {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({ maNv: '', hoTen: '', phongBan: '', chucVu: '', email: '', dienThoai: '', trangThai: 'Đang làm việc' });}} style={{marginLeft: '10px'}}>Hủy</button>}
      </form>

      <div style={{ marginBottom: '20px' }}>
        <input placeholder="Tìm kiếm theo mã hoặc họ tên..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '300px', padding: '5px' }} />
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
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
          {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.maNv}</td>
              <td>{emp.hoTen}</td>
              <td>{emp.phongBan}</td>
              <td>{emp.chucVu}</td>
              <td>{emp.email}</td>
              <td>{emp.dienThoai}</td>
              <td>{emp.trangThai}</td>
              <td>
                <button onClick={() => handleEdit(emp)} style={{marginRight: '5px'}}>Sửa</button>
                <button onClick={() => handleDelete(emp._id)} style={{background: 'red', color: 'white'}}>Xóa</button>
              </td>
            </tr>
          )) : <tr><td colSpan="8" style={{textAlign: 'center'}}>Không có dữ liệu nhân viên</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default App;
