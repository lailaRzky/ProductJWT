import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('accessToken');

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 60 }}>Memuat...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
