import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  fiscalNumber?: string;
  phone?: string;
  address?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  category5?: string;
  status?: string;
  active?: boolean;
  expiryDate?: string;
  registrationDate?: string;
  role?: string;
  name?: string; // Keep for backward compatibility
  pako_name?: string; // Package name
  valid_time?: number; // Package expiry timestamp
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const getInitialAuthState = (): AuthState => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          return {
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          };
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
  } catch (error) {
    console.warn('Could not load initial auth state:', error);
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      } catch (error) {
        console.warn('Could not save to localStorage:', error);
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.warn('Could not clear localStorage:', error);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.warn('Could not clear localStorage:', error);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    loadUserFromStorage: (state) => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          const userStr = localStorage.getItem('user');
          if (token && userStr) {
            try {
              const user = JSON.parse(userStr);
              state.token = token;
              state.user = user;
              state.isAuthenticated = true;
            } catch (error) {
              // Clear invalid data
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          }
        }
      } catch (error) {
        console.warn('Could not load from localStorage:', error);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  loadUserFromStorage,
} = authSlice.actions;

export default authSlice.reducer;