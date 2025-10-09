import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { User } from '../slices/authSlice';

// Define the base URL for your backend API
// Update this to match your actual backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message?: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  fiscalNumber?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  message?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ProfileUpdateData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  fiscalNumber?: string;
  phone?: string;
  address?: string;
  password?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  category5?: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/members/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<RegisterResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: '/members/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    forgotPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: '/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => '/me',
      providesTags: ['User'],
    }),
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    refreshToken: builder.mutation<{ token: string }, void>({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
    }),
    getProfile: builder.query<{ success: boolean; data: User }, { userId: number }>({
      query: ({ userId }) => ({
        url: '/members/profile',
        method: 'POST',
        body: { userId },
      }),
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<{ success: boolean; data: User; message: string }, { userId: number } & ProfileUpdateData>({
      query: ({ userId, ...profileData }) => ({
        url: '/members/profile',
        method: 'PUT',
        body: { userId, ...profileData },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;