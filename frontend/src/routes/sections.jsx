import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from '../layouts/dashboard';
import ProtectedRoute from '../components/protectedRoute/ProtectedRoute';
import LoadingPage from '../pages/loading';
import Permissions from '../utils/permissions';

export const InstitutionPage = lazy(() => import('../pages/institution'));
export const OtpPage = lazy(() => import('../pages/otp'));
export const AssetPage = lazy(() => import('../pages/asset'));
export const IndexPage = lazy(() => import('../pages/app'));
export const UserPage = lazy(() => import('../pages/user'));
export const LoginPage = lazy(() => import('../pages/login'));
export const TagPage = lazy(() => import('../pages/tag'));
export const ProductsPage = lazy(() => import('../pages/products'));
export const Page404 = lazy(() => import('../pages/page-not-found'));
export const Page401 = lazy(() => import('../pages/401'));
export const UserAssetPage = lazy(() => import('../pages/userAsset'));
export const ChangePasswordPage = lazy(() => import('../pages/changePassword'));

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={<LoadingPage />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { 
          path: 'dashboard', 
          element: (
            <ProtectedRoute permissions={[Permissions.VIEW_DASHBOARD]}>
              <IndexPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'asset', 
          element: (
            <ProtectedRoute>
              <AssetPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: '/password-reset/', 
          element: (
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'userAsset/:id/details', 
          element: (
            <ProtectedRoute permissions={[Permissions.ADD_ASSET]}>
              <UserAssetPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'institution', 
          element: (
            <ProtectedRoute permissions={[Permissions.VIEW_INSTITUTION]}>
              <InstitutionPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'tag', 
          element: (
            <ProtectedRoute permissions={[Permissions.ADD_TAG]}>
              <TagPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'user', 
          element: (
            <ProtectedRoute permissions={[Permissions.ADD_USER]}>
              <UserPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'products', 
          element: (
            <ProtectedRoute permissions={[Permissions.MANAGE_PRODUCT]}>
              <ProductsPage />
            </ProtectedRoute>
          ) 
        },
      ],
    },
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/verify-otp',
      element: <OtpPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '401',
      element: <Page401 replace={false} />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
