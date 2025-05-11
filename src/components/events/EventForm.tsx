'use client';

import React from 'react';
import { Event } from '../../services/event-service';
import EventFormContainer from './EventFormContainer';

interface EventFormProps {
  event?: Event;
  isEdit?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ event, isEdit = false }) => {
  return <EventFormContainer event={event} isEdit={isEdit} />;
};

export default EventForm; 