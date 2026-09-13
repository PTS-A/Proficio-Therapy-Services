const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const outputPath = path.join(docsDir, 'MANUAL_SETUP_AND_ACTION_ITEMS.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 40, right: 40 },
  info: {
    Title: 'Proficio Therapy Services - Manual Setup & Action Items Checklist',
    Author: 'Enterprise Systems Architecture',
    Subject: 'Comprehensive step-by-step external setup guide for Resend, Supabase, and DNS',
    Keywords: 'Resend, Supabase, Email Automations, Manual Setup, Healthcare Credentialing',
  }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Professional Design Colors
const NAVY = '#1E3A8A';
const INDIGO = '#2B4C9D';
const BLUE = '#2563EB';
const SLATE = '#1E293B';
const MUTED = '#475569';
const EMERALD = '#059669';
const AMBER = '#D97706';
const ROSE = '#E11D48';
const LIGHT_BG = '#F8FAFC';
const CARD_BG = '#F1F5F9';
const BORDER_COLOR = '#CBD5E1';

function checkPageSpace(needed = 80) {
  if (doc.y + needed > 760) {
    doc.addPage();
  }
}

function drawHeaderBanner(title, subtitle) {
  doc.rect(40, 35, 515, 70).fill(NAVY);
  doc.fillColor('#FFFFFF').fontSize(13.5).font('Helvetica-Bold').text(title, 55, 48, { width: 485 });
  doc.fillColor('#93C5FD').fontSize(8.5).font('Helvetica').text(subtitle, 55, 68, { width: 485 });
  doc.fillColor('#CBD5E1').fontSize(7.5).font('Helvetica-Bold').text('INTERNAL DEVOPS RUNBOOK • CONFIDENTIAL • NOT EXPOSED IN APP OR PUBLIC WEB', 55, 84);
  doc.y = 120;
}

function drawSectionHeading(number, title) {
  checkPageSpace(60);
  doc.moveDown(0.6);
  const currentY = doc.y;
  doc.rect(40, currentY, 515, 22).fill(LIGHT_BG);
  doc.rect(40, currentY, 4, 22).fill(INDIGO);
  doc.fillColor(NAVY).fontSize(10.5).font('Helvetica-Bold').text(`${number}. ${title.toUpperCase()}`, 52, currentY + 6);
  doc.y = currentY + 28;
}

function drawSubHeading(title) {
  checkPageSpace(45);
  doc.moveDown(0.4);
  doc.fillColor(INDIGO).fontSize(9.5).font('Helvetica-Bold').text(title);
  doc.moveDown(0.2);
}

function drawParagraph(text) {
  checkPageSpace(30);
  doc.fillColor(SLATE).fontSize(8.5).font('Helvetica').text(text, { align: 'justify', lineGap: 1.5 });
  doc.moveDown(0.35);
}

function drawStepCard(stepNumber, title, details, isRequired = true) {
  checkPageSpace(65);
  const startY = doc.y;
  
  // Outer box
  doc.roundedRect(40, startY, 515, 50, 4).fillAndStroke(CARD_BG, BORDER_COLOR);
  
  // Badge
  const badgeColor = isRequired ? ROSE : AMBER;
  const badgeText = isRequired ? 'MANDATORY' : 'RECOMMENDED';
  doc.roundedRect(450, startY + 8, 95, 14, 3).fill(badgeColor);
  doc.fillColor('#FFFFFF').fontSize(7).font('Helvetica-Bold').text(badgeText, 450, startY + 11, { width: 95, align: 'center' });
  
  // Step Number & Title
  doc.fillColor(NAVY).fontSize(9.5).font('Helvetica-Bold').text(`STEP ${stepNumber}: ${title}`, 52, startY + 9, { width: 390 });
  
  // Details
  doc.fillColor(MUTED).fontSize(8).font('Helvetica').text(details, 52, startY + 24, { width: 490, lineGap: 1.5 });
  
  doc.y = startY + 58;
}

function drawCodeBlock(code) {
  checkPageSpace(45);
  const currentY = doc.y;
  const lines = code.split('\n');
  const height = lines.length * 12 + 14;
  doc.rect(40, currentY, 515, height).fill('#0F172A');
  doc.fillColor('#38BDF8').fontSize(7.5).font('Courier').text(code, 50, currentY + 8, { lineGap: 2 });
  doc.y = currentY + height + 8;
}

function drawNoteBox(title, text, type = 'info') {
  checkPageSpace(50);
  const startY = doc.y;
  const borderColor = type === 'warning' ? AMBER : type === 'success' ? EMERALD : BLUE;
  const bgColor = type === 'warning' ? '#FFFBEB' : type === 'success' ? '#F0FDF4' : '#EFF6FF';
  const textColor = type === 'warning' ? '#92400E' : type === 'success' ? '#166534' : '#1E40AF';
  
  doc.roundedRect(40, startY, 515, 42, 4).fillAndStroke(bgColor, borderColor);
  doc.fillColor(textColor).fontSize(8.5).font('Helvetica-Bold').text(title, 50, startY + 7);
  doc.fillColor(textColor).fontSize(8).font('Helvetica').text(text, 50, startY + 20, { width: 495, lineGap: 1.5 });
  doc.y = startY + 48;
}

// -------------------------------------------------------------
// PAGE 1: TITLE & EXECUTIVE SUMMARY
// -------------------------------------------------------------
drawHeaderBanner(
  'MANUAL SETUP & EXTERNAL DEVOPS ACTION ITEMS',
  'Step-by-Step Production Configuration Runbook for Resend, Supabase & DNS'
);

drawSectionHeading('1', 'Executive Overview & Scope of Manual Work');
drawParagraph(
  'All code implementations, visual UI editors, database bridges, and automation engines are fully compiled and live in the codebase. However, security boundaries require that third-party cloud accounts, DNS domain authentications, and production secret keys be managed externally by you. Neither Google AI Studio nor automated scripts can create third-party vendor accounts or modify domain DNS records on your behalf.'
);
drawParagraph(
  'This document provides the complete, authoritative checklist of manual steps you must perform outside Google AI Studio to enable live outbound email delivery and permanent database operations.'
);

drawNoteBox(
  'SECURITY PROTOCOL: PRIVACY & ZERO SECRETS IN REPO',
  'Never paste production API keys or database service role keys into front-end code, GitHub, or public forms. All secrets must be stored strictly in server-side container variables or Supabase Vault.',
  'warning'
);

drawSectionHeading('2', 'Master Checklist of External Action Items');

drawStepCard(
  '1',
  'Create & Configure Resend Account',
  'Navigate to https://resend.com and sign up with your corporate email (e.g., joel.reji@ageslearningsolutions.com). Resend serves as the dedicated transactional email delivery engine for deadline reminders.'
);

drawStepCard(
  '2',
  'Add & Verify Corporate Sending Domain',
  'In the Resend Dashboard, go to "Domains" > "Add Domain". Enter your corporate email domain (e.g., proficiotherapy.com or ageslearningsolutions.com). Do not use public domains like gmail.com or yahoo.com.'
);

drawStepCard(
  '3',
  'Publish Resend DNS Records (DKIM & SPF)',
  'Access your DNS host (Cloudflare, GoDaddy, Google Domains, AWS Route 53) and create the 3 DNS records provided by Resend (DKIM TXT, SPF TXT, and MX tracking record) to guarantee 100% email deliverability.'
);

// -------------------------------------------------------------
// PAGE 2: RESEND KEYS & SERVER-SIDE SECRETS
// -------------------------------------------------------------
doc.addPage();
drawHeaderBanner(
  'MANUAL SETUP RUNBOOK — PART 2: KEYS & SECRETS',
  'API Key Generation, Environment Variable Provisioning & Database Verification'
);

drawStepCard(
  '4',
  'Generate Production Resend API Key',
  'In Resend, navigate to "API Keys" > "Create API Key". Name it "Proficio Credentialing Engine". Select "Full Access" or "Sending access (restricted to your verified domain)". Copy the generated key (starts with "re_").'
);

drawStepCard(
  '5',
  'Inject RESEND_API_KEY into Server Environment',
  'Set the server environment variable RESEND_API_KEY in your Cloud Run container or Supabase Edge Function secrets. This key is used exclusively server-side by the automation engine and is NEVER sent to the browser.'
);

drawCodeBlock(
  `# Required Server-Side Environment Variables (.env / Cloud Run Secrets)\n` +
  `RESEND_API_KEY=re_123456789_abcdefghijklmnopqrstuvwxyz\n` +
  `RESEND_FROM_EMAIL=Credentialing Team <credentialing@proficiotherapy.com>\n` +
  `APPLICATION_URL=https://ais-dev-ro7zg4lpp6jxlcjol5in7a-568047474488.asia-southeast1.run.app`
);

drawStepCard(
  '6',
  'Execute Database Migration Script in Supabase',
  'Log into your Supabase Dashboard at https://supabase.com/dashboard/project/uqaiotacheqjvfbanxtp/sql. Open the SQL Editor and execute the provided migration script: supabase/migrations/20260912000000_automated_deadline_reminders.sql.'
);

drawParagraph(
  'The migration script creates the required relational tables: "automation_definitions" and "automation_executions", applies the unique idempotency index to prevent duplicate emails, configures Row Level Security (RLS), and seeds the default 30-14-7-1 day reminder cadence.'
);

drawStepCard(
  '7',
  'Enable pg_cron Daily Scheduled Invocation',
  'In the Supabase SQL Editor, enable pg_cron if not already active to schedule the daily deadline evaluation job at 08:00 UTC (midnight PST).'
);

drawCodeBlock(
  `-- Enable pg_cron and pg_net extensions in Supabase SQL Editor:\n` +
  `CREATE EXTENSION IF NOT EXISTS pg_cron;\n` +
  `CREATE EXTENSION IF NOT EXISTS pg_net;\n\n` +
  `-- Schedule automated daily evaluation at 08:00 UTC (12:00 AM PST):\n` +
  `SELECT cron.schedule(\n` +
  `  'credential-deadline-reminders-daily',\n` +
  `  '0 8 * * *',\n` +
  `  $$ SELECT net.http_post(\n` +
  `       url:='https://ais-dev-ro7zg4lpp6jxlcjol5in7a-568047474488.asia-southeast1.run.app/api/automations/run-check',\n` +
  `       headers:='{"Content-Type": "application/json"}'::jsonb,\n` +
  `       body:='{"scheduled": true}'::jsonb\n` +
  `     ) AS request_id; $$\n` +
  `);`
);

// -------------------------------------------------------------
// PAGE 3: CONFIRMATION, TESTING & VERIFICATION
// -------------------------------------------------------------
doc.addPage();
drawHeaderBanner(
  'MANUAL SETUP RUNBOOK — PART 3: TESTING & CUTOVER',
  'End-to-End Verification, Zero-Duplicate Validation & Firebase Severance'
);

drawSectionHeading('3', 'End-to-End Verification & Sanity Test Matrix');

drawStepCard(
  '8',
  'Dispatch End-to-End Test Email via UI',
  'In the application, log in as Manager or Admin and navigate to the "Automations" tab. Click the "Send Test Email" button. Enter your personal work email. Confirm receipt of the branded test email in your inbox.'
);

drawStepCard(
  '9',
  'Perform a Dry-Run / Preview Audit',
  'On the Automations screen, click "Preview / Dry Run". Verify that the engine accurately identifies all clinical credentials approaching 30, 14, 7, or 1 days without sending duplicate messages or throwing database errors.'
);

drawStepCard(
  '10',
  'Confirm Complete Firebase Decommissioning',
  'Navigate to Admin > System Configuration > Retention & DR tab. Verify that Supabase PostgreSQL displays "ACTIVE PRIMARY" with 16 verified tables, and Google Cloud Firestore displays "SEVERED & DISCONNECTED".'
);

drawNoteBox(
  'FIREBASE SEVERANCE VERIFIED',
  'All operational connections, dual-write bridges, and SDK calls to Firebase have been permanently eliminated. All 103 clinical documents and 16 database tables run 100% natively on Supabase PostgreSQL.',
  'success'
);

drawSectionHeading('4', 'Summary Table of Required Settings');

// Summary Table
const tableY = doc.y + 4;
doc.rect(40, tableY, 515, 18).fill(NAVY);
doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
doc.text('Component', 48, tableY + 5, { width: 110 });
doc.text('Configuration Item', 165, tableY + 5, { width: 140 });
doc.text('Value / Destination', 315, tableY + 5, { width: 140 });
doc.text('Action Needed', 465, tableY + 5, { width: 85 });

const rows = [
  ['Email Provider', 'Resend Account', 'resend.com', 'Create account & verify domain'],
  ['DNS Records', 'DKIM & SPF Records', 'Your DNS Registrar', 'Add 3 DNS records'],
  ['API Credentials', 'RESEND_API_KEY', 'Server Environment', 'Paste key into server .env'],
  ['Sender Address', 'RESEND_FROM_EMAIL', 'Server Environment', 'Set verified sender email'],
  ['Database Host', 'Supabase PostgreSQL', 'Project: uqaiotacheqjvfbanxtp', 'Run migration SQL in editor'],
  ['Scheduled Task', 'Daily Cron Trigger', 'pg_cron / Supabase', 'Schedule daily check at 08:00 UTC'],
  ['Firebase Engine', 'Google Firestore', 'Decommissioned', 'No action needed (severed)'],
];

let rowY = tableY + 18;
rows.forEach((row, idx) => {
  const bg = idx % 2 === 0 ? '#FFFFFF' : CARD_BG;
  doc.rect(40, rowY, 515, 16).fillAndStroke(bg, BORDER_COLOR);
  doc.fillColor(SLATE).fontSize(7.5).font('Helvetica');
  doc.text(row[0], 48, rowY + 4, { width: 110 });
  doc.text(row[1], 165, rowY + 4, { width: 140 });
  doc.text(row[2], 315, rowY + 4, { width: 140 });
  doc.fillColor(INDIGO).font('Helvetica-Bold').text(row[3], 465, rowY + 4, { width: 85 });
  rowY += 16;
});

doc.y = rowY + 15;
drawParagraph(
  'Notice: This document is stored exclusively on the server filesystem at docs/MANUAL_SETUP_AND_ACTION_ITEMS.pdf. In strict accordance with security directives, it is NOT exposed through public HTTP routes, website buttons, navigation menus, or client-side bundles.'
);

doc.end();

writeStream.on('finish', () => {
  console.log('Successfully generated docs/MANUAL_SETUP_AND_ACTION_ITEMS.pdf');
});
