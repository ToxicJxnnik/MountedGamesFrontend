import axios from 'axios';

interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ user: UserResponse; token: string }> => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/register', {
      email,
      password,
      firstName,
      lastName
    });

    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
