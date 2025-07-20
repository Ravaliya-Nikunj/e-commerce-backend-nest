import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class DateUtil {
  /**
   * Converts a date string to epoch time (milliseconds)
   */
  getEpochFromDate = (date: string | Date): number => {
    return moment(new Date(date), 'D/M/YYYY H:mm').valueOf();
  };

  /**
   * Calculates the time difference between two dates and returns hours, minutes, and seconds
   */
  getDifferenceOfTwoDate = (
    startDate: string | number,
    endDate?: string | number | Date,
  ): { hours: number; min: number; seconds: number } => {
    const start = moment(startDate); // ✅ Don't parseInt
    const end = endDate ? moment(endDate) : moment();

    if (!start.isValid() || !end.isValid()) {
      throw new Error('Invalid date input provided');
    }

    const duration = moment.duration(end.diff(start));
    const hours = duration.days() * 24 + duration.hours();
    const min = duration.minutes();
    const seconds = duration.seconds();

    return { hours, min, seconds };
  };

  /**
   * Formats a date string or Date object to DD-MM-YYYY
   */
  getDateformat = (date: string | Date): string => {
    return moment(date).format('DD-MM-YYYY');
  };

  /**
   * Filters out past dates from a nested object structure
   */
  filterPastDates = (
    data: Record<string, { day: string | Date }[]>,
  ): Record<string, { day: string | Date }[]> => {
    const currentDate = new Date();
    const result: Record<string, { day: string | Date }[]> = {};

    for (const [month, dates] of Object.entries(data)) {
      const filteredDates = dates.filter(
        (dateObj) => new Date(dateObj.day) >= currentDate,
      );

      if (filteredDates.length > 0) {
        result[month] = filteredDates;
      }
    }

    return result;
  };
}
