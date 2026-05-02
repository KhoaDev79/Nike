/**
 * Format số tiền sang định dạng Việt Nam
 * @param {number} amount
 * @returns {string} e.g. "1.500.000đ"
 */
export const formatVND = (amount) => {
  if (amount == null) return '0đ';
  return amount.toLocaleString('vi-VN') + 'đ';
};

/**
 * Format ngày sang tiếng Việt
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateVN = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};
