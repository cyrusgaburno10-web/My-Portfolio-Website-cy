'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

type CellState = 'default' | 'past' | 'today' | 'available' | 'selected';

interface DayCell {
  date: Date;
  inCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
  isAvailable: boolean;
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function buildMonthGrid(viewDate: Date, today: Date): DayCell[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  // Convert Sun-first (0-6) to Mon-first (0-6) offset.
  const firstWeekdayIndex = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - firstWeekdayIndex);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const inCurrentMonth = date.getMonth() === month;
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isPast = startOfDay(date) < today;
    const isToday = isSameDay(date, today);
    return {
      date,
      inCurrentMonth,
      isPast,
      isToday,
      isAvailable: inCurrentMonth && !isPast && !isWeekend,
    };
  });
}

export interface BookingCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export function BookingCalendar({ selectedDate, onSelectDate }: BookingCalendarProps) {
  const [today] = useState(() => startOfDay(new Date()));
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const cells = useMemo(() => buildMonthGrid(viewDate, today), [viewDate, today]);
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  function goToPrevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  function cellState(cell: DayCell): CellState {
    if (selectedDate && isSameDay(cell.date, selectedDate)) return 'selected';
    if (cell.isToday) return 'today';
    if (cell.isPast || !cell.inCurrentMonth) return 'past';
    if (cell.isAvailable) return 'available';
    return 'default';
  }

  return (
    <div data-component="booking-calendar" className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={goToPrevMonth} aria-label="Previous month" data-role="prev-month">
          <ChevronLeft size={18} strokeWidth={1.75} />
        </button>
        <span data-role="month-label">{monthLabel}</span>
        <button type="button" onClick={goToNextMonth} aria-label="Next month" data-role="next-month">
          <ChevronRight size={18} strokeWidth={1.75} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <span key={day} data-role="weekday-label" className="text-center">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          const state = cellState(cell);
          const disabled = !cell.isAvailable && state !== 'selected';
          return (
            <button
              key={i}
              type="button"
              data-role="date-cell"
              data-state={state}
              disabled={disabled}
              aria-pressed={state === 'selected'}
              aria-label={cell.date.toDateString()}
              onClick={() => cell.isAvailable && onSelectDate(cell.date)}
              className="flex aspect-square w-full items-center justify-center"
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
