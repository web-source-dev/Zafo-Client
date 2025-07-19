/**
 * Format date to a human-readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/**
 * Format time to a human-readable string
 * @param date The date containing the time to format
 * @returns Formatted time string
 */
export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

/**
 * Format date range to a human-readable string
 * @param startDate Start date
 * @param endDate End date
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const startMonth = startDate.getMonth();
  const startDay = startDate.getDate();
  const startYear = startDate.getFullYear();
  
  const endMonth = endDate.getMonth();
  const endDay = endDate.getDate();
  const endYear = endDate.getFullYear();
  
  // Same day
  if (startMonth === endMonth && startDay === endDay && startYear === endYear) {
    return formatDate(startDate);
  }
  
  // Same month and year
  if (startMonth === endMonth && startYear === endYear) {
    return `${formatDate(startDate).split(' ')[0]} ${startDay} - ${endDay}, ${startYear}`;
  }
  
  // Different months, same year
  if (startYear === endYear) {
    return `${formatDate(startDate).split(',')[0]} - ${formatDate(endDate)}`;
  }
  
  // Different years
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Format currency to a human-readable string
 * @param amount The amount to format
 * @param currency The currency code (default: CHF)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'CHF'): string => {
  return new Intl.NumberFormat('en-CH', {
    style: 'currency',
    currency: currency
  }).format(amount);
}; 