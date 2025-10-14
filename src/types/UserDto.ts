import type { LocationDto } from "./LocationDto";

export interface UserDto{
    id: number | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    location: LocationDto | null;
}