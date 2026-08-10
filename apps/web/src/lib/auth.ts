import { jwtDecode, JwtPayload } from 'jwt-decode'

const TOKEN_KEY = "token";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getId(): string | null {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (token) {
    const decoded: CustomJwtPayload= jwtDecode(token);
    return decoded.userId;
  } else {
    return null;
  }

}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}