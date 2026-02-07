"use client"

import { Star } from "lucide-react"

type StarInputProps = {
  value: number
  onChange: (value: number) => void
  size?: number
}

export function StarInput({ value, onChange, size = 32 }: StarInputProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            size={size}
            className={
              star <= value
                ? "text-amber-500 fill-amber-500"
                : "text-muted-foreground"
            }
          />
        </button>
      ))}
    </div>
  )
}