export interface EventFormData {
  title: string;
  smallDescription: string;
  aboutEvent: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  category: 'conference' | 'workshop' | 'seminar' | 'networking' | 'social' | 'other';
  capacity: number;
  registrationDeadline?: string;
  isOnline: boolean;
  location: {
    name: string;
    address: {
      street: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    };
    meetingLink?: string;
  };
  isFree: boolean;
  price: {
    amount: number;
    currency: string;
  };
  tags: string[];
  isPublic: boolean;
  coverImage?: string | File;
  galleryImages?: (string | File)[];
  refundPolicy: string;
  eventIncludes: string;
  ageRange: {
    min?: number;
    max?: number;
  };
  arriveBy: string;
  deliverBy?: string;
  speakers: {
    name: string;
    image?: string | File;
    about: string;
    role?: string;
  }[];
  additionalFields: {
    title: string;
    content: string;
  }[];
  seo?: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
    ogImageFile?: File;
  };
}

export interface SectionState {
  isEditing: boolean;
  isCompleted: boolean;
}

export interface EventFormState {
  basicInfo: SectionState;
  dateTime: SectionState;
  location: SectionState;
  speakers: SectionState;
  details: SectionState;
  additionalInfo: SectionState;
  images: SectionState;
  pricing: SectionState;
}

export enum SectionType {
  BASIC_INFO = 'basicInfo',
  DATE_TIME = 'dateTime',
  LOCATION = 'location',
  SPEAKERS = 'speakers',
  DETAILS = 'details',
  ADDITIONAL_INFO = 'additionalInfo',
  IMAGES = 'images',
  PRICING = 'pricing'
} 