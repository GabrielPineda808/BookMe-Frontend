import type { LocationDto } from "./LocationDto";

export interface ServiceResponse {
  id?: number | null;            
  handle?: string | null;
  name?: string | null;
  description?: string | null;
  location?: LocationDto | null;  


  open?: string | null;           
  close?: string | null;          

  intervalMinutes?: number;      
  averageRating?: number | null;  
  reviewCount?: number | null;    

  created_At?: string | null;     
}
