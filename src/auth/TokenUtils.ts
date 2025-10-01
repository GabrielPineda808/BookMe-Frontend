import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/JwtPayload";
import type { UserDto } from "../types/UserDto";

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (e) {
    console.warn("Invalid token decode", e);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  if (!payload.exp) return false; // no exp claim -> treat as non-expiring (or change logic)
  return Date.now() / 1000 > payload.exp;
}

export function userFromToken(token: string | null): UserDto | null {
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  if (payload.exp && Date.now() / 1000 > payload.exp) return null;

  const id = payload.userId ?? payload.sub ?? undefined;
  return {
    id: typeof id === "string" ? Number(id) : id,
    username: payload.username ?? null,
    firstName: payload.firstName ?? null,
    lastName: payload.lastName ?? null,
    location: payload.location ?? null,
  } as UserDto;
}
