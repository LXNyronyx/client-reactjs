import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

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
      // If unauthorized, redirect to login
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name_id');
    navigate('/login');
  };

  return (
    <div className="container container-lg">
      <div className="header-row">
        <h2 style={{ margin: 0 }}>Product Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
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
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span style={{ fontSize: '14px', color: '#666' }}>Page {page} of {totalPages || 1}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default Dashboard;
