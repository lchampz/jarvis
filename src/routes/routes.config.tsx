import { Dashboard } from '@/pages/Dashboard';
import { UserType } from '../types/userType.enum';
import { LoginPage } from '@/pages/Login';
import RegisterPage from '@/pages/Register';

export interface RouteConfig {
    path: string;
    element?: React.ComponentType;
    allowedRoles: UserType[];
    isPublic?: boolean;
    redirectTo?: string;
    children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
    {
        path: '/',
        redirectTo: '/login',
        allowedRoles: [],
        isPublic: true
    },
    {
        path: '/login',
        element: LoginPage,
        allowedRoles: [],
        isPublic: true
    },
    {
        path: '/register',
        element: RegisterPage,
        allowedRoles: [],
        isPublic: true
    },
    {
        path: '/dashboard',
        element: Dashboard,
        allowedRoles: [UserType.ADMIN, UserType.VISITOR]
    }
];

export const getDefaultRoute = (userType: UserType): string => {
    switch (userType) {
        case UserType.ADMIN:
            return '/admin';
        case UserType.VISITOR:
            return '/visitor';
        default:
            return '/login';
    }
};

export const hasRouteAccess = (route: RouteConfig, userType: UserType): boolean => {
    if (route.isPublic) return true;
    return route.allowedRoles.includes(userType);
};