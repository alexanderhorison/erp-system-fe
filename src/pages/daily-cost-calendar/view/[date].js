import DateFormatError from 'src/views/daily-cost-calendar/DateFormatError';
// Next.js Page that handles /daily-cost-calendar/add/[date]
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import DailyCostViewOnly from 'src/views/daily-cost-calendar/DailyCostViewOnly';

dayjs.locale('id');

export default function ViewDailyCost() {
  const router = useRouter();
  const { date } = router.query;
  const [selectedDate, setSelectedDate] = useState(null);
  const [isValidDate, setIsValidDate] = useState(true);

  useEffect(() => {
    if (date) {
      try {
        // Parse the date from the URL (format: dd-mm-yyyy)
        const parts = date.split('-');
        if (parts.length !== 3) {
          setIsValidDate(false);
          return;
        }

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);

        const parsedDate = dayjs(`${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);

        if (!parsedDate.isValid()) {
          setIsValidDate(false);
          return;
        }

        setSelectedDate(parsedDate.format('YYYY-MM-DD'));
        setIsValidDate(true);
      } catch (error) {
        console.error('Error parsing date:', error);
        setIsValidDate(false);
      }
    }
  }, [date]);

  if (!date) {
    return <div>Loading...</div>;
  }

  if (!isValidDate) {
    return <DateFormatError format="DD-MM-YYYY" />;
  }

  return selectedDate ? (
    <DailyCostViewOnly selectedDate={selectedDate} />
  ) : (
    <div>Loading...</div>
  );
}