import React, { useState, useRef } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import * as XLSX from 'xlsx';
import { 
  AlertCircle, 
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
  X 
} from 'lucide-react';
import { ApplicationType, CredentialingRecord, CredentialingStage, Discipline, Payer, Provider, ProviderType } from '../../types';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportCategory = 'providers' | 'applications' | 'payers';

export const DataImportModal: React.FC<DataImportModalProps> = ({ isOpen, onClose }) => {
  const { providers, payers, entities, locations, importBulkData, isAdmin } = useCredentialing();

  const [category, setCategory] = useState<ImportCategory>('providers');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'templates'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
          setImportStatus({ type: 'error', message: 'Spreadsheet appears to be empty or missing header rows.' });
          setIsProcessing(false);
          return;
        }

        const rawHeaders = (jsonData[0] || []).map((h: any) => String(h).trim());
        const rawRows = jsonData.slice(1).filter((row) => row.some((cell) => cell !== ''));

        // Convert to array of objects
        const objects = rawRows.map((row) => {
          const obj: any = {};
          rawHeaders.forEach((head, idx) => {
            let val = row[idx];
            if (val instanceof Date) {
              val = val.toISOString().split('T')[0];
            }
            obj[head] = val;
          });
          return obj;
        });

        setHeaders(rawHeaders);
        setParsedRows(objects);
        setImportStatus({
          type: 'success',
          message: `Successfully parsed ${objects.length} rows from "${fileObj.name}". Preview below before committing to database.`,
        });
      } catch (err: any) {
        setImportStatus({ type: 'error', message: `Error parsing file: ${err.message || 'Invalid format'}` });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(fileObj);
  };

  // Process Pasted CSV / TSV text
  const handleParsePastedText = () => {
    if (!pastedText.trim()) return;

    try {
      const lines = pastedText.trim().split('\n');
      if (lines.length < 2) {
        setImportStatus({ type: 'error', message: 'Please provide at least a header row and one data row.' });
        return;
      }

      // Check delimiter (comma or tab)
      const delimiter = lines[0].includes('\t') ? '\t' : ',';
      const rawHeaders = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ''));

      const objects: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ''));
        if (row.length === 0 || (row.length === 1 && !row[0])) continue;
        const obj: any = {};
        rawHeaders.forEach((h, idx) => {
          obj[h] = row[idx] || '';
        });
        objects.push(obj);
      }

      setHeaders(rawHeaders);
      setParsedRows(objects);
      setImportStatus({
        type: 'success',
        message: `Parsed ${objects.length} rows from tabular text.`,
      });
    } catch (err) {
      setImportStatus({ type: 'error', message: 'Failed to parse tabular data. Please check delimiter formatting.' });
    }
  };

  // Convert parsed rows into domain model and commit to context
  const handleCommitImport = () => {
    if (parsedRows.length === 0) return;

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
          message: `Successfully ingested ${importedRecords.length} Credentialing Pipeline applications!`,
        });
      } else if (category === 'payers') {
        const importedPayers: Payer[] = parsedRows.map((row, idx) => ({
          id: `pyr-imp-${Date.now()}-${idx}`,
          name: row['Payer Name'] || row['Name'] || `Payer ${idx + 1}`,
          type: row['Payer Type'] || 'Commercial',
          statesServed: ['CA'],
          contacts: [],
          requiredDocuments: ['State License', 'W-9', 'COI'],
          requiredFields: ['NPI', 'Taxonomy', 'CAQH ID'],
          averageTatDays: Number(row['Average TAT Days']) || 60,
          followUpCadenceDays: Number(row['Follow Up Cadence Days']) || 7,
          submissionMethod: row['Submission Method'] || 'Online Portal / Availity',
          active: true,
        }));

        importBulkData([], [], importedPayers);
        setImportStatus({
          type: 'success',
          message: `Successfully ingested ${importedPayers.length} Health Plan Payers into Directory!`,
        });
      }

      setTimeout(() => {
        setParsedRows([]);
        setFile(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setImportStatus({ type: 'error', message: `Import error: ${err.message || 'Validation failed'}` });
    }
  };

  // Download Sample Template for Excel / CSV
  const handleDownloadTemplate = (cat: ImportCategory) => {
    let templateData: any[] = [];
    let defaultFileName = '';

    if (cat === 'providers') {
      defaultFileName = 'Proficio_Providers_Roster_Template.xlsx';
      templateData = [
        {
          'First Name': 'Rachel',
          'Last Name': 'Green',
          'NPI': '1948572910',
          'Credentials': 'MS, BCBA, LBA',
          'Provider Type': 'BCBA',
          'Discipline': 'ABA',
          'Email': 'rachel.green@proficiotherapy.com',
          'Phone': '(408) 555-0182',
          'License Number': '1-19-48201',
          'License State': 'CA',
          'License Expiration': '2027-10-31',
          'Taxonomy': '103K00000X',
          'Specialty': 'Behavior Analysis',
          'Employment Status': 'Full-Time',
          'CAQH ID': '18492048',
          'CAQH Status': 'Attested',
          'PAVE Status': 'Approved',
        },
        {
          'First Name': 'Carlos',
          'Last Name': 'Mendez',
          'NPI': '1827491028',
          'Credentials': 'MS, CCC-SLP',
          'Provider Type': 'SLP',
          'Discipline': 'Speech',
          'Email': 'carlos.mendez@proficiotherapy.com',
          'Phone': '(408) 555-0193',
          'License Number': 'SP-28491',
          'License State': 'CA',
          'License Expiration': '2027-08-31',
          'Taxonomy': '235Z00000X',
          'Specialty': 'Speech-Language Pathology',
          'Employment Status': 'Full-Time',
          'CAQH ID': '19382019',
          'CAQH Status': 'Attested',
          'PAVE Status': 'Approved',
        },
      ];
    } else if (cat === 'applications') {
      defaultFileName = 'Proficio_Credentialing_Applications_Template.xlsx';
      templateData = [
        {
          'Application ID': 'APP-2026-801',
          'Provider NPI': '1948572910',
          'Provider Name': 'Rachel Green',
          'Payer Name': 'Blue Shield of California',
          'Application Type': 'Initial credentialing',
          'Stage': 'Application Submitted',
          'Intake Date': '2026-02-01',
          'Submission Date': '2026-02-05',
          'Next Follow-Up Date': '2026-02-19',
          'Specialist': 'Sanjay Tom',
        },
        {
          'Application ID': 'APP-2026-802',
          'Provider NPI': '1827491028',
          'Provider Name': 'Carlos Mendez',
          'Payer Name': 'Kaiser Permanente Northern California',
          'Application Type': 'Initial credentialing',
          'Stage': 'Payer Review',
          'Intake Date': '2026-01-20',
          'Submission Date': '2026-01-25',
          'Next Follow-Up Date': '2026-02-25',
          'Specialist': 'Elena Rostova',
        },
      ];
    } else {
      defaultFileName = 'Proficio_Payers_Directory_Template.xlsx';
      templateData = [
        {
          'Payer Name': 'Aetna Better Health California',
          'Payer Type': 'Commercial',
          'Average TAT Days': 60,
          'Follow Up Cadence Days': 7,
          'Submission Method': 'Availity / Online Portal',
        },
      ];
    }

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, defaultFileName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#111E42] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center space-x-2">
                <span>Excel & CSV Multi-Roster Ingestion Hub</span>
                <span className="bg-[#00A651] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ADMINISTRATOR TOOL
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Consolidate fragmented spreadsheets into the centralized Proficio database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Selector */}
        <div className="bg-[#EEF2FF] border-b border-[#2B4C9D]/20 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#2B4C9D]">Target Dataset:</span>
            <div className="flex bg-white rounded-xl p-1 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setCategory('providers');
                  setParsedRows([]);
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  category === 'providers'
                    ? 'bg-[#2B4C9D] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Providers Roster
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('applications');
                  setParsedRows([]);
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  category === 'applications'
                    ? 'bg-[#2B4C9D] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Applications Tracker
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('payers');
                  setParsedRows([]);
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  category === 'payers'
                    ? 'bg-[#2B4C9D] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Payers Directory
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleDownloadTemplate(category)}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-[#2B4C9D] border border-[#2B4C9D]/30 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#2B4C9D]" />
            <span>Download Sample Excel Template</span>
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#2B4C9D] text-[#2B4C9D] bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            File Upload (.xlsx, .xls, .csv)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'paste'
                ? 'border-[#2B4C9D] text-[#2B4C9D] bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Paste Tabular Data / CSV Stream
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Status alert */}
          {importStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 border ${
                importStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : importStatus.type === 'error'
                  ? 'bg-red-50 text-red-900 border-red-200'
                  : 'bg-blue-50 text-blue-900 border-blue-200'
              }`}
            >
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : importStatus.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <RefreshCw className="w-4 h-4 text-blue-600 shrink-0 animate-spin" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#2B4C9D] bg-slate-50 hover:bg-slate-100 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
              >
                <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-200 text-[#2B4C9D]">
                  <FileUp className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {fileName ? fileName : 'Click to select or drag & drop Excel (.xlsx, .xls) or CSV'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports multi-column spreadsheets with automated field mapping
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700">Paste Tabular Stream (CSV / TSV):</label>
                <span className="text-[11px] text-slate-500">Copy rows directly from Excel and paste here</span>
              </div>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={6}
                placeholder="First Name,Last Name,NPI,Credentials,Discipline,Provider Type,CAQH ID..."
                className="w-full p-3 font-mono text-[11px] bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleParsePastedText}
                  className="px-4 py-1.5 bg-[#2B4C9D] text-white font-bold rounded-lg text-xs hover:bg-[#223E80] cursor-pointer"
                >
                  Parse Pasted Rows
                </button>
              </div>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <Table className="w-4 h-4 text-emerald-600" />
                  <span>Parsed Data Preview ({parsedRows.length} Rows Detected)</span>
                </h4>
                <span className="text-[11px] text-slate-500">Showing first 5 sample rows</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-56">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      {headers.slice(0, 7).map((h, i) => (
                        <th key={i} className="px-3 py-2 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                      {headers.length > 7 && <th className="px-3 py-2">+{headers.length - 7} more</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-1.5 text-slate-400 font-mono">{idx + 1}</td>
                        {headers.slice(0, 7).map((h, i) => (
                          <td key={i} className="px-3 py-1.5 whitespace-nowrap text-slate-800">
                            {String(row[h] || '—')}
                          </td>
                        ))}
                        {headers.length > 7 && (
                          <td className="px-3 py-1.5 text-slate-400 text-[10px]">...</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal Action Bar */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center space-x-3">
              {parsedRows.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setParsedRows([]);
                    setFile(null);
                    setFileName('');
                  }}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-red-600 font-medium"
                >
                  Clear Data
                </button>
              )}

              <button
                type="button"
                disabled={parsedRows.length === 0}
                onClick={handleCommitImport}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all ${
                  parsedRows.length > 0
                    ? 'bg-[#00A651] hover:bg-[#008f45]'
                    : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Ingest & Commit {parsedRows.length} Records to System</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
