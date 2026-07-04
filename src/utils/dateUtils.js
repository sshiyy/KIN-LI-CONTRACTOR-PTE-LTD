export function formatDate(date) {
  if (!date || date === "-") return "-";

  const formattedDate = new Date(date);

  return formattedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}