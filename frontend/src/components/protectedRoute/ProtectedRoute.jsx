import { lazy, Suspense } from 'react';
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
export const Page401 = lazy(() => import('../../pages/401'));


const ProtectedRoute = ({ children, permissions = [] }) => {
    const user = useSelector((state) => state.authentication.user);
    const userPermissions = useSelector((state) => new Set(state.authentication.userPermissions));
    const hasPermission = permissions.every((permission) => userPermissions.has(permission));

    if (!hasPermission)
        return <Page401 />
    return Boolean(user?.username) ? children : <Navigate to="/" />;
}
export default ProtectedRoute;
