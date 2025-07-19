import api, { ApiResponse } from '../api/api';

// Ticket interfaces
export interface TicketDetail {
  attendeeName: string;
  attendeeEmail: string;
  ticketNumber: string;
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

export interface AddTicketsToExistingRequest {
  existingTicketId: string;
  additionalQuantity: number;
  additionalTicketDetails: TicketDetail[];
}

export interface AddTicketsToExistingResponse {
  existingTicketId: string;
  clientSecret: string;
  additionalTotalAmount: number;
  additionalPlatformFee: number;
  additionalOrganizerPayment: number;
  additionalQuantity: number;
  paymentIntentId: string;
}

export interface ConfirmAdditionalTicketRequest {
  existingTicketId: string;
  paymentIntentId: string;
  additionalTicketDetails: TicketDetail[];
}

export interface ConfirmAdditionalTicketResponse {
  ticketId: string;
  totalQuantity: number;
  additionalQuantity: number;
  totalAmount: number;
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
  refundTickets?: string[]; // Array of ticket numbers to refund (as strings)
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

export interface UserReportsOverview {
  totalTickets: number; // Total individual attendee tickets (not ticket records)
  totalSpent: number;
  totalEvents: number;
  averageTicketPrice: number;
  refundedAmount: number;
  refundRequests: number;
}

export interface UserReportsTicketsByStatus {
  paid: number; // Individual attendee tickets with paid status (excluding refunded ones)
  pending: number; // Individual attendee tickets with pending status
  failed: number; // Individual attendee tickets with failed status
  refunded: number; // Individual attendee tickets that have been refunded
  partially_refunded: number; // Individual attendee tickets that are still active after partial refund
}

export interface MonthlySpendingData {
  month: string;
  spending: number;
  tickets: number; // Individual attendee tickets for this month
}

export interface CategoryBreakdownData {
  category: string;
  tickets: number; // Individual attendee tickets in this category
  spending: number;
  events: number;
}

export interface RecentActivityData {
  ticketId: string;
  eventTitle: string;
  eventDate: Date | null;
  quantity: number; // Individual attendee tickets in this purchase
  amount: number;
  currency: string;
  paymentStatus: string;
  purchasedAt: Date;
  organizer: string;
}

export interface FavoriteOrganizerData {
  id: string;
  name: string;
  tickets: number; // Individual attendee tickets from this organizer
  spending: number;
  events: number;
}

export interface UserReportsEvents {
  attended: number; // Individual attendee tickets for attended events
  upcoming: number; // Individual attendee tickets for upcoming events
  total: number; // Total unique events
}

export interface UserReportsData {
  overview: UserReportsOverview;
  ticketsByStatus: UserReportsTicketsByStatus;
  monthlySpending: MonthlySpendingData[];
  categoryBreakdown: CategoryBreakdownData[];
  recentActivity: RecentActivityData[];
  favoriteOrganizers: FavoriteOrganizerData[];
  events: UserReportsEvents;
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
   * Add tickets to existing purchase
   * @param data - Additional ticket data
   * @returns Promise with additional purchase result
   */
  addTicketsToExistingPurchase: async (data: AddTicketsToExistingRequest): Promise<ApiResponse<AddTicketsToExistingResponse>> => {
    return api.post<AddTicketsToExistingResponse>('/tickets/add-to-existing', data);
  },

  /**
   * Confirm additional ticket payment and merge with existing ticket
   * @param data - Additional ticket confirmation data
   * @returns Promise with confirmation result
   */
  confirmAdditionalTicketPayment: async (data: ConfirmAdditionalTicketRequest): Promise<ApiResponse<ConfirmAdditionalTicketResponse>> => {
    return api.post<ConfirmAdditionalTicketResponse>('/tickets/confirm-additional', data);
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
  },

  /**
   * Get user's comprehensive reports and statistics
   * @returns Promise with user's reports data
   */
  getUserReports: async (): Promise<ApiResponse<UserReportsData>> => {
    return api.get<UserReportsData>('/tickets/user/reports');
  }
};

export default ticketService; 