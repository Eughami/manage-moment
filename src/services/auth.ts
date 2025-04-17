// Define the LoginCredentials type that matches the zod schema
export interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<boolean> => {
  // Simulate API login call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        // Demo validation, in a real app this would check against an API
        if (credentials.email === "admin@example.com" && credentials.password === "password") {
          resolve(true);
        } else {
          reject(new Error("Invalid credentials"));
        }
      } else {
        reject(new Error("Email and password are required"));
      }
    }, 1000);
  });
};
