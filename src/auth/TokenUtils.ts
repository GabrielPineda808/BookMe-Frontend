import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/JwtPayload";
import type { UserDto } from "../types/UserDto";

export function decodeToken(token: string): JwtPayload | null { //function to get payload claims
  try {
    return jwtDecode<JwtPayload>(token); //decoding nto payload obj
  } catch (e) {
    console.warn("Invalid token decode", e);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  if (!payload.exp) return false; 
  return Date.now() / 1000 > payload.exp; //checking if token is old
}

export function userFromToken(token: string | null): UserDto | null { //extracing user details to save for context
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  if (payload.exp && Date.now() / 1000 > payload.exp) return null;

  return {
    id: payload.id ?? null,
    username: payload.username ?? null,
    firstName: payload.firstName ?? null,
    lastName: payload.lastName ?? null,
    location: payload.location ?? null,
  } as UserDto;
}
