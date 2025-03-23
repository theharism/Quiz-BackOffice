const API_URL = "/admin/api/v1/auth";

// Login function
export const login = async (username: string, password: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        });
    
        if (!response.ok) {
            return false;
        }
    
        if (response.status !== 200) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error login:", error);
        return false;
    }
}

// Check if user is authenticated via cookies
export const isAuthenticated = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
  
    try {
      const response = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        credentials: "include", // Ensures cookies are sent
      });
  
      if (!response.ok) return false;
  
      if (response.status !== 200) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
};
  
  // Logout function (Removes session cookie)
  export const logout = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "GET",
        credentials: "include", // Ensures cookie is cleared on the server
      });
  
      if (!response.ok) return false;

      if (response.status !== 200) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
};
  
