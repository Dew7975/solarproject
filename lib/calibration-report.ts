import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

export async function generateCalibrationPDF(calibration: any) {
  const dir = path.join(process.cwd(), "public/uploads/calibrations")
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const filePath = path.join(dir, `${calibration.id}.pdf`)
  const doc = new PDFDocument({ margin: 50 })

  doc.pipe(fs.createWriteStream(filePath))

  doc.fontSize(18).text("CEB Solar System Calibration Report", {
    align: "center",
  })

  doc.moveDown()
  doc.fontSize(12)
  doc.text(`Application ID: ${calibration.applicationId}`)
  doc.text(`Completed Date: ${new Date(calibration.completedAt).toDateString()}`)

  doc.moveDown()
  doc.text("Checklist:")
  Object.entries(calibration.checklist || {}).forEach(([k, v]) => {
    doc.text(`• ${k}: ${v ? "OK" : "NOT OK"}`)
  })

  doc.moveDown()
  doc.text("Readings:")
  doc.text(JSON.stringify(calibration.readings || {}, null, 2))

  doc.moveDown()
  doc.text("Recommendations:")
  doc.text(calibration.recommendations || "None")

  doc.moveDown(2)
  doc.text("Officer Signature: ________________________")

  doc.end()

  return `/uploads/calibrations/${calibration.id}.pdf`
}
