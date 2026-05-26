import { useState, useEffect, useCallback } from 'react';

interface CountdownResult {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

export function useCountdown(targetDate: Date): CountdownResult {
  const calculateTimeLeft = useCallback(() => {
    const now = Date.now();
    const target = targetDate.getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: '00', hours: '00', minutes: '00', seconds: '00', isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      isExpired: false,
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<CountdownResult>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
}
