import Stripe from "stripe"

let stripeClient: Stripe | null = null

export function getStripe() {
  if (stripeClient) return stripeClient
  const mode = process.env.STRIPE_MODE?.toLowerCase()
  const sandboxKey = process.env.STRIPE_SANDBOX_SECRET_KEY
  const isSandbox = mode === "sandbox" || mode === "test"
  const secret = isSandbox
    ? sandboxKey || process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY
  if (!secret) {
    throw new Error(
      isSandbox
        ? "STRIPE_SANDBOX_SECRET_KEY is not set"
        : "STRIPE_SECRET_KEY is not set",
    )
  }
  stripeClient = new Stripe(secret, { apiVersion: "2024-06-20" })
  return stripeClient
}
