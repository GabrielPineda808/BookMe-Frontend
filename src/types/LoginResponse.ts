export interface LoginResponse {
  token: string;
  expiresIn?: number | null; // seconds (Long -> number). optional if server might omit it
}
