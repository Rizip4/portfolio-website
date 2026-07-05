import api from "./api";

export interface LoginCredentials { email: string; password: string; }
export interface AuthResponse {
  admin: { id: string; email: string; name: string | null; role: string; };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    localStorage.setItem("access_token", response.data.accessToken);
    localStorage.setItem("refresh_token", response.data.refreshToken);
    return response.data;
  },
  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },
  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.post("/auth/change-password", { currentPassword, newPassword });
    return response.data;
  },
  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  },
};
