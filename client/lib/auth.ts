// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    if (typeof window === "undefined") return false
    return localStorage.getItem("quiz-admin-auth") === "true"
}

// Login function
export const login = (username: string, password: string): boolean => {
    if (username === "admin" && password === "password") {
        localStorage.setItem("quiz-admin-auth", "true")
        return true
    }
    return false
}

// Logout function
export const logout = (): void => {
    localStorage.removeItem("quiz-admin-auth")
}