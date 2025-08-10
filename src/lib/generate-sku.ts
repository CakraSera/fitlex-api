export const generateSku = (categoryDisplayName: string): string => {
  const prefix = categoryDisplayName
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 3)
    .toUpperCase();
  const sequence = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${sequence}`;
};
