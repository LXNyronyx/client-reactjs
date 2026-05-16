import React, { useState } from 'react';
import api from '../api';

function Setup({ onComplete }) {
  const [formData, setFormData] = useState({
    admin_email: '',
    admin_password: '',
    admin_password_confirm: '',
    db_type: 'sqlite',
    db_host: '',
    db_name: '',
    db_user: '',
    db_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/setup/init', formData);
      onComplete();
    } catch (err) {
      setError(err.response?.data?.error || 'Setup failed. Please check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container container-md">
      <h2 className="text-center" style={{ marginBottom: '25px' }}>System Setup</h2>
      {error && <div className="error-text text-center">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form-group">
        <h3 style={{ fontSize: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>Admin Account</h3>
        <input type="email" name="admin_email" placeholder="Admin Email" required onChange={handleChange} />
        <input type="password" name="admin_password" placeholder="Password" required onChange={handleChange} />
        <input type="password" name="admin_password_confirm" placeholder="Confirm Password" required onChange={handleChange} />

        <h3 className="mt-3" style={{ fontSize: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>Database Configuration</h3>
        <select name="db_type" onChange={handleChange} value={formData.db_type}>
          <option value="sqlite">SQLite</option>
          <option value="mysql">MySQL</option>
        </select>
        
        {formData.db_type === 'mysql' && (
          <>
            <input type="text" name="db_host" placeholder="Database Host (e.g., localhost)" required onChange={handleChange} />
            <input type="text" name="db_name" placeholder="Database Name" required onChange={handleChange} />
            <input type="text" name="db_user" placeholder="Database User" required onChange={handleChange} />
            <input type="password" name="db_password" placeholder="Database Password" onChange={handleChange} />
          </>
        )}

        <button type="submit" className="primary mt-3" disabled={loading}>
          {loading ? 'Configuring System...' : 'Initialize System'}
        </button>
      </form>
    </div>
  );
}

export default Setup;
