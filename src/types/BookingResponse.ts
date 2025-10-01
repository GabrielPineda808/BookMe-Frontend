// src/types/api/BookingResponse.ts
import { type Status } from "./Status";
import type { ServiceResponse } from "./ServiceResponse";

export interface BookingResponse {
  id?: number | null;
  status?: Status | string;      
  serviceId?: number | null;
  serviceHandle?: string | null;
  serviceName?: string | null;

  start?: string | null;    
  end?: string | null;      
  date?: string | null;     

  canAccept?: boolean | null;
  canDecline?: boolean | null;
  canCancel?: boolean | null;

  createdAt?: string | null; 
  updatedAt?: string | null; 
}
