export const formatToAPITime = (date) => {
  if (!date) return new Date().toISOString();
  
  // Nếu là string, chuyển thành Date object trước
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format theo chuẩn ISO 8601
  return dateObj.toISOString();
};