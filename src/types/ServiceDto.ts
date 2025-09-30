import type { LocationDto } from "./LocationDto";

export interface ServiceDto {
    handle: string | null;

    serviceName: string | null;

    location: LocationDto | null;

    desc : string | null;

    open: string | null;

    close: string | null;

    interval: number | null;
}