import { api } from '../api/api';
import { TicketListResponse } from './ticket-service';

export interface StripeAccountStatus {
  hasAccount: boolean;
  status: 'not_setup' | 'pending' | 'active';
  accountId?: string;
  detailsSubmitted?: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}

export interface PaymentSummary {
  totalTickets: number;
  totalRevenue: number;
  platformFees: number;
  organizerPayments: number;
  pendingTransfers: number;
  completedTransfers: number;
  failedTransfers: number;
  paidTickets: number;
  pendingTickets: number;
  refundedTickets: number;
  totalAttendees: number;
}

export interface DashboardOverview {
  eventStats: {
    totalEvents: number;
    publishedEvents: number;
    draftEvents: number;
    completedEvents: number;
    canceledEvents: number;
    pendingPaymentEvents: number;
  };
  ticketStats: {
    totalTickets: number;
    paidTickets: number;
    pendingTickets: number;
    refundedTickets: number;
    totalAttendees: number;
    totalRevenue: number;
    platformFees: number;
    organizerPayments: number;
    averageTicketPrice: number;
  };
  transferStats: {
    pendingTransfers: number;
    completedTransfers: number;
    failedTransfers: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    tickets: number;
  }>;
  recentEvents: Array<{
    _id: string;
    title: string;
    status: string;
    startDate: Date;
    endDate: Date;
    soldTickets: number;
    totalRevenue: number;
    capacity: number;
    category: string;
    location: {
      name: string;
      online: boolean;
    };
  }>;
  recentTickets: Array<{
    _id: string;
    eventId: any;
    quantity: number;
    totalAmount: number;
    paymentStatus: string;
    purchasedAt: Date;
    attendee: any;
  }>;
  refundRequests: number;
  stripeAccountStatus: StripeAccountStatus;
}

export interface CreateStripeAccountRequest {
  country: string;
  email: string;
  businessType: 'individual' | 'company';
}

export interface CreateStripeAccountResponse {
  accountId: string;
  accountLink: string;
}

export interface AccountLinkResponse {
  accountLink: string;
}

class OrganizerService {
  /**
   * Get Stripe account status
   */
  async getStripeAccountStatus(): Promise<StripeAccountStatus> {
    const response = await api.get<StripeAccountStatus>('/organizer/stripe-account/status');
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch Stripe account status');
    }
    return response.data as StripeAccountStatus;
  }

  /**
   * Create Stripe Connect account
   */
  async createStripeAccount(data: CreateStripeAccountRequest): Promise<CreateStripeAccountResponse> {
    const response = await api.post<CreateStripeAccountResponse>('/organizer/stripe-account', data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to create Stripe account');
    }
    return response.data as CreateStripeAccountResponse;
  }

  /**
   * Create account link for onboarding
   */
  async createAccountLink(): Promise<AccountLinkResponse> {
    const response = await api.post<AccountLinkResponse>('/organizer/stripe-account/link');
    if (!response.success) {
      throw new Error(response.message || 'Failed to create account link');
    }
    return response.data as AccountLinkResponse;
  }

  /**
   * Get payment summary
   */
  async getPaymentSummary(): Promise<PaymentSummary> {
    const response = await api.get<PaymentSummary>('/organizer/payments/summary');
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch payment summary');
    }
    return response.data as PaymentSummary;
  }

  /**
   * Get detailed payment summary for reports
   */
  async getDetailedPaymentSummary(): Promise<PaymentSummary> {
    const response = await api.get<PaymentSummary>('/organizer/payments/summary');
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch detailed payment summary');
    }
    return response.data as PaymentSummary;
  }

  /**
   * Get comprehensive dashboard overview
   */
  async getDashboardOverview(): Promise<DashboardOverview> {
    const response = await api.get<DashboardOverview>('/organizer/dashboard/overview');
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch dashboard overview');
    }
    return response.data as DashboardOverview;
  }

  /**
   * Get organizer's ticket sales
   */
  async getOrganizerTickets(params?: {
    status?: string;
    eventId?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/tickets/organizer', { params });
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch organizer tickets');
    }
    return response.data as unknown as TicketListResponse;
  }

  /**
   * Get transfer status for tickets
   */
  async getTransferStatus() {
    const response = await api.get('/tickets/transfer-status');
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch transfer status');
    }
    return response.data;
  }
}

const organizerService = new OrganizerService();
export default organizerService; 