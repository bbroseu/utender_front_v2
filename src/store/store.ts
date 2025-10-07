import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import { authApi } from './api/authApi';
import { tendersApi } from './api/tendersApi';
import { categoriesApi } from './api/categoriesApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [tendersApi.reducerPath]: tendersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          authApi.util.getRunningQueriesThunk.type,
          tendersApi.util.getRunningQueriesThunk.type,
          categoriesApi.util.getRunningQueriesThunk.type,
        ],
      },
    }).concat(authApi.middleware, tendersApi.middleware, categoriesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;