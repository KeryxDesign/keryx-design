import { useState, useEffect } from "react";

const STORAGE_KEY = "keryx_promo_start";
const PROMO_HOURS = 48;

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function getTimeLeft(startTime: number): TimeLeft {
  const expiresAt = startTime + PROMO_HOURS * 60 * 60 * 1000;
  const diff = expiresAt - Date.now();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, expired: false };
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono font-bold text-xl md:text-2xl tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-widest opacity-70 mt-1">
        {label}
      </span>
    </div>
  );
}

export default function PromoCountdown() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    let stored = localStorage.getItem(STORAGE_KEY);
    let t: number;
    if (stored) {
      t = parseInt(stored, 10);
    } else {
      t = Date.now();
      localStorage.setItem(STORAGE_KEY, String(t));
    }
    setStartTime(t);
    setTimeLeft(getTimeLeft(t));
  }, []);

  useEffect(() => {
    if (startTime === null) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(startTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (!timeLeft) return null;
  if (timeLeft.expired) return null;

  return (
    <div className="flex items-center justify-center gap-1 text-white">
      <span className="text-sm font-medium mr-2 hidden sm:inline">Offerta scade tra</span>
      <span className="text-sm font-medium mr-2 sm:hidden">Scade tra</span>
      <div className="flex items-center gap-2">
        <Digit value={timeLeft.hours} label="ore" />
        <span className="font-bold text-xl opacity-60">:</span>
        <Digit value={timeLeft.minutes} label="min" />
        <span className="font-bold text-xl opacity-60">:</span>
        <Digit value={timeLeft.seconds} label="sec" />
      </div>
    </div>
  );
}
