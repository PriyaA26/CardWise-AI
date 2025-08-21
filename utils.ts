export const formatCamelCase = (text: string): string => {
  if (!text) return '';
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};
