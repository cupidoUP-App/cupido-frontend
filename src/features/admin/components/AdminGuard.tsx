/**
 * AdminGuard - Componente de protección para rutas administrativas
 * Verifica que el usuario tenga is_superuser = true
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@store/appStore';

const AdminGuard = () => {
  const { isAuthenticated, user } = useAppStore();

  // Si no está autenticado, redirigir al home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si no es superusuario, redirigir al home
  if (!user?.is_superuser) {
    return <Navigate to="/" replace />;
  }

  // Si es superusuario, renderizar las rutas hijas
  return <Outlet />;
};

export default AdminGuard;
