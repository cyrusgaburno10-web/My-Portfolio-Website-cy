'use client';

import { useState } from 'react';
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { MultiStepMessageForm } from '@/components/booking/MultiStepMessageForm';

export function BookingSection() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div data-component="booking-section" className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2 xl:gap-8">
      <div data-role="column-pick-a-time" className="flex flex-col gap-3">
        <span data-role="column-label">PICK A TIME</span>
        <div data-role="calendar-card">
          <BookingCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
      </div>

      <div data-role="column-send-message">
        <MultiStepMessageForm />
      </div>
    </div>
  );
}
