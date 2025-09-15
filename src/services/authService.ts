import axios from 'axios';

interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface RegisterResponse {
  user: UserResponse;
  token: string;
}

interface LoginResponse {
  user: UserResponse;
  token: string;
}

const API_BASE_URL = 'http://localhost:8080/api';

// Add request/response interceptors for better debugging
axios.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    console.log('Request config:', config);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response,
      request: error.request
    });
    return Promise.reject(error);
  }
);

export const authService = {
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<RegisterResponse> {
    try {
      console.log('Attempting to register with:', { email, firstName, lastName });
      
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        firstName,
        lastName
      });
      
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error);
      
      // Check if it's a network error
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to server. Is the backend running?');
        }
        if (error.code === 'ERR_NETWORK') {
          throw new Error('Network error. Check if backend is running and CORS is configured.');
        }
        if (error.response) {
          // Server responded with error status
          throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error('No response from server. Check backend URL and network connection.');
        }
      }
      
      throw error;
    }
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Attempting to login with:', { email });
      
      // Match your backend's expected format
      const requestData = {
        Email: email,
        Password: password
      };
      
      console.log('Sending login request data:', requestData);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to server. Is the backend running?');
        }
        if (error.response) {
          throw new Error(error.response.data?.message || `Login failed: ${error.response.status}`);
        } else if (error.request) {
          throw new Error('No response from server. Check backend URL and network connection.');
        }
      }
      
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove token even if API call fails
      localStorage.removeItem('auth_token');
    }
  },

  async getCurrentUser(): Promise<UserResponse> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};