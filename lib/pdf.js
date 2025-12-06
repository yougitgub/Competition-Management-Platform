import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';

const certsDir = path.join(process.cwd(), 'public', 'certificates');
if (!fs.existsSync(certsDir)) fs.mkdirSync(certsDir, { recursive: true });

export async function generateCertificate({ studentName, competitionName, rank, date }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 420]); // landscape A4-ish small
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

  // Title
  page.drawText('Certificate of Achievement', {
    x: 40,
    y: height - 80,
    size: 26,
    font,
    color: rgb(0.05, 0.05, 0.05)
  });

  // Student name
  page.drawText(studentName, {
    x: 40,
    y: height - 140,
    size: 20,
    font: fontRegular,
    color: rgb(0, 0, 0)
  });

  // Details
  page.drawText(`${competitionName} — Rank: ${rank}`, {
    x: 40,
    y: height - 180,
    size: 14,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1)
  });

  page.drawText(`Date: ${date}`, {
    x: 40,
    y: height - 200,
    size: 12,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2)
  });

  const pdfBytes = await pdfDoc.save();
  const filename = `${uuidv4()}.pdf`;
  const outPath = path.join(certsDir, filename);
  fs.writeFileSync(outPath, pdfBytes);

  return `/certificates/${filename}`;
}
