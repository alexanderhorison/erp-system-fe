/**
 * Format a number with dot as thousand separator
 * @param {number|string} value - The number to format
 * @returns {string} Formatted number as string
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Parse a formatted number string back to a number
 * @param {string} value - The formatted number string
 * @returns {number} Parsed number
 */
export const parseNumber = (value) => {
  if (!value) return 0;
  return Number(value.replace(/\./g, ''));
};