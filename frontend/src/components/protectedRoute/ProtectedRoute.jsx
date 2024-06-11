import { lazy, Suspense } from 'react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingPage from '../../pages/loading';
export const Page401 = lazy(() => import('../../pages/401'));

const ProtectedRoute = ({ children, permissions = [] }) => {
    const user = useSelector((state) => state.authentication.user);
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const hasPermission = permissions.every((permission) => userPermissions.has(permission));

    if (!user?.username) {
        // If there is no user, redirect to login
        return <Navigate to="/" replace />;
    }

    if (!hasPermission) {
        // If user doesn't have permissions, show 401 page
        return <Suspense fallback={<LoadingPage />}>
            <Page401 />
        </Suspense>;
    }

    // If user is logged in and has permissions, render the requested page
    return children;
}

export default ProtectedRoute;
