import { apiRequest } from "@/lib/api";
import type {
  Candidate,
  CandidateCreateRequest,
  CandidateFilters,
  CandidatePatchRequest,
  CandidateUpdateRequest,
} from "@/types/candidate";
import type { CandidatesResponse, NotesResponse } from "@/types/api";
import type { Note, NoteCreateRequest } from "@/types/note";

export async function getCandidates(
  filters: CandidateFilters,
): Promise<CandidatesResponse> {
  return apiRequest<CandidatesResponse>(
    "/records",
    { method: "GET" },
    {
      status: filters.status,
      stage: filters.stage,
      search: filters.search,
      page: filters.page,
      limit: filters.limit,
    },
  );
}

export async function getCandidateById(id: string): Promise<Candidate> {
  return apiRequest<Candidate>(`/records/${id}`, { method: "GET" });
}

export async function createCandidate(
  payload: CandidateCreateRequest,
): Promise<Candidate> {
  return apiRequest<Candidate>("/records", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCandidate(
  id: string,
  payload: CandidateUpdateRequest,
): Promise<Candidate> {
  return apiRequest<Candidate>(`/records/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function patchCandidate(
  id: string,
  payload: CandidatePatchRequest,
): Promise<Candidate> {
  return apiRequest<Candidate>(`/records/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteCandidate(id: string): Promise<void> {
  await apiRequest<void>(`/records/${id}`, {
    method: "DELETE",
  });
}

export async function getCandidateNotes(id: string): Promise<NotesResponse> {
  return apiRequest<NotesResponse>(`/records/${id}/notes`, { method: "GET" });
}

export async function createCandidateNote(
  id: string,
  payload: NoteCreateRequest,
): Promise<Note> {
  return apiRequest<Note>(`/records/${id}/notes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteCandidateNote(
  id: string,
  noteId: string,
): Promise<void> {
  await apiRequest<void>(`/records/${id}/notes/${noteId}`, {
    method: "DELETE",
  });
}
