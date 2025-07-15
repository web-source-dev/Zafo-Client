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
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  /**
   * Create Stripe Connect account
   */
  async createStripeAccount(data: CreateStripeAccountRequest): Promise<CreateStripeAccountResponse> {
    const response = await api.post<CreateStripeAccountResponse>('/organizer/stripe-account', data);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  /**
   * Create account link for onboarding
   */
  async createAccountLink(): Promise<AccountLinkResponse> {
    const response = await api.post<AccountLinkResponse>('/organizer/stripe-account/link');
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  /**
   * Get payment summary
   */
  async getPaymentSummary(): Promise<PaymentSummary> {
    const response = await api.get<PaymentSummary>('/organizer/payments/summary');
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
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
    return response.data as unknown as TicketListResponse;
  }

  /**
   * Get transfer status for tickets
   */
  async getTransferStatus() {
    const response = await api.get('/tickets/transfer-status');
    return response.data;
  }
}

const organizerService = new OrganizerService();
export default organizerService; 