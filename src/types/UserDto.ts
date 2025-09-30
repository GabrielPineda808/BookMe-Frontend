import type { LocationDto } from "./LocationDto";

export interface UserDto{
    firstName: string | null;
    lastName: string | null;
    location: LocationDto | null;
}