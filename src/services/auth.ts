
export interface LoginCredentials {
  email: string;
  password: string;
}

// Simulated API call
export const loginUser = async (credentials: LoginCredentials): Promise<{ success: boolean }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes, accept any non-empty email/password
  if (credentials.email && credentials.password) {
    return { success: true };
  }
  
  throw new Error('Invalid credentials');
};
