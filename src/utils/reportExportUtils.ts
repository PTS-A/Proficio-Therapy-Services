/**
 * Executive Credentialing Reports & Template Generator
 * Handles Weekly/Monthly Reports, Official Downloadable Templates with Embedded Company Logo,
 * and Ingest Parser for Batch Updates.
 */

import { PROFICIO_MARK_BASE64 } from './logoBase64';
import { CredentialingRecord, Provider, Payer, LegalEntity, Location } from '../types';

export interface ReportGenerationData {
  records: CredentialingRecord[];
  providers: Provider[];
  payers: Payer[];
  entities: LegalEntity[];
  locations: Location[];
  periodLabel?: string;
  disciplineFilter?: string;
}

export interface ParsedReportRow {
  rowNumber: number;
  providerName: string;
  npi: string;
  discipline: string;
  entityName: string;
  payerName: string;
  stage: string;
  intakeDate?: string;
  submissionDate?: string;
  approvalDate?: string;
  effectiveDate?: string;
  notes?: string;
  status: 'valid' | 'warning' | 'error';
  validationMessage: string;
  matchedProviderId?: string;
  matchedPayerId?: string;
  matchedEntityId?: string;
}

/**
 * Trigger browser file download helper
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================
// 1. OFFICIAL TEMPLATES (DOWNLOADABLE WITH EMBEDDED COMPANY LOGO)
// ============================================================================

/**
 * Download Weekly Status Report Template as Excel/HTML Workbook with Company Logo
 */
export function downloadWeeklyTemplateXls() {
  const today = new Date().toISOString().split('T')[0];
  const htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>Weekly Credentialing Update</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #1e293b; }
    .header-box { background: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .logo-img { height: 50px; vertical-align: middle; }
    .title { font-size: 20px; font-weight: bold; color: #ffffff; margin-top: 10px; }
    .subtitle { font-size: 13px; color: #94a3b8; }
    .instructions { background: #f8fafc; border: 1px solid #cbd5e1; padding: 14px; border-radius: 6px; margin-bottom: 20px; font-size: 12px; }
    table { border-collapse: collapse; width: 100%; font-size: 12px; }
    th { background: #1e3a8a; color: #ffffff; padding: 10px 8px; border: 1px solid #1e3a8a; text-align: left; }
    td { padding: 8px; border: 1px solid #cbd5e1; }
    .sample { background: #f1f5f9; color: #475569; font-style: italic; }
  </style>
</head>
<body>
  <div class="header-box">
    <table style="width: 100%; border: none;">
      <tr style="border: none;">
        <td style="border: none; width: 70px;">
          <img src="${PROFICIO_MARK_BASE64}" alt="Proficio Therapy Logo" class="logo-img" />
        </td>
        <td style="border: none;">
          <div class="title">PROFICIO THERAPY SERVICES • EXECUTIVE CREDENTIALING ROSTER</div>
          <div class="subtitle">Weekly Operational Update Template • Generated: ${today}</div>
        </td>
      </tr>
    </table>
  </div>

  <div class="instructions">
    <strong>Instructions for Weekly Batch Upload:</strong><br/>
    1. Enter your weekly provider enrollments or stage updates below.<br/>
    2. Fill out <strong>Clinician Name, NPI, Discipline (Speech / ABA / OT), Legal Entity, Payer Name, and Stage</strong>.<br/>
    3. Valid Stages: <em>Intake, Documents Pending, Application Preparation, Application Submitted, Payer Review, Approved, Linked, Effective</em>.<br/>
    4. Entity names: <strong>Proficio Speech Therapy Group, INC.</strong> or <strong>Proficio Therapy Services, LLC</strong>.<br/>
    5. Save file as CSV or Excel and upload directly into the Reports tab.
  </div>

  <table>
    <thead>
      <tr>
        <th>Clinician Name</th>
        <th>NPI</th>
        <th>Discipline</th>
        <th>Legal Entity</th>
        <th>Payer Name</th>
        <th>Application Stage</th>
        <th>Submission Date (YYYY-MM-DD)</th>
        <th>Approval Date (YYYY-MM-DD)</th>
        <th>Effective Date (YYYY-MM-DD)</th>
        <th>Days in Stage</th>
        <th>Follow-Up Date</th>
        <th>Status Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr class="sample">
        <td>Maya Patel, MS, CCC-SLP</td>
        <td>1487293810</td>
        <td>Speech</td>
        <td>Proficio Speech Therapy Group, INC.</td>
        <td>Blue Shield CA</td>
        <td>Application Submitted</td>
        <td>2026-09-10</td>
        <td></td>
        <td></td>
        <td>15</td>
        <td>2026-09-28</td>
        <td>Application confirmed under group NPI 1083140560. Follow-up queued.</td>
      </tr>
      <tr class="sample">
        <td>David Miller, BCBA</td>
        <td>1928374102</td>
        <td>ABA</td>
        <td>Proficio Therapy Services, LLC</td>
        <td>Aetna Commercial</td>
        <td>Approved</td>
        <td>2026-08-01</td>
        <td>2026-09-18</td>
        <td>2026-09-20</td>
        <td>7</td>
        <td></td>
        <td>Credentialing approved. Group linking active for billing.</td>
      </tr>
      <!-- Empty template rows for user input -->
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    </tbody>
  </table>
</body>
</html>`;

  triggerFileDownload(htmlContent, `Weekly_Credentialing_Update_Template_${today}.xls`, 'application/vnd.ms-excel');
}

/**
 * Download Weekly Status Report Template as CSV
 */
export function downloadWeeklyTemplateCsv() {
  const headers = [
    'Clinician Name',
    'NPI',
    'Discipline',
    'Legal Entity',
    'Payer Name',
    'Application Stage',
    'Submission Date',
    'Approval Date',
    'Effective Date',
    'Days in Stage',
    'Follow-Up Date',
    'Status Notes'
  ];
  const sample1 = [
    'Maya Patel, MS, CCC-SLP',
    '1487293810',
    'Speech',
    'Proficio Speech Therapy Group, INC.',
    'Blue Shield CA',
    'Application Submitted',
    '2026-09-10',
    '',
    '',
    '15',
    '2026-09-28',
    'Application submitted under group NPI 1083140560'
  ];
  const sample2 = [
    'David Miller, BCBA',
    '1928374102',
    'ABA',
    'Proficio Therapy Services, LLC',
    'Aetna Commercial',
    'Approved',
    '2026-08-01',
    '2026-09-18',
    '2026-09-20',
    '7',
    '',
    'Approved and linked to facility group'
  ];

  const csvRows = [
    '# PROFICIO THERAPY SERVICES - WEEKLY CREDENTIALING BATCH TEMPLATE',
    '# Valid Entities: Proficio Speech Therapy Group, INC. | Proficio Therapy Services, LLC',
    '# Valid Disciplines: Speech | ABA | OT',
    headers.join(','),
    sample1.map(v => `"${v}"`).join(','),
    sample2.map(v => `"${v}"`).join(',')
  ];

  triggerFileDownload(csvRows.join('\n'), `Weekly_Credentialing_Update_Template_${new Date().toISOString().split('T')[0]}.csv`);
}

/**
 * Download Monthly Review Template as Excel/HTML Workbook with Company Logo
 */
export function downloadMonthlyTemplateXls() {
  const today = new Date().toISOString().split('T')[0];
  const htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #1e293b; }
    .header-box { background: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .logo-img { height: 50px; vertical-align: middle; }
    .title { font-size: 20px; font-weight: bold; color: #ffffff; margin-top: 10px; }
    .subtitle { font-size: 13px; color: #94a3b8; }
    .instructions { background: #f8fafc; border: 1px solid #cbd5e1; padding: 14px; border-radius: 6px; margin-bottom: 20px; font-size: 12px; }
    table { border-collapse: collapse; width: 100%; font-size: 12px; }
    th { background: #047857; color: #ffffff; padding: 10px 8px; border: 1px solid #047857; text-align: left; }
    td { padding: 8px; border: 1px solid #cbd5e1; }
    .sample { background: #f1f5f9; color: #475569; font-style: italic; }
  </style>
</head>
<body>
  <div class="header-box">
    <table style="width: 100%; border: none;">
      <tr style="border: none;">
        <td style="border: none; width: 70px;">
          <img src="${PROFICIO_MARK_BASE64}" alt="Proficio Therapy Logo" class="logo-img" />
        </td>
        <td style="border: none;">
          <div class="title">PROFICIO THERAPY SERVICES • EXECUTIVE MONTHLY ROSTER TEMPLATE</div>
          <div class="subtitle">Comprehensive Monthly Enrollment Audit & Performance Template • Generated: ${today}</div>
        </td>
      </tr>
    </table>
  </div>

  <div class="instructions">
    <strong>Instructions for Monthly Roster & Credentialing Reconciliation:</strong><br/>
    1. Enter provider monthly progress or audit records below.<br/>
    2. Ensure accurate NPI, CAQH ID, Legal Entity, and Contract Dates.<br/>
    3. Save and upload back into the Credentialing Hub to sync rosters and update monthly metrics.
  </div>

  <table>
    <thead>
      <tr>
        <th>Clinician Name</th>
        <th>NPI</th>
        <th>Discipline</th>
        <th>Legal Entity</th>
        <th>Payer Name</th>
        <th>Application Stage</th>
        <th>Intake Date (YYYY-MM-DD)</th>
        <th>Submission Date (YYYY-MM-DD)</th>
        <th>Approval Date (YYYY-MM-DD)</th>
        <th>Effective Date (YYYY-MM-DD)</th>
        <th>Total Cycle Days</th>
        <th>CAQH Status</th>
        <th>Action Items / Delays</th>
      </tr>
    </thead>
    <tbody>
      <tr class="sample">
        <td>Jessica Wong, MS CCC-SLP</td>
        <td>1083948571</td>
        <td>Speech</td>
        <td>Proficio Speech Therapy Group, INC.</td>
        <td>Kaiser Permanente Northern CA</td>
        <td>Effective</td>
        <td>2026-06-01</td>
        <td>2026-06-15</td>
        <td>2026-08-20</td>
        <td>2026-09-01</td>
        <td>78</td>
        <td>Attested</td>
        <td>Finalized billing enrollment under Tax ID 821221807.</td>
      </tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    </tbody>
  </table>
</body>
</html>`;

  triggerFileDownload(htmlContent, `Monthly_Credentialing_Roster_Template_${today}.xls`, 'application/vnd.ms-excel');
}

/**
 * Download Monthly Review Template as CSV
 */
export function downloadMonthlyTemplateCsv() {
  const headers = [
    'Clinician Name',
    'NPI',
    'Discipline',
    'Legal Entity',
    'Payer Name',
    'Application Stage',
    'Intake Date',
    'Submission Date',
    'Approval Date',
    'Effective Date',
    'Total Cycle Days',
    'CAQH Status',
    'Action Items / Delays'
  ];
  const sample = [
    'Jessica Wong, MS CCC-SLP',
    '1083948571',
    'Speech',
    'Proficio Speech Therapy Group, INC.',
    'Kaiser Permanente Northern CA',
    'Effective',
    '2026-06-01',
    '2026-06-15',
    '2026-08-20',
    '2026-09-01',
    '78',
    'Attested',
    'Finalized billing enrollment under Tax ID 821221807'
  ];

  const csvRows = [
    '# PROFICIO THERAPY SERVICES - MONTHLY CREDENTIALING ROSTER TEMPLATE',
    '# Entities: Proficio Speech Therapy Group, INC. | Proficio Therapy Services, LLC',
    headers.join(','),
    sample.map(v => `"${v}"`).join(',')
  ];

  triggerFileDownload(csvRows.join('\n'), `Monthly_Credentialing_Roster_Template_${new Date().toISOString().split('T')[0]}.csv`);
}

// ============================================================================
// 2. GENERATE DOWNLOADABLE EXECUTIVE REPORTS (WITH EMBEDDED COMPANY LOGO)
// ============================================================================

/**
 * Generates and downloads the full Executive Weekly Report as an official branded HTML document
 */
export function downloadWeeklyExecutiveReportHtml(data: ReportGenerationData) {
  const { records, providers, payers, entities } = data;
  const today = new Date().toISOString().split('T')[0];

  const newIntakes = records.filter(r => ['Intake', 'Documents Pending'].includes(r.stage)).length;
  const inPreparation = records.filter(r => r.stage === 'Application Preparation').length;
  const submitted = records.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).length;
  const approved = records.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
  const overdue = records.filter(r => r.isOverdue).length;
  const followUpsDue = records.filter(r => r.nextFollowUpDate && !['Approved', 'Linked', 'Effective', 'Closed / Not Contracted'].includes(r.stage)).length;

  const tableRowsHtml = records.slice(0, 150).map(r => {
    const prov = providers.find(p => p.id === r.providerId);
    const pay = payers.find(p => p.id === r.payerId);
    const ent = entities.find(e => e.id === r.entityId);
    const isApproved = ['Approved', 'Linked', 'Effective'].includes(r.stage);
    const badgeClass = isApproved ? 'badge-green' : r.isOverdue ? 'badge-red' : 'badge-blue';

    const provName = prov ? ((prov as any).fullName || `${prov.firstName} ${prov.lastName}`) : 'N/A';
    const entName = ent?.dba || ent?.legalName || '—';

    return `
      <tr>
        <td><strong>${provName}</strong></td>
        <td>${prov?.npi || '—'}</td>
        <td>${r.discipline}</td>
        <td>${entName}</td>
        <td>${pay?.name || '—'}</td>
        <td><span class="${badgeClass}">${r.stage}</span></td>
        <td>${r.submissionDate || '—'}</td>
        <td>${r.approvalDate || '—'}</td>
        <td>${r.effectiveDate || '—'}</td>
        <td style="text-align: right;">${r.daysInCurrentStage || 0}d</td>
        <td>${r.nextFollowUpDate || '—'}</td>
      </tr>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Proficio Therapy - Executive Weekly Credentialing Report (${today})</title>
  <style>
    @page { size: letter landscape; margin: 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 24px; color: #0f172a; background: #ffffff; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
    .brand-section { display: flex; align-items: center; gap: 16px; }
    .brand-section img { height: 56px; width: auto; }
    .brand-titles h1 { margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
    .brand-titles p { margin: 4px 0 0 0; font-size: 13px; color: #64748b; }
    .meta-box { text-align: right; font-size: 12px; color: #475569; }
    .kpi-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 24px; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center; }
    .kpi-title { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 4px; }
    .kpi-value { font-size: 24px; font-weight: 800; color: #0f172a; }
    .badge-green { background: #dcfce7; color: #166534; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .badge-blue { background: #dbeafe; color: #1e40af; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .badge-red { background: #fee2e2; color: #991b1b; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 12px; }
    th { background: #0f172a; color: #ffffff; font-weight: 700; text-align: left; padding: 8px 10px; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
    tr:nth-child(even) td { background: #f8fafc; }
    .footer { margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand-section">
      <img src="${PROFICIO_MARK_BASE64}" alt="Proficio Logo" />
      <div class="brand-titles">
        <h1>Proficio Therapy Services • Weekly Credentialing Status</h1>
        <p>Operational Roster Management &amp; Payer Enrollment Pipeline</p>
      </div>
    </div>
    <div class="meta-box">
      <div><strong>Report Date:</strong> ${today}</div>
      <div><strong>Cycle:</strong> Week ${Math.ceil(new Date().getDate() / 7)} • Current Year 2026</div>
      <div><strong>Entity Scope:</strong> PTS LLC &amp; PSTG INC</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-title">Active Intakes</div>
      <div class="kpi-value">${newIntakes}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">App Prep</div>
      <div class="kpi-value">${inPreparation}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Submitted to Payers</div>
      <div class="kpi-value">${submitted}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Follow-ups Due</div>
      <div class="kpi-value">${followUpsDue}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Approved / Active</div>
      <div class="kpi-value" style="color: #16a34a;">${approved}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Overdue / Delayed</div>
      <div class="kpi-value" style="color: #dc2626;">${overdue}</div>
    </div>
  </div>

  <h2 style="font-size: 15px; margin: 20px 0 8px 0; color: #0f172a;">Active Enrollment Records Status</h2>
  <table>
    <thead>
      <tr>
        <th>Clinician Name</th>
        <th>NPI</th>
        <th>Discipline</th>
        <th>Legal Entity</th>
        <th>Payer Name</th>
        <th>Stage</th>
        <th>Submitted</th>
        <th>Approved</th>
        <th>Effective</th>
        <th style="text-align: right;">Days</th>
        <th>Next Follow-Up</th>
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml}
    </tbody>
  </table>

  <div class="footer">
    <div>Confidential • HIPAA Protected ePHI Credentialing Dossier • Proficio Therapy Services, LLC &amp; Proficio Speech Therapy Group, INC.</div>
    <div>System Generated on ${new Date().toLocaleString()}</div>
  </div>
</body>
</html>`;

  triggerFileDownload(html, `Proficio_Weekly_Credentialing_Report_${today}.html`, 'text/html');
}

/**
 * Generates and downloads the full Executive Monthly Report as an official branded HTML document
 */
export function downloadMonthlyExecutiveReportHtml(data: ReportGenerationData) {
  const { records, providers, payers, entities, periodLabel = 'September 2026', disciplineFilter = 'Consolidated' } = data;
  const today = new Date().toISOString().split('T')[0];

  const filteredRecords = disciplineFilter === 'Consolidated' 
    ? records 
    : records.filter(r => r.discipline === disciplineFilter);

  const approvedThisMonth = filteredRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
  const submittedThisMonth = filteredRecords.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).length;
  const totalClinicians = providers.length;

  const rowsHtml = filteredRecords.slice(0, 150).map(r => {
    const prov = providers.find(p => p.id === r.providerId);
    const pay = payers.find(p => p.id === r.payerId);
    const ent = entities.find(e => e.id === r.entityId);

    const provName = prov ? ((prov as any).fullName || `${prov.firstName} ${prov.lastName}`) : 'N/A';
    const entName = ent?.dba || ent?.legalName || '—';

    return `
      <tr>
        <td><strong>${provName}</strong></td>
        <td>${prov?.npi || '—'}</td>
        <td>${r.discipline}</td>
        <td>${entName}</td>
        <td>${pay?.name || '—'}</td>
        <td><span class="badge">${r.stage}</span></td>
        <td>${r.submissionDate || '—'}</td>
        <td>${r.approvalDate || '—'}</td>
        <td>${r.effectiveDate || '—'}</td>
        <td style="text-align: right;">${r.daysInCurrentStage || 0}d</td>
      </tr>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Proficio Therapy - Executive Monthly Credentialing Review (${periodLabel})</title>
  <style>
    @page { size: letter landscape; margin: 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 24px; color: #0f172a; background: #ffffff; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
    .brand-section { display: flex; align-items: center; gap: 16px; }
    .brand-section img { height: 56px; width: auto; }
    .brand-titles h1 { margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; }
    .brand-titles p { margin: 4px 0 0 0; font-size: 13px; color: #64748b; }
    .meta-box { text-align: right; font-size: 12px; color: #475569; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
    .kpi-title { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 4px; }
    .kpi-value { font-size: 26px; font-weight: 800; color: #0f172a; }
    .badge { background: #f1f5f9; color: #334155; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 12px; }
    th { background: #047857; color: #ffffff; font-weight: 700; text-align: left; padding: 8px 10px; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
    tr:nth-child(even) td { background: #f8fafc; }
    .footer { margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand-section">
      <img src="${PROFICIO_MARK_BASE64}" alt="Proficio Logo" />
      <div class="brand-titles">
        <h1>Proficio Therapy Services • Monthly Executive Credentialing Review</h1>
        <p>Comprehensive Performance &amp; Network Expansion Review • ${periodLabel} (${disciplineFilter})</p>
      </div>
    </div>
    <div class="meta-box">
      <div><strong>Reporting Period:</strong> ${periodLabel}</div>
      <div><strong>Generated Date:</strong> ${today}</div>
      <div><strong>Scope:</strong> Proficio Speech Group &amp; Proficio Therapy Services</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-title">Total Active Clinicians</div>
      <div class="kpi-value">${totalClinicians}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Active Enrollments</div>
      <div class="kpi-value">${filteredRecords.length}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Payer Submissions</div>
      <div class="kpi-value">${submittedThisMonth}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Approvals / In-Network</div>
      <div class="kpi-value" style="color: #047857;">${approvedThisMonth}</div>
    </div>
  </div>

  <h2 style="font-size: 15px; margin: 20px 0 8px 0; color: #0f172a;">Enrollment Pipeline Detail</h2>
  <table>
    <thead>
      <tr>
        <th>Clinician Name</th>
        <th>NPI</th>
        <th>Discipline</th>
        <th>Legal Entity</th>
        <th>Payer Name</th>
        <th>Stage</th>
        <th>Submitted</th>
        <th>Approved</th>
        <th>Effective</th>
        <th style="text-align: right;">Days in Stage</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="footer">
    <div>Confidential Executive Briefing • Proficio Therapy Services &amp; Proficio Speech Therapy Group</div>
    <div>System Generated on ${new Date().toLocaleString()}</div>
  </div>
</body>
</html>`;

  triggerFileDownload(html, `Proficio_Monthly_Credentialing_Review_${today}.html`, 'text/html');
}

// ============================================================================
// 3. REPORT UPLOAD PARSER & VALIDATOR
// ============================================================================

/**
 * Parses uploaded CSV / TSV / Excel text data into validated records
 */
export function parseUploadedReport(
  rawContent: string,
  existingProviders: Provider[],
  existingPayers: Payer[],
  existingEntities: LegalEntity[]
): ParsedReportRow[] {
  const lines = rawContent
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'));

  if (lines.length < 2) {
    return [];
  }

  // Parse header
  const headerLine = lines[0];
  const delimiter = headerLine.includes('\t') ? '\t' : ',';
  
  const parseRowValues = (rowStr: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values.map(v => v.replace(/^"|"$/g, '').trim());
  };

  const headers = parseRowValues(headerLine).map(h => h.toLowerCase());

  // Find column indices
  const getIdx = (keywords: string[]) => {
    return headers.findIndex(h => keywords.some(k => h.includes(k)));
  };

  const nameIdx = getIdx(['clinician', 'provider', 'name', 'staff']);
  const npiIdx = getIdx(['npi']);
  const discIdx = getIdx(['discipline', 'type', 'specialty']);
  const entIdx = getIdx(['entity', 'legal entity', 'group', 'company']);
  const payerIdx = getIdx(['payer', 'insurance', 'plan']);
  const stageIdx = getIdx(['stage', 'status', 'enrollment status']);
  const subIdx = getIdx(['submission', 'submit', 'submitted']);
  const appIdx = getIdx(['approval', 'approved']);
  const effIdx = getIdx(['effective', 'effective date']);
  const notesIdx = getIdx(['notes', 'comment', 'remarks', 'action']);

  const parsedResults: ParsedReportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowValues = parseRowValues(lines[i]);
    if (rowValues.length < 2 || rowValues.every(v => !v)) continue;

    const providerName = nameIdx >= 0 && rowValues[nameIdx] ? rowValues[nameIdx] : 'Clinician ' + i;
    const npi = npiIdx >= 0 && rowValues[npiIdx] ? rowValues[npiIdx].replace(/\D/g, '') : '';
    const discipline = discIdx >= 0 && rowValues[discIdx] ? rowValues[discIdx] : 'Speech';
    const entityName = entIdx >= 0 && rowValues[entIdx] ? rowValues[entIdx] : 'Proficio Speech Therapy Group, INC.';
    const payerName = payerIdx >= 0 && rowValues[payerIdx] ? rowValues[payerIdx] : 'Standard Payer';
    const stage = stageIdx >= 0 && rowValues[stageIdx] ? rowValues[stageIdx] : 'Application Submitted';
    const submissionDate = subIdx >= 0 ? rowValues[subIdx] : '';
    const approvalDate = appIdx >= 0 ? rowValues[appIdx] : '';
    const effectiveDate = effIdx >= 0 ? rowValues[effIdx] : '';
    const notes = notesIdx >= 0 ? rowValues[notesIdx] : '';

    // Provider matching
    let matchedProvider = existingProviders.find(p => npi && p.npi === npi);
    if (!matchedProvider) {
      const cleanName = providerName.toLowerCase().replace(/[^a-z]/g, '');
      matchedProvider = existingProviders.find(p => {
        const fullClean = ((p as any).fullName || `${p.firstName} ${p.lastName}`).toLowerCase().replace(/[^a-z]/g, '');
        return fullClean.includes(cleanName) || cleanName.includes(fullClean);
      });
    }

    // Entity matching
    let matchedEntity = existingEntities.find(e => {
      const eName = (e.dba || e.legalName || '').toLowerCase();
      const testName = entityName.toLowerCase();
      if (testName.includes('speech') && eName.includes('speech')) return true;
      if (testName.includes('therapy services') && eName.includes('therapy services') && !eName.includes('speech')) return true;
      return eName.includes(testName) || testName.includes(eName);
    });

    if (!matchedEntity) {
      matchedEntity = existingEntities[0];
    }

    // Payer matching
    const matchedPayer = existingPayers.find(p => {
      const pName = p.name.toLowerCase();
      const testName = payerName.toLowerCase();
      return pName.includes(testName) || testName.includes(pName);
    });

    // Validation
    let status: 'valid' | 'warning' | 'error' = 'valid';
    const messages: string[] = [];

    if (!matchedProvider) {
      status = 'warning';
      messages.push('Provider not found in roster; will associate or prompt creation');
    }
    if (!matchedPayer) {
      status = 'warning';
      messages.push('Payer will be dynamically recognized');
    }
    if (npi && npi.length !== 10) {
      status = 'warning';
      messages.push('NPI is not 10 digits');
    }

    parsedResults.push({
      rowNumber: i,
      providerName,
      npi,
      discipline,
      entityName: matchedEntity?.legalName || entityName,
      payerName: matchedPayer?.name || payerName,
      stage,
      submissionDate,
      approvalDate,
      effectiveDate,
      notes,
      status,
      validationMessage: messages.length > 0 ? messages.join('; ') : 'Ready for database synchronization',
      matchedProviderId: matchedProvider?.id,
      matchedPayerId: matchedPayer?.id,
      matchedEntityId: matchedEntity?.id
    });
  }

  return parsedResults;
}

/**
 * Downloads a formatted Excel report with company logo specifically filtered for a single operating entity
 */
export function downloadEntityRosterXls(
  entity: LegalEntity,
  entityRecords: CredentialingRecord[],
  providers: Provider[],
  payers: Payer[]
) {
  const today = new Date().toISOString().split('T')[0];
  const safeName = (entity.dba || entity.legalName || 'Entity').replace(/[^a-zA-Z0-9]/g, '_');

  const rowsHtml = entityRecords.map(r => {
    const prov = providers.find(p => p.id === r.providerId);
    const pay = payers.find(p => p.id === r.payerId);
    const provName = prov?.firstName ? `${prov.firstName} ${prov.lastName}` : ((prov as any)?.fullName || 'Clinician');
    return `
      <tr>
        <td style="font-weight: bold; border: 1px solid #cbd5e1; padding: 6px 8px;">${provName}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-family: monospace;">${prov?.npi || '—'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">${r.discipline}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-weight: 500;">${pay?.name || 'Payer'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-weight: bold; color: ${['Approved', 'Linked', 'Effective'].includes(r.stage) ? '#166534' : r.isOverdue ? '#991b1b' : '#1e40af'};">${r.stage}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-family: monospace;">${r.submissionDate || '—'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-family: monospace;">${r.approvalDate || '—'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-family: monospace;">${r.effectiveDate || '—'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: right; font-weight: bold;">${r.daysInCurrentStage || 0}d</td>
      </tr>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>${(entity.dba || 'Entity').substring(0, 30)}</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #1e293b; }
    .header-box { background: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .title { font-size: 20px; font-weight: bold; color: #ffffff; }
    .subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }
    .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 14px; border-radius: 6px; margin-bottom: 20px; font-size: 12px; }
    table { border-collapse: collapse; width: 100%; font-size: 12px; }
    th { background: #1e3a8a; color: #ffffff; padding: 10px 8px; border: 1px solid #1e3a8a; text-align: left; }
    td { padding: 6px 8px; border: 1px solid #cbd5e1; }
  </style>
</head>
<body>
  <div class="header-box">
    <table style="width: 100%; border: none;">
      <tr style="border: none;">
        <td style="border: none; width: 70px;">
          <img src="${PROFICIO_MARK_BASE64}" alt="Company Logo" style="height: 50px;" />
        </td>
        <td style="border: none;">
          <div class="title">${entity.legalName} (${entity.dba || 'Operating Group'})</div>
          <div class="subtitle">Official Credentialing &amp; Payer Enrollment Roster &bull; Generated: ${today}</div>
        </td>
      </tr>
    </table>
  </div>

  <div class="meta-box">
    <strong>Operating Entity Governance Profile:</strong><br/>
    • <strong>Legal Name:</strong> ${entity.legalName}<br/>
    • <strong>DBA:</strong> ${entity.dba || '—'}<br/>
    • <strong>Federal Tax ID (EIN):</strong> ${entity.ein || '—'} &bull; <strong>Type 2 Group NPI:</strong> ${entity.npiType2 || '—'}<br/>
    • <strong>Headquarters:</strong> ${entity.address || 'Fairfield, CA'}<br/>
    • <strong>Total In-Scope Payer Applications:</strong> ${entityRecords.length}
  </div>

  <table>
    <thead>
      <tr>
        <th>Clinician Name</th>
        <th>Individual NPI</th>
        <th>Discipline</th>
        <th>Payer Network</th>
        <th>Current Stage</th>
        <th>Submission Date</th>
        <th>Approval Date</th>
        <th>Effective Date</th>
        <th style="text-align: right;">Days in Stage</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || '<tr><td colspan="9" style="text-align: center; padding: 20px;">No records found for this operating entity.</td></tr>'}
    </tbody>
  </table>
</body>
</html>`;

  triggerFileDownload(html, `${safeName}_Credentialing_Roster_${today}.xls`, 'application/vnd.ms-excel');
}

/**
 * Downloads a raw CSV roster filtered for a single operating entity
 */
export function downloadEntityRosterCsv(
  entity: LegalEntity,
  entityRecords: CredentialingRecord[],
  providers: Provider[],
  payers: Payer[]
) {
  const today = new Date().toISOString().split('T')[0];
  const safeName = (entity.dba || entity.legalName || 'Entity').replace(/[^a-zA-Z0-9]/g, '_');

  const headers = ['Record ID', 'Clinician Name', 'Individual NPI', 'Discipline', 'Operating Entity', 'Payer Network', 'Stage', 'Submitted', 'Approved', 'Effective', 'Days In Stage', 'Overdue'];
  const rows = entityRecords.map(r => {
    const prov = providers.find(p => p.id === r.providerId);
    const pay = payers.find(p => p.id === r.payerId);
    const provName = prov?.firstName ? `${prov.firstName} ${prov.lastName}` : ((prov as any)?.fullName || '');
    return [
      r.id,
      `"${provName}"`,
      prov?.npi || '',
      r.discipline,
      `"${entity.dba || entity.legalName}"`,
      `"${pay?.name || ''}"`,
      `"${r.stage}"`,
      r.submissionDate || '',
      r.approvalDate || '',
      r.effectiveDate || '',
      r.daysInCurrentStage || 0,
      r.isOverdue ? 'YES' : 'NO'
    ].join(',');
  });

  const content = [
    `# ${entity.legalName} - CREDENTIALING ROSTER EXPORT`,
    `# Tax ID (EIN): ${entity.ein || 'N/A'} | Group NPI: ${entity.npiType2 || 'N/A'}`,
    `# Generated: ${today}`,
    headers.join(','),
    ...rows
  ].join('\n');

  triggerFileDownload(content, `${safeName}_Roster_${today}.csv`, 'text/csv;charset=utf-8;');
}

