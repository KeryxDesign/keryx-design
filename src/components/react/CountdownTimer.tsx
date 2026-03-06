import { useState, useEffect } from "react";

interface Props {
  expiresAt: Date;
}

export default function CountdownTimer({ expiresAt }: Props) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(expiresAt));
    }, 60_000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (timeLeft.expired) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center">
        <p className="text-red-700 font-medium">Questo sconto è scaduto.</p>
      </div>
    );
  }

  return (
    <div className="bg-[hsl(42,87%,55%)]/10 border border-[hsl(42,87%,55%)]/20 rounded-lg px-4 py-3 text-center">
      <p className="text-sm text-[hsl(213,50%,20%)] font-medium">
        Questo sconto è valido ancora per{" "}
        <strong>
          {timeLeft.days > 0 && `${timeLeft.days} giorni, `}
          {timeLeft.hours} ore
          {timeLeft.days === 0 && `, ${timeLeft.minutes} minuti`}
        </strong>
      </p>
    </div>
  );
}

function getTimeLeft(expiresAt: Date) {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, expired: false };
}
