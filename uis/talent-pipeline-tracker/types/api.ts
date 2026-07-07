import type { Candidate, CandidateListItem } from "@/types/candidate";
import type { Note } from "@/types/note";

export interface PaginatedResponse<T> {
  data: T[];
  page?: number;
  limit?: number;
  total?: number;
  meta?: {
    total?: number;
  };
}

export type CandidatesResponse = PaginatedResponse<CandidateListItem>;

export type CandidateResponse = Candidate;

export type NotesResponse = PaginatedResponse<Note>;

export interface ApiErrorResponse {
  detail?: string | { msg?: string }[];
  message?: string;
}
