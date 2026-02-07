function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
}

type PdfSection = {
  title: string
  lines: { label: string; value: string }[]
}

export function buildSimplePdf(title: string, lines: string[]) {
  const contentLines = [
    "BT",
    "/F1 18 Tf",
    "72 740 Td",
    `(${escapePdfText(title)}) Tj`,
    "/F1 12 Tf",
    "16 TL",
    ...lines.map((line) => `T* (${escapePdfText(line)}) Tj`),
    "ET",
  ].join("\n")

  const objects: string[] = []
  objects[1] = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
  objects[2] = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
  objects[3] =
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
  objects[4] =
    `4 0 obj\n<< /Length ${Buffer.byteLength(contentLines, "utf8")} >>\nstream\n${contentLines}\nendstream\nendobj\n`
  objects[5] =
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"

  let pdf = "%PDF-1.4\n"
  const offsets: number[] = [0]
  for (let i = 1; i <= 5; i += 1) {
    offsets[i] = pdf.length
    pdf += objects[i]
  }
  const xrefStart = pdf.length
  pdf += "xref\n0 6\n0000000000 65535 f \n"
  for (let i = 1; i <= 5; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`
  }
  pdf += "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n"
  pdf += `${xrefStart}\n%%EOF\n`
  return Buffer.from(pdf, "utf8")
}

export function buildReportPdf({
  title,
  subtitle,
  sections,
  footer,
}: {
  title: string
  subtitle?: string
  sections: PdfSection[]
  footer?: string
}) {
  const content: string[] = []

  // Header background
  content.push("0.93 0.97 0.99 rg")
  content.push("0 720 612 72 re f")

  // Title
  content.push("0 0 0 rg")
  content.push("BT")
  content.push("/F1 18 Tf")
  content.push("72 760 Td")
  content.push(`(${escapePdfText(title)}) Tj`)
  if (subtitle) {
    content.push("/F1 10 Tf")
    content.push("0 -18 Td")
    content.push(`(${escapePdfText(subtitle)}) Tj`)
  }
  content.push("ET")

  let y = 680
  sections.forEach((section) => {
    content.push("BT")
    content.push("/F1 12 Tf")
    content.push(`72 ${y} Td`)
    content.push(`(${escapePdfText(section.title)}) Tj`)
    content.push("ET")
    y -= 16

    section.lines.forEach((line) => {
      content.push("BT")
      content.push("/F1 10 Tf")
      content.push(`72 ${y} Td`)
      content.push(`(${escapePdfText(line.label)}) Tj`)
      content.push("ET")
      content.push("BT")
      content.push("/F1 10 Tf")
      content.push(`360 ${y} Td`)
      content.push(`(${escapePdfText(line.value)}) Tj`)
      content.push("ET")
      y -= 14
    })

    y -= 10
    content.push("0.85 0.85 0.85 RG")
    content.push(`72 ${y} m 540 ${y} l S`)
    y -= 14
  })

  if (footer) {
    content.push("0 0 0 rg")
    content.push("BT")
    content.push("/F1 9 Tf")
    content.push(`72 ${y} Td`)
    content.push(`(${escapePdfText(footer)}) Tj`)
    content.push("ET")
  }

  const contentLines = content.join("\n")

  const objects: string[] = []
  objects[1] = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
  objects[2] = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
  objects[3] =
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
  objects[4] =
    `4 0 obj\n<< /Length ${Buffer.byteLength(contentLines, "utf8")} >>\nstream\n${contentLines}\nendstream\nendobj\n`
  objects[5] =
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"

  let pdf = "%PDF-1.4\n"
  const offsets: number[] = [0]
  for (let i = 1; i <= 5; i += 1) {
    offsets[i] = pdf.length
    pdf += objects[i]
  }
  const xrefStart = pdf.length
  pdf += "xref\n0 6\n0000000000 65535 f \n"
  for (let i = 1; i <= 5; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`
  }
  pdf += "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n"
  pdf += `${xrefStart}\n%%EOF\n`
  return Buffer.from(pdf, "utf8")
}

export async function writePdfToPublic({
  filename,
  buffer,
}: {
  filename: string
  buffer: Buffer
}) {
  const { promises: fs } = await import("fs")
  const path = await import("path")
  const dir = path.join(process.cwd(), "public", "pdfs")
  await fs.mkdir(dir, { recursive: true })
  const filePath = path.join(dir, filename)
  await fs.writeFile(filePath, buffer)
  return `/pdfs/${filename}`
}
