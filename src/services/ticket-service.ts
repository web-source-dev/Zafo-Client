import api, { ApiResponse } from '../api/api';

// Ticket interfaces
export interface IndividualTicket {
  ticketNumber: string;
  attendeeName: string | null;
  attendeeEmail: string | null;
  isCheckedIn: boolean;
  checkedInAt: Date | null;
  qrCodeUrl: string | null;
}

export interface TicketOrder {
  _id: string;
  event: string | {
    _id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    location: {
      name: string;
      address: {
        city: string;
        country: string;
      };
      online: boolean;
    };
    status: string;
    coverImage: string | null;
    slug: string;
  };
  user: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  quantity: number;
  tickets: IndividualTicket[];
  amount: number;
  currency: string;
  paymentIntentId: string;
  paymentStatus: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  pdfUrl: string | null;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseRequest {
  eventId: string;
  quantity: number;
}

export interface PurchaseResponse {
  clientSecret: string;
  ephemeralKey: string;
  customerId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  ticketOrderId: string;
}

export interface CompletePurchaseRequest {
  paymentIntentId: string;
  ticketOrderId: string;
  attendeeInfo?: Array<{name: string, email: string}>;
}

export interface CompletePurchaseResponse {
  ticketOrder: TicketOrder;
  pdfUrl: string;
}

export interface TicketListResponse {
  tickets: TicketOrder[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface AttendeeUpdateRequest {
  ticketOrderId: string;
  ticketNumber: string;
  attendeeName?: string;
  attendeeEmail?: string;
}

/**
 * Service for ticket-related API calls
 */
const ticketService = {
  /**
   * Initiate ticket purchase
   * @param purchaseData - Ticket purchase data
   * @returns Promise with payment details
   */
  initiateTicketPurchase: async (purchaseData: PurchaseRequest): Promise<ApiResponse<PurchaseResponse>> => {
    return api.post<PurchaseResponse>('/tickets/purchase', purchaseData);
  },

  /**
   * Complete ticket purchase
   * @param completeData - Data to complete purchase
   * @returns Promise with purchase result and ticket PDF
   */
  completeTicketPurchase: async (completeData: CompletePurchaseRequest): Promise<ApiResponse<CompletePurchaseResponse>> => {
    return api.post<CompletePurchaseResponse>('/tickets/complete', completeData);
  },

  /**
   * Get user's tickets
   * @param filters - Optional filters
   * @returns Promise with tickets list
   */
  getUserTickets: async (filters?: { status?: string; limit?: number; page?: number; sort?: string }): Promise<ApiResponse<TicketListResponse>> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return api.get<TicketListResponse>(`/tickets${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get ticket by ID
   * @param id - Ticket ID
   * @returns Promise with ticket details
   */
  getTicketById: async (id: string): Promise<ApiResponse<TicketOrder>> => {
    return api.get<TicketOrder>(`/tickets/${id}`);
  },

  /**
   * Update attendee information
   * @param updateData - Attendee update data
   * @returns Promise with updated ticket
   */
  updateAttendeeInfo: async (updateData: AttendeeUpdateRequest): Promise<ApiResponse<IndividualTicket>> => {
    return api.patch<IndividualTicket>('/tickets/attendee', updateData);
  }
};

export default ticketService; 