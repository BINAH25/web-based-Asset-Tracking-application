import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URI } from '../../utils/constants';

export const resourceApiSlice = createApi({
    reducerPath: 'resources-api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URI,
        prepareHeaders(headers) {
            headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
            return headers;
        },
    }),
    endpoints(builder) {
        return {
            getUserPermissions: builder.query({
                query() {
                    return `/auth/user-permissions/`;
                },
            }),

            changeOwnPassword: builder.mutation({
                query(body) {
                    return {
                        url: `/api/auth/change-own-password/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            
            // users
            registerUser: builder.mutation({
                query(body) {
                    return {
                        url: `/api/auth/register/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            getUsers: builder.query({
                query() {
                    return `/api/users/`;
                },
            }),
            getActivityLogs: builder.query({
                query() {
                    return `/api/activity/logs/`;
                },
            }),

            deleteUsers: builder.mutation({
                query(body) {
                    return {
                        url: `/api/users/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),
            logOutUser: builder.mutation({
                query(body) {
                    return {
                        url: `/api/auth/logout/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            // institutions
            putInstitution: builder.mutation({
                query(body) {
                    return {
                        url: `/api/institutions/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            getAllInstitutions: builder.query({
                query() {
                    return `/api/institutions/`;
                },
            }),

            getAllNewInstitutions: builder.query({
                query() {
                    return `/api/get/all/new/institutions/`;
                },
            }),
            deleteInstitutions: builder.mutation({
                query(body) {
                    return {
                        url: `/api/institutions/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),

            // tags
            putTag: builder.mutation({
                query(body) {
                    return {
                        url: `/api/assets/add/tag/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
            getAllTags: builder.query({
                query() {
                    return `/api/assets/tags/`;
                },
            }),

            deleteTags: builder.mutation({
                query(body) {
                    return {
                        url: `/api/assets/tags/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),

            // products
            putProduct: builder.mutation({
                query(body) {
                    return {
                        url: `/api/assets/add/product/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
            getAllProducts: builder.query({
                query() {
                    return `/api/assets/products/`;
                },
            }),
            getAllAvailableProducts: builder.query({
                query() {
                    return `/api/assets/get/available/products/`;
                },
            }),
            deleteProducts: builder.mutation({
                query(body) {
                    return {
                        url: `/api/assets/products/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),

            // assets
            putAsset: builder.mutation({
                query(body) {
                    return {
                        url: `/api/assets/add/asset/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
            putAssetStatus: builder.mutation({
                query(body) {
                    return {
                        url: `/api/assets/update/status/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
            getAllAssets: builder.query({
                query() {
                    return `/api/assets/get/all/assets/`;
                },
            }),
            getAssetsStatitics: builder.query({
                query() {
                    return `/api/assets/dashboard/`;
                },
            }),
            getAllUserAssets: builder.query({
                query({ id }) {
                    return `/api/assets/user/${id}/`;
                },
            }),
            deleteAsset: builder.mutation({
                query(body) {
                    return {
                        url: `/api/assets/delete/asset/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),

        
           
            

        };
    },
});

export const {
    useLazyGetUserPermissionsQuery,

    // Users
    useLazyGetUsersQuery,
    useRegisterUserMutation,
    useDeleteUsersMutation,
    useLogOutUserMutation,
    useChangeOwnPasswordMutation,
    useLazyGetActivityLogsQuery,
    // Institutions
    useLazyGetAllInstitutionsQuery,
    useLazyGetAllNewInstitutionsQuery,
    usePutInstitutionMutation,
    useDeleteInstitutionsMutation,

    // tags
    useLazyGetAllTagsQuery,
    usePutTagMutation,
    useDeleteTagsMutation,
    // products
    useLazyGetAllProductsQuery,
    usePutProductMutation,
    useLazyGetAllAvailableProductsQuery,
    useDeleteProductsMutation,
    // assets
    useLazyGetAllAssetsQuery,
    usePutAssetMutation,
    useDeleteAssetMutation,
    usePutAssetStatusMutation,
    useLazyGetAllUserAssetsQuery,
    useLazyGetAssetsStatiticsQuery,
    
} = resourceApiSlice;

export default resourceApiSlice;