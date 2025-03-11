const API_URL = "http://localhost:3005/api/v1/auth";

// Login function
export const login = async (username: string, password: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
    
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (!data.success) {
          throw new Error("Failed to login");
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
  
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
};
  
  // Logout function (Removes session cookie)
  export const logout = async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include", // Ensures cookie is cleared on the server
      });
  
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
};
  