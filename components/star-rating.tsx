import { Star } from "lucide-react"

type StarRatingProps = {
  rating: number
  max?: number
  size?: number
}

export function StarRating({
  rating,
  max = 5,
  size = 16,
}: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className="text-amber-500 fill-amber-500"
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <Star
          size={size}
          className="text-amber-500"
          style={{
            fill: "linear-gradient(90deg, #f59e0b 50%, transparent 50%)",
          }}
        />
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className="text-muted-foreground"
        />
      ))}
    </div>
  )
}