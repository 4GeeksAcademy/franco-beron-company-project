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
  if (status === "selected")
    return "bg-emerald-500/15 text-emerald-200 border-emerald-500/40";
  if (status === "in_progress")
    return "bg-amber-500/15 text-amber-200 border-amber-500/40";
  if (status === "discarded")
    return "bg-rose-500/15 text-rose-200 border-rose-500/40";
  return "bg-sky-500/15 text-sky-200 border-sky-500/40";
}

export function getStageTone(stage: CandidateStage): string {
  if (stage === "offer_presented")
    return "bg-cyan-500/15 text-cyan-200 border-cyan-500/40";
  if (stage === "technical_interview")
    return "bg-blue-500/15 text-blue-200 border-blue-500/40";
  if (stage === "personal_interview")
    return "bg-teal-500/15 text-teal-200 border-teal-500/40";
  if (stage === "review")
    return "bg-orange-500/15 text-orange-200 border-orange-500/40";
  return "bg-slate-500/15 text-slate-200 border-slate-500/40";
}
