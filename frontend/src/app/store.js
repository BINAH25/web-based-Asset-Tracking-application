import { configureStore } from "@reduxjs/toolkit";
import { resourceApiSlice } from "../features/resources/resources-api-slice";
import authenticationReducer, { apiSlice } from "../features/authentication/authentication";

export const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [resourceApiSlice.reducerPath]: resourceApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(resourceApiSlice.middleware),
});
