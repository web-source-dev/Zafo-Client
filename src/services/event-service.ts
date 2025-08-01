import api, { ApiResponse } from '../api/api';

// Event interfaces
export interface EventLocation {
  name: string;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  online: boolean;
  meetingLink?: string;
}

export interface Speaker {
  name: string;
  image?: string;
  about: string;
  role?: string;
}

export interface AdditionalField {
  title: string;
  content: string;
}



export interface EventPrice {
  amount: number;
  currency: string;
  isFree: boolean;
  platformFee?: number;
}

export interface AgeRange {
  min?: number;
  max?: number;
}

export interface Event {
  _id: string;
  title: string;
  smallDescription: string;
  aboutEvent: string;
  startDate: Date;
  endDate: Date;
  location: EventLocation;
  refundPolicy?: string;
  eventIncludes?: string;
  ageRange?: AgeRange;
  arriveBy?: string;
  deliverBy?: string;
  speakers?: Speaker[];
  additionalFields?: AdditionalField[];
  capacity: number;
  registrationDeadline?: Date;
  category: 'conference' | 'workshop' | 'seminar' | 'networking' | 'social' | 'other';
  tags?: string[];
  coverImage?: string;
  galleryImages?: string[];
  price: EventPrice;
  status: 'draft' | 'published' | 'canceled' | 'completed' | 'pending_payment';
  isPublic: boolean;
  organizer: string | { _id: string; firstName: string; lastName: string; email: string; };
  slug: string;

  createdAt: Date;
  updatedAt: Date;
  savedAt?: Date; // For saved events
  isSaved?: boolean; // For UI state
  isPaid?: boolean; // Whether the event has been paid for
  paidAt?: Date; // When the event was paid for
  paymentId?: string; // Payment ID from payment processor
  soldTickets?: number; // Number of tickets sold
  remainingCapacity?: number; // Remaining capacity
  isSoldOut?: boolean; // Whether the event is sold out
}

export interface EventListResponse {
  events: Event[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface EventFilters {
  status?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  isPublic?: boolean;
  sort?: string;
  limit?: number;
  page?: number;
  search?: string;
  priceRange?: string;
  location?: string;
}

export interface SavedEventResponse {
  _id: string;
  user: string;
  event: string;
  savedAt: Date;
}

export interface EventStats {
  eventId: string;
  totalCapacity: number;
  soldTickets: number;
  remainingCapacity: number;
  isSoldOut: boolean;
}

/**
 * Service for event-related API calls
 */
const eventService = {
  /**
   * Create a new event
   * @param eventData - Event data
   * @returns Promise with event creation result
   */
  createEvent: async (eventData: Omit<Event, '_id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Event>> => {
    return api.post<Event>('/events', eventData);
  },

  /**
   * Get all events (with optional filters)
   * @param filters - Optional filters and pagination
   * @returns Promise with events list
   */
  getEvents: async (filters?: EventFilters): Promise<ApiResponse<EventListResponse>> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return api.get<EventListResponse>(`/events${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get events created by the current organizer
   * @param filters - Optional filters and pagination
   * @returns Promise with organizer's events list
   */
  getOrganizerEvents: async (filters?: { status?: string; sort?: string; limit?: number; page?: number }): Promise<ApiResponse<EventListResponse>> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return api.get<EventListResponse>(`/events/organizer${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get a single event by ID or slug
   * @param idOrSlug - Event ID or slug
   * @returns Promise with event details
   */
  getEvent: async (idOrSlug: string): Promise<ApiResponse<Event>> => {
    return api.get<Event>(`/events/${idOrSlug}`);
  },

  /**
   * Update an event
   * @param id - Event ID
   * @param updateData - Updated event data
   * @returns Promise with updated event
   */
  updateEvent: async (id: string, updateData: Partial<Event>): Promise<ApiResponse<Event>> => {
    return api.put<Event>(`/events/${id}`, updateData);
  },

  /**
   * Change event status
   * @param id - Event ID
   * @param status - New status
   * @returns Promise with updated event
   */
  changeEventStatus: async (id: string, status: 'draft' | 'published' | 'canceled' | 'completed'): Promise<ApiResponse<Event>> => {
    return api.patch<Event>(`/events/${id}/status`, { status });
  },

  /**
   * Delete an event
   * @param id - Event ID
   * @returns Promise with deletion result
   */
  deleteEvent: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete(`/events/${id}`);
  },
  
  /**
   * Check if an event is saved by the current user
   * @param eventId - Event ID
   * @returns Promise with save status
   */
  checkSavedEvent: async (eventId: string): Promise<ApiResponse<{isSaved: boolean}>> => {
    return api.get<{isSaved: boolean}>(`/saved-events/check/${eventId}`);
  },
  
  /**
   * Save an event for the current user
   * @param eventId - Event ID to save
   * @returns Promise with save result
   */
  saveEvent: async (eventId: string): Promise<ApiResponse<SavedEventResponse>> => {
    return api.post<SavedEventResponse>('/saved-events', { eventId });
  },
  
  /**
   * Unsave an event for the current user
   * @param eventId - Event ID to unsave
   * @returns Promise with unsave result
   */
  unsaveEvent: async (eventId: string): Promise<ApiResponse<void>> => {
    return api.delete(`/saved-events/${eventId}`);
  },
  
  /**
   * Get all saved events for the current user
   * @param options - Pagination and sorting options
   * @returns Promise with saved events
   */
  getSavedEvents: async (options?: { sort?: string; limit?: number; page?: number }): Promise<ApiResponse<EventListResponse>> => {
    const queryParams = new URLSearchParams();
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return api.get<EventListResponse>(`/saved-events${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get event statistics
   * @param eventId - Event ID
   * @returns Promise with event statistics
   */
  getEventStats: async (eventId: string): Promise<ApiResponse<EventStats>> => {
    return api.get<EventStats>(`/events/${eventId}/stats`);
  }
};

export default eventService; 