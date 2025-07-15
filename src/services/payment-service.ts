import api, { ApiResponse } from '../api/api';

/**
 * Service for payment-related API calls
 */
const paymentService = {
  /**
   * Create a checkout session for event payment
   * @param eventId - Event ID
   * @param amount - Payment amount
   * @param currency - Currency code
   * @param eventTitle - Event title
   * @returns Promise with checkout session details
   */
  createCheckoutSession: async (
    eventId: string, 
    amount: number, 
    currency: string = 'CHF',
    eventTitle: string
  ): Promise<ApiResponse<{ sessionId: string; sessionUrl: string }>> => {
    return api.post('/payments/create-session', {
      eventId,
      amount,
      currency,
      eventTitle
    });
  },

  /**
   * Verify payment status for an event
   * @param eventId - Event ID
   * @returns Promise with payment verification result
   */
  verifyPayment: async (eventId: string): Promise<ApiResponse<{ isPaid: boolean; paidAt?: Date }>> => {
    return api.get(`/payments/verify/${eventId}`);
  }
};

export default paymentService; 