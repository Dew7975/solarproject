// lib/services/fusion-solar.service.ts

export type FusionSolarLiveData = {
  currentPower: number
  todayEnergy: number
  monthlyEnergy: number
  inverterTemp?: number
  status: "Online" | "Offline"
}

export async function getFusionSolarLiveData(
  deviceId: string
): Promise<FusionSolarLiveData> {
  // 🔴 MOCK for now (replace with real API later)
  return {
    currentPower: Math.random() * 5,
    todayEnergy: 15 + Math.random() * 10,
    monthlyEnergy: 300 + Math.random() * 100,
    inverterTemp: 35 + Math.random() * 10,
    status: "Online",
  }
}
