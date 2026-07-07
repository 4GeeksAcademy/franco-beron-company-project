import { Suspense } from "react";
import { CandidatesDashboard } from "@/components/CandidatesDashboard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <LoadingSkeleton rows={7} />
          </div>
        </main>
      }
    >
      <CandidatesDashboard />
    </Suspense>
  );
}
