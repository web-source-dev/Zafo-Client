'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Loader } from '@googlemaps/js-api-loader';
import {
  Calendar,
  MapPin,
  Tag,
  Users,
  Globe,
  Ticket,
  Info,
  User,
  ChevronLeft,
  Share2,
  Heart,
  ChevronRight,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import eventService, { Event } from '@/services/event-service';
import Image from 'next/image';
// You should replace this with your actual Google Maps API key in a production environment
// Ideally, this would be stored in an environment variable
const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Gallery state
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (typeof params.slug !== 'string') {
          setError('Invalid event slug');
          setLoading(false);
          return;
        }

        const response = await eventService.getEvent(params.slug);
        if (response.success && response.data) {
          setEvent(response.data);
        } else {
          setError(response.message || 'Failed to load event details');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('An error occurred while loading the event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.slug]);

  // Load Google Maps when event data is available
  useEffect(() => {
    if (!event || !event.location || !event.location.coordinates || event.location.online) {
      return;
    }

    const loadMap = async () => {
      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
        });

        const google = await loader.load();
        setMapLoaded(true);

        const mapElement = document.getElementById('event-map');
        if (mapElement && event.location.coordinates) {
          const { latitude, longitude } = event.location.coordinates;
          
          // Map styling to match website theme
          const mapStyles = [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ saturation: -100 }]
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ];
          
          const map = new google.maps.Map(mapElement, {
            center: { lat: latitude, lng: longitude },
            zoom: 15,
            mapTypeControl: false,
            fullscreenControl: true,
            streetViewControl: true,
            styles: mapStyles,
            zoomControl: true
          });

          // Create info window with venue details
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 5px;">${event.location.name}</h3>
                <p style="font-size: 12px; margin: 0;">
                  ${event.location.address.street}, 
                  ${event.location.address.city}
                  ${event.location.address.state ? `, ${event.location.address.state}` : ''}
                </p>
              </div>
            `
          });

          // Add marker for event location
          const marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map,
            title: event.location.name,
            animation: google.maps.Animation.DROP,
          });
          
          // Open info window when marker is clicked
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
          
          // Open info window by default
          infoWindow.open(map, marker);
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
      }
    };

    loadMap();
  }, [event]);

  // Gallery navigation functions
  const openGallery = (index: number = 0) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
    // Prevent scrolling when gallery is open
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setShowGallery(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = useCallback(() => {
    if (!event || !event.galleryImages) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === event.galleryImages!.length - 1 ? 0 : prevIndex + 1
    );
  }, [event]);

  const prevImage = useCallback(() => {
    if (!event || !event.galleryImages) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? event.galleryImages!.length - 1 : prevIndex - 1
    );
  }, [event]);

  // Handle keyboard events for gallery navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showGallery) return;
      
      if (e.key === 'Escape') closeGallery();
      else if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGallery, event, nextImage, prevImage]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold text-[var(--sage-green)] mb-4">
            {error || 'Event not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            The event you&apos;re looking for might have been removed or is not available.
          </p>
          <Button onClick={() => router.push('/events')}>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  // Gallery components
  const FullscreenGallery = () => {
    if (!showGallery || !event.galleryImages || event.galleryImages.length === 0) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center">
        {/* Close button */}
        <button 
          onClick={closeGallery}
          className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors"
          aria-label="Close gallery"
        >
          <X className="h-8 w-8" />
        </button>
        
        {/* Image counter */}
        <div className="absolute top-4 left-4 z-50 text-white">
          <span>{currentImageIndex + 1} / {event.galleryImages.length}</span>
        </div>
        
        {/* Main image */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <Image
            src={event.galleryImages[currentImageIndex]}
            alt={`Event gallery image ${currentImageIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            width={500}
            height={500}
          />
        </div>
        
        {/* Navigation buttons */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
          <button 
            onClick={prevImage}
            className="bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-opacity"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button 
            onClick={nextImage}
            className="bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-opacity"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
        
        {/* Thumbnails */}
        {event.galleryImages.length > 1 && (
          <div className="absolute bottom-4 inset-x-0">
            <div className="flex justify-center space-x-2 px-4 overflow-x-auto">
              {event.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex 
                      ? 'border-[var(--sage-green)] opacity-100 scale-110' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[var(--taupe)]">
      {/* Fullscreen gallery */}
      <FullscreenGallery />
      
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 w-full">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-contain"
            width={500}
            height={500}
          />
        ) : (
          <div className="w-full h-full bg-[var(--sage)] flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white">{event.title}</h1>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Gallery (if available) */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-[var(--sage-green)]">Event Gallery</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {event.galleryImages.slice(0, 8).map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md overflow-hidden cursor-pointer hover-lift transition-standard"
                        onClick={() => openGallery(index)}
                      >
                        <Image
                          src={image}
                          alt={`Event gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                          width={500}
                          height={500}
                        />
                        {index === 7 && event.galleryImages && event.galleryImages.length > 8 && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <div className="text-white text-center">
                              <p className="text-2xl font-bold">+{event.galleryImages.length - 8}</p>
                              <p className="text-sm">More photos</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {event.galleryImages.length > 4 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        onClick={() => openGallery(0)}
                        className="mx-auto"
                      >
                        View All Photos
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-[var(--sage-green)]">About This Event</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: event.aboutEvent }} />
                </div>
              </CardContent>
            </Card>

            {/* Event Includes Section (if available) */}
            {event.eventIncludes && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-[var(--sage-green)]">What&apos;s Included</h2>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: event.eventIncludes }} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Speakers Section (if available) */}
            {event.speakers && event.speakers.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-[var(--sage-green)]">Speakers</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.speakers.map((speaker, index) => (
                      <div key={index} className="flex space-x-4">
                        {speaker.image ? (
                            <Image
                            src={speaker.image}
                            alt={speaker.name}
                            className="w-16 h-16 rounded-full object-cover"
                            width={500}
                            height={500}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[var(--sage)] flex items-center justify-center">
                            <User className="h-8 w-8 text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg text-[var(--sage-green)]">{speaker.name}</h3>
                          {speaker.role && <p className="text-sm text-gray-600 mb-1">{speaker.role}</p>}
                          {speaker.about && <p className="text-sm">{speaker.about}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Map (if not online) */}
            {!event.location.online && event.location.coordinates && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-[var(--sage-green)]">Location</h2>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-medium text-lg">{event.location.name}</h3>
                    <p className="text-gray-600">
                      {event.location.address.street}, {event.location.address.city}
                      {event.location.address.state && `, ${event.location.address.state}`}
                      <br />
                      {event.location.address.postalCode}, {event.location.address.country}
                    </p>
                  </div>
                  <div 
                    id="event-map" 
                    className="h-64 md:h-80 w-full rounded-md bg-gray-200 flex items-center justify-center shadow-md overflow-hidden"
                  >
                    {!mapLoaded && (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--sage-green)] mx-auto mb-2"></div>
                        <p className="text-gray-500">Loading map...</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${event.location.coordinates.latitude},${event.location.coordinates.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--sage-green)] hover:underline"
                    >
                      Get directions →
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Online Meeting Link (if online) */}
            {event.location.online && event.location.meetingLink && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-[var(--sage-green)]">Online Event</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Globe className="h-5 w-5 text-[var(--sage-green)]" />
                    <span>This is an online event</span>
                  </div>
                  <p className="mb-4">
                    The event link will be available after registration.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Additional Fields (if available) */}
            {event.additionalFields && event.additionalFields.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-[var(--sage-green)]">Additional Information</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.additionalFields.map((field, index) => (
                      <div key={index}>
                        <h3 className="font-medium text-lg text-[var(--sage-green)]">{field.title}</h3>
                        <div className="prose max-w-none mt-2">
                          <div dangerouslySetInnerHTML={{ __html: field.content }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Register Card */}
            <Card className="sticky top-6">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-[var(--sage-green)]" />
                      <span className="font-medium">Date & Time</span>
                    </div>
                  </div>
                  <div className="ml-7">
                    <p className="mb-1">
                      {format(parseISO(event.startDate.toString()), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p>
                      {format(parseISO(event.startDate.toString()), 'h:mm a')} - 
                      {format(parseISO(event.endDate.toString()), 'h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-5 w-5 text-[var(--sage-green)]" />
                    <span className="font-medium">Location</span>
                  </div>
                  <div className="ml-7">
                    {event.location.online ? (
                      <p>Online Event</p>
                    ) : (
                      <>
                        <p className="mb-1">{event.location.name}</p>
                        <p className="text-sm text-gray-600">
                          {event.location.address.city}, {event.location.address.country}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Ticket className="h-5 w-5 text-[var(--sage-green)]" />
                    <span className="font-medium">Price</span>
                  </div>
                  <div className="ml-7">
                    {event.price.isFree ? (
                      <span className="font-semibold text-green-600">Free</span>
                    ) : (
                      <span className="font-semibold">
                        {event.price.amount} {event.price.currency}
                      </span>
                    )}
                  </div>
                </div>

                {event.capacity && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-[var(--sage-green)]" />
                      <span className="font-medium">Capacity</span>
                    </div>
                    <div className="ml-7">
                      <p>{event.capacity} attendees</p>
                    </div>
                  </div>
                )}

                {event.category && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Tag className="h-5 w-5 text-[var(--sage-green)]" />
                      <span className="font-medium">Category</span>
                    </div>
                    <div className="ml-7">
                      <span className="inline-block bg-[var(--sage-green)] text-white text-xs font-semibold px-2 py-1 rounded-full capitalize">
                        {event.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-col space-y-3">
                  <Button
                    size="lg"
                    fullWidth
                  >
                    Register Now
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="md"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="md"
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                {event.refundPolicy && (
                  <div className="mt-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1 mb-1">
                      <Info className="h-4 w-4" />
                      <span className="font-medium">Refund Policy</span>
                    </div>
                    <p>{event.refundPolicy}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organizer info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-[var(--sage-green)]">Organizer</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--sage)] flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    {typeof event.organizer === 'object' ? (
                      <>
                        <p className="font-medium">{event.organizer.firstName} {event.organizer.lastName}</p>
                        <p className="text-sm text-gray-600">{event.organizer.email}</p>
                      </>
                    ) : (
                      <p className="font-medium">Event Organizer</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 