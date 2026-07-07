"use client";

import type { CandidateStatus } from "@/types/candidate";
import { getStatusTone, toHumanLabel } from "@/utils/candidate";

interface StatusBadgeProps {
  status: CandidateStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusTone(
        status,
      )}`}
    >
      {toHumanLabel(status)}
    </span>
  );
}
