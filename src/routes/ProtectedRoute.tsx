import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../stores/auth.store';
import { UserType } from '@/types/userType.enum';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserType[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(isAdmin ? UserType.ADMIN : UserType.VISITOR)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
} 