export function formatDate(date) {
  if (!date || date === "-" || date === "No Expiry") {
    return date || "-";
  }

  const formattedDate = new Date(date);

  if (isNaN(formattedDate.getTime())) {
    return "-";
  }

  return formattedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}