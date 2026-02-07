"use client";

import { useEffect, useMemo, useState } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getParts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds, total };
}

export default function Countdown({
  expiresAt,
  className = "",
  onExpire,
  variant = "full",
  showLabel = true,
  colorClass,
}: {
  expiresAt: string | Date;
  className?: string;
  onExpire?: () => void;
  variant?: "full" | "short";
  showLabel?: boolean;
  colorClass?: string; // e.g. "text-amber-500"
}) {
  const targetMs = useMemo(() => new Date(expiresAt).getTime(), [expiresAt]);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const intervalMs = variant === "short" ? 60_000 : 1_000;
    const t = setInterval(() => setNowMs(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [variant]);

  const remainingMs = targetMs - nowMs;
  const expired = remainingMs <= 0;

  const { days, hours, minutes, seconds, total } = getParts(remainingMs);

  useEffect(() => {
    if (total === 0 && onExpire) onExpire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  let text = "";
  if (variant === "short") {
    if (expired) text = "Expired";
    else if (days > 0) text = `${days}d ${hours}h ${minutes}m`;
    else {
      const totalHours = Math.floor((targetMs - nowMs) / (1000 * 60 * 60));
      text = `${Math.max(0, totalHours)}h ${minutes}m`;
    }
  } else {
    text = `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return (
    <div className={className}>
      <div
        className={[
          "font-mono font-bold tracking-wider",
          expired ? "text-red-600" : colorClass ?? "text-emerald-600",
        ].join(" ")}
      >
        {text}
      </div>

      {showLabel && (
        <div className="text-xs text-muted-foreground">
          {expired ? "Expired" : "Time remaining"}
        </div>
      )}
    </div>
  );
}