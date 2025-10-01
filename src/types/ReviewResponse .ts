export interface ReviewResponse {
  id?: number | null;
  serviceId?: number | null;
  reviewerId?: number | null;
  reviewerDisplayName?: string | null;
  rating: number;               
  comment?: string | null;
  createdAt?: string | null;    
  updatedAt?: string | null;    
}
