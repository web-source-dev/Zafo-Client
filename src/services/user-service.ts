import api, { ApiResponse } from '../api/api';

// User Dashboard Interfaces
export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin' | 'organizer';
  createdAt: string;
  memberSince: string;
}

export interface TicketStats {
  totalTickets: number;
  paidTickets: number;
  pendingTickets: number;
  refundedTickets: number;
  partiallyRefundedTickets: number;
  totalSpent: number;
  totalRefunds: number;
  averageTicketPrice: number;
  netSpending: number;
}

export interface EventStats {
  upcomingEvents: number;
  pastEvents: number;
  totalEvents: number;
}

export interface MonthlySpending {
  month: string;
  spending: number;
  tickets: number;
}

export interface RecentActivity {
  _id: string;
  type: string;
  eventTitle: string;
  eventId: string;
  quantity: number;
  amount: number;
  currency: string;
  paymentStatus: string;
  purchasedAt: string;
  eventDate: string | null;
  eventLocation: string;
}

export interface FavoriteCategory {
  category: string;
  count: number;
}

export interface UpcomingEvent {
  _id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string | null;
  eventLocation: string;
  eventCategory: string;
  coverImage: string | null;
  slug: string | null;
  quantity: number;
  paymentStatus: string;
  ticketPrice: number;
  currency: string;
}

export interface DashboardOverview {
  userProfile: UserProfile;
  ticketStats: TicketStats;
  eventStats: EventStats;
  monthlySpending: MonthlySpending[];
  recentActivity: RecentActivity[];
  favoriteCategories: FavoriteCategory[];
  upcomingEventsDetails: UpcomingEvent[];
  refundRequests: number;
}

export interface TicketHistoryResponse {
  tickets: Array<{
    _id: string;
    eventId: any;
    attendee: any;
    organizer: any;
    quantity: number;
    ticketDetails: Array<{
      attendeeName: string;
      attendeeEmail: string;
      ticketNumber: string;
      refundStatus?: string;
      refundAmount?: number;
      refundReason?: string;
      refundedAt?: string;
    }>;
    ticketPrice: number;
    currency: string;
    platformFee: number;
    organizerPayment: number;
    paymentStatus: string;
    refundStatus: string;
    refundAmount: number;
    purchasedAt: string;
    updatedAt: string;
  }>;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface SpendingAnalytics {
  monthlySpending: MonthlySpending[];
  categoryBreakdown: Array<{
    category: string;
    totalSpent: number;
    ticketCount: number;
  }>;
  totalSpent: number;
  totalTickets: number;
  averageTicketPrice: number;
}

export interface FavoritesData {
  favoriteCategories: FavoriteCategory[];
  favoriteOrganizers: Array<{
    organizerName: string;
    count: number;
  }>;
  recentEvents: Array<{
    _id: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    eventCategory: string;
    coverImage: string | null;
    slug: string;
    quantity: number;
    purchasedAt: string;
  }>;
}

/**
 * Service for user dashboard and profile-related API calls
 */
class UserService {
  /**
   * Get comprehensive user dashboard overview
   * @returns Promise with dashboard overview data
   */
  async getDashboardOverview(): Promise<ApiResponse<DashboardOverview>> {
    return api.get<DashboardOverview>('/user/dashboard');
  }

  /**
   * Get user's ticket history with filters
   * @param filters - Optional filters and pagination
   * @returns Promise with ticket history
   */
  async getTicketHistory(filters?: {
    status?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<ApiResponse<TicketHistoryResponse>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return api.get<TicketHistoryResponse>(`/user/tickets${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Get user's spending analytics
   * @param period - Time period for analytics (6months or 12months)
   * @returns Promise with spending analytics
   */
  async getSpendingAnalytics(period: '6months' | '12months' = '6months'): Promise<ApiResponse<SpendingAnalytics>> {
    return api.get<SpendingAnalytics>(`/user/analytics?period=${period}`);
  }

  /**
   * Get user's favorite events and categories
   * @returns Promise with favorites data
   */
  async getFavorites(): Promise<ApiResponse<FavoritesData>> {
    return api.get<FavoritesData>('/user/favorites');
  }
}

export default new UserService(); 