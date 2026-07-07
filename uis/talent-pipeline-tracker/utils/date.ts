export function formatDate(dateIso: string): string {
  const date = new Date(dateIso);

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
