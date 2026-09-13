import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const redirectMap = { farmer: '/farmer/dashboard', buyer: '/buyer/dashboard', admin: '/admin/dashboard' };
    return <Navigate to={redirectMap[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
