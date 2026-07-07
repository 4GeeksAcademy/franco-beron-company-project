import { CandidateDetail } from "@/components/CandidateDetail";

interface CandidateDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CandidateDetailPage({
  params,
}: CandidateDetailPageProps) {
  const { id } = await params;

  return (
    <main className="flex-1 bg-[radial-gradient(circle_at_top_right,#0f3c3f,#0a1425_42%,#070b14)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <CandidateDetail candidateId={id} />
      </div>
    </main>
  );
}
