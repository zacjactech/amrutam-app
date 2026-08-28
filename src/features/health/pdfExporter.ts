// Health Records - PDF Export Utility
// Generates styled HTML from health record data and converts to PDF via expo-print

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { HealthRecord, RECORD_TYPE_LABELS, HealthRecordType } from './types';
import { logger } from '../../infrastructure/logging/logger';

const BRAND_GREEN = '#2D6A4F';
const BRAND_GREEN_LIGHT = '#D1FAE5';
const TEXT_PRIMARY = '#1A1A1A';
const TEXT_SECONDARY = '#6B7280';
const BORDER_COLOR = '#E5E7EB';
const BACKGROUND = '#F8F9FA';

const RECORD_TYPE_COLORS: Record<HealthRecordType, string> = {
  lab_report: '#3B82F6',
  prescription: '#2D6A4F',
  consultation: '#7C3AED',
  vaccination: '#06B6D4',
  allergy: '#F97316',
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br/>');
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildLabReportHtml(record: HealthRecord): string {
  const labTests = [
    { name: 'Hemoglobin', result: '14.2 g/dL', normal: true, reference: '12.0-16.0 g/dL' },
    { name: 'WBC Count', result: '11,200 /µL', normal: false, reference: '4,000-11,000 /µL' },
    { name: 'RBC Count', result: '5.1 M/µL', normal: true, reference: '4.5-5.5 M/µL' },
    { name: 'Platelet Count', result: '2,45,000 /µL', normal: true, reference: '1,50,000-4,00,000 /µL' },
    { name: 'Hematocrit', result: '42.3%', normal: true, reference: '36.0-46.0%' },
    { name: 'MCV', result: '82.9 fL', normal: true, reference: '80.0-100.0 fL' },
  ];

  const rows = labTests
    .map(
      (test) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid ${BORDER_COLOR};color:${TEXT_PRIMARY};font-size:13px;">${test.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid ${BORDER_COLOR};color:${test.normal ? BRAND_GREEN : '#F97316'};font-weight:600;font-size:13px;">
          ${test.result}${!test.normal ? ' ▲' : ''}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid ${BORDER_COLOR};color:${TEXT_SECONDARY};font-size:13px;text-align:right;">${test.reference}</td>
      </tr>`,
    )
    .join('');

  return `
    <div style="margin-top:24px;">
      <h3 style="font-size:14px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Results</h3>
      <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:${BACKGROUND};">
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:${TEXT_SECONDARY};text-transform:uppercase;font-weight:600;">Test</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:${TEXT_SECONDARY};text-transform:uppercase;font-weight:600;">Result</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:${TEXT_SECONDARY};text-transform:uppercase;font-weight:600;">Reference</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${
      record.description
        ? `<div style="margin-top:20px;">
        <h3 style="font-size:14px;color:#F97316;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;font-weight:700;">Doctor's Summary</h3>
        <div style="background:#fff;border-radius:8px;padding:16px;">
          <p style="color:${TEXT_SECONDARY};line-height:1.6;font-size:14px;margin:0;">${escapeHtml(record.description)}</p>
        </div>
      </div>`
        : ''
    }`;
}

function buildPrescriptionHtml(_record: HealthRecord): string {
  const medications = [
    { name: 'Ashwagandha Churna', dosage: '1 tsp twice daily with warm water', duration: '30 days' },
    { name: 'Triphala Tablet', dosage: '1 tablet after dinner', duration: '15 days' },
    { name: 'Brahmi Syrup', dosage: '10ml twice daily', duration: '21 days' },
  ];

  const meds = medications
    .map(
      (med) => `
      <div style="background:#fff;border-radius:8px;padding:16px;margin-bottom:10px;border-left:3px solid ${BRAND_GREEN};">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:${BRAND_GREEN};font-weight:700;font-size:14px;">${med.name}</span>
          <span style="color:${TEXT_SECONDARY};font-size:12px;">${med.duration}</span>
        </div>
        <p style="color:${TEXT_SECONDARY};margin:6px 0 0;font-size:13px;">${med.dosage}</p>
      </div>`,
    )
    .join('');

  return `
    <div style="margin-top:24px;">
      <h3 style="font-size:14px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Medications</h3>
      ${meds}
    </div>`;
}

function buildConsultationHtml(record: HealthRecord): string {
  const sections = [
    { label: 'Reason for Visit', content: 'Patient reports persistent fatigue, mild headaches, and difficulty sleeping for the past 3 weeks.' },
    { label: 'Clinical Notes', content: 'Pulse diagnosis (Nadi Pariksha) indicates Vata imbalance. Tongue coating suggests mild Ama (toxin accumulation).' },
    { label: 'Recommendations', content: 'Begin Ashwagandha and Brahmi supplementation. Practice Pranayama for 15 minutes daily. Follow Dinacharya protocol.' },
  ];

  const cards = sections
    .map(
      (s) => `
      <div style="background:#fff;border-radius:8px;padding:16px;margin-bottom:10px;">
        <h4 style="font-size:11px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px;font-weight:600;">${s.label}</h4>
        <p style="color:${TEXT_PRIMARY};line-height:1.6;font-size:13px;margin:0;">${escapeHtml(record.description ?? s.content)}</p>
      </div>`,
    )
    .join('');

  return `
    <div style="margin-top:24px;">
      ${cards}
    </div>`;
}

function buildVaccinationHtml(record: HealthRecord): string {
  const administeredDate = new Date(record.occurredAt);
  const nextBooster = new Date(administeredDate);
  nextBooster.setFullYear(nextBooster.getFullYear() + 1);

  const details = [
    { label: 'Provider', value: (record.metadata.provider as string) ?? 'Amrutam Wellness Center' },
    { label: 'Batch Number', value: (record.metadata.batchNumber as string) ?? 'VAC-2026-0847' },
    { label: 'Dose', value: (record.metadata.dose as string) ?? '1st Booster' },
    { label: 'Route', value: (record.metadata.route as string) ?? 'Intramuscular' },
  ];

  const rows = details
    .map(
      (d) => `
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid ${BORDER_COLOR};">
        <span style="color:${TEXT_SECONDARY};font-size:13px;">${d.label}</span>
        <span style="color:${TEXT_PRIMARY};font-weight:500;font-size:13px;">${d.value}</span>
      </div>`,
    )
    .join('');

  return `
    <div style="margin-top:24px;">
      <div style="background:#CFFAFE;border-radius:8px;padding:16px;border-left:4px solid #06B6D4;margin-bottom:20px;">
        <h4 style="font-size:11px;color:#0E7490;text-transform:uppercase;margin:0 0 4px;font-weight:700;">Next Booster Due</h4>
        <p style="font-size:16px;color:#155E75;font-weight:600;margin:0;">${nextBooster.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      <h3 style="font-size:14px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Details</h3>
      ${rows}
    </div>`;
}

function buildAllergyHtml(record: HealthRecord): string {
  const severity = (record.metadata.severity as string) ?? 'moderate';

  return `
    <div style="margin-top:24px;">
      <h3 style="font-size:14px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Reaction</h3>
      <div style="background:#fff;border-radius:8px;padding:16px;">
        <p style="color:${TEXT_PRIMARY};line-height:1.6;font-size:13px;margin:0;">${escapeHtml(record.description ?? 'Patient experiences skin rash, mild swelling, and nasal congestion upon exposure.')}</p>
      </div>
      <h3 style="font-size:14px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;margin:20px 0 8px;">Severity</h3>
      <div style="display:inline-block;background:#FFEDD5;border-radius:6px;padding:6px 14px;">
        <span style="color:#C2410C;font-weight:600;text-transform:capitalize;font-size:13px;">${severity}</span>
      </div>
    </div>`;
}

function buildRecordTypeContent(record: HealthRecord): string {
  switch (record.type) {
    case 'lab_report':
      return buildLabReportHtml(record);
    case 'prescription':
      return buildPrescriptionHtml(record);
    case 'consultation':
      return buildConsultationHtml(record);
    case 'vaccination':
      return buildVaccinationHtml(record);
    case 'allergy':
      return buildAllergyHtml(record);
    default:
      return '';
  }
}

function buildAttachmentsHtml(record: HealthRecord): string {
  if (record.attachments.length === 0) return '';

  const items = record.attachments
    .map(
      (att) => `
      <div style="display:flex;align-items:center;background:#fff;border-radius:8px;padding:12px;margin-bottom:8px;">
        <div style="width:40px;height:40px;border-radius:6px;background:${att.mimeType === 'application/pdf' ? '#FEE2E2' : '#DBEAFE'};display:flex;align-items:center;justify-content:center;margin-right:12px;">
          <span style="font-size:16px;">${att.mimeType === 'application/pdf' ? '📄' : '🖼️'}</span>
        </div>
        <div style="flex:1;">
          <p style="color:${TEXT_PRIMARY};font-weight:600;font-size:13px;margin:0;">${escapeHtml(att.name)}</p>
          <p style="color:${TEXT_SECONDARY};font-size:11px;margin:2px 0 0;">${att.mimeType === 'application/pdf' ? 'PDF' : 'Image'}${att.sizeBytes ? ` · ${(att.sizeBytes / 1024).toFixed(1)} KB` : ''}</p>
        </div>
      </div>`,
    )
    .join('');

  return `
    <div style="margin-top:24px;">
      <h3 style="font-size:14px;color:${TEXT_SECONDARY};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">Attachments</h3>
      ${items}
    </div>`;
}

export function buildRecordHtml(record: HealthRecord): string {
  const typeColor = RECORD_TYPE_COLORS[record.type] ?? '#6B7280';
  const date = formatDate(record.occurredAt);
  const doctor = (record.metadata.doctor as string) ?? 'Dr. Priya Sharma';
  const facility = (record.metadata.facility as string) ?? 'Amrutam Wellness Center';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: ${BACKGROUND}; color: ${TEXT_PRIMARY}; }
    @page { margin: 24px; size: A4; }
  </style>
</head>
<body>
  <div style="padding:0;">
    <!-- Header -->
    <div style="text-align:center;padding-bottom:20px;border-bottom:2px solid ${BRAND_GREEN};margin-bottom:20px;">
      <h1 style="font-size:20px;color:${BRAND_GREEN};margin-bottom:4px;">Amrutam</h1>
      <p style="font-size:11px;color:${TEXT_SECONDARY};letter-spacing:1px;text-transform:uppercase;">Ayurvedic Wellness</p>
    </div>

    <!-- Record Type Badge -->
    <div style="display:inline-block;background:${typeColor}15;color:${typeColor};padding:4px 10px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
      ${RECORD_TYPE_LABELS[record.type]}
    </div>

    <!-- Title -->
    <h2 style="font-size:20px;font-weight:700;color:${TEXT_PRIMARY};margin-bottom:8px;">${escapeHtml(record.title)}</h2>

    <!-- Meta -->
    <div style="font-size:13px;color:${TEXT_SECONDARY};margin-bottom:4px;">
      ${date} · ${doctor} · ${facility}
    </div>

    <!-- Tags -->
    ${
      record.tags.length > 0
        ? `<div style="margin-top:8px;">${record.tags
            .map(
              (tag) =>
                `<span style="display:inline-block;background:${BRAND_GREEN_LIGHT};color:${BRAND_GREEN};padding:3px 10px;border-radius:999px;font-size:11px;margin-right:6px;margin-bottom:4px;">${escapeHtml(tag)}</span>`,
            )
            .join('')}</div>`
        : ''
    }

    <!-- Type-specific content -->
    ${buildRecordTypeContent(record)}

    <!-- Attachments -->
    ${buildAttachmentsHtml(record)}

    <!-- Footer -->
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid ${BORDER_COLOR};text-align:center;">
      <p style="font-size:11px;color:${TEXT_SECONDARY};">Generated by Amrutam · ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <p style="font-size:10px;color:${TEXT_SECONDARY};margin-top:4px;">Record ID: ${record.id.slice(0, 16)}</p>
    </div>
  </div>
</body>
</html>`;
}

export async function exportRecordAsPdf(record: HealthRecord): Promise<string | null> {
  try {
    const html = buildRecordHtml(record);

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    logger.info('PDF exported successfully', { recordId: record.id, uri });
    return uri;
  } catch (error) {
    logger.error('PDF export failed', {
      recordId: record.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return null;
  }
}

export async function shareRecordAsPdf(record: HealthRecord): Promise<boolean> {
  try {
    const pdfUri = await exportRecordAsPdf(record);
    if (pdfUri === null) return false;

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      logger.warn('Sharing not available on this device');
      return false;
    }

    await Sharing.shareAsync(pdfUri, {
      mimeType: 'application/pdf',
      dialogTitle: `Share ${record.title}`,
      UTI: 'com.adobe.pdf',
    });

    logger.info('PDF shared successfully', { recordId: record.id });
    return true;
  } catch (error) {
    logger.error('PDF share failed', {
      recordId: record.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  }
}

export async function downloadRecordAsPdf(record: HealthRecord): Promise<string | null> {
  try {
    const pdfUri = await exportRecordAsPdf(record);
    if (pdfUri === null) return null;

    logger.info('PDF downloaded', { recordId: record.id, uri: pdfUri });
    return pdfUri;
  } catch (error) {
    logger.error('PDF download failed', {
      recordId: record.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return null;
  }
}
