/**
 * generatePdf.js
 *
 * Generates a professionally designed "Findings" PDF report using jsPDF +
 * jsPDF-autoTable (bundled as npm packages — jspdf@2.5.1, jspdf-autotable@3.8.2).
 *
 * Design language:
 *   - Brand red (#cc0000) used sparingly as an accent colour
 *   - Dark charcoal (#2c2c2c) for section headings — professional, neutral
 *   - Clean two-column tables: Field label | Value
 *   - High-risk values highlighted in red
 *   - Photos embedded inline per section (2 per row)
 *   - Page footer with app name + page numbers on every page
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { buildPdfData } from './pdfDataBuilder';
import { computeRiskScore } from './riskEngine';

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

// ─── Risk summary block ───────────────────────────────────────────────────────

const LEVEL_COLORS_PDF = {
  'safe':      [46,  125, 50 ],
  'caution':   [193, 125, 0  ],
  'at-risk':   [217, 119, 6  ],
  'high-risk': [204, 0,   0  ],
};

const LEVEL_LABELS_PDF = {
  'safe':      'Safe',
  'caution':   'Caution',
  'at-risk':   'At Risk',
  'high-risk': 'High Risk',
};

const SEVERITY_COLORS_PDF = {
  critical: [204, 0,   0  ],
  high:     [217, 119, 6  ],
  medium:   [193, 125, 0  ],
};

/**
 * Draws the risk score summary block onto the PDF.
 * Returns the new Y position after the block.
 */
function drawRiskSummary(doc, risk, y, marginX, contentW, pageH) {
  if (!risk || !risk.hasAnyData) return y;

  const { score, level, sectionScores, flags } = risk;
  const levelColor = LEVEL_COLORS_PDF[level] || C.red;
  const levelLabel = LEVEL_LABELS_PDF[level] || '';

  let curY = y + 4;

  // ── Heading strip (same style as section headings) ──
  const headingH = 11;
  fill(doc, C.red);
  doc.rect(marginX, curY, 3, headingH, 'F');
  fill(doc, C.charcoal);
  doc.rect(marginX + 3, curY, contentW - 3, headingH, 'F');
  textColor(doc, C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Safety Risk Score', marginX + 10, curY + 7.5);
  curY += headingH + 6;

  // ── Score number ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(levelColor[0], levelColor[1], levelColor[2]);
  doc.text(String(score), marginX, curY + 11);

  // "/100" beside score
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  textColor(doc, C.textMuted);
  doc.text('/ 100', marginX + 20, curY + 11);

  // Level pill badge
  const badgeW = 22;
  const badgeH = 6.5;
  const badgeX = marginX + 48;
  const badgeY = curY + 5;
  fill(doc, levelColor);
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, 'F');
  textColor(doc, C.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text(levelLabel.toUpperCase(), badgeX + badgeW / 2, badgeY + badgeH / 2 + 0.5, {
    align: 'center',
    baseline: 'middle',
  });

  curY += 17;

  // ── Score bar ──
  const barH = 5;
  fill(doc, C.lightGrey);
  doc.rect(marginX, curY, contentW, barH, 'F');
  fill(doc, levelColor);
  doc.rect(marginX, curY, Math.round(contentW * (score / 100)), barH, 'F');
  curY += barH + 8;

  // ── Section breakdown (only sections with data) ──
  const sectionList = Object.values(sectionScores).filter(s => s.hasData && s.score !== null);
  if (sectionList.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    textColor(doc, C.textMuted);
    doc.text('SECTION SCORES', marginX, curY);
    curY += 5;

    const colW    = (contentW - 8) / 2; // two columns
    const nameW   = 44;
    const miniBarW = 28;
    const miniBarH = 3;
    const rowH    = 9;

    sectionList.forEach((s, idx) => {
      const col  = idx % 2;
      const row  = Math.floor(idx / 2);
      const x    = marginX + col * (colW + 8);
      const rowY = curY + row * rowH;

      // Name (truncate to fit)
      const nameStr = s.name.length > 12 ? s.name.slice(0, 12) + '…' : s.name;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      textColor(doc, C.textSecondary);
      doc.text(nameStr, x, rowY + 2.5);

      // Mini bar
      const barColor = s.score >= 80 ? [46, 125, 50]
                     : s.score >= 60 ? [193, 125, 0]
                     : s.score >= 40 ? [217, 119, 6]
                     :                 [204, 0, 0];
      fill(doc, C.lightGrey);
      doc.rect(x + nameW, rowY, miniBarW, miniBarH, 'F');
      doc.setFillColor(barColor[0], barColor[1], barColor[2]);
      doc.rect(x + nameW, rowY, Math.round(miniBarW * (s.score / 100)), miniBarH, 'F');

      // Score text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(barColor[0], barColor[1], barColor[2]);
      doc.text(String(s.score), x + nameW + miniBarW + 3, rowY + 2.5);
    });

    curY += Math.ceil(sectionList.length / 2) * rowH + 6;
  }

  // ── Flags ──
  if (flags.length > 0) {
    // Page break check before flags block
    if (curY > pageH - 50) {
      doc.addPage();
      curY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    textColor(doc, C.textMuted);
    doc.text(`IDENTIFIED RISKS (${flags.length})`, marginX, curY);
    curY += 6;

    const maxFlags = 8;
    const showFlags = flags.slice(0, maxFlags);

    showFlags.forEach(f => {
      if (curY > pageH - 20) {
        doc.addPage();
        curY = 20;
      }

      const dotColor = SEVERITY_COLORS_PDF[f.severity] || C.textMuted;
      const sevLabel = f.severity.charAt(0).toUpperCase() + f.severity.slice(1);

      // Severity label on the right (draw first so text flows left of it)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(dotColor[0], dotColor[1], dotColor[2]);
      const sevX = marginX + contentW;
      doc.text(sevLabel.toUpperCase(), sevX, curY, { align: 'right' });

      // Bullet dot (radius 1.2, centred vertically on the text line)
      doc.setFillColor(dotColor[0], dotColor[1], dotColor[2]);
      doc.circle(marginX + 1.5, curY - 1, 1.2, 'F');

      // Flag text (leave room for severity label ~20mm from right)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      textColor(doc, C.textPrimary);
      const maxFlagW = contentW - 25;
      const flagLines = doc.splitTextToSize(f.flag, maxFlagW);
      const truncated = flagLines.length > 1 ? flagLines[0].slice(0, -1) + '…' : flagLines[0];
      doc.text(truncated, marginX + 6, curY);

      curY += 6.5;
    });

    if (flags.length > maxFlags) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      textColor(doc, C.textMuted);
      doc.text(`+ ${flags.length - maxFlags} more risks identified`, marginX + 6, curY);
      curY += 6;
    }
  }

  // Reset PDF state so subsequent drawing functions start from a clean baseline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  textColor(doc, C.textPrimary);

  return curY + 6;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Generates and triggers download of a Findings PDF.
 *
 * @param {Object} formData - from FormContext ({ meta, fields })
 * @param {Object} photos   - from PhotoContext ({ '1': [{id, name, data}], ... })
 */
export function generatePdf(formData, photos) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW    = doc.internal.pageSize.getWidth();
  const pageH    = doc.internal.pageSize.getHeight();
  const marginX  = 14;
  const contentW = pageW - marginX * 2;

  const sections = buildPdfData(formData, photos);
  const riskScore = computeRiskScore(formData.fields);

  // ── First page header ──
  let currentY = drawHeader(doc, formData.meta, pageW);

  // ── Risk summary (after header, before sections) ──
  currentY = drawRiskSummary(doc, riskScore, currentY, marginX, contentW, pageH);

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
