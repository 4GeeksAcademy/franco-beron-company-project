"use client";

interface AvatarInitialsProps {
  name: string;
}

function buildInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "--";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function AvatarInitials({ name }: AvatarInitialsProps) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/35 bg-linear-to-br from-cyan-500/25 to-teal-500/15 text-xs font-bold text-cyan-100 shadow-sm">
      {buildInitials(name)}
    </span>
  );
}
