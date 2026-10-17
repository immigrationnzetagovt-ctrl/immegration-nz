const PDFDocument = require('pdfkit');

/**
 * Generate a clean, professional educational PDF document using PDFKit.
 * Strictly displays "DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT" throughout.
 * Does not use government seals or official state insignia.
 */
const generateApplicationPdf = (application, outputStream) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    info: {
      Title: `VisaPath Educational Demo - ${application.applicationRef}`,
      Author: 'VisaPath Demo Portal',
      Subject: 'Educational Immigration Workflow Demonstration',
      Keywords: 'educational, demo, fictional, not-official',
    },
  });

  doc.pipe(outputStream);

  // 1. Prominent Top Warning Banner
  doc
    .rect(40, 40, 515, 32)
    .fill('#FEE2E2'); // Soft red/coral background

  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .fillColor('#991B1B')
    .text(
      'DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT',
      40,
      48,
      { width: 515, align: 'center' }
    );

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .fillColor('#B91C1C')
    .text(
      'FOR EDUCATIONAL SIMULATION PURPOSES ONLY • FICTIONAL SAMPLE DATA • NOT GOVERNMENT ISSUED',
      40,
      60,
      { width: 515, align: 'center' }
    );

  // 2. Portal Header
  doc
    .rect(40, 85, 515, 60)
    .fill('#0F172A'); // Deep executive navy

  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .fillColor('#FFFFFF')
    .text('VisaPath Demo Portal', 60, 98);

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#94A3B8')
    .text('Educational Immigration Application Workflow Simulation', 60, 122);

  // Reference Badge on Right
  doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#38BDF8')
    .text('APPLICATION REFERENCE', 350, 98, { width: 185, align: 'right' });

  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .fillColor('#FFFFFF')
    .text(application.applicationRef, 350, 114, { width: 185, align: 'right' });

  // 3. Status & Metadata Summary Bar
  const formattedCreatedDate = new Date(application.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  doc
    .rect(40, 155, 515, 30)
    .fill('#F1F5F9');

  doc
    .fontSize(9)
    .font('Helvetica-Bold')
    .fillColor('#334155')
    .text(`STATUS: ${application.status.toUpperCase()}`, 55, 165);

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#64748B')
    .text(`Submission Date: ${formattedCreatedDate}`, 250, 165);

  doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#DC2626')
    .text('SIMULATED RECORD', 400, 165, { width: 140, align: 'right' });

  // 4. Section: Applicant Information
  let currentY = 200;

  const renderSectionHeader = (title, y) => {
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#1E293B')
      .text(title.toUpperCase(), 40, y);

    doc
      .moveTo(40, y + 16)
      .lineTo(555, y + 16)
      .lineWidth(1)
      .strokeColor('#CBD5E1')
      .stroke();
  };

  renderSectionHeader('1. Applicant Information', currentY);
  currentY += 26;

  const renderDataRow = (label1, val1, label2, val2, y) => {
    // Column 1
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#64748B')
      .text(label1, 50, y);
    doc
      .fontSize(9.5)
      .font('Helvetica-Bold')
      .fillColor('#0F172A')
      .text(val1 || 'N/A', 50, y + 11);

    // Column 2
    if (label2) {
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#64748B')
        .text(label2, 300, y);
      doc
        .fontSize(9.5)
        .font('Helvetica-Bold')
        .fillColor('#0F172A')
        .text(val2 || 'N/A', 300, y + 11);
    }
  };

  const dobStr = new Date(application.dateOfBirth).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  renderDataRow('Full Display Name', application.displayName, 'Declared Nationality', application.nationality, currentY);
  currentY += 32;

  renderDataRow('Date of Birth', dobStr, 'Gender', application.gender, currentY);
  currentY += 32;

  renderDataRow('Fictional Passport Number', application.passportNumber, 'Passport Status', 'Educational Sample (Not Verified)', currentY);
  currentY += 45;

  // 5. Section: Visa & Travel Parameters
  renderSectionHeader('2. Travel & Visa Parameters', currentY);
  currentY += 26;

  const travelStartStr = new Date(application.travelStartDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const travelEndStr = new Date(application.travelEndDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  renderDataRow('Requested Visa Type', application.visaType, 'Entry Classification', application.entryType, currentY);
  currentY += 32;

  renderDataRow('Simulated Travel Start', travelStartStr, 'Simulated Travel End', travelEndStr, currentY);
  currentY += 45;

  // 6. Section: Demonstration Conditions & Disclaimers
  renderSectionHeader('3. Educational Simulation Conditions & Notice', currentY);
  currentY += 26;

  doc
    .fontSize(8)
    .font('Helvetica')
    .fillColor('#64748B')
    .text('Demonstration Conditions:', 50, currentY);

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#1E293B')
    .text(application.conditions || 'None specified.', 50, currentY + 12, {
      width: 480,
      lineGap: 3,
    });

  currentY += 45;

  // Boxed Educational Notice
  doc
    .rect(40, currentY, 515, 65)
    .fillAndStroke('#F8FAFC', '#E2E8F0');

  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .fillColor('#0F172A')
    .text('IMPORTANT EDUCATIONAL NOTICE:', 55, currentY + 10);

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .fillColor('#475569')
    .text(
      'This document is generated by VisaPath Demo Portal for academic, architectural, and educational testing purposes only. ' +
      'It DOES NOT confer any legal right, visa status, entry permit, or official governmental authorization in any jurisdiction. ' +
      'All passport information, references, and statuses are fictional samples. Do not present this document to border enforcement or official authorities.',
      55,
      currentY + 23,
      { width: 485, lineGap: 2.5 }
    );

  // 7. Footer Watermark / Disclaimer
  doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#94A3B8')
    .text(
      'DEMO — NOT AN OFFICIAL IMMIGRATION DOCUMENT • Generated via VisaPath Demo Portal',
      40,
      760,
      { width: 515, align: 'center' }
    );

  doc.end();
};

module.exports = {
  generateApplicationPdf,
};
