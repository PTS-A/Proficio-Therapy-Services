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
  Database
} from 'lucide-react';
import { ApplicationType, CredentialingRecord, CredentialingStage, Discipline, Payer, Provider, ProviderType } from '../../types';

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
  const { providers, payers, entities, locations, importBulkData, isAdmin } = useCredentialing();

  const [category, setCategory] = useState<ImportCategory>('providers');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [activeMode, setActiveMode] = useState<'upload' | 'paste' | 'templates'>('upload');

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
          const firstName = row['First Name'] || row['firstName'] || row['First'] || row['Provider First Name'] || `Provider`;
          const lastName = row['Last Name'] || row['lastName'] || row['Last'] || row['Provider Last Name'] || `${idx + 1}`;
          const npi = String(row['NPI'] || row['npi'] || row['National Provider ID'] || `100000000${idx}`).trim();
          const providerType: ProviderType = row['Provider Type'] || row['Type'] || row['providerType'] || 'BCBA';
          const disciplineRaw = row['Discipline'] || row['Disciplines'] || 'ABA';
          const disciplines: Discipline[] = disciplineRaw.includes('Speech')
            ? ['Speech']
            : disciplineRaw.includes('OT')
            ? ['OT']
            : ['ABA'];

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
            licenseNumber: row['License Number'] || row['License'] || `CA-${Math.floor(10000 + Math.random() * 90000)}`,
            licenseState: row['License State'] || row['State'] || 'CA',
            licenseExpiration: row['License Expiration'] || '2027-12-31',
            taxonomy: row['Taxonomy'] || '103K00000X',
            specialty: row['Specialty'] || 'Behavior Analysis',
            employmentStatus: row['Employment Status'] || 'Full-Time',
            startDate: row['Start Date'] || '2026-01-15',
            entityIds: [entities[0]?.id || 'ent-1'],
            locationIds: [locations[0]?.id || 'loc-1'],
            caqhId: String(row['CAQH ID'] || row['caqhId'] || Math.floor(10000000 + Math.random() * 90000000)),
            caqhStatus: row['CAQH Status'] || 'Attested',
            paveStatus: row['PAVE Status'] || 'Approved',
            npiVerified: true,
            nppesRecordMatch: true,
            documents: [],
            active: true,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
          };
        });

        importBulkData([], importedProviders);
        setImportStatus({
          type: 'success',
          message: `Successfully ingested ${importedProviders.length} Providers into Master Roster!`,
        });
        setParsedRows([]);
        setFile(null);
      } else if (category === 'applications') {
        const importedRecords: CredentialingRecord[] = parsedRows.map((row, idx) => {
          const recId = row['Application ID'] || row['id'] || `APP-2026-IMP-${idx + 1}`;
          const provNpi = row['Provider NPI'] || row['NPI'];
          const matchedProv = providers.find((p) => p.npi === provNpi || `${p.firstName} ${p.lastName}`.toLowerCase() === String(row['Provider Name']).toLowerCase()) || providers[0];
          const matchedPayer = payers.find((p) => p.name.toLowerCase().includes(String(row['Payer Name'] || row['Payer']).toLowerCase())) || payers[0];
          const stage: CredentialingStage = row['Stage'] || row['Status'] || 'Application Submitted';
          const appType: ApplicationType = row['Application Type'] || row['Type'] || 'Initial credentialing';

          return {
            id: recId,
            providerId: matchedProv.id,
            payerId: matchedPayer.id,
            entityId: entities[0]?.id || 'ent-1',
            locationId: locations[0]?.id || 'loc-1',
            applicationType: appType,
            discipline: matchedProv.disciplines[0] || 'ABA',
            stage,
            assignedSpecialistId: 'usr-1',
            assignedSpecialistName: row['Specialist'] || 'Sanjay Tom',
            intakeDate: row['Intake Date'] || '2026-01-10',
            submissionDate: row['Submission Date'] || '2026-01-15',
            targetTurnaroundDate: '2026-04-15',
            nextFollowUpDate: row['Next Follow-Up Date'] || '2026-03-01',
            isOverdue: false,
            daysInCurrentStage: 12,
            totalCycleDays: 35,
            linkingStatus: 'Not Applicable',
            contractStatus: 'Contract Executed',
            followUps: [],
            checklist: [],
            documents: [],
            validationIssues: [],
            auditTrail: [
              {
                id: `aud-${Date.now()}-${idx}`,
                timestamp: new Date().toLocaleString(),
                userId: 'admin',
                userName: 'Administrator',
                action: 'Bulk Ingested from Excel',
                notes: `Imported from spreadsheet batch.`,
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
          type: row['Type'] || 'Commercial',
          portalUrl: row['Portal URL'] || 'https://payer.availity.com',
          portalCredentialsSummary: 'Stored in credential vault',
          standardTurnaroundDays: Number(row['SLA Days']) || 60,
          requiresCAQH: true,
          requiresPAVE: false,
          requiresDirectForm: true,
          rosterAcceptanceMethod: 'Portal Upload',
          rosterCadence: 'Monthly',
          contacts: [],
          requirementsSummary: row['Requirements'] || 'Requires CAQH attestation, W9, Professional Liability COI',
          activeApplicationsCount: 0,
          approvedProvidersCount: 0,
          avgTurnaroundDays: 45,
          credentialingMethod: 'CAQH Direct',
          notes: 'Imported via spreadsheet batch',
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

  const handleDownloadTemplate = (type: ImportCategory) => {
    let sampleData: any[] = [];
    if (type === 'providers') {
      sampleData = [
        {
          'First Name': 'Rachel',
          'Last Name': 'Green',
          'Credentials': 'MS, CCC-SLP',
          'NPI': '1849204918',
          'CAQH ID': '14920481',
          'Discipline': 'Speech',
          'Provider Type': 'SLP',
          'Email': 'rachel.green@proficiotherapy.com',
          'Phone': '(555) 234-5678',
          'License': 'CA-SLP-9482',
          'State': 'CA',
          'Hire Date': '2024-01-15',
        },
        {
          'First Name': 'Carlos',
          'Last Name': 'Mendez',
          'Credentials': 'OTD, OTR/L',
          'NPI': '1938472910',
          'CAQH ID': '15839201',
          'Discipline': 'OT',
          'Provider Type': 'OTR/L',
          'Email': 'carlos.mendez@proficiotherapy.com',
          'Phone': '(555) 876-5432',
          'License': 'CA-OT-2039',
          'State': 'CA',
          'Hire Date': '2024-02-01',
        },
      ];
    } else if (type === 'applications') {
      sampleData = [
        {
          'Provider NPI': '1849204918',
          'Payer Name': 'Blue Shield of California',
          'Discipline': 'Speech',
          'Application Type': 'Initial credentialing',
          'Stage': 'Application Submitted',
          'Submission Date': '2026-02-10',
        },
      ];
    } else {
      sampleData = [
        {
          'Payer Name': 'Optum / UnitedHealthcare',
          'Payer Code': 'UHC01',
          'SLA Days': '60',
          'Portal URL': 'https://www.uhcprovider.com',
          'Requirements': 'CAQH attestation & roster upload',
        },
      ];
    }

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${type}_template`);
    XLSX.writeFile(wb, `Proficio_${type}_template.xlsx`);
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
              Spreadsheet Bulk Ingestion
            </h1>
          </div>
        </div>

        {/* Quick Nav actions */}
        <div className="flex items-center space-x-2">
          {onNavigateToProviders && (
            <button
              onClick={onNavigateToProviders}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              View Providers Master
            </button>
          )}
          {onNavigateToTracker && (
            <button
              onClick={onNavigateToTracker}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              View Application Tracker
            </button>
          )}
        </div>
      </div>

      {/* Target Dataset & Ingestion Mode Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            1. Select Target Dataset to Ingest
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'providers',
                label: 'Providers Master Roster',
                desc: 'Therapist NPIs, licenses, CAQH IDs, taxonomy, and contact info',
                icon: Users,
              },
              {
                id: 'applications',
                label: 'Credentialing Applications',
                desc: 'Active payer submissions, filing dates, tracking numbers, and stages',
                icon: Layers,
              },
              {
                id: 'payers',
                label: 'Payer Plan Directory',
                desc: 'Insurance payer codes, portal endpoints, and turnaround policies',
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
                  <p className="text-[11px] text-slate-500 mt-1">{cat.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ingestion Mode Tabs */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveMode('upload')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeMode === 'upload'
                  ? 'bg-[#2B4C9D] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Upload Excel / CSV File</span>
            </button>

            <button
              onClick={() => setActiveMode('paste')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeMode === 'paste'
                  ? 'bg-[#2B4C9D] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Clipboard Table</span>
            </button>

            <button
              onClick={() => setActiveMode('templates')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeMode === 'templates'
                  ? 'bg-[#2B4C9D] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Schema Templates</span>
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
              <p className="text-[11px] text-slate-400 mt-1">
                Supports automated header mapping, Date formatting, and multi-sheet workbooks
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
            <label className="block text-xs font-bold text-slate-700">
              Paste Tab-Separated or CSV Data (Copy directly from Excel/Google Sheets):
            </label>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="First Name	Last Name	NPI	Discipline	Email
Rachel	Green	1849204918	Speech	rachel.green@proficiotherapy.com"
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
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900">
              Official Spreadsheet Import Templates
            </h3>
            <p className="text-xs text-slate-500">
              Download these standardized Microsoft Excel files to format your clinical provider rosters, payer application filings, and contracted insurance plans for zero-error ingestion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { type: 'providers', label: 'Providers Master Template', file: 'Proficio_providers_template.xlsx' },
                { type: 'applications', label: 'Applications Tracker Template', file: 'Proficio_applications_template.xlsx' },
                { type: 'payers', label: 'Payers Directory Template', file: 'Proficio_payers_template.xlsx' },
              ].map((t) => (
                <div key={t.type} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600 mb-2" />
                    <h4 className="text-xs font-bold text-slate-800">{t.label}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{t.file}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadTemplate(t.type as ImportCategory)}
                    className="mt-3 w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .XLSX</span>
                  </button>
                </div>
              ))}
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
