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
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">
      {buildInitials(name)}
    </span>
  );
}
