import { useState, useEffect } from 'react';

interface CountdownTime {
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

export function useFedExCountdown(targetDateTime?: string | Date): CountdownTime {
  const [countdown, setCountdown] = useState<CountdownTime>({
    hours: '00',
    minutes: '00',
    seconds: '00',
    isExpired: false
  });

  useEffect(() => {
    if (!targetDateTime) {
      return;
    }

    const targetDate = typeof targetDateTime === 'string'
      ? new Date(targetDateTime)
      : targetDateTime;

    if (isNaN(targetDate.getTime())) {
      console.warn('Invalid date provided to useFedExCountdown:', targetDateTime);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const timeDifference = targetDate.getTime() - now.getTime();

      if (timeDifference <= 0) {
        setCountdown({
          hours: '00',
          minutes: '00',
          seconds: '00',
          isExpired: true
        });
        return;
      }

      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setCountdown({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        isExpired: false
      });
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDateTime]);

  return countdown;
}

// Helper function to parse FedEx API response for delivery time
export function parseFedExDeliveryTime(fedExData: any): string | null {
  try {
    // Check for estimatedDeliveryTimeWindow
    if (fedExData?.completeTrackResults?.[0]?.trackResults?.[0]?.estimatedDeliveryTimeWindow) {
      const timeWindow = fedExData.completeTrackResults[0].trackResults[0].estimatedDeliveryTimeWindow;
      if (timeWindow.estimatedDeliveryDateTime) {
        return timeWindow.estimatedDeliveryDateTime;
      }
    }

    // Check for dateAndTimes array
    if (fedExData?.completeTrackResults?.[0]?.trackResults?.[0]?.dateAndTimes) {
      const dateAndTimes = fedExData.completeTrackResults[0].trackResults[0].dateAndTimes;
      const estimatedDelivery = dateAndTimes.find((item: any) =>
        item.type === 'ESTIMATED_DELIVERY' || item.type === 'ACTUAL_DELIVERY'
      );

      if (estimatedDelivery?.dateTime) {
        return estimatedDelivery.dateTime;
      }
    }

    return null;
  } catch (error) {
    console.warn('Error parsing FedEx delivery time:', error);
    return null;
  }
}
