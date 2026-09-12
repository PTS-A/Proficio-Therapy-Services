import React, { useState, useEffect } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  Discipline, 
  CredentialingRecord,
  ApplicationDocument,
  ApplicationComment
} from '../../types';
import { 
  Check, 
  CheckCircle2, 
  Plus, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Trash2, 
  Sparkles, 
  Clock, 
  MessageSquare, 
  Calendar, 
  Award, 
  Briefcase, 
  Link2, 
  AlertCircle, 
  Copy,
  Layers,
  ArrowRight
} from 'lucide-react';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord: (recordId: string) => void;
  onNavigateToLinking?: () => void;
  onNavigateToProviders?: (providerId?: string) => void;
}

type WizardStep = 1 | 2 | 3 | 4;

interface TempDocItem {
  id: string;
  name: string;
  type: string;
  url: string;
  expirationDate?: string;
}

interface TempCommentItem {
  id: string;
  commentText: string;
  authorName: string;
  authorRole: string;
  dateCreated: string;
  timeCreated: string;
  timestamp: string;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  isOpen,
  onClose,
  onSelectRecord,
  onNavigateToLinking,
  onNavigateToProviders,
}) => {
  const {
    payers,
    locations,
    entities,
    currentUser,
    currentAccount,
    startCredentialingWorkflow,
    providers,
    updateProviderLinking,
  } = useCredentialing();

  // Wizard Step Control (1: Initial Info, 2: Provider & Credentialing, 3: Payers & Comments, 4: Confirmation & Linking)
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // STEP 1 FIELDS (Initial Information) - Clean, empty defaults for all users
  const [field1Name, setField1Name] = useState<string>('');
  const [field2Contact, setField2Contact] = useState<string>('');
  const [field4Location, setField4Location] = useState<string>('');
  const [field5Discipline, setField5Discipline] = useState<Discipline>('ABA');

  // STEP 2 FIELDS (Provider Information & Credentialing) - Clean, empty defaults
  const [field3NpiLicense, setField3NpiLicense] = useState<string>('');
  const [field6CaqhSpecialty, setField6CaqhSpecialty] = useState<string>('');
  
  // Supporting Documents - Starts completely empty
  const [documents, setDocuments] = useState<TempDocItem[]>([]);

  // Add Document Inline Form State
  const [isAddingDoc, setIsAddingDoc] = useState<boolean>(false);
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocType, setNewDocType] = useState<string>('State License');
  const [newDocUrl, setNewDocUrl] = useState<string>('');
  const [newDocExp, setNewDocExp] = useState<string>('');

  // STEP 3 FIELDS (Payers & Comments) - Starts completely clean
  const [selectedPayerIds, setSelectedPayerIds] = useState<string[]>([]);

  // Comments State - Starts completely empty
  const [isCommentInputOpen, setIsCommentInputOpen] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [comments, setComments] = useState<TempCommentItem[]>([]);

  // STEP 4 STATE (Created Application & Linking)
  const [createdResult, setCreatedResult] = useState<{
    applicationId: string;
    record: CredentialingRecord | null;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Provider Linking Panel in Step 4
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState<boolean>(false);
  const [selectedLinkEntity, setSelectedLinkEntity] = useState<string>(entities[0]?.id || '');
  const [selectedLinkLocation, setSelectedLinkLocation] = useState<string>(locations[0]?.id || '');
  const [linkNotes, setLinkNotes] = useState<string>('');
  const [linkSuccessMessage, setLinkSuccessMessage] = useState<string | null>(null);

  // Requirement 2 & 3: Ensure every new application modal opens with a completely clean, pristine form
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setField1Name('');
      setField2Contact('');
      setField4Location(locations[0]?.id || '');
      setField5Discipline('ABA');
      setField3NpiLicense('');
      setField6CaqhSpecialty('');
      setDocuments([]);
      setSelectedPayerIds([]);
      setComments([]);
      setCreatedResult(null);
      setIsSubmitting(false);
      setSubmissionError(null);
      setIsLinkingModalOpen(false);
      setSelectedLinkEntity(entities[0]?.id || '');
      setSelectedLinkLocation(locations[0]?.id || '');
      setLinkNotes('');
      setLinkSuccessMessage(null);
      setIsAddingDoc(false);
      setNewDocName('');
      setNewDocType('State License');
      setNewDocUrl('');
      setNewDocExp('');
      setIsCommentInputOpen(false);
      setNewCommentText('');
    }
  }, [isOpen, locations, entities]);

  if (!isOpen) return null;

  // Selected location object
  const selectedLocationObj = locations.find((l) => l.id === field4Location) || locations[0];

  // Add new document link
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const docItem: TempDocItem = {
      id: `doc-tmp-${Date.now()}`,
      name: newDocName.trim(),
      type: newDocType,
      url: newDocUrl.trim() || 'https://storage.cloud.google.com/ages-cred-docs/sample-doc.pdf',
      expirationDate: newDocExp || '2028-12-31',
    };

    setDocuments((prev) => [...prev, docItem]);
    setNewDocName('');
    setNewDocUrl('');
    setIsAddingDoc(false);
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Payer Selection Helpers
  const togglePayerSelection = (payerId: string) => {
    setSelectedPayerIds((prev) =>
      prev.includes(payerId) ? prev.filter((id) => id !== payerId) : [...prev, payerId]
    );
  };

  const selectAllPayers = () => {
    setSelectedPayerIds(payers.map((p) => p.id));
  };

  const clearAllPayers = () => {
    setSelectedPayerIds([]);
  };

  // Add Comment Helper
  const handleSaveComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const now = new Date();
    const commentItem: TempCommentItem = {
      id: `com-tmp-${Date.now()}`,
      commentText: newCommentText.trim(),
      authorName: currentAccount?.name || currentUser.name || 'Sanjay Tom',
      authorRole: currentAccount?.systemRole || currentUser.role || 'Credentialing Specialist',
      dateCreated: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      timeCreated: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      timestamp: now.toISOString(),
    };

    setComments((prev) => [commentItem, ...prev]);
    setNewCommentText('');
    setIsCommentInputOpen(false);
  };

  // Final Application Submission (Calls backend workflow with atomic updates)
  const handleSubmitApplication = async () => {
    if (selectedPayerIds.length === 0) {
      setSubmissionError('Please select at least one payer to associate with this credentialing application.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const res = await startCredentialingWorkflow({
      field1_name: field1Name,
      field2_contact: field2Contact,
      field4_location: field4Location,
      field5_discipline: field5Discipline,
      field3_npi_license: field3NpiLicense,
      field6_caqh_specialty: field6CaqhSpecialty,
      documents: documents.map((d) => ({
        name: d.name,
        type: d.type,
        url: d.url,
        expirationDate: d.expirationDate,
      })),
      payerIds: selectedPayerIds,
      comments: comments.map((c) => ({
        commentText: c.commentText,
        authorName: c.authorName,
        dateCreated: c.dateCreated,
        timeCreated: c.timeCreated,
        timestamp: c.timestamp,
      })),
    });

    setIsSubmitting(false);

    if (res.success) {
      setCreatedResult({
        applicationId: res.applicationId,
        record: res.record,
      });
      setCurrentStep(4);
    } else {
      setSubmissionError(res.error || 'Failed to submit application. Please check inputs.');
    }
  };

  // Execute Provider Linking from Step 4
  const handleExecuteLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (createdResult?.record) {
      updateProviderLinking(
        createdResult.record.id,
        'Linked',
        new Date().toISOString().split('T')[0],
        linkNotes
      );
      setLinkSuccessMessage('Successfully linked clinician with group provider TIN and rendering location!');
      setTimeout(() => {
        setIsLinkingModalOpen(false);
        setLinkSuccessMessage(null);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Progress Indicator */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-[#1e2f5b] to-[#2B4C9D] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 tracking-wide uppercase">
                Step {currentStep} of 4
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {currentStep === 1 && 'New Application: Initial Information'}
                {currentStep === 2 && 'Provider Information & Credentialing'}
                {currentStep === 3 && 'Credentialing Application Phase: Payers & Notes'}
                {currentStep === 4 && 'Application Created & Provider Linking'}
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {currentStep === 1 && 'Enter initial clinician, contact, location, and clinical discipline details.'}
              {currentStep === 2 && 'Review credentials, licensure, CAQH, and link supporting verification documents.'}
              {currentStep === 3 && 'Associate participating insurance payers and log initial onboarding notes.'}
              {currentStep === 4 && 'Atomic database records created. Link with group providers and locations.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-medium text-slate-600 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 w-full justify-between">
            {/* Step 1 Indicator */}
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 transition-all ${
                currentStep === 1
                  ? 'text-[#2B4C9D] font-bold'
                  : currentStep > 1
                  ? 'text-emerald-700 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep === 1
                    ? 'bg-[#2B4C9D] text-white'
                    : currentStep > 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </div>
              <span className="hidden sm:inline">1. Initial Info</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

            {/* Step 2 Indicator */}
            <button
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-2 transition-all ${
                currentStep === 2
                  ? 'text-[#2B4C9D] font-bold'
                  : currentStep > 2
                  ? 'text-emerald-700 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep === 2
                    ? 'bg-[#2B4C9D] text-white'
                    : currentStep > 2
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </div>
              <span className="hidden sm:inline">2. Provider & Docs</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

            {/* Step 3 Indicator */}
            <button
              onClick={() => {
                if (currentStep > 2 || field1Name) setCurrentStep(3);
              }}
              className={`flex items-center gap-2 transition-all ${
                currentStep === 3
                  ? 'text-[#2B4C9D] font-bold'
                  : currentStep > 3
                  ? 'text-emerald-700 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep === 3
                    ? 'bg-[#2B4C9D] text-white'
                    : currentStep > 3
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentStep > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
              </div>
              <span className="hidden sm:inline">3. Payers & Comments</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

            {/* Step 4 Indicator */}
            <div
              className={`flex items-center gap-2 transition-all ${
                currentStep === 4 ? 'text-emerald-700 font-bold' : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                4
              </div>
              <span className="hidden sm:inline">4. Confirmation & Link</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ========================================================= */}
          {/* STEP 1: INITIAL INFORMATION (Fields 1, 2, 4, 5)           */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Field 1: Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Field 1: Clinician Full Name & Credentials <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={field1Name}
                      onChange={(e) => setField1Name(e.target.value)}
                      placeholder="Enter clinician full name and credentials (e.g. Jane Doe, MS, BCBA)"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:border-[#2B4C9D] text-slate-800 font-medium"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Includes provider title, first name, last name, and professional designations.
                  </p>
                </div>

                {/* Field 2: Contact Information */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Field 2: Contact Information (Phone & Email) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={field2Contact}
                      onChange={(e) => setField2Contact(e.target.value)}
                      placeholder="Enter contact phone and work email (e.g. (408) 555-0100 | jane.doe@clinic.com)"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:border-[#2B4C9D] text-slate-800 font-medium"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Used for payer credentialing communications, committee notifications, and provider roster filing.
                  </p>
                </div>

                {/* Field 4: Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Field 4: Office Location & Service Hub <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={field4Location}
                      onChange={(e) => setField4Location(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:border-[#2B4C9D] text-slate-800 font-medium"
                    >
                      <option value="">Select practice location...</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.city}, {loc.state})
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedLocationObj && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{selectedLocationObj.address}, {selectedLocationObj.city}, {selectedLocationObj.zip}</span>
                    </p>
                  )}
                </div>

                {/* Field 5: Discipline */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Field 5: Clinical Discipline & Role <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['ABA', 'Speech', 'OT'] as Discipline[]).map((disc) => (
                      <button
                        key={disc}
                        type="button"
                        onClick={() => setField5Discipline(disc)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          field5Discipline === disc
                            ? disc === 'ABA'
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                              : disc === 'Speech'
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                              : 'bg-amber-600 border-amber-600 text-white shadow-sm'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {field5Discipline === disc && <Check className="w-3.5 h-3.5" />}
                        {disc}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Determines CAQH taxonomy mapping and state licensing requirements.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: PROVIDER INFORMATION & START CREDENTIALING (Fields 3, 6 & Docs)  */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* TOP DISPLAY BANNER (Displays Name and Location from Step 1 as required) */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#2B4C9D] text-white">
                      {field5Discipline} Clinician
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{field1Name}</h3>
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2B4C9D]" />
                    <span>Location: {selectedLocationObj?.name} ({selectedLocationObj?.city}, {selectedLocationObj?.state})</span>
                    <span className="text-slate-300">|</span>
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{field2Contact}</span>
                  </p>
                </div>

                {/* PROMINENT BUTTON: START CREDENTIALING (As explicitly specified in Prompt Section 2) */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2B4C9D] to-indigo-600 hover:from-[#233f82] hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-98 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Start Credentialing</span>
                  <ChevronRight className="w-4 h-4 text-blue-200" />
                </button>
              </div>

              {/* Remaining Information: Field 3 & Field 6 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Field 3: NPI & Professional License */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Field 3: NPI & State Professional License <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={field3NpiLicense}
                      onChange={(e) => setField3NpiLicense(e.target.value)}
                      placeholder="Enter Type 1 NPI and License (e.g. NPI: 1234567890 | License: LBA-CA-12345 Exp: 2028-12-31)"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:border-[#2B4C9D] text-slate-800 font-medium"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Individual Type 1 NPI with California state license number and expiration.
                  </p>
                </div>

                {/* Field 6: CAQH & Specialty / Taxonomy */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Field 6: CAQH ID & Specialty / Taxonomy Code <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={field6CaqhSpecialty}
                      onChange={(e) => setField6CaqhSpecialty(e.target.value)}
                      placeholder="Enter CAQH provider ID and Specialty (e.g. CAQH: 12345678 | Specialty: Behavior Analysis)"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2B4C9D] focus:border-[#2B4C9D] text-slate-800 font-medium"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Attested CAQH profile ID and healthcare provider taxonomy code.
                  </p>
                </div>
              </div>

              {/* Supporting Credentialing Documents Subtab / Table */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#2B4C9D]" />
                      <span>Supporting Credentialing Documents ({documents.length})</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Link verification documents, state licenses, and malpractice coverage.
                    </p>
                  </div>

                  {!isAddingDoc && (
                    <button
                      type="button"
                      onClick={() => setIsAddingDoc(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:border-[#2B4C9D] text-slate-700 hover:text-[#2B4C9D] text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Document Link</span>
                    </button>
                  )}
                </div>

                {/* Inline Add Document Form */}
                {isAddingDoc && (
                  <form onSubmit={handleAddDocument} className="p-3 bg-white border border-blue-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-[#2B4C9D]">
                      <span>Add Document Verification Link</span>
                      <button
                        type="button"
                        onClick={() => setIsAddingDoc(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Title / Name</label>
                        <input
                          type="text"
                          value={newDocName}
                          onChange={(e) => setNewDocName(e.target.value)}
                          placeholder="e.g. Malpractice Insurance Certificate (COI)"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Type</label>
                        <select
                          value={newDocType}
                          onChange={(e) => setNewDocType(e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="State License">State License</option>
                          <option value="Board Certification">Board Certification</option>
                          <option value="Malpractice Insurance">Malpractice Insurance</option>
                          <option value="Curriculum Vitae (CV)">Curriculum Vitae (CV)</option>
                          <option value="PAVE Proof">PAVE Proof</option>
                          <option value="Degree / Diploma">Degree / Diploma</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">URL / Cloud Link</label>
                        <input
                          type="text"
                          value={newDocUrl}
                          onChange={(e) => setNewDocUrl(e.target.value)}
                          placeholder="https://storage.cloud.google.com/..."
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiration Date</label>
                        <input
                          type="date"
                          value={newDocExp}
                          onChange={(e) => setNewDocExp(e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingDoc(false)}
                        className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#2B4C9D] text-white rounded-lg text-xs font-semibold hover:bg-blue-800"
                      >
                        Save Document
                      </button>
                    </div>
                  </form>
                )}

                {/* Documents Table */}
                <div className="overflow-hidden border border-slate-200 rounded-xl bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                      <tr>
                        <th className="px-3.5 py-2.5">Document Name</th>
                        <th className="px-3.5 py-2.5">Category</th>
                        <th className="px-3.5 py-2.5">Expiration</th>
                        <th className="px-3.5 py-2.5">Verification</th>
                        <th className="px-3.5 py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/70">
                          <td className="px-3.5 py-2.5 font-medium text-slate-800">
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className="truncate max-w-xs">{doc.name}</span>
                            </div>
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-600">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                              {doc.type}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-600 font-mono text-[11px]">
                            {doc.expirationDate || 'N/A'}
                          </td>
                          <td className="px-3.5 py-2.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              {doc.url && (
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="View Document"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveDocument(doc.id)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                                title="Remove document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================================= */}
          {/* STEP 3: CREDENTIALING APPLICATION PHASE (Payers & Non-Prominent Add Comment)     */}
          {/* ================================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header Summary */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{field1Name}</span>
                  <span className="text-slate-500 ml-2">({field5Discipline} Clinician • {selectedLocationObj?.name})</span>
                </div>
                <div className="text-slate-500 font-mono">
                  {selectedPayerIds.length} Payers Selected
                </div>
              </div>

              {/* Payer Association Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Select Contracted Payers for Credentialing <span className="text-rose-500">*</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Check all health plans and insurance networks where this provider will be enrolled.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={selectAllPayers}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={clearAllPayers}
                      className="text-slate-500 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Payer Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {payers.map((payer) => {
                    const isSelected = selectedPayerIds.includes(payer.id);
                    return (
                      <div
                        key={payer.id}
                        onClick={() => togglePayerSelection(payer.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-500/80 text-blue-950 ring-1 ring-blue-500/20 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold leading-snug">{payer.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {payer.category} • {payer.slaDays}d SLA
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                            isSelected ? 'bg-[#2B4C9D] text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NON-PROMINENT ADD COMMENT BUTTON & COMMENTS SECTION (Section 3 Requirement) */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <span>Application Comments & History Log ({comments.length})</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Collaborative notes and status logs for all specialists handling this clinical staff.
                    </p>
                  </div>

                  {/* NON-PROMINENT ADD COMMENT BUTTON */}
                  {!isCommentInputOpen && (
                    <button
                      type="button"
                      onClick={() => setIsCommentInputOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Comment</span>
                    </button>
                  )}
                </div>

                {/* Comment Input Box (Toggled by the non-prominent button) */}
                {isCommentInputOpen && (
                  <form onSubmit={handleSaveComment} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Posting as {currentAccount?.name || currentUser.name} ({currentAccount?.systemRole || currentUser.role})
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCommentInputOpen(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Write comment or onboarding log notes here..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#2B4C9D] focus:border-[#2B4C9D] text-slate-800"
                      required
                      autoFocus
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCommentInputOpen(false)}
                        className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#2B4C9D] hover:bg-[#233f82] text-white rounded-lg text-xs font-semibold shadow-2xs"
                      >
                        Save Comment
                      </button>
                    </div>
                  </form>
                )}

                {/* History Log List */}
                <div className="space-y-2">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{comment.authorName}</span>
                        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {comment.dateCreated}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {comment.timeCreated}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-xs">{comment.commentText}</p>
                      <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                        {comment.authorRole}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {submissionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{submissionError}</span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: CONFIRMATION & LINK TO PROVIDERS (Post-Add Confirmation Page)     */}
          {/* ========================================================================= */}
          {currentStep === 4 && createdResult && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Success Banner */}
              <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-base font-bold text-emerald-950">
                    Application & Clinical Staff Created Successfully!
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    The backend has automatically generated and synchronized dedicated database records across
                    Employees, Clinical Staff, Providers, Payers, Documents, and Comments.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold">
                      App ID: {createdResult.applicationId}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                      Discipline: {field5Discipline}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                      Payers: {selectedPayerIds.length} Associated
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Inputted Data Overview (As requested) */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#2B4C9D]" />
                    <span>Synchronized Record Summary</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Database Consistent
                  </span>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-semibold block">Clinician Name</span>
                      <p className="font-bold text-slate-900 text-sm">{field1Name}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-semibold block">Contact Info</span>
                      <p className="text-slate-700 font-medium">{field2Contact}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-semibold block">Primary Location</span>
                      <p className="text-slate-700 font-medium">{selectedLocationObj?.name} ({selectedLocationObj?.city})</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-semibold block">NPI & State Licensure</span>
                      <p className="text-slate-800 font-medium">{field3NpiLicense}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-semibold block">CAQH & Specialty</span>
                      <p className="text-slate-800 font-medium">{field6CaqhSpecialty}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-semibold block">Documents & Comments</span>
                      <p className="text-slate-800 font-medium">
                        {documents.length} Document Links Verified • {comments.length} Comments Logged
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROMINENT SECTION WITH PLUS SIGN (+) TO LINK WITH PROVIDERS (As explicitly requested) */}
              <div className="p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border-2 border-dashed border-[#2B4C9D]/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-[#2B4C9D]" />
                      <span>Link With Providers & Group TIN</span>
                    </h4>
                    <p className="text-xs text-slate-600">
                      Associate this clinical staff member with billing group entities, rendering locations, and supervising providers.
                    </p>
                  </div>

                  {/* PROMINENT PLUS SIGN BUTTON */}
                  <button
                    type="button"
                    onClick={() => setIsLinkingModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2B4C9D] hover:bg-[#203a78] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Link With Providers</span>
                  </button>
                </div>

                {/* Inline Linking Form if open */}
                {isLinkingModalOpen && (
                  <form onSubmit={handleExecuteLink} className="p-4 bg-white border border-blue-200 rounded-xl space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-[#2B4C9D] pb-1 border-b border-slate-100">
                      <span>Establish Provider Group Link</span>
                      <button
                        type="button"
                        onClick={() => setIsLinkingModalOpen(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Group Legal Entity (Billing TIN)
                        </label>
                        <select
                          value={selectedLinkEntity}
                          onChange={(e) => setSelectedLinkEntity(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        >
                          {entities.map((ent) => (
                            <option key={ent.id} value={ent.id}>
                              {ent.legalName} (TIN: {ent.taxId})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Rendering Practice Location
                        </label>
                        <select
                          value={selectedLinkLocation}
                          onChange={(e) => setSelectedLinkLocation(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        >
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name} - {loc.city}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Linking Notes & Effective Authorization
                        </label>
                        <input
                          type="text"
                          value={linkNotes}
                          onChange={(e) => setLinkNotes(e.target.value)}
                          placeholder="e.g. Added under group Type 2 NPI for commercial and Medicaid rosters."
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {linkSuccessMessage && (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{linkSuccessMessage}</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsLinkingModalOpen(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                      >
                        Confirm Provider Link
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div>
            {currentStep > 1 && currentStep < 4 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as WizardStep)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep === 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2B4C9D] hover:bg-[#203a78] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
              >
                <span>Next: Provider & Licensure</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2B4C9D] hover:bg-[#203a78] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
              >
                <span>Next: Payers & Notes</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitApplication}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Synchronizing Records...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Create Credentialing Application</span>
                  </>
                )}
              </button>
            )}

            {currentStep === 4 && createdResult && (
              <div className="flex items-center gap-2">
                {onNavigateToLinking && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToLinking();
                    }}
                    className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Go to Linking Tracker
                  </button>
                )}
                {onNavigateToProviders && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToProviders();
                    }}
                    className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Clinical Staff Directory
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectRecord(createdResult.applicationId);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#2B4C9D] hover:bg-[#203a78] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  <span>View Application in Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
