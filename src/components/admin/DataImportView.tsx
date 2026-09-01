import React, { useState, useRef } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import * as XLSX from 'xlsx';
import { 
  AlertCircle, 
  ArrowLeft,
  CheckCircle2, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileUp, 
  HelpCircle, 
  Layers, 
  Plus, 
  RefreshCw, 
  Search, 
  Sparkles, 
  Table, 
  Trash2, 
  Upload, 
  Users, 
  X,
  Database,
  Building2,
  MapPin,
  ShieldCheck,
  ClipboardList,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { 
  ApplicationType, 
  CredentialingRecord, 
  CredentialingStage, 
  Discipline, 
  Payer, 
  Provider, 
  ProviderType, 
  ServiceType, 
  EmploymentStatus, 
  CAQHStatus, 
  PAVEStatus,
  ProviderPayerEnrollment,
  ContractStatus,
  LinkingStatus
} from '../../types';

interface DataImportViewProps {
  onBackToDashboard: () => void;
  onNavigateToTracker?: () => void;
  onNavigateToProviders?: () => void;
}

type ImportCategory = 'providers' | 'applications' | 'payers';

export const DataImportView: React.FC<DataImportViewProps> = ({ 
  onBackToDashboard,
  onNavigateToTracker,
  onNavigateToProviders
}) => {
  const { providers, payers, entities, locations, records, importBulkData, isAdmin } = useCredentialing();

  const [category, setCategory] = useState<ImportCategory>('providers');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [activeMode, setActiveMode] = useState<'upload' | 'paste' | 'templates'>('upload');
  const [selectedSchemaCategory, setSelectedSchemaCategory] = useState<ImportCategory>('providers');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process Excel or CSV File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    parseSpreadsheetFile(selectedFile);
  };

  const parseSpreadsheetFile = (fileObj: File) => {
    setIsProcessing(true);
    setImportStatus({ type: 'info', message: 'Reading spreadsheet file...' });

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const firstSheetName = wb.SheetNames[0];
        const worksheet = wb.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];

        if (jsonData.length < 2) {
          setImportStatus({ type: 'error', message: 'Spreadsheet has no data rows.' });
          setIsProcessing(false);
          return;
        }

        const rawHeaders = (jsonData[0] || []).map((h) => String(h).trim());
        const dataRows = jsonData.slice(1).filter((row) => row.some((cell) => cell !== ''));

        // Map array of arrays to array of objects
        const objects = dataRows.map((row) => {
          const obj: Record<string, any> = {};
          rawHeaders.forEach((header, index) => {
            if (header) {
              obj[header] = row[index] !== undefined ? String(row[index]).trim() : '';
            }
          });
          return obj;
        });

        setHeaders(rawHeaders.filter(Boolean));
        setParsedRows(objects);
        setImportStatus({
          type: 'info',
          message: `Successfully parsed ${objects.length} rows from sheet "${firstSheetName}". Review preview below.`,
        });
      } catch (err: any) {
        setImportStatus({ type: 'error', message: `Failed to parse file: ${err.message}` });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setImportStatus({ type: 'error', message: 'Error reading file from disk.' });
      setIsProcessing(false);
    };

    reader.readAsBinaryString(fileObj);
  };

  const handlePasteParse = () => {
    if (!pastedText.trim()) {
      setImportStatus({ type: 'error', message: 'Please paste spreadsheet data first.' });
      return;
    }

    try {
      const lines = pastedText.trim().split('\n');
      if (lines.length < 2) {
        setImportStatus({ type: 'error', message: 'Pasted data must include a header line and at least one data line.' });
        return;
      }

      // Check delimiter (tab or comma)
      const delimiter = lines[0].includes('\t') ? '\t' : ',';
      const rawHeaders = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ''));
      
      const rows = lines.slice(1).map((line) => {
        const parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ''));
        const obj: Record<string, any> = {};
        rawHeaders.forEach((h, i) => {
          if (h) obj[h] = parts[i] || '';
        });
        return obj;
      });

      setHeaders(rawHeaders.filter(Boolean));
      setParsedRows(rows);
      setImportStatus({
        type: 'info',
        message: `Parsed ${rows.length} tabular rows from clipboard. Review preview below.`,
      });
    } catch (err: any) {
      setImportStatus({ type: 'error', message: `Parse error: ${err.message}` });
    }
  };

  const handleExecuteImport = () => {
    if (parsedRows.length === 0) {
      setImportStatus({ type: 'error', message: 'No parsed rows available to import.' });
      return;
    }

    setIsProcessing(true);

    try {
      if (category === 'providers') {
        const importedProviders: Provider[] = parsedRows.map((row, idx) => {
          const firstName = row['First Name'] || row['firstName'] || row['First'] || row['Provider First Name'] || `Clinician`;
          const lastName = row['Last Name'] || row['lastName'] || row['Last'] || row['Provider Last Name'] || `${idx + 1}`;
          const npi = String(row['NPI'] || row['npi'] || row['National Provider ID'] || `100000000${idx}`).trim();
          const providerType: ProviderType = row['Provider Type'] || row['Type'] || row['providerType'] || 'BCBA';
          
          // Disciplines (supports comma-separated multi-select)
          const disciplineRaw = String(row['Disciplines'] || row['Discipline'] || 'ABA');
          const disciplines: Discipline[] = [];
          if (disciplineRaw.toLowerCase().includes('speech') || disciplineRaw.toLowerCase().includes('slp')) disciplines.push('Speech');
          if (disciplineRaw.toLowerCase().includes('ot') || disciplineRaw.toLowerCase().includes('occupational')) disciplines.push('OT');
          if (disciplineRaw.toLowerCase().includes('aba') || disciplines.length === 0) disciplines.push('ABA');

          // Entity Resolution
          const primaryEntName = String(row['Primary Legal Entity'] || row['Legal Entity'] || row['Entity'] || '').toLowerCase();
          const matchedEntity = entities.find(e => 
            e.legalName.toLowerCase().includes(primaryEntName) || 
            (e.dba && e.dba.toLowerCase().includes(primaryEntName)) ||
            e.id === primaryEntName
          ) || entities[0];
          
          const entityAffilRaw = String(row['Entity Affiliations'] || row['Affiliations'] || '');
          const entityIds: string[] = [matchedEntity?.id || 'ent-1'];
          if (entityAffilRaw) {
            entities.forEach(ent => {
              if (entityAffilRaw.toLowerCase().includes(ent.legalName.toLowerCase()) || (ent.dba && entityAffilRaw.toLowerCase().includes(ent.dba.toLowerCase()))) {
                if (!entityIds.includes(ent.id)) entityIds.push(ent.id);
              }
            });
          }

          // Service Location Resolution (Multi-location support)
          const locationsRaw = String(row['Service Locations'] || row['Locations'] || row['Location'] || '');
          const matchedLocationIds: string[] = [];
          if (locationsRaw) {
            locations.forEach(loc => {
              if (locationsRaw.toLowerCase().includes(loc.name.toLowerCase()) || locationsRaw.toLowerCase().includes(loc.city.toLowerCase()) || locationsRaw.includes(loc.id)) {
                matchedLocationIds.push(loc.id);
              }
            });
          }
          const finalLocationIds = matchedLocationIds.length > 0 ? matchedLocationIds : [locations[0]?.id || 'loc-1'];

          // Service Delivery Types
          const serviceTypesRaw = String(row['Service Delivery Types'] || row['Service Types'] || 'In-Clinic, In-Home');
          const serviceTypes: ServiceType[] = [];
          if (serviceTypesRaw.includes('In-Clinic')) serviceTypes.push('In-Clinic');
          if (serviceTypesRaw.includes('In-Home')) serviceTypes.push('In-Home');
          if (serviceTypesRaw.includes('In-School')) serviceTypes.push('In-School');
          if (serviceTypesRaw.includes('Telehealth')) serviceTypes.push('Telehealth');
          if (serviceTypes.length === 0) serviceTypes.push('In-Clinic', 'In-Home');

          // Insurance / Payer Enrollments Parsing
          const insuranceEnrollmentsRaw = String(row['Insurance Enrollments'] || row['Payers'] || row['Payer Enrollments'] || '');
          const payerEnrollments: ProviderPayerEnrollment[] = [];
          if (insuranceEnrollmentsRaw) {
            const enrollmentItems = insuranceEnrollmentsRaw.split(/[;,]/).map(s => s.trim()).filter(Boolean);
            enrollmentItems.forEach((item, enrIdx) => {
              const statusMatch = item.match(/\(([^)]+)\)/);
              const extractedStatus = statusMatch ? statusMatch[1].trim() : 'In Progress';
              const cleanPayerName = item.replace(/\([^)]+\)/, '').trim();
              
              const matchedPayer = payers.find(p => p.name.toLowerCase().includes(cleanPayerName.toLowerCase())) || payers[enrIdx % payers.length];
              if (matchedPayer) {
                payerEnrollments.push({
                  id: `enr-imp-${Date.now()}-${idx}-${enrIdx}`,
                  payerId: matchedPayer.id,
                  payerName: matchedPayer.name,
                  status: extractedStatus,
                  enrollmentStatus: extractedStatus as any,
                  applicationType: 'Initial credentialing',
                  effectiveDate: row['Effective Date'] || new Date().toISOString().split('T')[0],
                  recredentialingDueDate: row['Recredentialing Due Date'] || '2028-02-01',
                  providerIdNumber: `PRV-${npi.slice(-5)}`,
                  notes: `Ingested from bulk spreadsheet`,
                });
              }
            });
          }

          const caqhStatus: CAQHStatus = (['Attested', 'Initial', 'Re-attestation Due', 'Expired', 'Draft'] as CAQHStatus[]).find(s => s.toLowerCase() === String(row['CAQH Status']).toLowerCase()) || 'Attested';
          const paveStatus: PAVEStatus = (['Approved', 'In Review', 'Needs Attestation', 'Expired', 'Not Started'] as PAVEStatus[]).find(s => s.toLowerCase() === String(row['PAVE Status']).toLowerCase()) || 'Approved';
          const employmentStatus: EmploymentStatus = (['Full-Time', 'Part-Time', 'Contractor', 'PRN'] as EmploymentStatus[]).find(s => s.toLowerCase() === String(row['Employment Status']).toLowerCase()) || 'Full-Time';

          return {
            id: `prv-imp-${Date.now()}-${idx}`,
            firstName,
            lastName,
            npi,
            credentials: row['Credentials'] || row['Degree'] || 'MS, BCBA',
            disciplines,
            providerType,
            email: row['Email'] || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@proficiotherapy.com`,
            phone: row['Phone'] || '(408) 555-0100',
            altPhone: row['Alt Phone'] || '',
            contactAddress: row['Contact Address'] || '',
            licenseNumber: row['License Number'] || row['License'] || `CA-${Math.floor(10000 + Math.random() * 90000)}`,
            licenseState: row['License State'] || row['State'] || 'CA',
            licenseExpiration: row['License Expiration'] || '2027-12-31',
            taxonomy: row['Taxonomy'] || '103K00000X',
            specialty: row['Specialty'] || 'Behavior Analysis',
            
            // Employment & Group
            entityIds,
            primaryEntityId: matchedEntity?.id || 'ent-1',
            dba: row['DBA'] || matchedEntity?.dba || '',
            employmentStatus,
            contractStatus: row['Contract Classification'] || 'W-2 Full-Time',
            startDate: row['Hire Date'] || row['Start Date'] || '2026-01-15',
            groupAffiliation: row['Group Affiliation Name'] || 'Ages Pediatric Health Partners',
            
            // Location Assignment
            locationIds: finalLocationIds,
            serviceTypes,
            locationEffectiveDate: row['Location Effective Date'] || row['Hire Date'] || '2026-01-15',

            // Credentialing
            caqhId: String(row['CAQH ID'] || row['caqhId'] || Math.floor(10000000 + Math.random() * 90000000)),
            caqhStatus,
            lastAttestationDate: row['Last Attestation Date'] || '2026-01-10',
            nextAttestationDate: row['Next Attestation Date'] || '2026-05-10',
            paveStatus,
            medicaidId: row['Medicaid ID'] || `MCD-CA-${Math.floor(100000 + Math.random() * 900000)}`,
            npiVerified: true,
            nppesRecordMatch: true,
            effectiveDate: row['Effective Date'] || '2026-02-01',
            recredentialingDate: row['Recredentialing Due Date'] || '2028-02-01',
            contractInfo: {
              contractNumber: row['Contract Number'] || `CTR-${Date.now().toString().slice(-4)}`,
              contractType: row['Contract Type'] || 'Group Agreement',
              feeScheduleTier: row['Fee Schedule Tier'] || 'Tier 1 - Standard Clinical',
              contractEffectiveDate: row['Effective Date'] || '2026-02-01',
              recredentialingCycleYears: 3,
            },
            payerEnrollments: payerEnrollments.length > 0 ? payerEnrollments : undefined,
            documents: [],
            active: true,
            notes: row['Notes'] || 'Ingested via spreadsheet bulk import',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
          };
        });

        importBulkData([], importedProviders);
        setImportStatus({
          type: 'success',
          message: `Successfully ingested ${importedProviders.length} Clinical Staff members with multi-location & multi-payer schemas into Master Roster!`,
        });
        setParsedRows([]);
        setFile(null);
      } else if (category === 'applications') {
        const importedRecords: CredentialingRecord[] = parsedRows.map((row, idx) => {
          const recId = row['Application ID'] || row['id'] || `APP-2026-IMP-${idx + 1}`;
          const provNpi = String(row['Provider NPI'] || row['NPI'] || '').trim();
          const matchedProv = providers.find((p) => p.npi === provNpi || `${p.firstName} ${p.lastName}`.toLowerCase() === String(row['Provider Name']).toLowerCase()) || providers[0];
          const matchedPayer = payers.find((p) => p.name.toLowerCase().includes(String(row['Payer Name'] || row['Payer']).toLowerCase())) || payers[0];
          const stage: CredentialingStage = row['Stage'] || row['Status'] || 'Application Submitted';
          const appType: ApplicationType = row['Application Type'] || row['Type'] || 'Initial credentialing';

          const legalEntityName = String(row['Legal Entity'] || '').toLowerCase();
          const matchedEntity = entities.find(e => e.legalName.toLowerCase().includes(legalEntityName) || (e.dba && e.dba.toLowerCase().includes(legalEntityName))) || entities[0];
          
          const locName = String(row['Service Locations'] || row['Location'] || '').toLowerCase();
          const matchedLoc = locations.find(l => l.name.toLowerCase().includes(locName) || l.city.toLowerCase().includes(locName)) || locations[0];

          return {
            id: recId,
            providerId: matchedProv?.id || 'prv-1',
            payerId: matchedPayer?.id || 'pyr-1',
            entityId: matchedEntity?.id || 'ent-1',
            locationId: matchedLoc?.id || 'loc-1',
            applicationType: appType,
            discipline: matchedProv?.disciplines?.[0] || 'ABA',
            stage,
            assignedSpecialistId: 'usr-1',
            assignedSpecialistName: row['Assigned Specialist'] || row['Specialist'] || 'Sanjay Tom',
            intakeDate: row['Intake Date'] || '2026-01-10',
            submissionDate: row['Submission Date'] || '2026-01-15',
            targetTurnaroundDate: row['Target Turnaround Date'] || '2026-04-15',
            nextFollowUpDate: row['Next Follow-Up Date'] || '2026-03-01',
            isOverdue: false,
            daysInCurrentStage: 12,
            totalCycleDays: 35,
            linkingStatus: (row['Linking Status'] as LinkingStatus) || 'Not Applicable',
            contractStatus: (row['Contract Status'] as ContractStatus) || 'Contract Executed',
            followUps: [],
            checklist: [],
            documents: [],
            validationIssues: [],
            notes: row['Notes'] || row['PAVE Tracking Number'] ? `PAVE: ${row['PAVE Tracking Number']}` : 'Imported via spreadsheet batch.',
            auditTrail: [
              {
                id: `aud-${Date.now()}-${idx}`,
                timestamp: new Date().toLocaleString(),
                userId: 'admin',
                userName: 'Administrator',
                action: 'Bulk Ingested from Excel',
                notes: `Imported from spreadsheet batch. Entity: ${matchedEntity?.legalName}`,
              },
            ],
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
          };
        });

        importBulkData(importedRecords);
        setImportStatus({
          type: 'success',
          message: `Successfully imported ${importedRecords.length} Credentialing Records into Active Tracking!`,
        });
        setParsedRows([]);
        setFile(null);
      } else if (category === 'payers') {
        const importedPayers: Payer[] = parsedRows.map((row, idx) => ({
          id: `pyr-imp-${Date.now()}-${idx}`,
          name: row['Payer Name'] || `Payer Plan ${idx + 1}`,
          code: row['Payer Code'] || `PAY${idx + 100}`,
          type: row['Payer Type'] || row['Type'] || 'Commercial',
          portalUrl: row['Portal URL'] || 'https://payer.availity.com',
          portalCredentialsSummary: 'Stored in credential vault',
          standardTurnaroundDays: Number(row['SLA Days']) || 60,
          requiresCAQH: String(row['Requires CAQH']).toLowerCase().includes('y'),
          requiresPAVE: String(row['Requires PAVE']).toLowerCase().includes('y'),
          requiresDirectForm: String(row['Requires Direct Form']).toLowerCase().includes('y'),
          rosterAcceptanceMethod: row['Roster Acceptance Method'] || row['Roster Method'] || 'Portal Upload',
          rosterCadence: row['Roster Cadence'] || 'Monthly',
          contacts: [],
          requirementsSummary: row['Requirements Summary'] || row['Requirements'] || 'Requires CAQH attestation, W9, Professional Liability COI',
          activeApplicationsCount: 0,
          approvedProvidersCount: 0,
          avgTurnaroundDays: Number(row['SLA Days']) ? Math.round(Number(row['SLA Days']) * 0.75) : 45,
          credentialingMethod: row['Credentialing Method'] || 'CAQH Direct',
          notes: row['Notes'] || 'Imported via spreadsheet batch',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        }));

        importBulkData([], [], importedPayers);
        setImportStatus({
          type: 'success',
          message: `Successfully registered ${importedPayers.length} new Payer profiles!`,
        });
        setParsedRows([]);
        setFile(null);
      }
    } catch (err: any) {
      setImportStatus({ type: 'error', message: `Import failed: ${err.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // Get column headers definition from schema dictionaries
  const getHeadersForCategory = (type: ImportCategory): string[] => {
    return schemaDictionaries[type].map(col => col.field);
  };

  // Blank template with clean headers only (no mock people names)
  const getBlankTemplateData = (type: ImportCategory) => {
    const headers = getHeadersForCategory(type);
    const blankRow: Record<string, string> = {};
    headers.forEach(h => {
      blankRow[h] = '';
    });
    return [blankRow];
  };

  // Export actual real records currently loaded in the system
  const getExistingDataForExport = (type: ImportCategory) => {
    if (type === 'providers') {
      if (providers.length === 0) return getBlankTemplateData('providers');
      return providers.map(p => {
        const primaryEnt = entities.find(e => e.id === p.primaryEntityId);
        const allEnts = (p.entityIds || [p.primaryEntityId || ''])
          .map(id => entities.find(e => e.id === id)?.legalName)
          .filter(Boolean)
          .join(', ');
        const locNames = (p.locationIds || [])
          .map(id => locations.find(l => l.id === id)?.name)
          .filter(Boolean)
          .join(', ');
        const enrollments = (p.payerEnrollments || [])
          .map(pe => `${pe.payerName} (${pe.status})`)
          .join('; ');

        return {
          'First Name': p.firstName,
          'Last Name': p.lastName,
          'Credentials': p.credentials || '',
          'Disciplines': (p.disciplines || []).join(', '),
          'Provider Type': p.providerType || '',
          'NPI': p.npi || '',
          'CAQH ID': p.caqhId || '',
          'CAQH Status': p.caqhStatus || 'Attested',
          'PAVE Status': p.paveStatus || 'Approved',
          'PAVE Tracking Number': p.paveTrackingNumber || '',
          'Taxonomy': p.taxonomy || '',
          'Specialty': p.specialty || '',
          'Email': p.email || '',
          'Phone': p.phone || '',
          'Alt Phone': p.altPhone || '',
          'Contact Address': p.contactAddress || '',
          'License Number': p.licenseNumber || '',
          'License State': p.licenseState || 'CA',
          'License Expiration': p.licenseExpiration || '',
          'Primary Legal Entity': primaryEnt?.legalName || entities[0]?.legalName || '',
          'Entity Affiliations': allEnts || primaryEnt?.legalName || '',
          'DBA': p.dba || primaryEnt?.dba || '',
          'Employment Status': p.employmentStatus || 'Full-Time',
          'Contract Classification': p.contractStatus || 'W-2 Full-Time',
          'Hire Date': p.startDate || '',
          'Group Affiliation Name': p.groupAffiliation || '',
          'Service Locations': locNames || '',
          'Service Delivery Types': (p.serviceTypes || []).join(', '),
          'Location Effective Date': p.locationEffectiveDate || p.startDate || '',
          'Insurance Enrollments': enrollments,
          'Notes': p.notes || ''
        };
      });
    } else if (type === 'applications') {
      if (records.length === 0) return getBlankTemplateData('applications');
      return records.map(r => {
        const prov = providers.find(p => p.id === r.providerId);
        const payer = payers.find(p => p.id === r.payerId);
        const ent = entities.find(e => e.id === r.entityId);
        const loc = locations.find(l => l.id === r.locationId);
        return {
          'Application ID': r.id,
          'Provider NPI': prov?.npi || '',
          'Provider Name': prov ? `${prov.firstName} ${prov.lastName}` : '',
          'Payer Name': payer?.name || '',
          'Discipline': r.discipline || prov?.disciplines?.[0] || 'ABA',
          'Application Type': r.applicationType,
          'Legal Entity': ent?.legalName || '',
          'Service Locations': loc?.name || '',
          'Stage': r.stage,
          'Assigned Specialist': r.assignedSpecialistName || '',
          'Intake Date': r.intakeDate || '',
          'Submission Date': r.submissionDate || '',
          'Target Turnaround Date': r.targetTurnaroundDate || '',
          'Next Follow-Up Date': r.nextFollowUpDate || '',
          'Linking Status': r.linkingStatus || 'Not Applicable',
          'Contract Status': r.contractStatus || 'Contract Executed',
          'PAVE Tracking Number': prov?.paveTrackingNumber || '',
          'Notes': r.notes || ''
        };
      });
    } else {
      if (payers.length === 0) return getBlankTemplateData('payers');
      return payers.map(p => ({
        'Payer Name': p.name,
        'Payer Code': p.code,
        'Payer Type': p.type,
        'SLA Days': p.standardTurnaroundDays,
        'Portal URL': p.portalUrl,
        'Credentialing Method': p.credentialingMethod || 'CAQH Direct',
        'Requires CAQH': p.requiresCAQH ? 'Yes' : 'No',
        'Requires PAVE': p.requiresPAVE ? 'Yes' : 'No',
        'Requires Direct Form': p.requiresDirectForm ? 'Yes' : 'No',
        'Roster Acceptance Method': p.rosterAcceptanceMethod,
        'Roster Cadence': p.rosterCadence,
        'Requirements Summary': p.requirementsSummary,
        'Notes': p.notes || ''
      }));
    }
  };

  const handleDownloadTemplate = (type: ImportCategory, format: 'xlsx' | 'csv' = 'xlsx', exportLive: boolean = false) => {
    const dataToExport = exportLive ? getExistingDataForExport(type) : getBlankTemplateData(type);
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${type}_schema`);

    const filePrefix = exportLive ? 'Proficio_export' : 'Proficio_blank_template';
    const fileBase = `${filePrefix}_${type}`;

    if (format === 'csv') {
      XLSX.writeFile(wb, `${fileBase}.csv`, { bookType: 'csv' });
    } else {
      XLSX.writeFile(wb, `${fileBase}.xlsx`);
    }
  };

  const copyTemplateClipboard = (type: ImportCategory) => {
    const headers = getHeadersForCategory(type);
    const headerRow = headers.join('\t');

    navigator.clipboard.writeText(headerRow).then(() => {
      setCopiedTemplate(type);
      setTimeout(() => setCopiedTemplate(null), 2500);
    });
  };

  // Detailed Schema Reference Dictionary
  const schemaDictionaries: Record<ImportCategory, Array<{ field: string; type: string; req: string; description: string; example: string }>> = {
    providers: [
      { field: 'First Name', type: 'String', req: 'Required', description: 'Legal first name of the clinician', example: 'Rachel' },
      { field: 'Last Name', type: 'String', req: 'Required', description: 'Legal last name of the clinician', example: 'Green' },
      { field: 'Credentials', type: 'String', req: 'Required', description: 'Professional degree & license credentials', example: 'MS, CCC-SLP' },
      { field: 'Disciplines', type: 'String', req: 'Required', description: 'Clinical disciplines (ABA, Speech, OT, PT, Mental Health)', example: 'Speech' },
      { field: 'Provider Type', type: 'String', req: 'Required', description: 'Role classification (BCBA, SLP, OTR/L, PT, LMFT, LCSW, RBT)', example: 'SLP' },
      { field: 'NPI', type: 'String (10)', req: 'Required', description: 'Individual Type 1 National Provider Identifier', example: '1849204918' },
      { field: 'CAQH ID', type: 'String (8)', req: 'Required', description: 'CAQH ProView profile ID number', example: '14920481' },
      { field: 'CAQH Status', type: 'Enum', req: 'Optional', description: 'Attested, Initial, Re-attestation Due, Expired', example: 'Attested' },
      { field: 'PAVE Status', type: 'Enum', req: 'Optional', description: 'Approved, In Review, Needs Attestation, Expired', example: 'Approved' },
      { field: 'PAVE Tracking Number', type: 'String', req: 'Optional', description: 'California DHCS PAVE application tracking code', example: 'PAVE-2026-9482' },
      { field: 'Taxonomy', type: 'String (10)', req: 'Optional', description: 'Healthcare Provider Taxonomy Code', example: '235Z00000X' },
      { field: 'Specialty', type: 'String', req: 'Optional', description: 'Primary clinical subspecialty area', example: 'Speech-Language Pathology' },
      { field: 'Email', type: 'Email', req: 'Required', description: 'Official clinical corporate email address', example: 'rachel.green@proficiotherapy.com' },
      { field: 'Phone', type: 'Phone', req: 'Required', description: 'Primary contact phone number', example: '(555) 234-5678' },
      { field: 'Alt Phone', type: 'Phone', req: 'Optional', description: 'Secondary direct or mobile contact number', example: '(555) 234-5679' },
      { field: 'Contact Address', type: 'String', req: 'Optional', description: 'Mailing or service domicile address', example: '1240 S Bascom Ave, San Jose, CA 95128' },
      { field: 'License Number', type: 'String', req: 'Required', description: 'State professional license registration code', example: 'CA-SLP-9482' },
      { field: 'License State', type: 'String (2)', req: 'Required', description: 'Two-letter US state code', example: 'CA' },
      { field: 'License Expiration', type: 'Date (YYYY-MM-DD)', req: 'Required', description: 'Current license expiration date', example: '2027-12-31' },
      { field: 'Primary Legal Entity', type: 'String', req: 'Required', description: 'Primary billing legal entity (or DBA)', example: 'Ages Learning Solutions Inc' },
      { field: 'Entity Affiliations', type: 'String (comma-sep)', req: 'Optional', description: 'Multiple group practice legal entities clinician is affiliated with', example: 'Ages Learning Solutions Inc, Proficio Therapy LLC' },
      { field: 'DBA', type: 'String', req: 'Optional', description: 'Operating clinic Doing Business As trade name', example: 'Ages Bay Area Clinic' },
      { field: 'Employment Status', type: 'Enum', req: 'Required', description: 'Full-Time, Part-Time, Contractor, PRN', example: 'Full-Time' },
      { field: 'Contract Classification', type: 'String', req: 'Optional', description: 'W-2 Full-Time, W-2 Part-Time, 1099 Contractor', example: 'W-2 Full-Time' },
      { field: 'Hire Date', type: 'Date (YYYY-MM-DD)', req: 'Required', description: 'Clinical staff onboarding date', example: '2024-01-15' },
      { field: 'Group Affiliation Name', type: 'String', req: 'Optional', description: 'Group clinical practice banner', example: 'Ages Pediatric Therapy Group' },
      { field: 'Service Locations', type: 'String (comma-sep)', req: 'Required', description: 'Multiple physical clinics and in-home territories assigned to staff', example: 'San Jose Main Clinic, Silicon Valley Mobile In-Home' },
      { field: 'Service Delivery Types', type: 'String (comma-sep)', req: 'Optional', description: 'In-Clinic, In-Home, In-School, Telehealth', example: 'In-Clinic, In-Home, Telehealth' },
      { field: 'Location Effective Date', type: 'Date (YYYY-MM-DD)', req: 'Optional', description: 'Effective date for location assignments', example: '2024-01-15' },
      { field: 'Insurance Enrollments', type: 'String (semicolon-sep)', req: 'Optional', description: 'Multiple insurance plans enrolled with status in parentheses', example: 'Aetna (In Progress); Blue Shield (In-Network); Optum (In Progress)' },
      { field: 'Notes', type: 'String', req: 'Optional', description: 'Clinical intake, onboarding, or credentialing remarks', example: 'Pediatric feeding specialist' },
    ],
    applications: [
      { field: 'Application ID', type: 'String', req: 'Optional', description: 'Unique tracking ID (auto-generated if empty)', example: 'APP-2026-0891' },
      { field: 'Provider NPI', type: 'String (10)', req: 'Required', description: 'NPI-1 of the clinician to link with application', example: '1849204918' },
      { field: 'Provider Name', type: 'String', req: 'Optional', description: 'Clinician full name for fallback mapping', example: 'Rachel Green, MS, CCC-SLP' },
      { field: 'Payer Name', type: 'String', req: 'Required', description: 'Contracted health plan name', example: 'Blue Shield of California' },
      { field: 'Discipline', type: 'String', req: 'Required', description: 'Clinical discipline (ABA, Speech, OT, PT)', example: 'Speech' },
      { field: 'Application Type', type: 'Enum', req: 'Required', description: 'Initial credentialing, Re-credentialing, Location Addition, Rendering Provider Linkage', example: 'Initial credentialing' },
      { field: 'Legal Entity', type: 'String', req: 'Required', description: 'Group legal entity billing this application', example: 'Ages Learning Solutions Inc' },
      { field: 'Service Locations', type: 'String (comma-sep)', req: 'Optional', description: 'Assigned practice clinics/territories', example: 'San Jose Main Clinic' },
      { field: 'Stage', type: 'Enum', req: 'Required', description: 'Application Submitted, Document Gathering, Internal Review, Payer Processing, Approved & Linking, Linking Completed', example: 'Application Submitted' },
      { field: 'Assigned Specialist', type: 'String', req: 'Optional', description: 'Credentialing coordinator name', example: 'Sanjay Tom' },
      { field: 'Intake Date', type: 'Date (YYYY-MM-DD)', req: 'Optional', description: 'Application initiation date', example: '2026-01-10' },
      { field: 'Submission Date', type: 'Date (YYYY-MM-DD)', req: 'Optional', description: 'Formal payer package transmission date', example: '2026-02-10' },
      { field: 'Target Turnaround Date', type: 'Date (YYYY-MM-DD)', req: 'Optional', description: 'Calculated SLA completion target', example: '2026-04-20' },
      { field: 'Next Follow-Up Date', type: 'Date (YYYY-MM-DD)', req: 'Optional', description: 'Next scheduled payer outreach', example: '2026-03-05' },
      { field: 'Linking Status', type: 'Enum', req: 'Optional', description: 'Not Applicable, In Progress, Pending Roster Confirmation, Linked / Active', example: 'Pending Roster Confirmation' },
      { field: 'Contract Status', type: 'Enum', req: 'Optional', description: 'Contract Executed, In Negotiation, Not Started', example: 'Contract Executed' },
      { field: 'PAVE Tracking Number', type: 'String', req: 'Optional', description: 'DHCS Medi-Cal application number', example: 'PAVE-2026-9482' },
      { field: 'Notes', type: 'String', req: 'Optional', description: 'Filing history and portal notes', example: 'Submitted via Availity portal' },
    ],
    payers: [
      { field: 'Payer Name', type: 'String', req: 'Required', description: 'Full insurance plan title', example: 'Optum / UnitedHealthcare' },
      { field: 'Payer Code', type: 'String', req: 'Required', description: 'Internal payer code / EDI payer ID', example: 'UHC01' },
      { field: 'Payer Type', type: 'Enum', req: 'Required', description: 'Commercial, Medicaid / Medi-Cal, Regional', example: 'Commercial' },
      { field: 'SLA Days', type: 'Number', req: 'Required', description: 'Standard turnaround SLA benchmark in calendar days', example: '60' },
      { field: 'Portal URL', type: 'URL', req: 'Optional', description: 'Provider credentialing portal URL', example: 'https://www.uhcprovider.com' },
      { field: 'Credentialing Method', type: 'String', req: 'Optional', description: 'CAQH Direct, Availity Portal, State PAVE Portal, Paper Form', example: 'CAQH Direct' },
      { field: 'Requires CAQH', type: 'Yes / No', req: 'Optional', description: 'Whether CAQH ProView attestation is required', example: 'Yes' },
      { field: 'Requires PAVE', type: 'Yes / No', req: 'Optional', description: 'Whether California PAVE portal filing is required', example: 'No' },
      { field: 'Requires Direct Form', type: 'Yes / No', req: 'Optional', description: 'Whether custom payer direct packet is required', example: 'Yes' },
      { field: 'Roster Acceptance Method', type: 'String', req: 'Optional', description: 'Portal Upload, Email Roster, Availity Roster', example: 'Portal Upload' },
      { field: 'Roster Cadence', type: 'String', req: 'Optional', description: 'Monthly, Bi-Weekly, Quarterly', example: 'Monthly' },
      { field: 'Requirements Summary', type: 'String', req: 'Optional', description: 'Summary of documentation required by payer', example: 'CAQH attestation, W-9, Professional Liability COI' },
      { field: 'Notes', type: 'String', req: 'Optional', description: 'Operational tips and contact details', example: 'Accepts monthly standard therapy rosters' },
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Administration</span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-semibold text-[#2B4C9D]">Data Integration</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">
              Spreadsheet Bulk Ingestion & Schema Templates
            </h1>
          </div>
        </div>

        {/* Quick Nav actions */}
        <div className="flex items-center space-x-2">
          {onNavigateToProviders && (
            <button
              onClick={onNavigateToProviders}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Clinical Staff Master</span>
            </button>
          )}
          {onNavigateToTracker && (
            <button
              onClick={onNavigateToTracker}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Application Tracker</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Dataset & Ingestion Mode Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            1. Select Target Dataset to Ingest or Inspect
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'providers',
                label: 'Clinical Staff Master Roster',
                desc: 'Multi-location, multi-entity affiliations, licenses, CAQH/PAVE, and multi-insurance enrollments',
                icon: Users,
              },
              {
                id: 'applications',
                label: 'Credentialing Applications',
                desc: 'Active payer submissions, filing dates, tracking numbers, SLAs, and stages',
                icon: Layers,
              },
              {
                id: 'payers',
                label: 'Payer Plan Directory',
                desc: 'Insurance payer codes, portal endpoints, turnaround SLAs, and roster rules',
                icon: Table,
              },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id as ImportCategory);
                    setSelectedSchemaCategory(cat.id as ImportCategory);
                    setParsedRows([]);
                    setHeaders([]);
                    setImportStatus(null);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#2B4C9D] bg-indigo-50/50 text-[#2B4C9D] ring-1 ring-[#2B4C9D]'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-xs">
                    <Icon className="w-4 h-4 text-[#2B4C9D]" />
                    <span>{cat.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{cat.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ingestion Mode Tabs */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveMode('upload')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeMode === 'upload'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Upload Excel / CSV File</span>
            </button>

            <button
              onClick={() => setActiveMode('paste')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeMode === 'paste'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Clipboard Table</span>
            </button>

            <button
              onClick={() => setActiveMode('templates')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeMode === 'templates'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Schema Templates & Data Dictionary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Mode Content */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        {activeMode === 'upload' && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-[#2B4C9D] bg-slate-50/50 hover:bg-indigo-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all"
            >
              <FileSpreadsheet className="w-10 h-10 text-[#2B4C9D] mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-800">
                Click or Drag & Drop Excel (.xlsx, .xls) or CSV file
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-lg mx-auto">
                Supports automated schema mapping, multi-location parsing, multi-entity mapping, and date formatting.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {fileName && (
              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl text-xs">
                <span className="font-mono text-slate-700 font-medium truncate">Selected: {fileName}</span>
                <button
                  onClick={() => {
                    setFile(null);
                    setFileName('');
                    setParsedRows([]);
                    setHeaders([]);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {activeMode === 'paste' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Paste Tab-Separated or CSV Data (Copy directly from Excel / Google Sheets):
              </label>
              <button
                type="button"
                onClick={() => {
                  const headers = getHeadersForCategory(category);
                  setPastedText(headers.join('\t') + '\n');
                }}
                className="text-[11px] font-bold text-[#2B4C9D] hover:underline cursor-pointer"
              >
                + Insert Header Row
              </button>
            </div>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder={`First Name\tLast Name\tCredentials\tDisciplines\tNPI\tLicense Number\tPrimary Legal Entity\tService Locations...`}
              className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
            />
            <div className="flex justify-end">
              <button
                onClick={handlePasteParse}
                className="px-4 py-2 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Parse Clipboard Rows
              </button>
            </div>
          </div>
        )}

        {activeMode === 'templates' && (
          <div className="space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Official Standardized Spreadsheet Schema Templates</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Download clean blank templates (headers only, no mock data) or export existing system records.
                  </p>
                </div>
              </div>

              {/* Template Download Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {[
                  { 
                    type: 'providers', 
                    label: 'Clinical Staff Master Template', 
                    desc: 'Clean schema for clinical staff intake: NPI-1, licensure, multi-entity, multi-location clinic/home territories, and multi-payer enrollments.'
                  },
                  { 
                    type: 'applications', 
                    label: 'Applications Tracker Template', 
                    desc: 'Clean schema for payer application filings, workflow stages, SLA turnaround targets, linking status, and PAVE tracking numbers.'
                  },
                  { 
                    type: 'payers', 
                    label: 'Payers Directory Template', 
                    desc: 'Clean schema for contracted health plans, SLA benchmarks, portal URLs, CAQH/PAVE requirements, and roster cadences.'
                  },
                ].map((t) => (
                  <div key={t.type} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col justify-between space-y-3 transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                          <FileSpreadsheet className="w-4 h-4" />
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                          {t.type === 'providers' ? '30+ Columns' : t.type === 'applications' ? '18 Columns' : '13 Columns'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-2.5">{t.label}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{t.desc}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Blank Template (Headers Only)
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleDownloadTemplate(t.type as ImportCategory, 'xlsx', false)}
                            className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                            title="Download blank spreadsheet with schema headers"
                          >
                            <Download className="w-3 h-3 text-emerald-600" />
                            <span>Blank .XLSX</span>
                          </button>
                          <button
                            onClick={() => handleDownloadTemplate(t.type as ImportCategory, 'csv', false)}
                            className="py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                            title="Download blank CSV with schema headers"
                          >
                            <Download className="w-3 h-3 text-sky-600" />
                            <span>Blank .CSV</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Export Live Data (Existing Only)
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleDownloadTemplate(t.type as ImportCategory, 'xlsx', true)}
                            className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-[#2B4C9D] text-[11px] font-semibold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                            title="Export live records currently loaded in the database"
                          >
                            <Download className="w-3 h-3 text-[#2B4C9D]" />
                            <span>Live .XLSX</span>
                          </button>
                          <button
                            onClick={() => handleDownloadTemplate(t.type as ImportCategory, 'csv', true)}
                            className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-[#2B4C9D] text-[11px] font-semibold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                            title="Export live records currently loaded in the database as CSV"
                          >
                            <Download className="w-3 h-3 text-[#2B4C9D]" />
                            <span>Live .CSV</span>
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => copyTemplateClipboard(t.type as ImportCategory)}
                        className="w-full py-1.5 bg-slate-200/70 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                      >
                        {copiedTemplate === t.type ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Headers Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Copy Schema Column Headers</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Schema & Field Dictionary Explorer */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-[#2B4C9D]" />
                    <span>Spreadsheet Schema & Column Dictionary</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Detailed field specifications, data validation formats, and sample values for accurate bulk onboarding.
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200">
                  {(['providers', 'applications', 'payers'] as ImportCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedSchemaCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedSchemaCategory === cat
                          ? 'bg-[#2B4C9D] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat === 'providers' ? 'Clinical Staff Schema' : cat === 'applications' ? 'Applications Schema' : 'Payers Schema'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schema Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 w-40 whitespace-nowrap">Column Name</th>
                        <th className="p-2.5 w-24 whitespace-nowrap">Data Type</th>
                        <th className="p-2.5 w-24 whitespace-nowrap">Requirement</th>
                        <th className="p-2.5 min-w-[200px]">Description & Ingestion Logic</th>
                        <th className="p-2.5 w-48 whitespace-nowrap">Example Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {schemaDictionaries[selectedSchemaCategory].map((col, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2.5 font-bold font-mono text-[11px] text-slate-800">{col.field}</td>
                          <td className="p-2.5 text-[11px] text-slate-600 font-mono">{col.type}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              col.req === 'Required' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {col.req}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600 leading-relaxed text-[11px]">{col.description}</td>
                          <td className="p-2.5 text-slate-500 font-mono text-[10px] truncate max-w-xs">{col.example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-[11px]">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Schema Notes:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-blue-800">
                    <li><strong>Service Locations:</strong> Multi-location values separated by commas or semicolons are automatically matched and assigned across active physical clinics and regional in-home territories.</li>
                    <li><strong>Insurance Enrollments:</strong> Supports multi-payer entries in the format <code>Payer Name (Status)</code> separated by semicolons (e.g. <code>Aetna (In Progress); Blue Shield (In-Network)</code>).</li>
                    <li><strong>Clean Architecture:</strong> Singular Primary Practice Base and Rendering Provider Information fields have been replaced with full multi-location and multi-entity relationship mapping.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Alert */}
        {importStatus && (
          <div className={`mt-4 p-4 rounded-xl text-xs flex items-center justify-between border ${
            importStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
            importStatus.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
            'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            <div className="flex items-center space-x-2">
              {importStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> :
               importStatus.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /> :
               <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />}
              <span>{importStatus.message}</span>
            </div>
            <button onClick={() => setImportStatus(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedRows.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Data Preview & Verification ({parsedRows.length} Rows Detected)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Review the mapped fields below before committing records to the live database.
                </p>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleExecuteImport}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Commit & Ingest {parsedRows.length} Records</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-72">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 text-center w-10">#</th>
                    {headers.map((h, i) => (
                      <th key={i} className="p-2.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedRows.slice(0, 50).map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-slate-50">
                      <td className="p-2.5 text-center text-slate-400 font-mono text-[10px]">{rowIdx + 1}</td>
                      {headers.map((h, colIdx) => (
                        <td key={colIdx} className="p-2.5 whitespace-nowrap text-slate-700 text-xs">
                          {row[h] !== undefined ? String(row[h]) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedRows.length > 50 && (
              <p className="text-[10px] text-slate-400 text-center">
                Showing first 50 rows of {parsedRows.length} parsed items. All {parsedRows.length} will be imported on commit.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

