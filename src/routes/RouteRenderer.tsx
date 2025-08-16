import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { routes, getDefaultRoute, hasRouteAccess } from './routes.config';
import { useAuth } from '../stores/auth.store';
import { UserType } from '../types/userType.enum';
import type { JSX } from 'react';

export function RouteRenderer() {
    const { id, isAdmin } = useAuth();

    const renderRoute = (route: typeof routes[0]): JSX.Element => {
        if (route.redirectTo) {
            return <Navigate to={route.redirectTo} replace />;
        }

        if (route.isPublic) {
            return route.element ? <route.element /> : <Navigate to="/login" replace />;
        }


        if (!hasRouteAccess(route, isAdmin ? UserType.ADMIN : UserType.VISITOR)) {
            return <Navigate to={getDefaultRoute(isAdmin ? UserType.ADMIN : UserType.VISITOR)} replace />;
        }

        return (
            <ProtectedRoute allowedRoles={route.allowedRoles}>
                {route.element ? <route.element /> : <div>Página em construção</div>}
            </ProtectedRoute>
        );
    };

    const renderRoutes = (routeList: typeof routes): JSX.Element[] => {
        return routeList.map((route) => {
            if (route.children) {
                return (
                    <Route key={route.path} path={route.path}>
                        {renderRoutes(route.children)}
                    </Route>
                );
            }

            return (
                <Route
                    key={route.path}
                    path={route.path}
                    element={renderRoute(route)}
                />
            );
        });
    };

    return <Routes>{renderRoutes(routes)}</Routes>;
}