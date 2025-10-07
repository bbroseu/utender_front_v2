# Authentication System Documentation

## Overview

This project now includes a complete authentication system using Redux Toolkit, Redux Toolkit Query, and React Router. The system provides secure login/logout functionality with protected routes and persistent authentication state.

## Architecture

### State Management
- **Redux Toolkit**: For global state management
- **RTK Query**: For efficient API calls and caching
- **React Redux**: For React component integration

### Key Components

#### 1. Redux Store (`src/store/store.ts`)
- Configures the Redux store with auth slice and API slice
- Includes middleware for RTK Query

#### 2. Authentication Slice (`src/store/slices/authSlice.ts`)
- Manages authentication state (user, token, loading, errors)
- Handles localStorage persistence
- Actions: loginStart, loginSuccess, loginFailure, logout, clearError

#### 3. Auth API (`src/store/api/authApi.ts`)
- RTK Query API for authentication endpoints
- Endpoints: login, register, logout, getCurrentUser, forgotPassword, resetPassword
- Automatic token inclusion in headers
- Base URL configurable via environment variables

#### 4. Protected Routes (`src/components/auth/ProtectedRoute.tsx`)
- Wrapper component for route protection
- Redirects unauthenticated users to login
- Prevents authenticated users from accessing auth pages
- Loading state handling

### Updated Components

#### Login Page (`src/screens/LoginPage/LoginPage.tsx`)
- Connected to Redux for state management
- Real-time error display
- Loading states during authentication
- Form validation
- Password visibility toggle
- Automatic redirect after successful login

#### Navbar (`src/components/Navbar/Navbar.tsx`)
- Dynamic authentication state display
- User menu with profile and logout options
- Mobile-responsive authentication UI
- Logout functionality

#### App Component (`src/App.tsx`)
- Redux Provider integration
- Protected route configuration
- Authentication state initialization from localStorage

## API Integration

### Backend Requirements

The frontend expects the following API endpoints:

```typescript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  },
  "token": "jwt_token_here",
  "message": "Login successful"
}
```

### Environment Configuration

Create a `.env` file in the project root:

```env
REACT_APP_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
```

## Route Protection

### Public Routes
- `/` - Home page
- `/contact` - Contact page

### Auth Routes (redirect if authenticated)
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset page

### Protected Routes (require authentication)
- `/tenders` - Tender listings
- `/profile` - User profile
- `/success` - Success page

## Usage Examples

### Accessing Authentication State
```typescript
import { useAppSelector } from '../store/hooks';

const MyComponent = () => {
  const { user, isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Welcome, {user?.name}!</div>;
};
```

### Making Authenticated API Calls
```typescript
import { useLoginMutation } from '../store/api/authApi';

const LoginForm = () => {
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials).unwrap();
      // Login successful, Redux state updated automatically
    } catch (error) {
      // Error handled by RTK Query
    }
  };
};
```

### Creating Protected Components
```typescript
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// In App.tsx or route configuration
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <ProtectedComponent />
    </ProtectedRoute>
  }
/>
```

## Security Features

1. **JWT Token Storage**: Tokens stored in localStorage with automatic cleanup
2. **Automatic Token Inclusion**: RTK Query automatically includes tokens in API requests
3. **Route Protection**: Prevents unauthorized access to protected routes
4. **State Persistence**: Authentication state persists across browser sessions
5. **Error Handling**: Comprehensive error handling for authentication failures
6. **Loading States**: User feedback during authentication processes

## Testing the Authentication

1. Start the development server: `npm run dev`
2. Navigate to `/login`
3. The form will show validation and loading states
4. On successful login (requires backend), user will be redirected and navbar will update
5. Protected routes will be accessible
6. Logout will clear state and redirect to home

## Next Steps

To complete the authentication system:

1. Set up the backend API with matching endpoints
2. Test the login flow with real API responses
3. Implement registration page with Redux integration
4. Add password reset functionality
5. Implement refresh token logic for token renewal
6. Add role-based access control if needed

## Dependencies Added

- `@reduxjs/toolkit`: State management and RTK Query
- `react-redux`: React bindings for Redux
- `axios`: HTTP client (used by RTK Query)

All authentication functionality is now ready for backend integration!