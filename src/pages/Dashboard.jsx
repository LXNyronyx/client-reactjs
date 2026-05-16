import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Check if the user is currently logged in based on token existence
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (currentPage) => {
    try {
      const response = await api.get(`/products?page=${currentPage}&limit=10`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name_id');
    // Reload to clear state and switch button back to Login
    window.location.reload();
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="container container-lg">
      <div className="header-row">
        <h2 style={{ margin: 0 }}>Product Dashboard</h2>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button className="primary" onClick={handleLogin}>Login (Admin)</button>
        )}
      </div>

      <div className="mt-3">
        {products.length === 0 ? (
          <p className="text-center" style={{ color: '#888', padding: '40px 0' }}>No products found.</p>
        ) : (
          <ul className="card-list">
            {products.map((product) => (
              <li key={product.id} className="card-item">
                <h3>{product.name_display}</h3>
                <p><strong>Type:</strong> {product.type}</p>
                <p>{product.description}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pagination">
        {page > 1 ? (
          <button onClick={() => setPage(page - 1)}>Previous</button>
        ) : (
          <button style={{ visibility: 'hidden' }}>Previous</button>
        )}
        
        <span style={{ fontSize: '14px', color: '#666' }}>Page {page} of {totalPages || 1}</span>
        
        {page < totalPages ? (
          <button onClick={() => setPage(page + 1)}>Next</button>
        ) : (
          <button style={{ visibility: 'hidden' }}>Next</button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
