import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Define the base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface Tender {
  id: number;
  title: string;
  procurement_number?: string;
  publication_date: number;
  expiry_date: number;
  retendering: number;
  folder: number;
  file?: string;
  contract_type_id: number;
  category_id: number;
  procedures_id: number;
  notice_type_id: number;
  region_id: number;
  states_id: number;
  contracting_authority_id: number;
  description?: string;
  email?: string;
  cmimi?: string;
  flag: number;
  created_by?: string;
  create_date: number;
  updated_by?: string;
  update_date: number;
  update_no: number;
  status: string;
  // Additional computed fields that might be returned
  publication_date_formatted?: string;
  expiry_date_formatted?: string;
  contract_type_name?: string;
  category_name?: string;
  procedure_name?: string;
  notice_type_name?: string;
  region_name?: string;
  state_name?: string;
  contracting_authority_name?: string;
}

export interface TendersResponse {
  success: boolean;
  data: Tender[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
}

export interface TenderResponse {
  success: boolean;
  data: Tender;
}

export interface TendersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  contracting_authority_id?: number;
  category_id?: number;
  notice_type_id?: number;
  region_id?: number;
  state_id?: number;
  contract_type_id?: number;
  procedures_id?: number;
  from_date?: number;
  to_date?: number;
  flag?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  _v?: number; // Cache bust version
}

export interface MonthlyStatsResponse {
  success: boolean;
  data: {
    month: string;
    year: number;
    count: number;
  };
}

export interface Category {
  id: number;
  name: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface ContractingAuthority {
  id: number;
  name: string;
}

export interface ContractingAuthoritiesResponse {
  success: boolean;
  data: ContractingAuthority[];
}

export interface NoticeType {
  id: number;
  name: string;
}

export interface NoticeTypesResponse {
  success: boolean;
  data: NoticeType[];
}

export const tendersApi = createApi({
  reducerPath: 'tendersApi',
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
  tagTypes: ['Tender'],
  endpoints: (builder) => ({
    getTenders: builder.query<TendersResponse, TendersQueryParams & { searchTerm?: string }>({
      query: ({ page = 1, limit = 50, search, searchTerm, contracting_authority_id, category_id, notice_type_id, region_id, state_id, contract_type_id, procedures_id, from_date, to_date, flag, sortBy, sortOrder, _v } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        // Support both 'search' and 'searchTerm' parameters for backwards compatibility
        const searchQuery = searchTerm || search;
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        if (contracting_authority_id) {
          params.append('contracting_authority_id', contracting_authority_id.toString());
        }
        if (category_id) {
          params.append('category_id', category_id.toString());
        }
        if (notice_type_id) {
          params.append('notice_type_id', notice_type_id.toString());
        }
        if (region_id) {
          params.append('region_id', region_id.toString());
        }
        if (state_id) {
          params.append('state_id', state_id.toString());
        }
        if (contract_type_id) {
          params.append('contract_type_id', contract_type_id.toString());
        }
        if (procedures_id) {
          params.append('procedures_id', procedures_id.toString());
        }
        if (from_date) {
          params.append('from_date', from_date.toString());
        }
        if (to_date) {
          params.append('to_date', to_date.toString());
        }
        if (flag !== undefined && flag !== null) {
          params.append('flag', flag.toString());
        }
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        if (sortOrder) {
          params.append('sortOrder', sortOrder);
        }

        console.log('🌐 RTK Query making request to:', `/tenders?${params.toString()}`);
        return `/tenders?${params.toString()}`;
      },
      // Custom cache key serialization to ensure sorting changes trigger refetch
      serializeQueryArgs: ({ queryArgs }) => {
        // Create a unique cache key that includes all parameters including sorting
        const sortedArgs = Object.keys(queryArgs || {})
          .sort()
          .reduce((acc, key) => {
            acc[key] = queryArgs[key];
            return acc;
          }, {} as any);
        const cacheKey = JSON.stringify(sortedArgs);
        console.log('🔑 RTK Query cache key:', cacheKey);
        return cacheKey;
      },
      keepUnusedDataFor: 0, // Don't cache results
      providesTags: ['Tender'],
    }),
    getTenderById: builder.query<TenderResponse, number>({
      query: (id) => `/tenders/${id}`,
      providesTags: ['Tender'],
    }),
    searchTenders: builder.query<TendersResponse, { searchTerm: string; page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }>({
      query: ({ searchTerm, page = 1, limit = 50, sortBy, sortOrder }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        if (sortOrder) {
          params.append('sortOrder', sortOrder);
        }
        console.log('🌐 RTK Query search request to:', `/tenders/search/${encodeURIComponent(searchTerm)}?${params.toString()}`);
        return `/tenders/search/${encodeURIComponent(searchTerm)}?${params.toString()}`;
      },
      keepUnusedDataFor: 0, // Don't cache results
      providesTags: ['Tender'],
    }),
    getActiveTenders: builder.query<TendersResponse, TendersQueryParams>({
      query: ({ page = 1, limit = 50 } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        return `/tenders/filter/active?${params.toString()}`;
      },
      providesTags: ['Tender'],
    }),
    getExpiredTenders: builder.query<TendersResponse, TendersQueryParams>({
      query: ({ page = 1, limit = 50 } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        return `/tenders/filter/expired?${params.toString()}`;
      },
      providesTags: ['Tender'],
    }),
    getMonthlyTenderStats: builder.query<MonthlyStatsResponse, { month?: number; year?: number }>({
      query: ({ month, year } = {}) => {
        const currentDate = new Date();
        const targetMonth = month || currentDate.getMonth() + 1;
        const targetYear = year || currentDate.getFullYear();
        return `/tenders/stats/monthly?month=${targetMonth}&year=${targetYear}`;
      },
      providesTags: ['Tender'],
    }),
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => '/categories',
    }),
    getContractingAuthorities: builder.query<ContractingAuthoritiesResponse, void>({
      query: () => '/contracting-authorities',
    }),
    getNoticeTypes: builder.query<NoticeTypesResponse, void>({
      query: () => '/notice-types',
    }),
  }),
});

export const {
  useGetTendersQuery,
  useLazyGetTendersQuery,
  useGetTenderByIdQuery,
  useSearchTendersQuery,
  useGetActiveTendersQuery,
  useGetExpiredTendersQuery,
  useGetMonthlyTenderStatsQuery,
  useGetCategoriesQuery,
  useGetContractingAuthoritiesQuery,
  useGetNoticeTypesQuery,
} = tendersApi;