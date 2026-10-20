const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a pixel-perfect 3-page New Zealand Immigration eVisa / Verification PDF document
 * matching official INZ records and the provided screenshots.
 */
const generateApplicationPdf = (application, outputStream) => {
  const doc = new PDFDocument({
    size: 'A4', // 595.28 x 841.89 points
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    autoFirstPage: false,
    bufferPages: true,
    info: {
      Title: `INZ_eVisa_${application.applicationRef || 'Record'}`,
      Author: 'Immigration New Zealand',
      Subject: 'Visa Verification Service Enquiry Record',
      Keywords: 'New Zealand Immigration, eVisa, Visa Verification',
    },
  });

  doc.pipe(outputStream);

  // Asset paths with fallbacks
  const serverAssetsDir = path.join(__dirname, '../assets');
  const clientAssetsDir = path.join(__dirname, '../../client/src/assets');

  const getAssetPath = (fileName) => {
    const sPath = path.join(serverAssetsDir, fileName);
    if (fs.existsSync(sPath)) return sPath;
    const cPath = path.join(clientAssetsDir, fileName);
    if (fs.existsSync(cPath)) return cPath;
    return sPath;
  };

  const logoPath = getAssetPath('immegration.png');
  const mbiePath = getAssetPath('mbie_footer_clean.png');
  const nzgovtPath = getAssetPath('nzgovt_footer_clean.png');

  // Helpers
  const pad = (n) => String(n).padStart(2, '0');
  const monthsHyphen = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatDateYMD = (val) => {
    if (!val) return '2026-09-09';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '2026-09-09';
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const formatDateSlash = (val) => {
    if (!val) return '09/09/2026';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '09/09/2026';
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  const formatDateHyphen = (val) => {
    if (!val) return '09-September-2026';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '09-September-2026';
    return `${pad(d.getDate())}-${monthsHyphen[d.getMonth()]}-${d.getFullYear()}`;
  };

  const formatDateDayMonthYear = (val) => {
    if (!val) return '09 September 2026';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '09 September 2026';
    return `${pad(d.getDate())} ${monthsHyphen[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Deterministic 8-digit client number
  const getClientNumber = (app) => {
    if (app.clientNumber) return String(app.clientNumber);
    const seed = String(app._id || app.applicationRef || app.displayName || 'client');
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
    }
    return String((Math.abs(hash) % 90000000) + 10000000);
  };

  const clientNum = getClientNumber(application);
  const appRef = application.applicationRef || 'VV00211932';
  const fullName = (application.displayName || 'Manpreet Singh').trim();
  const fullNameUpper = fullName.toUpperCase();
  const nationality = application.nationality || 'Indian';
  const passportNumber = (application.passportNumber || 'V9918043').trim();
  const rawGender = (application.gender || 'Male').trim();
  const genderFull = rawGender.charAt(0).toUpperCase() + rawGender.slice(1).toLowerCase();
  const genderShort = genderFull.charAt(0);
  const visaType = application.visaType || 'Visitor';
  const visaTypeCap = visaType.charAt(0).toUpperCase() + visaType.slice(1).toLowerCase();
  const entryType = application.entryType || 'Multiple entry';
  const isMultiple = !entryType.toLowerCase().includes('single');
  const entryTypeDisplay = isMultiple ? 'Multiple' : 'Single';

  const startDate = application.travelStartDate ? new Date(application.travelStartDate) : new Date();
  const endDate = application.travelEndDate
    ? new Date(application.travelEndDate)
    : new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);
  const dob = application.dateOfBirth ? new Date(application.dateOfBirth) : new Date('2001-12-03');

  // First entry before date
  const firstEntryBeforeDate = new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000);

  // Enquiry Date (formatted DD/MM/YYYY)
  const enquiryDateSlash = formatDateSlash(application.createdAt || new Date());

  const linkBlue = '#0050B3';

  // Helper to draw macron "ā" without font corruption
  const drawNgaMihi = (x, y) => {
    doc.fontSize(8.5).font('Helvetica').fillColor('#000000').text('Nga mihi', x, y);
    // Draw the macron bar over the 'a'
    doc
      .lineWidth(0.65)
      .strokeColor('#000000')
      .moveTo(x + 12.8, y + 1.2)
      .lineTo(x + 16.8, y + 1.2)
      .stroke();
  };

  // ==========================================
  // PAGE 1: VISA VERIFICATION SERVICE ENQUIRY RECORD
  // ==========================================
  doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });

  // 1. Logo at Top Center
  if (fs.existsSync(logoPath)) {
    const logoWidth = 145;
    const logoX = (595.28 - logoWidth) / 2;
    doc.image(logoPath, logoX, 40, { width: logoWidth });
  }

  // 2. Title & Subtitle
  doc
    .fontSize(10.5)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('VISA VERIFICATION SERVICE ENQUIRY RECORD', 0, 92, {
      width: 595.28,
      align: 'center',
    });

  doc
    .fontSize(8.5)
    .font('Helvetica')
    .fillColor('#000000')
    .text(
      "This document shows the results of an enquiry to Immigration New Zealand's Visa Verification Service",
      0,
      109,
      { width: 595.28, align: 'center' }
    );

  // 3. Enquiry Dates Line (Accurately Centered)
  const dateLineY = 129;
  doc.fontSize(8.5).font('Helvetica-Bold');
  const part1W = doc.widthOfString('Date of enquiry: ');
  doc.font('Helvetica');
  const part2W = doc.widthOfString(`${enquiryDateSlash}     `);
  doc.font('Helvetica-Bold');
  const part3W = doc.widthOfString('Visa information valid at: ');
  doc.font('Helvetica');
  const part4W = doc.widthOfString(enquiryDateSlash);

  const totalDateW = part1W + part2W + part3W + part4W;
  const startDateLineX = (595.28 - totalDateW) / 2;

  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text('Date of enquiry: ', startDateLineX, dateLineY, { continued: true })
    .font('Helvetica')
    .text(`${enquiryDateSlash}     `, { continued: true })
    .font('Helvetica-Bold')
    .text('Visa information valid at: ', { continued: true })
    .font('Helvetica')
    .text(enquiryDateSlash);

  // 4. Main Table
  const tableX = 42;
  const tableWidth = 511.28;
  const col1W = 168;
  const col2W = 165;
  const col3W = tableWidth - col1W - col2W; // 178.28

  const col1X = tableX;
  const col2X = tableX + col1W;
  const col3X = col2X + col2W;

  const rowH = 19.5;
  let currentY = 146;

  const drawRowBorder = (y, height) => {
    doc
      .lineWidth(0.6)
      .strokeColor('#000000')
      .rect(tableX, y, tableWidth, height)
      .stroke();
    // vertical dividers
    doc.moveTo(col2X, y).lineTo(col2X, y + height).stroke();
    doc.moveTo(col3X, y).lineTo(col3X, y + height).stroke();
  };

  const renderCell = (x, y, w, label, val) => {
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fillColor('#000000')
      .text(label, x + 5, y + 5, { continued: true })
      .font('Helvetica')
      .text(' ' + (val || ''));
  };

  // Row 1
  drawRowBorder(currentY, rowH);
  renderCell(col1X, currentY, col1W, 'Family, First Name:', fullNameUpper);
  renderCell(col2X, currentY, col2W, 'Passport Nationality:', nationality);
  renderCell(col3X, currentY, col3W, 'Passport Number:', passportNumber);
  currentY += rowH;

  // Row 2
  drawRowBorder(currentY, rowH);
  renderCell(col1X, currentY, col1W, 'Date of Birth:', formatDateYMD(dob));
  renderCell(col2X, currentY, col2W, 'Gender:', genderShort);
  renderCell(col3X, currentY, col3W, 'INZ Client Number:', clientNum);
  currentY += rowH;

  // Row 3
  drawRowBorder(currentY, rowH);
  renderCell(col1X, currentY, col1W, 'Visa Type:', visaTypeCap);
  renderCell(col2X, currentY, col2W, 'Visa Expiry Date:', formatDateYMD(endDate));
  renderCell(col3X, currentY, col3W, 'Visa Start Date:', formatDateYMD(startDate));
  currentY += rowH;

  // Row 4
  drawRowBorder(currentY, rowH);
  renderCell(col1X, currentY, col1W, 'First Entry Before:', formatDateYMD(firstEntryBeforeDate));
  renderCell(col2X, currentY, col2W, 'Number of Entries:', entryTypeDisplay);
  renderCell(col3X, currentY, col3W, 'Expiry Date Travel:', formatDateYMD(endDate));
  currentY += rowH;

  // Row 5: Visa Conditions Box
  let conditionsText = '';
  if (visaTypeCap.toLowerCase() === 'work') {
    conditionsText =
      'Financial support evidence not required. May not be placed in a triangular employment arrangement with a controlling third part. ' +
      'Must be paid at or above $28.50 per hour. Must provide evidence of remuneration if requested. Return/onward ticket not required. ' +
      'subject to grant of entry permission. The holder may only work as Store Helper in Auckland for KIWI FARMING ENTERPRISES LIMITED. ' +
      `The last date you may re-enter New Zealand is 36 months after the date of your first arrival in New Zealand. The start date of this visa is ${formatDateDayMonthYear(startDate)}. ` +
      `This visa allows ${isMultiple ? 'multiple entry - you can enter New Zealand multiple times' : 'single entry - you can enter New Zealand once'} using this visa. ` +
      `This visa expires 36 month(s) after the date of your first arrival in New Zealand. You must arrive in New Zealand before ${formatDateDayMonthYear(firstEntryBeforeDate)}. You must leave before visa expires.`;
  } else {
    // Visitor / Business / Student
    conditionsText =
      `The start date of your visa is: ${formatDateHyphen(startDate)}. ` +
      `This visa allows ${isMultiple ? 'Multiple entry, you can enter New Zealand for multiple times' : 'Single entry, you can enter New Zealand once'}. ` +
      `Each entry should not be more than 3 months of stay in New Zealand. ` +
      `The last date you may travel and enter/re-enter New Zealand is: ${formatDateHyphen(endDate)}. ` +
      `This visa expires 3 month(s) after the date of each arrival in New Zealand. ` +
      `Stay subject to grant of entry permission. ` +
      `You must leave before visa expiry or face deportation. ` +
      `The holder shall not study for more than 3 months in every 12 month period in NZ. ` +
      `The holder of this visa must comply with any order made under section 70 of the Health Act 1956 and listed in schedule 2 of the COVID-19 Public Health Response Act 2020. ` +
      `The holder of this visa must comply with any order made under section 11 of the COVID-19 Public Health Response Act 2020. ` +
      `The holder of this visa must comply with any instruction from a Medical Officer of Health which relates to a notifiable or quarantinable disease.`;
  }

  doc.fontSize(7.3).font('Helvetica');
  const textHeight = doc.heightOfString(conditionsText, {
    width: tableWidth - 10,
    lineGap: 1.5,
  });
  const row5H = Math.max(82, textHeight + 22);

  doc
    .lineWidth(0.6)
    .strokeColor('#000000')
    .rect(tableX, currentY, tableWidth, row5H)
    .stroke();

  doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('Visa Conditions:', tableX + 5, currentY + 5);

  doc
    .fontSize(7.3)
    .font('Helvetica')
    .fillColor('#000000')
    .text(conditionsText, tableX + 5, currentY + 18, {
      width: tableWidth - 10,
      lineGap: 1.5,
    });

  currentY += row5H + 15;

  // 5. Sections Below Table on Page 1
  // Section 1: About Visa Verification Service enquiries
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('About Visa Verification Service enquiries', 0, currentY, {
      width: 595.28,
      align: 'center',
    });
  currentY += 13;

  const aboutText =
    'A Visa Verification Service Enquiry Record shows details of the visa record held by Immigration New Zealand (INZ) for a particular visa holder. All non-New Zealand citizens must hold a visa to be in New Zealand. All visas are held in INZ’s electronic records. Some visa holders receive a visa label in their passport, and some visa holders have eVisas (label-less visas). The Visa Verification Service allows service providers in New Zealand to verify a person’s visa status where the person does not have a visa label in their passport.';
  doc
    .fontSize(7.3)
    .font('Helvetica')
    .fillColor('#000000')
    .text(aboutText, tableX, currentY, { width: tableWidth, lineGap: 1.5 });
  currentY += doc.heightOfString(aboutText, { width: tableWidth, lineGap: 1.5 }) + 10;

  // Section 2: Identity assurance
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('Identity assurance', tableX, currentY);
  currentY += 12;

  const idText =
    'A Visa Verification Service Enquiry Record confirms that the details of the visa you have been presented with match the details of a visa in INZ’s electronic records. You should also sight a passport or other appropriate identity document to ensure that the biographic details in the identity document match the biographic details in the visa, and that the photograph in the identity document matches the person presenting this information.';
  doc
    .fontSize(7.3)
    .font('Helvetica')
    .fillColor('#000000')
    .text(idText, tableX, currentY, { width: tableWidth, lineGap: 1.5 });
  currentY += doc.heightOfString(idText, { width: tableWidth, lineGap: 1.5 }) + 10;

  // Section 3: Validity
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('Validity', tableX, currentY);
  currentY += 12;

  const valText =
    'Visa Verification Service Enquiry Records are current on the date conducted, and the information provided is valid at the date stated on the Enquiry Record. Visa information may change. Where a person is not yet in New Zealand, their visa may be subject to the grant of entry permission at the New Zealand border.';
  doc
    .fontSize(7.3)
    .font('Helvetica')
    .fillColor('#000000')
    .text(valText, tableX, currentY, { width: tableWidth, lineGap: 1.5 });
  currentY += doc.heightOfString(valText, { width: tableWidth, lineGap: 1.5 }) + 10;

  // Section 4: Privacy
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('Privacy', tableX, currentY);
  currentY += 12;

  const privText =
    'A Visa Verification Service enquiry must only be performed with the consent of the visa holder. Please treat this document and the personal information it contains in accordance with the Privacy Act 2020. You must only use the information for a lawful purpose; only retain the information as long as required for that lawful purpose; only share the information if authorised by the visa holder or otherwise permitted by law; and if storing, sharing or destroying any electronic or hard copy version of this information, do so in a secure manner. Any complaints can be made using the Ministry of Business, Innovation and Employment’s complaints process which is available at www.mbie.govt.nz.';
  doc
    .fontSize(7.3)
    .font('Helvetica')
    .fillColor('#000000')
    .text(privText, tableX, currentY, { width: tableWidth, lineGap: 1.5 });
  currentY += doc.heightOfString(privText, { width: tableWidth, lineGap: 1.5 }) + 10;

  // Section 5: For more assistance
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('For more assistance', tableX, currentY);
  currentY += 12;

  const assistText =
    'The INZ website includes a Visa Verification Service User Guide, which explains the details on a visa record. You may also contact the Immigration Contact Centre on (09) 969-1458 from within the Auckland toll free calling area, (04) 910-9916 from Wellington or 0508 967 569 from the rest of New Zealand.';
  doc
    .fontSize(7.3)
    .font('Helvetica')
    .fillColor('#000000')
    .text(assistText, tableX, currentY, { width: tableWidth, lineGap: 1.5 });

  // ==========================================
  // PAGE 2: APPROVAL LETTER & VISA CONDITIONS
  // ==========================================
  doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });

  // Top Left text
  let p2Y = 40;
  doc
    .fontSize(7.5)
    .font('Helvetica')
    .fillColor('#000000')
    .text(
      'If this application has been made through a Licensed immigration Adviser, lawyer or other representative who is exempt from licensing, they must give this entire document to the applicant.',
      tableX,
      p2Y,
      { width: 335, lineGap: 1.5 }
    );
  p2Y += 38;

  // Application number / Client number / Date
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text('Application number: ', tableX, p2Y, { continued: true })
    .font('Helvetica')
    .text(appRef);
  p2Y += 14;

  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text('Client number: ', tableX, p2Y, { continued: true })
    .font('Helvetica')
    .text(clientNum);
  p2Y += 14;

  doc
    .fontSize(8.5)
    .font('Helvetica')
    .text(formatDateHyphen(startDate), tableX, p2Y);
  p2Y += 32;

  // Salutation
  doc
    .fontSize(9)
    .font('Helvetica')
    .text(`Kia ora ${fullName}`, tableX, p2Y);
  p2Y += 38;

  // Top Right Logo (Right aligned to table edge: 42 + 511.28 = 553.28)
  if (fs.existsSync(logoPath)) {
    const logoW2 = 135;
    const logoX2 = 553.28 - logoW2;
    doc.image(logoPath, logoX2, 42, { width: logoW2 });
  }

  // Heading: Visitor visa application approved
  doc
    .fontSize(9.5)
    .font('Helvetica-Bold')
    .text(`${visaTypeCap} visa application approved`, tableX, p2Y);
  p2Y += 14;

  const subCatText =
    visaTypeCap.toLowerCase() === 'visitor'
      ? ' - Business events (participation).'
      : '.';
  doc
    .fontSize(8.5)
    .font('Helvetica')
    .text(
      `We have approved your application for a New Zealand ${visaTypeCap} Visa${subCatText}`,
      tableX,
      p2Y
    );
  p2Y += 30;

  // Centered Visa Details title
  doc
    .fontSize(9)
    .font('Helvetica-Bold')
    .text(`${visaTypeCap} Visa details`, 0, p2Y, {
      width: 595.28,
      align: 'center',
    });
  p2Y += 26;

  // Applicant details section
  doc
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('Applicant details', tableX, p2Y);
  p2Y += 16;

  // Two columns for applicant details
  const colLeftX = tableX;
  const colRightX = 295;

  // Row 1
  doc.fontSize(8.5).font('Helvetica').text(`Name: ${fullName}`, colLeftX, p2Y);
  doc.fontSize(8.5).font('Helvetica').text(`Date of birth: ${formatDateHyphen(dob)}`, colRightX, p2Y);
  p2Y += 17;

  // Row 2
  doc.fontSize(8.5).font('Helvetica').text(`Gender: ${genderFull}`, colLeftX, p2Y);
  doc.fontSize(8.5).font('Helvetica').text(`Passport number: ${passportNumber}`, colRightX, p2Y);
  p2Y += 17;

  // Row 3
  doc.fontSize(8.5).font('Helvetica').text(`Nationality: ${nationality}`, colLeftX, p2Y);
  doc.fontSize(8.5).font('Helvetica').text(`Client number: ${clientNum}`, colRightX, p2Y);
  p2Y += 32;

  // Visa conditions heading
  doc
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('Visa conditions', tableX, p2Y);
  p2Y += 18;

  // List of conditions
  const conditionsList = [
    `The start date of your visa is: ${formatDateHyphen(startDate)}`,
    `This visa allows ${isMultiple ? 'Multiple entry, you can enter New Zealand for multiple times.' : 'Single entry, you can enter New Zealand once.'}`,
    'Each entry should not be more than 3 months of stay in New Zealand.',
    `The last date you may travel and enter/re-enter New Zealand is: ${formatDateHyphen(endDate)}`,
    'This visa expires 3 month(s) after the date of each arrival in New Zealand.',
    'Stay subject to grant of entry permission.',
    'You must leave before visa expiry or face deportation.',
    'The holder shall not study for more than 3 months in every 12 month period in NZ.',
    'The holder of this visa must comply with any order made under section 70 of the Health Act 1956 and listed in schedule 2 of the COVID-19 Public Health Response Act 2020.',
    'The holder of this visa must comply with any order made under section 11 of the COVID-19 Public Health Response Act 2020.',
    'The holder of this visa must comply with any instruction from a Medical Officer of Health which relates to a notifiable or quarantinable disease.',
  ];

  doc.fontSize(8).font('Helvetica');
  conditionsList.forEach((cond) => {
    doc.text(cond, tableX, p2Y, { width: tableWidth, lineGap: 2.5 });
    p2Y += doc.heightOfString(cond, { width: tableWidth, lineGap: 2.5 }) + 3.5;
  });

  p2Y += 24;

  // Warning line
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text('If you do not comply with these conditions you may become liable for deportation.', tableX, p2Y);

  // Footer on Page 2 (pinned at Y = 776)
  const footerY = 776;
  if (fs.existsSync(mbiePath)) {
    doc.image(mbiePath, tableX, footerY, { width: 125 });
  }
  if (fs.existsSync(nzgovtPath)) {
    doc.image(nzgovtPath, 435, footerY + 5, { width: 95 });
  }

  // ==========================================
  // PAGE 3: VISA LABEL INFO & TRAVEL INSTRUCTIONS
  // ==========================================
  doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });

  let p3Y = 48;

  // Section 1: You do not require a visa label in your passport
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text('You do not require a visa label in your passport', tableX, p3Y);
  p3Y += 13;

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text(
      'The details above reflect the electronic record of your visa held by Immigration New Zealand (INZ).',
      tableX,
      p3Y,
      { width: tableWidth }
    );
  p3Y += 12;

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text('Do not alter this letter. For information about eVisas go to ', tableX, p3Y, { continued: true })
    .fillColor(linkBlue)
    .text('immigration.govt.nz/evisas.', { underline: true, link: 'https://www.immigration.govt.nz/evisas' })
    .fillColor('#000000');
  p3Y += 12;

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text(
      'Please check that your visa details match your passport before you travel and contact us immediately if there are any errors.',
      tableX,
      p3Y,
      { width: tableWidth }
    );
  p3Y += 20;

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text(
      'If you get a new passport while this visa is still valid, you must request INZ to update your visa details so that they match your new passport. INZ’s website has information on how to do this: ',
      tableX,
      p3Y,
      { continued: true, width: tableWidth }
    )
    .fillColor(linkBlue)
    .text('immigration.govt.nz/transfervisa', { underline: true, link: 'https://www.immigration.govt.nz/transfervisa' })
    .fillColor('#000000');
  p3Y += 24;

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text('You can verify the details of your visa online using the Visa Verification Service:', tableX, p3Y, { width: tableWidth });
  p3Y += 12;

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .fillColor(linkBlue)
    .text('www.immigration.govt.nz/about-us/our-online-systems/visa-verification-service', tableX, p3Y, {
      underline: true,
      link: 'https://www.immigration.govt.nz/about-us/our-online-systems/visa-verification-service',
      width: tableWidth,
    })
    .fillColor('#000000');
  p3Y += 26;

  // Section 2: Your passport scans
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text('Your passport scans', tableX, p3Y);
  p3Y += 13;

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text(
      'When you made your application, you may have been asked to submit your passport to your nearest Visa Application Centre (VAC) for scanning.',
      tableX,
      p3Y,
      { width: tableWidth }
    );
  p3Y += 20;

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text(
      'Following assessment of your application we waived the passport requirement. We apologise if you have already submitted your passport to the VAC. Your passport will be returned to you as soon as possible. If you have not yet submitted your passport, please do not send it.',
      tableX,
      p3Y,
      { width: tableWidth, lineGap: 1.5 }
    );
  p3Y += 34;

  // Section 3: New Zealand's COVID-19 requirements
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text('New Zealand’s COVID-19 requirements', tableX, p3Y);
  p3Y += 13;

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text(
      'If you plan to travel to or from New Zealand, please check the current COVID-19 requirements. These requirements can change so we recommend referring to these often when planning travel ',
      tableX,
      p3Y,
      { continued: true, width: tableWidth }
    )
    .fillColor(linkBlue)
    .text('covid19.govt.nz/international-travel', { underline: true, link: 'https://covid19.govt.nz/international-travel' })
    .fillColor('#000000');
  p3Y += 28;

  // Section 4: Automated systems
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text('Automated systems', tableX, p3Y);
  p3Y += 13;

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text(
      'Some aspects of your application have been processed using automated systems in accordance with section 28 of the Immigration Act 2009. For more information about INZ’s use of automated systems go to ',
      tableX,
      p3Y,
      { continued: true, width: tableWidth }
    )
    .fillColor(linkBlue)
    .text('www.immigration.govt.nz/about-us/site-information/terms-of-use', {
      underline: true,
      link: 'https://www.immigration.govt.nz/about-us/site-information/terms-of-use',
    })
    .fillColor('#000000');
  p3Y += 28;

  // Section 5: You must not remain in New Zealand after your visa expires
  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text('You must not remain in New Zealand after your visa expires', tableX, p3Y);
  p3Y += 13;

  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text(
      'You must hold a valid visa at all times while you are in New Zealand. If you do not hold a valid visa, you will be in New Zealand unlawfully and you will be liable for deportation. If you do not leave voluntarily before you are served with a deportation order you will face a prohibition period preventing your return to New Zealand in the future.',
      tableX,
      p3Y,
      { width: tableWidth, lineGap: 1.5 }
    );
  p3Y += 36;

  // Help & Contact info
  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text('If you have any questions, you can:', tableX, p3Y);
  p3Y += 14;

  // Bullet 1
  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text('•', tableX + 8, p3Y);
  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text(
      'call our Immigration Contact Centre on 0508 55 88 55 or 09 914 4100, or for those outside of\nNew Zealand +64 9 914 4100, or',
      tableX + 22,
      p3Y,
      { width: tableWidth - 22, lineGap: 1.5 }
    );
  p3Y += 24;

  // Bullet 2
  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text('•', tableX + 8, p3Y);
  doc
    .fontSize(7.5)
    .font('Helvetica')
    .text('find answers to frequently asked questions at: ', tableX + 22, p3Y);
  p3Y += 11;
  doc
    .fontSize(7.5)
    .font('Helvetica')
    .fillColor(linkBlue)
    .text('www.immigration.govt.nz/knowledgebase/kb-question', tableX + 22, p3Y, {
      underline: true,
      link: 'https://www.immigration.govt.nz/knowledgebase/kb-question',
    })
    .fillColor('#000000');
  p3Y += 30;

  // Sign off with pixel-perfect "Ngā mihi"
  drawNgaMihi(tableX, p3Y);
  p3Y += 18;

  doc
    .fontSize(8.5)
    .font('Helvetica')
    .text('Immigration New Zealand', tableX, p3Y);
  p3Y += 38;

  // PRINT THIS DOCUMENT...
  doc
    .fontSize(9.5)
    .font('Helvetica-Bold')
    .text('PRINT THIS DOCUMENT AND CARRY IT WITH YOUR PASSPORT WHEN TRAVELLING', 0, p3Y, {
      width: 595.28,
      align: 'center',
    });

  // Footer on Page 3
  if (fs.existsSync(mbiePath)) {
    doc.image(mbiePath, tableX, footerY, { width: 125 });
  }
  if (fs.existsSync(nzgovtPath)) {
    doc.image(nzgovtPath, 435, footerY + 5, { width: 95 });
  }

  doc.end();
};

module.exports = {
  generateApplicationPdf,
};
