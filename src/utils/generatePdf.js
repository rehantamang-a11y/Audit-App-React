/**
 * generatePdf.js
 *
 * Generates a professionally designed "Findings" PDF report using jsPDF +
 * jsPDF-autoTable (loaded via CDN in public/index.html).
 *
 * Design language:
 *   - Brand red (#cc0000) used sparingly as an accent colour
 *   - Dark charcoal (#2c2c2c) for section headings — professional, neutral
 *   - Clean two-column tables: Field label | Value
 *   - High-risk values highlighted in red
 *   - Photos embedded inline per section (2 per row)
 *   - Page footer with app name + page numbers on every page
 */

import { buildPdfData } from './pdfDataBuilder';

// ─── Colour palette ──────────────────────────────────────────────────────────
const C = {
  red:            [204, 0,   0  ],
  charcoal:       [44,  44,  44 ],
  white:          [255, 255, 255],
  lightGrey:      [238, 238, 238],
  veryLightGrey:  [250, 250, 250],
  tableBorder:    [220, 220, 220],
  textPrimary:    [26,  26,  26 ],
  textSecondary:  [107, 101, 96 ],
  textMuted:      [158, 152, 148],
  metaBg:         [248, 248, 248],
  commentBg:      [255, 250, 250],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fill(doc, color) {
  doc.setFillColor(color[0], color[1], color[2]);
}

function textColor(doc, color) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function drawColor(doc, color) {
  doc.setDrawColor(color[0], color[1], color[2]);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    // Append time to avoid timezone-shift issues with date-only strings
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// ─── Header (first page) ─────────────────────────────────────────────────────

function drawHeader(doc, meta, pageW) {
  // Thin brand-red stripe at very top
  fill(doc, C.red);
  doc.rect(0, 0, pageW, 3, 'F');

  // Dark charcoal band
  fill(doc, C.charcoal);
  doc.rect(0, 3, pageW, 34, 'F');

  // Report title
  textColor(doc, C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('Bathroom Safety Audit', 15, 19);

  // "FINDINGS REPORT" subtitle in muted lighter text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(190, 190, 190);
  doc.text('FINDINGS REPORT', 15, 28);

  // Meta info row — light background
  fill(doc, C.metaBg);
  doc.rect(0, 37, pageW, 22, 'F');

  // Divider line below meta
  drawColor(doc, C.tableBorder);
  doc.setLineWidth(0.3);
  doc.line(0, 59, pageW, 59);

  const metaItems = [
    { label: 'AUDITOR',  value: meta?.auditor  || '—' },
    { label: 'DATE',     value: formatDate(meta?.date) },
    { label: 'LOCATION', value: meta?.location || '—' },
  ];

  const colW = (pageW - 30) / metaItems.length;
  metaItems.forEach((item, i) => {
    const x = 15 + i * colW;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    textColor(doc, C.textMuted);
    doc.text(item.label, x, 46);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    textColor(doc, C.textPrimary);

    // Truncate long values so they don't overflow their column
    const maxW  = colW - 5;
    const lines = doc.splitTextToSize(String(item.value), maxW);
    const truncated = lines.length > 1 ? lines[0].slice(0, -1) + '…' : lines[0];
    doc.text(truncated, x, 54);
  });

  // Return Y where content starts
  return 65;
}

// ─── Section heading strip ───────────────────────────────────────────────────

function drawSectionHeading(doc, section, y, marginX, contentW) {
  const headingH = 11;

  // Red left-border accent
  fill(doc, C.red);
  doc.rect(marginX, y, 3, headingH, 'F');

  // Charcoal background
  fill(doc, C.charcoal);
  doc.rect(marginX + 3, y, contentW - 3, headingH, 'F');

  // Section number chip
  fill(doc, C.red);
  doc.rect(marginX + 7, y + 2.5, 10, 6, 'F');
  textColor(doc, C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(String(section.sectionNum), marginX + 12, y + 7, { align: 'center' });

  // Section title
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  textColor(doc, C.white);
  doc.text(section.title, marginX + 21, y + 7.5);

  return y + headingH;
}

// ─── Comments block ──────────────────────────────────────────────────────────

function drawComments(doc, comments, y, marginX, contentW, pageH) {
  const lineH  = 4.5;
  const innerW = contentW - 14;
  const padTop = 10; // space for "COMMENTS" label before text starts

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const allLines = doc.splitTextToSize(comments, innerW);

  let currentY  = y + 3;
  let remaining = [...allLines];
  let isFirst   = true;

  while (remaining.length > 0) {
    const availH     = pageH - 20 - currentY; // space before footer
    const maxLines   = Math.max(1, Math.floor((availH - padTop - 4) / lineH));
    const chunk      = remaining.splice(0, maxLines);
    const blockH     = chunk.length * lineH + padTop + 4;

    // Background
    fill(doc, C.commentBg);
    doc.rect(marginX, currentY, contentW, blockH, 'F');

    // Red left-border accent
    fill(doc, C.red);
    doc.rect(marginX, currentY, 2.5, blockH, 'F');

    // Label only on the first block
    if (isFirst) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      textColor(doc, C.textMuted);
      doc.text('COMMENTS', marginX + 7, currentY + 5.5);
      isFirst = false;
    }

    // Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    textColor(doc, C.textPrimary);
    doc.text(chunk, marginX + 7, currentY + padTop);

    currentY += blockH + 2;

    // If there's still text left, start a new page
    if (remaining.length > 0) {
      doc.addPage();
      currentY = 20;
    }
  }

  return currentY;
}

// ─── Photos grid ─────────────────────────────────────────────────────────────

function drawPhotos(doc, photos, y, marginX, contentW, pageH) {
  if (!photos || photos.length === 0) return y;

  const gap    = 8;
  const photoW = (contentW - gap) / 2;
  const photoH = photoW * 0.68;
  const startY = y + 5;

  let currentY = startY;

  for (let i = 0; i < photos.length; i += 2) {
    const rowH = photoH + 4;

    // Page overflow check
    if (currentY + rowH > pageH - 20) {
      doc.addPage();
      currentY = 20;
    }

    // Left photo
    try {
      const fmt = photos[i]?.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(photos[i], fmt, marginX, currentY, photoW, photoH);
    } catch {
      // Photo corrupted or unsupported — skip silently
    }

    // Right photo (if exists)
    if (photos[i + 1]) {
      try {
        const fmt = photos[i + 1]?.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        doc.addImage(photos[i + 1], fmt, marginX + photoW + gap, currentY, photoW, photoH);
      } catch {
        // Skip silently
      }
    }

    currentY += photoH + gap;
  }

  return currentY;
}

// ─── Page footers ─────────────────────────────────────────────────────────────

function addPageFooters(doc, pageW, pageH, marginX) {
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    drawColor(doc, C.tableBorder);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageH - 13, pageW - marginX, pageH - 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    textColor(doc, C.textMuted);
    doc.text('Bathroom Safety Audit — Confidential', marginX, pageH - 7);
    doc.text(`Page ${i} of ${pageCount}`, pageW - marginX, pageH - 7, { align: 'right' });
  }
}

// ─── Table data builder ───────────────────────────────────────────────────────

/**
 * Converts section.rows into a jsPDF-autoTable body array + parallel rowMeta array.
 * rowMeta carries styling hints (isSubheading, highRisk) without polluting cell data.
 */
function buildTableData(rows) {
  const body    = [];
  const rowMeta = [];

  for (const row of rows) {
    if (row.type === 'subheading' || row.type === 'user-header') {
      body.push([row.label, '']);
      rowMeta.push({ isSubheading: true });
    } else {
      // Combine label + subLabel into a single readable string
      let label = row.label || '';
      if (row.subLabel) {
        label = label ? `${label} — ${row.subLabel}` : row.subLabel;
      }
      body.push([label, row.value || '—']);
      rowMeta.push({ isSubheading: false, highRisk: !!row.highRisk });
    }
  }

  // Fallback for sections with no filled data
  if (body.length === 0) {
    body.push(['No data entered for this section', '']);
    rowMeta.push({ isSubheading: false, highRisk: false });
  }

  return { body, rowMeta };
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Generates and triggers download of a Findings PDF.
 *
 * @param {Object} formData - from FormContext ({ meta, fields })
 * @param {Object} photos   - from PhotoContext ({ '1': [{id, name, data}], ... })
 * @throws {Error} if jsPDF CDN scripts are not loaded
 */
export function generatePdf(formData, photos) {
  if (!window.jspdf) {
    throw new Error(
      'PDF library not loaded. Please ensure you have an internet connection and reload the app.'
    );
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW    = doc.internal.pageSize.getWidth();
  const pageH    = doc.internal.pageSize.getHeight();
  const marginX  = 14;
  const contentW = pageW - marginX * 2;

  const sections = buildPdfData(formData, photos);

  // ── First page header ──
  let currentY = drawHeader(doc, formData.meta, pageW);

  // ── Sections ──
  for (const section of sections) {
    // Start a fresh page if we're too close to the bottom
    if (currentY > pageH - 55) {
      doc.addPage();
      currentY = 20;
    }

    // Section heading strip
    currentY = drawSectionHeading(doc, section, currentY, marginX, contentW);

    // Field table
    const { body, rowMeta } = buildTableData(section.rows);

    doc.autoTable({
      startY:     currentY,
      margin:     { left: marginX, right: marginX },
      tableWidth: contentW,
      body,
      theme:      'grid',
      styles: {
        fontSize:    8.5,
        cellPadding: { top: 3, right: 6, bottom: 3, left: 6 },
        lineColor:   C.tableBorder,
        lineWidth:   0.3,
        font:        'helvetica',
        overflow:    'linebreak',
        valign:      'middle',
        textColor:   C.textPrimary,
      },
      columnStyles: {
        0: { cellWidth: 72, textColor: C.textSecondary },
        1: { cellWidth: 'auto' },
      },
      alternateRowStyles: {
        fillColor: C.veryLightGrey,
      },
      didParseCell: function (data) {
        const meta = rowMeta[data.row.index];
        if (!meta) return;

        if (meta.isSubheading) {
          // Full-width subheading row
          data.cell.styles.fillColor   = C.lightGrey;
          data.cell.styles.textColor   = C.textSecondary;
          data.cell.styles.fontStyle   = 'bold';
          data.cell.styles.fontSize    = 7.5;
          if (data.column.index === 0) {
            data.cell.colSpan = 2;
          }
        } else if (data.column.index === 1 && meta.highRisk) {
          // High-risk value — red + bold
          data.cell.styles.textColor = C.red;
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    currentY = (doc.lastAutoTable?.finalY ?? currentY) + 3;

    // Comments
    if (section.comments && section.comments.trim()) {
      if (currentY > pageH - 35) {
        doc.addPage();
        currentY = 20;
      }
      currentY = drawComments(doc, section.comments.trim(), currentY, marginX, contentW, pageH);
    }

    // Photos
    if (section.photos.length > 0) {
      currentY = drawPhotos(doc, section.photos, currentY, marginX, contentW, pageH);
    }

    currentY += 8; // breathing room between sections
  }

  // ── Page footers (added last so page count is accurate) ──
  addPageFooters(doc, pageW, pageH, marginX);

  // ── Save ──
  const loc      = (formData.meta?.location || 'Audit').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
  const date     = formData.meta?.date || new Date().toISOString().slice(0, 10);
  const filename = `Findings_${loc}_${date}.pdf`;

  doc.save(filename);
}
