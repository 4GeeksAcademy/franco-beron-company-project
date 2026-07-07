"use client";

import type { CandidateStage } from "@/types/candidate";
import { getStageTone, toHumanLabel } from "@/utils/candidate";

interface StageBadgeProps {
  stage: CandidateStage;
}

export function StageBadge({ stage }: StageBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStageTone(
        stage,
      )}`}
    >
      {toHumanLabel(stage)}
    </span>
  );
}
