export interface JwtPayload {
  sub?: string | number;     
  userId?: number;  
  username?: string;
  firstName?: string;
  lastName?: string;
  location?: {
    id?: number;
    name?: string;
  } | null;
  roles?: string[];
  exp?: number;             
  iat?: number;
  [k: string]: any;
}
