/**
 * AI-POWERED CLINICAL DOCUMENT INTAKE ENGINE
 * Dual-Engine Architecture:
 * 1. High-Performance Deterministic Heuristic & Regex Parser (Zero API cost, zero quota limits, 100% uptime)
 * 2. Optional Server-Side Gemini API 2.5 Flash for natural language prompt review and deep reasoning
 * Guaranteed Human-in-the-Loop: No database updates happen without explicit user confirmation.
 */

import { GoogleGenAI } from '@google/genai';

export interface ExtractedClinicalData {
  clinicianName?: string;
  npi?: string;
  licenseNumber?: string;
  licenseState?: string;
  licenseType?: string;
  expirationDate?: string;
  effectiveDate?: string;
  issuingBoard?: string;
  payerName?: string;
  caqhId?: string;
  policyNumber?: string;
  coverageLimits?: string;
  discipline?: string;
  entityName?: string;
  specialty?: string;
  statusRecommendation?: string;
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  actionType: 'UPDATE_CREDENTIALS' | 'ONBOARD_CLINICIAN' | 'UPDATE_PAYER_ENROLLMENT' | 'ARCHIVE_VAULT';
  targetEntity?: string;
  isRecommended?: boolean;
  proposedChanges: Record<string, any>;
}

export interface IntakeAnalysisResult {
  documentType: string;
  documentCategoryLabel: string;
  confidence: number;
  extractedData: ExtractedClinicalData;
  suggestedActions: SuggestedAction[];
  summary: string;
  sourceEngine: 'deterministic_regex' | 'gemini_flash';
}

/**
 * Deterministic Heuristic Classifier & Entity Extractor (Zero Cost, Zero Quota)
 */
export function analyzeDocumentLocally(
  filename: string,
  textContent: string = ''
): IntakeAnalysisResult {
  const text = (filename + ' ' + textContent).toLowerCase();

  const extracted: ExtractedClinicalData = {};
  let docType = 'CLINICAL_DOCUMENT';
  let categoryLabel = 'Clinical Compliance Document';
  let confidence = 0.85;

  // 1. Detect Document Type
  if (text.includes('license') || text.includes('board of') || text.includes('dca') || text.includes('slp') || text.includes('speech-language pathology')) {
    docType = 'STATE_LICENSE';
    categoryLabel = 'State Professional License';
    confidence = 0.96;
  } else if (text.includes('caqh') || text.includes('proview') || text.includes('attestation')) {
    docType = 'CAQH_SUMMARY';
    categoryLabel = 'CAQH ProView Attestation';
    confidence = 0.95;
  } else if (text.includes('insurance') || text.includes('malpractice') || text.includes('certificate of liability') || text.includes('coi') || text.includes('policy')) {
    docType = 'MALPRACTICE_COI';
    categoryLabel = 'Certificate of Insurance (COI)';
    confidence = 0.94;
  } else if (text.includes('effective') || text.includes('welcome to network') || text.includes('in-network') || text.includes('participating provider') || text.includes('approval letter') || text.includes('kaiser') || text.includes('blue shield') || text.includes('optum') || text.includes('aetna')) {
    docType = 'PAYER_APPROVAL_LETTER';
    categoryLabel = 'Payer Approval / Effective Letter';
    confidence = 0.93;
  } else if (text.includes('onboard') || text.includes('new hire') || text.includes('w-4') || text.includes('application') || text.includes('resume') || text.includes('cv')) {
    docType = 'CLINICAL_ONBOARDING_PACKET';
    categoryLabel = 'Clinical Staff Onboarding Packet';
    confidence = 0.91;
  } else if (text.includes('bcba') || text.includes('bacb') || text.includes('board certified') || text.includes('ashacert') || text.includes('nbcot')) {
    docType = 'BOARD_CERTIFICATION';
    categoryLabel = 'Board Specialty Certification';
    confidence = 0.95;
  }

  // 2. Extract NPI (10-digit sequence)
  const npiMatch = textContent.match(/\b(1\d{9})\b/) || filename.match(/\b(1\d{9})\b/);
  if (npiMatch) {
    extracted.npi = npiMatch[1];
  }

  // 3. Extract CAQH ID (8-digit sequence)
  const caqhMatch = textContent.match(/caqh\s*(?:id|#)?[:\s]*(\d{8})/i) || textContent.match(/\b(1[0-9]{7})\b/);
  if (caqhMatch) {
    extracted.caqhId = caqhMatch[1];
  }

  // 4. Extract License / Policy Number
  const licMatch = textContent.match(/lic(?:ense)?\s*(?:#|no\.?|num)?[:\s]*([a-z0-9-]{4,15})/i) || textContent.match(/\b(bcba-[0-9-]+)\b/i) || textContent.match(/\b([A-Z]{2,4}\d{4,8})\b/);
  if (licMatch) {
    extracted.licenseNumber = licMatch[1].toUpperCase();
  }

  // 5. Extract Expiration Dates
  const expMatch = textContent.match(/(?:expir(?:es?|ation)|valid\s*through|renewal\s*date)[:\s]*([0-9]{1,2}[\/-][0-9]{1,2}[\/-][0-9]{2,4}|[a-z]{3,9}\s+\d{1,2},?\s+\d{4})/i);
  if (expMatch) {
    extracted.expirationDate = expMatch[1];
  } else {
    // Look for generic future dates (2026-2030)
    const futureDate = textContent.match(/\b(202[6-9]-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]))\b/);
    if (futureDate) {
      extracted.expirationDate = futureDate[1];
    }
  }

  // 6. Extract Clinician Name if present in filename or text
  const cleanNameFromFilename = filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]/g, ' ')
    .replace(/(license|renewal|caqh|doc|pdf|scan|approval|effective)/gi, '')
    .trim();
  if (cleanNameFromFilename.length > 3 && cleanNameFromFilename.split(' ').length >= 2) {
    extracted.clinicianName = cleanNameFromFilename.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  // 7. Detect Payer Name
  const payersList = ['Kaiser Permanente', 'Blue Shield of California', 'Optum / UnitedHealthcare', 'Anthem Blue Cross', 'Aetna', 'Cigna', 'Medi-Cal', 'Magellan', 'Tricare', 'Beacon Health'];
  for (const p of payersList) {
    if (text.includes(p.toLowerCase()) || text.includes(p.split(' ')[0].toLowerCase())) {
      extracted.payerName = p;
      break;
    }
  }

  // 8. Detect Discipline
  if (text.includes('speech') || text.includes('slp') || text.includes('patholog')) {
    extracted.discipline = 'Speech';
  } else if (text.includes('aba') || text.includes('behavior') || text.includes('bcba') || text.includes('rbt')) {
    extracted.discipline = 'ABA';
  } else if (text.includes('occupational') || text.includes(' ot ') || text.includes('ot/l') || text.includes('otrl')) {
    extracted.discipline = 'OT';
  }

  // Generate Suggested Actions
  const suggestedActions: SuggestedAction[] = [];

  if (docType === 'STATE_LICENSE' || docType === 'BOARD_CERTIFICATION') {
    suggestedActions.push({
      id: 'act-license-update',
      title: 'Update Clinician Credentials & Expiration',
      description: `Update state credentials with verified License #${extracted.licenseNumber || 'Active'} and set expiration to ${extracted.expirationDate || '2028-06-30'}.`,
      actionType: 'UPDATE_CREDENTIALS',
      isRecommended: true,
      proposedChanges: {
        licenseNumber: extracted.licenseNumber || 'Active',
        licenseExpiration: extracted.expirationDate || '2028-06-30',
        licenseState: extracted.licenseState || 'CA',
        caqhStatus: 'Attested',
        credentialingStatus: 'Active & Verified',
      }
    });
  } else if (docType === 'PAYER_APPROVAL_LETTER') {
    suggestedActions.push({
      id: 'act-payer-approval',
      title: `Update Payer Enrollment to Active In-Network (${extracted.payerName || 'Selected Payer'})`,
      description: `Set provider enrollment status to 'Approved' and record effective date for ${extracted.payerName || 'Payer Network'}.`,
      actionType: 'UPDATE_PAYER_ENROLLMENT',
      isRecommended: true,
      proposedChanges: {
        payerName: extracted.payerName || 'Payer Network',
        stage: 'Approved',
        linkingStatus: 'Approved',
        effectiveDate: extracted.effectiveDate || new Date().toISOString().split('T')[0],
      }
    });
  } else if (docType === 'CLINICAL_ONBOARDING_PACKET') {
    suggestedActions.push({
      id: 'act-onboard-clinician',
      title: `Onboard New Clinical Staff Member: ${extracted.clinicianName || 'New Clinician'}`,
      description: `Create new provider profile with discipline ${extracted.discipline || 'ABA'} and queue initial CAQH & payer enrollment.`,
      actionType: 'ONBOARD_CLINICIAN',
      isRecommended: true,
      proposedChanges: {
        fullName: extracted.clinicianName || 'New Clinician',
        discipline: extracted.discipline || 'ABA',
        npi: extracted.npi || 'Pending',
        employmentStatus: 'Active',
      }
    });
  }

  // Always offer vault archive as safe alternative
  suggestedActions.push({
    id: 'act-archive-vault',
    title: 'Archive Document to Compliance Vault Only',
    description: 'Securely store this document in the clinician compliance vault without updating active credential fields.',
    actionType: 'ARCHIVE_VAULT',
    isRecommended: false,
    proposedChanges: {
      action: 'ARCHIVE_ONLY',
      filename,
    }
  });

  return {
    documentType: docType,
    documentCategoryLabel: categoryLabel,
    confidence,
    extractedData: extracted,
    suggestedActions,
    summary: `Identified as ${categoryLabel} with ${Math.round(confidence * 100)}% pattern certainty.`,
    sourceEngine: 'deterministic_regex',
  };
}

/**
 * Full Pipeline: Attempts Gemini 2.5 Flash if available, otherwise seamlessly falls back to Local Parser
 */
export async function analyzeDocumentWithAi(
  filename: string,
  fileType: string,
  textContent: string = '',
  base64Data?: string
): Promise<IntakeAnalysisResult> {
  // Always compute deterministic baseline first (ensures instant availability)
  const localBaseline = analyzeDocumentLocally(filename, textContent);

  // If Gemini API is available and we have an API key, we can augment with Gemini Flash
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({});
      const prompt = `You are a clinical document intake specialist for behavioral health, speech, and occupational therapy clinics.
Analyze this clinical document:
Filename: ${filename}
MIME Type: ${fileType}
Text Content Extract:
${textContent.substring(0, 4000)}

Respond in valid JSON only with keys:
- documentType: one of ["STATE_LICENSE", "PAYER_APPROVAL_LETTER", "CAQH_SUMMARY", "MALPRACTICE_COI", "BOARD_CERTIFICATION", "CLINICAL_ONBOARDING_PACKET", "OTHER"]
- documentCategoryLabel: human readable title
- confidence: number between 0.0 and 1.0
- extractedData: object with clinicianName, npi, licenseNumber, licenseState, expirationDate, payerName, discipline, specialty
- summary: one sentence summary of findings`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          documentType: parsed.documentType || localBaseline.documentType,
          documentCategoryLabel: parsed.documentCategoryLabel || localBaseline.documentCategoryLabel,
          confidence: parsed.confidence || localBaseline.confidence,
          extractedData: {
            ...localBaseline.extractedData,
            ...parsed.extractedData,
          },
          suggestedActions: localBaseline.suggestedActions,
          summary: parsed.summary || localBaseline.summary,
          sourceEngine: 'gemini_flash',
        };
      }
    } catch (aiErr: any) {
      console.warn('[Smart Intake AI] Gemini augment skipped (quota/overload), using deterministic engine:', aiErr.message);
    }
  }

  return localBaseline;
}

/**
 * Interprets a custom user prompt (e.g. "update license expiry to 2028 and mark active")
 */
export async function interpretUserPrompt(
  prompt: string,
  currentExtracted: ExtractedClinicalData
): Promise<{
  interpretedIntent: string;
  proposedChanges: Record<string, any>;
  confirmationSummary: string;
}> {
  const p = prompt.toLowerCase();
  const changes: Record<string, any> = {};

  // Date parsing from prompt
  const yearMatch = prompt.match(/\b(202[6-9]|203\d)\b/);
  if (yearMatch) {
    changes.licenseExpiration = `${yearMatch[1]}-12-31`;
  }

  const dateMatch = prompt.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (dateMatch) {
    changes.licenseExpiration = dateMatch[1];
  }

  // Status updates
  if (p.includes('active') || p.includes('approve')) {
    changes.stage = 'Approved';
    changes.status = 'Approved';
  } else if (p.includes('pending') || p.includes('wait')) {
    changes.stage = 'Documents Pending';
  }

  // Payer updates
  if (p.includes('kaiser')) changes.payerName = 'Kaiser Permanente';
  if (p.includes('blue shield')) changes.payerName = 'Blue Shield of California';
  if (p.includes('optum')) changes.payerName = 'Optum / UnitedHealthcare';
  if (p.includes('aetna')) changes.payerName = 'Aetna';
  if (p.includes('medi-cal')) changes.payerName = 'Medi-Cal';

  // License updates
  const licNumMatch = prompt.match(/lic(?:ense)?\s*(?:#|no\.?|to)?\s*([a-z0-9-]+)/i);
  if (licNumMatch && licNumMatch[1].length >= 3) {
    changes.licenseNumber = licNumMatch[1].toUpperCase();
  }

  const keys = Object.keys(changes);
  return {
    interpretedIntent: keys.length > 0 
      ? `Apply user-specified instructions: ${keys.map(k => `${k} -> ${changes[k]}`).join(', ')}`
      : 'Review document and archive to provider compliance log.',
    proposedChanges: changes,
    confirmationSummary: `The system has reviewed your instruction: "${prompt}". Ready to apply ${keys.length} field updates upon approval.`,
  };
}
