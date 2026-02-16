/**
 * Generates a unique reference number in the format AB-YYYY-MMDD-XXXXX
 * Example: AB-2026-0216-12345
 */
export const generateReferenceNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Generate 5 random digits
  const random = Math.floor(10000 + Math.random() * 90000);
  
  return `AB-${year}-${month}${day}-${random}`;
};