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
                        url: `/auth/change-own-password/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            
            // users
            getUsers: builder.query({
                query() {
                    return `/api/users/`;
                },
            }),

            deleteUsers: builder.mutation({
                query() {
                    return {
                        url: `/users/`,
                        method: 'DELETE',
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
            

           
        
           
           
            

        };
    },
});

export const {
    useLazyGetUserPermissionsQuery,

   

    // Users
    useLazyGetUsersQuery,
    usePutUsersMutation,
    useDeleteUsersMutation,
    

    // Institutions
    useLazyGetAllInstitutionsQuery,
    useLazyGetAllNewInstitutionsQuery,
    usePutInstitutionMutation,

    

    

   
    
} = resourceApiSlice;

export default resourceApiSlice;