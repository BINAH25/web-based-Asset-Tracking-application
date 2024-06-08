import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from '../layouts/dashboard';
export const InstititionPage =  lazy(() => import('../pages/institution'));
export const OtpPage =  lazy(() => import('../pages/otp'));
export const AssetPage =  lazy(() => import('../pages/asset'));
export const IndexPage = lazy(() => import('../pages/app'));
export const UserPage = lazy(() => import('../pages/user'));
export const LoginPage = lazy(() => import('../pages/login'));
export const TagPage = lazy(() => import('../pages/tag'));
export const ProductsPage = lazy(() => import('../pages/products'));
export const Page404 = lazy(() => import('../pages/page-not-found'));
export const Page401 = lazy(() => import('../pages/401'));
import ProtectedRoute from '../components/protectedRoute/ProtectedRoute';
import LoadingPage from '../pages/loading';
import Permissions from '../utils/permissions';
// ----------------------------------------------------------------------

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
        { path:"dashboard", element: <IndexPage /> },
        { path:"asset", element: <AssetPage /> },
        { 
          path: 'institution', 
          element: (
            <ProtectedRoute permissions={[Permissions.VIEW_INSTITUTION]}>
              <InstititionPage />
            </ProtectedRoute>
          ) 
        },
        { path: 'tag', element: <TagPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
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
      element: <Page401 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
