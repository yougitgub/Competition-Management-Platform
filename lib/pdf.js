import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';

const certsDir = path.join(process.cwd(), 'public', 'certificates');
if (!fs.existsSync(certsDir)) fs.mkdirSync(certsDir, { recursive: true });

export async function generateCertificate({ studentName, competitionName, rank, date }) {
  // Create document with custom size [595, 420] (matches previous size)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [595, 420]
  });

  // Background (White)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 595, 420, 'F');

  // Title
  // Previous: y = height - 80 => 80 from top
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(13, 13, 13);
  doc.text('Certificate of Achievement', 40, 80);

  // Student name
  // Previous: y = height - 140 => 140 from top
  doc.setFont("helvetica", "normal");
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(studentName, 40, 140);

  // Details
  // Previous: y = height - 180 => 180 from top
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 26);
  doc.text(`${competitionName} — Rank: ${rank}`, 40, 180);

  // Date
  // Previous: y = height - 200 => 200 from top
  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.text(`Date: ${date}`, 40, 200);

  // Output to buffer and save
  const pdfArrayBuffer = doc.output('arraybuffer');
  const buffer = Buffer.from(pdfArrayBuffer);

  const filename = `${uuidv4()}.pdf`;
  const outPath = path.join(certsDir, filename);
  fs.writeFileSync(outPath, buffer);

  return `/certificates/${filename}`;
}
