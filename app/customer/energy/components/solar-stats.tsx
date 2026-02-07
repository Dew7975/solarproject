"use client"

import { useLanguage } from "@/context/LanguageContext"

export default function SolarStats({ data }: any) {
  const { t } = useLanguage()
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat label={t("currentPowerKw")} value={data.currentPowerKW} />
      <Stat label={t("dailyEnergyKwh")} value={data.dailyEnergyKWh} />
      <Stat label={t("monthlyEnergyKwh")} value={data.monthlyEnergyKWh} />
      <Stat label={t("co2Prevented")} value={data.co2PreventedKg.toFixed(2)} />
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="p-4 rounded-lg border bg-white">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
