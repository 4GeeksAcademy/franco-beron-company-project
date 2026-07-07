"use client";

import Link from "next/link";
import { AvatarInitials } from "@/components/AvatarInitials";
import { StageBadge } from "@/components/StageBadge";
import { StatusBadge } from "@/components/StatusBadge";
import type { Candidate } from "@/types/candidate";

interface CandidateTableProps {
  candidates: Candidate[];
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Candidate</th>
              <th className="px-5 py-3 font-semibold">Position</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Stage</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {candidates.map((candidate) => (
              <tr
                key={candidate.id}
                className="transition hover:bg-emerald-50/40"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <AvatarInitials name={candidate.full_name} />
                    <div>
                      <p className="font-medium text-zinc-900">
                        {candidate.full_name}
                      </p>
                      <p className="text-zinc-500">{candidate.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-zinc-700">
                  {candidate.position}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={candidate.status} />
                </td>
                <td className="px-5 py-4">
                  <StageBadge stage={candidate.stage} />
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/candidates/${candidate.id}`}
                    className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    View detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
