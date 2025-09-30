import type { Status } from "./Status";

export interface BookingChangeRequestDto {
  id: number | null;
  booking_id: number | null;
  user_id: number | null;

  current_date: string | null;
  current_start: string | null;
  current_end: string | null;

  proposed_date: string;
  proposed_start: string;
  proposed_end: string;

  status: Status | null;

  reason?: string | null;
  response_reason?: string | null;

  expires_at: string | null;
}
