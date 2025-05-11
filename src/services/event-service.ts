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

export interface EventSEO {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
}

export interface EventPrice {
  amount: number;
  currency: string;
  isFree: boolean;
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
  status: 'draft' | 'published' | 'canceled' | 'completed';
  isPublic: boolean;
  organizer: string | { _id: string; firstName: string; lastName: string; email: string; };
  slug: string;
  seo?: EventSEO;
  createdAt: Date;
  updatedAt: Date;
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
  }
};

export default eventService; 