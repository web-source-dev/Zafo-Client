import api, { ApiResponse } from '../api/api';

// Ticket interfaces
export interface TicketDetail {
  attendeeName: string;
  attendeeEmail: string;
  ticketNumber: number;
  refundStatus?: 'none' | 'requested' | 'approved' | 'rejected' | 'completed';
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
}

export interface Ticket {
  _id: string;
  eventId: string | {
    _id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    location: {
      name: string;
      online: boolean;
    };
    coverImage?: string;
    slug: string;
  };
  attendee: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  organizer: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  quantity: number;
  ticketDetails: TicketDetail[];
  ticketPrice: number;
  currency: string;
  platformFee: number;
  organizerPayment: number;
  stripePaymentIntentId: string;
  stripeTransferId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  refundStatus: 'none' | 'requested' | 'approved' | 'rejected' | 'completed';
  refundAmount: number;
  cancellationFee: number;
  refundReason?: string;
  refundedAt?: Date;
  organizerTransferStatus: 'pending' | 'completed' | 'failed';
  organizerTransferDate?: Date;
  purchasedAt: Date;
  updatedAt: Date;
}

export interface TicketPurchaseRequest {
  eventId: string;
  ticketPrice: number;
  currency?: string;
  quantity: number;
  ticketDetails: TicketDetail[];
}

export interface TicketPurchaseResponse {
  ticketId: string;
  clientSecret: string;
  totalAmount: number;
  platformFee: number;
  organizerPayment: number;
  quantity: number;
}

export interface TicketListResponse {
  tickets: Ticket[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface RefundRequest {
  reason: string;
  refundTickets?: number[]; // Array of ticket numbers to refund
}

export interface RefundResponse {
  ticketId: string;
  refundAmount: number;
  cancellationFee: number;
  refundStatus: string;
  quantity: number;
  refundedTickets?: Array<{
    ticketNumber: number;
    attendeeName: string;
    attendeeEmail: string;
  }>;
}

export interface ProcessRefundRequest {
  action: 'approve' | 'reject';
  refundTickets?: number[]; // Array of ticket numbers to refund
}

export interface ProcessRefundResponse {
  ticketId: string;
  refundAmount?: number;
  refundStatus: string;
  stripeRefundId?: string;
  quantity: number;
}

/**
 * Service for ticket-related API calls
 */
const ticketService = {
  /**
   * Create a ticket purchase
   * @param purchaseData - Ticket purchase data
   * @returns Promise with ticket purchase result
   */
  createTicketPurchase: async (purchaseData: TicketPurchaseRequest): Promise<ApiResponse<TicketPurchaseResponse>> => {
    return api.post<TicketPurchaseResponse>('/tickets/purchase', purchaseData);
  },

  /**
   * Confirm ticket payment
   * @param ticketId - Ticket ID
   * @returns Promise with payment confirmation result
   */
  confirmTicketPayment: async (ticketId: string): Promise<ApiResponse<{ ticketId: string; paymentStatus: string; totalAmount: number; quantity: number }>> => {
    return api.post(`/tickets/${ticketId}/confirm`);
  },

  /**
   * Request ticket refund
   * @param ticketId - Ticket ID
   * @param refundData - Refund request data
   * @returns Promise with refund request result
   */
  requestTicketRefund: async (ticketId: string, refundData: RefundRequest): Promise<ApiResponse<RefundResponse>> => {
    return api.post<RefundResponse>(`/tickets/${ticketId}/refund/request`, refundData);
  },

  /**
   * Process ticket refund (approve/reject)
   * @param ticketId - Ticket ID
   * @param processData - Process refund data
   * @returns Promise with refund processing result
   */
  processTicketRefund: async (ticketId: string, processData: ProcessRefundRequest): Promise<ApiResponse<ProcessRefundResponse>> => {
    return api.post<ProcessRefundResponse>(`/tickets/${ticketId}/refund/process`, processData);
  },

  /**
   * Get user's tickets
   * @param filters - Optional filters and pagination
   * @returns Promise with user's tickets
   */
  getUserTickets: async (filters?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<TicketListResponse>> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return api.get<TicketListResponse>(`/tickets/user${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get organizer's ticket sales
   * @param filters - Optional filters and pagination
   * @returns Promise with organizer's ticket sales
   */
  getOrganizerTickets: async (filters?: { status?: string; eventId?: string; page?: number; limit?: number }): Promise<ApiResponse<TicketListResponse>> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return api.get<TicketListResponse>(`/tickets/organizer${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Transfer money to organizers for completed events (admin only)
   * @returns Promise with transfer results
   */
  transferToOrganizers: async (): Promise<ApiResponse<{ totalProcessed: number; results: Array<{ ticketId: string; status: string; transferId?: string; amount?: number; error?: string; reason?: string }> }>> => {
    return api.post('/tickets/transfer-to-organizers');
  },

  /**
   * Get all refund requests (admin only)
   */
  getAllRefundRequests: async (): Promise<ApiResponse<Ticket[]>> => {
    return api.get<Ticket[]>('/tickets/refund-requests');
  },

  /**
   * Get organizer's refund requests (organizer only)
   */
  getOrganizerRefundRequests: async (): Promise<ApiResponse<Ticket[]>> => {
    return api.get<Ticket[]>('/tickets/organizer/refund-requests');
  }
};

export default ticketService; 