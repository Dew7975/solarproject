import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const FEES_PATH = path.join(DATA_DIR, "fees.json")

type FeeConfig = {
  siteVisitFee: number
}

const DEFAULT_FEES: FeeConfig = {
  siteVisitFee: 1200,
}

async function ensureFeesFile() {
  try {
    await fs.access(FEES_PATH)
    return
  } catch {}

  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(FEES_PATH, JSON.stringify(DEFAULT_FEES, null, 2), "utf8")
}

export async function getFees(): Promise<FeeConfig> {
  await ensureFeesFile()
  const content = await fs.readFile(FEES_PATH, "utf8")
  return JSON.parse(content) as FeeConfig
}

export async function updateFees(update: Partial<FeeConfig>): Promise<FeeConfig> {
  const current = await getFees()
  const next = { ...current, ...update }
  await fs.writeFile(FEES_PATH, JSON.stringify(next, null, 2), "utf8")
  return next
}
