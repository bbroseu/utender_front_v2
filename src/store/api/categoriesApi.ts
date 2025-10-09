import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface Category {
  id: number;
  name: string;
  parent_id?: number;
  create_date?: number;
  update_date?: number;
  created_by?: string;
  updated_by?: string;
  update_no?: number;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
}

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
  }),
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    getAllCategories: builder.query<CategoriesResponse, { limit?: number; page?: number }>({
      query: ({ limit = 1000, page = 1 } = {}) => ({
        url: '/categories',
        params: { limit, page },
      }),
      providesTags: ['Categories'],
    }),
    getCategoryById: builder.query<{ success: boolean; data: Category }, number>({
      query: (id) => `/categories/${id}`,
      providesTags: ['Categories'],
    }),
    getRootCategories: builder.query<CategoriesResponse, void>({
      query: () => '/categories/roots',
      providesTags: ['Categories'],
    }),
    getCategoryHierarchy: builder.query<{ success: boolean; data: any }, void>({
      query: () => '/categories/hierarchy',
      providesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetRootCategoriesQuery,
  useGetCategoryHierarchyQuery,
} = categoriesApi;
