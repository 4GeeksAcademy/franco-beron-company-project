import type { CandidateStage, CandidateStatus } from "@/types/candidate";

export const STATUS_OPTIONS: { value: CandidateStatus; label: string }[] = [
  { value: "received", label: "Received" },
  { value: "in_progress", label: "In Progress" },
  { value: "selected", label: "Selected" },
  { value: "discarded", label: "Discarded" },
];

export const STAGE_OPTIONS: { value: CandidateStage; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "review", label: "Review" },
  { value: "personal_interview", label: "Personal Interview" },
  { value: "technical_interview", label: "Technical Interview" },
  { value: "offer_presented", label: "Offer Presented" },
];

export function toHumanLabel(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getStatusTone(status: CandidateStatus): string {
  if (status === "selected") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (status === "in_progress") return "bg-amber-100 text-amber-800 border-amber-200";
  if (status === "discarded") return "bg-rose-100 text-rose-800 border-rose-200";
  return "bg-sky-100 text-sky-800 border-sky-200";
}

export function getStageTone(stage: CandidateStage): string {
  if (stage === "offer_presented") return "bg-purple-100 text-purple-800 border-purple-200";
  if (stage === "technical_interview") return "bg-indigo-100 text-indigo-800 border-indigo-200";
  if (stage === "personal_interview") return "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200";
  if (stage === "review") return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-zinc-100 text-zinc-700 border-zinc-200";
}
