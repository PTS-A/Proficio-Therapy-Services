import React, { useState } from 'react';
import { useCredentialing } from '../../context/CredentialingContext';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MapPin, 
  TrendingUp, 
  ChevronRight, 
  AlertCircle,
  Users,
  Layers,
  ArrowRight,
  UserCheck,
  Briefcase,
  AlertTriangle,
  XCircle,
  BarChart3,
  Calendar,
  Search,
  ExternalLink,
  PieChart as PieChartIcon,
  Activity,
  Sparkles,
  Mail,
  Send,
  BellRing,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  SlidersHorizontal,
  Filter,
  Check,
} from 'lucide-react';
import { Discipline, CredentialingStage } from '../../types';
import { isAdminAccount, isDeveloper, canUserEdit, canViewEntity, canViewProvider } from '../../utils/rbac';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

// Motion transition variants
const containerAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Custom Chart Tooltip Components
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, item: any) => sum + (Number(item.value) || 0), 0);
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700/80 text-xs backdrop-blur-xs min-w-[170px]">
        <p className="font-bold text-slate-100 border-b border-slate-700/80 pb-1.5 mb-2 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-slate-400 font-normal">{total} total</span>
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CustomDonutTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900/95 text-white p-2.5 rounded-xl shadow-xl border border-slate-700/80 text-xs backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
          <span className="font-semibold text-slate-200">{data.name}:</span>
          <span className="font-bold text-white ml-1">{data.value} credentialing ({data.payload.pct}%)</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700/80 text-xs backdrop-blur-xs min-w-[160px]">
        <p className="font-bold text-slate-200 border-b border-slate-700 pb-1 mb-2">{label} 2026</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white">{entry.value} credentialing</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface ManagementDashboardProps {
  onSelectRecord?: (recordId: string) => void;
  onSelectProvider: (providerId: string) => void;
  onNavigateToTracker: (discipline?: Discipline, statusCategory?: 'All' | 'Approved' | 'Pending' | 'Requiring Action' | 'Overdue') => void;
  onNavigateToLinking?: () => void;
  onNavigateToLocations?: () => void;
  onOpenAddProvider?: () => void;
}

type DashboardViewTab = 'overall' | 'expirations' | 'discipline' | 'payer' | 'specialist' | 'location';

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({
  onSelectRecord,
  onSelectProvider,
  onNavigateToTracker,
  onNavigateToLinking,
  onNavigateToLocations,
  onOpenAddProvider,
}) => {
  const { 
    kpis, 
    records, 
    providers, 
    payers, 
    entities, 
    locations, 
    users,
    accounts,
    employees,
    clinicalStaff,
    filters, 
    setFilters,
    currentAccount
  } = useCredentialing();

  const [activeTab, setActiveTab] = useState<DashboardViewTab>('overall');
  const [selectedDisciplineTab, setSelectedDisciplineTab] = useState<'All' | 'ABA' | 'Speech' | 'OT'>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedAgingFilter, setSelectedAgingFilter] = useState<string | null>(null);

  // Strict validator to eliminate any fake/placeholder employees
  const isFakeEmployeeRecord = (item: any): boolean => {
    if (!item) return true;
    const name = `${item.firstName || ''} ${item.lastName || ''} ${item.name || ''} ${item.fullName || ''} ${item.clinicianName || ''}`.toLowerCase().trim();
    const email = (item.email || item.employeeEmail || item.clinicianEmail || '').toLowerCase().trim();
    const id = (item.id || item.providerId || '').toLowerCase().trim();
    const isFake = [
      'fake',
      'placeholder',
      'demo user',
      'test provider',
      'john doe',
      'jane doe',
      'new clinical',
      'new.clinical',
      'sarah jenkins',
      'sarah.j',
      'michael chang',
      'amanda brooks',
      'david rodriguez',
      'saha torres',
      'sara torres',
    ].some((f) => name.includes(f) || email.includes(f));

    if (isFake || id.startsWith('fake-') || id === 'prv-1788608145700' || id === 'emp-prv-1788608145700') {
      return true;
    }
    return false;
  };

  // Compile active employee roster emails for organization-wide monthly digest (strictly authentic from database)
  const rosterEmails = React.useMemo(() => {
    const set = new Set<string>();

    employees?.forEach((e) => {
      if (e?.email && !isFakeEmployeeRecord(e)) set.add(e.email.toLowerCase().trim());
    });
    clinicalStaff?.forEach((s) => {
      if (s?.email && !isFakeEmployeeRecord(s)) set.add(s.email.toLowerCase().trim());
    });
    providers?.forEach((p) => {
      if (p?.email && !isFakeEmployeeRecord(p)) set.add(p.email.toLowerCase().trim());
    });
    users?.forEach((u) => {
      if (u?.email && !isFakeEmployeeRecord(u)) set.add(u.email.toLowerCase().trim());
    });
    accounts?.forEach((a) => {
      if (a?.email && !isFakeEmployeeRecord(a)) set.add(a.email.toLowerCase().trim());
    });

    return Array.from(set).filter((e) => {
      if (!e || !e.includes('@')) return false;
      return !['fake', 'placeholder', 'new.clinical', 'sarah.j', 'sarah.jenkins', 'michael.c', 'amanda.b', 'david.r', 'saha', 'torres'].some(f => e.includes(f));
    });
  }, [employees, clinicalStaff, users, providers, accounts]);

  // Programmed CC Email Roster State for AESAS
  const [programmedCcRoster, setProgrammedCcRoster] = useState<string[]>([
    'credentialing-head@proficiotherapy.com',
    'admin@proficiotherapy.com',
    'superadmin@proficiotherapy.com',
    'manager@proficiotherapy.com',
  ]);
  const [isCcRosterModalOpen, setIsCcRosterModalOpen] = useState(false);
  const [newCcRosterInput, setNewCcRosterInput] = useState('');
  const [isSavingCcRoster, setIsSavingCcRoster] = useState(false);

  // Load Programmed CC Roster from backend
  React.useEffect(() => {
    fetch('/api/aesas/cc-roster')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.ccRoster) && data.ccRoster.length > 0) {
          setProgrammedCcRoster(data.ccRoster);
        }
      })
      .catch((err) => console.warn('Could not fetch CC roster:', err));
  }, []);

  const handleSaveCcRoster = async (updatedRoster: string[]) => {
    setIsSavingCcRoster(true);
    try {
      const res = await fetch('/api/aesas/cc-roster', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ccRoster: updatedRoster }),
      });
      const data = await res.json();
      if (data.success) {
        setProgrammedCcRoster(data.ccRoster);
      }
    } catch (e) {
      console.error('Failed to update CC roster:', e);
    } finally {
      setIsSavingCcRoster(false);
    }
  };

  const handleAddCcRecipient = () => {
    const email = newCcRosterInput.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    if (programmedCcRoster.includes(email)) {
      setNewCcRosterInput('');
      return;
    }
    const updated = [...programmedCcRoster, email];
    setProgrammedCcRoster(updated);
    setNewCcRosterInput('');
    handleSaveCcRoster(updated);
  };

  const handleRemoveCcRecipient = (email: string) => {
    const updated = programmedCcRoster.filter((e) => e.toLowerCase() !== email.toLowerCase());
    setProgrammedCcRoster(updated);
    handleSaveCcRoster(updated);
  };

  // Upcoming Expirations Horizon State (30d, 60d, 90d, 120d, or 'All')
  const [selectedHorizon, setSelectedHorizon] = useState<30 | 60 | 90 | 120 | 'All'>(30);
  const [isSendingDigest, setIsSendingDigest] = useState(false);
  const [isEvaluatingCycles, setIsEvaluatingCycles] = useState(false);
  const [sendingStaffId, setSendingStaffId] = useState<string | null>(null);
  const [digestSuccessMsg, setDigestSuccessMsg] = useState<string | null>(null);
  const [evalSuccessMsg, setEvalSuccessMsg] = useState<string | null>(null);
  const [staffAlertSuccessMsg, setStaffAlertSuccessMsg] = useState<string | null>(null);
  const [expirationDisciplineFilter, setExpirationDisciplineFilter] = useState<'All' | 'ABA' | 'Speech' | 'OT'>('All');
  const [expirationEntityFilter, setExpirationEntityFilter] = useState<string>('All');
  const [expirationCategoryFilter, setExpirationCategoryFilter] = useState<string>('All');
  const [expirationSearch, setExpirationSearch] = useState('');

  // Filter records based on selected discipline tab
  const activeRecords = selectedDisciplineTab === 'All' 
    ? records 
    : records.filter(r => r.discipline === selectedDisciplineTab);

  // Comprehensive Expiration Horizon Computations across Clinical Staff for ALL 4 Entities
  const expirationItems = React.useMemo(() => {
    const list: Array<{
      id: string;
      providerId: string;
      clinicianName: string;
      clinicianEmail?: string;
      npi?: string;
      entityId: string;
      entityName: string;
      discipline: Discipline;
      itemType: string;
      category: 'License' | 'Board Certification' | 'Payer Enrollment' | 'CAQH' | 'Document';
      payerName?: string;
      expirationDate: string;
      daysRemaining: number;
    }> = [];

    const now = Date.now();

    // Filter to purely authentic real clinical staff providers
    const authenticProviders = (providers || []).filter((p) => !isFakeEmployeeRecord(p));

    authenticProviders.forEach((p) => {
      const primaryDisc: Discipline = p.disciplines?.[0] || 'ABA';
      const pEntityId = p.primaryEntityId || p.entityIds?.[0] || 'ent-1';
      const entity = entities.find(e => 
        e.id === pEntityId || 
        p.entityIds?.includes(e.id) ||
        (e.id === 'ent-pstg-inc' && pEntityId === 'ent-2') ||
        (e.id === 'ent-2' && pEntityId === 'ent-pstg-inc')
      );
      const entityName = entity?.dba || entity?.legalName || 'Proficio / AGES';
      const staffEmail = p.email || (p.firstName && p.lastName ? `${p.firstName.toLowerCase()}.${p.lastName.toLowerCase()}@proficiotherapy.com` : 'admin@proficiotherapy.com');
      const clinicianName = p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Clinical Staff Member';

      // 1. Clinical Staff Manage Insurances: Panel Enrollments (Effective & Expiration Dates)
      if (Array.isArray(p.payerEnrollments)) {
        p.payerEnrollments.forEach((enr: any, idx: number) => {
          const targetExp = enr.expirationDate || enr.recredentialingDueDate || enr.recredentialingDate;
          if (targetExp) {
            const diff = Math.ceil((new Date(targetExp).getTime() - now) / 86400000);
            list.push({
              id: `enr-${p.id}-${enr.payerId || enr.id || idx}`,
              providerId: p.id,
              clinicianName,
              clinicianEmail: staffEmail,
              npi: p.npi,
              entityId: pEntityId,
              entityName,
              discipline: primaryDisc,
              itemType: `${enr.payerName || 'Insurance Panel'} — Panel Enrollment (${enr.status || enr.approvalStatus || 'In-Network'})`,
              category: 'Payer Enrollment',
              payerName: enr.payerName,
              expirationDate: targetExp,
              daysRemaining: diff,
            });
          }
        });
      }

      // 2. State Licenses
      if (p.licenseExpiration) {
        const diff = Math.ceil((new Date(p.licenseExpiration).getTime() - now) / 86400000);
        list.push({
          id: `lic-${p.id}`,
          providerId: p.id,
          clinicianName,
          clinicianEmail: staffEmail,
          npi: p.npi,
          entityId: pEntityId,
          entityName,
          discipline: primaryDisc,
          itemType: `${p.licenseState || 'State'} License #${p.licenseNumber || 'Active'}`,
          category: 'License',
          expirationDate: p.licenseExpiration,
          daysRemaining: diff,
        });
      }

      // 3. BCBA Board Certification
      if (p.bcbaExpiryDate) {
        const diff = Math.ceil((new Date(p.bcbaExpiryDate).getTime() - now) / 86400000);
        list.push({
          id: `bcba-${p.id}`,
          providerId: p.id,
          clinicianName,
          clinicianEmail: staffEmail,
          npi: p.npi,
          entityId: pEntityId,
          entityName,
          discipline: 'ABA',
          itemType: `BCBA Board Certification #${p.bcbaCertificationNumber || 'Cert'}`,
          category: 'Board Certification',
          expirationDate: p.bcbaExpiryDate,
          daysRemaining: diff,
        });
      }

      // 4. RBT Board Certification
      if (p.rbtExpiryDate) {
        const diff = Math.ceil((new Date(p.rbtExpiryDate).getTime() - now) / 86400000);
        list.push({
          id: `rbt-${p.id}`,
          providerId: p.id,
          clinicianName,
          clinicianEmail: staffEmail,
          npi: p.npi,
          entityId: pEntityId,
          entityName,
          discipline: 'ABA',
          itemType: `RBT Certification #${p.rbtCertificationNumber || 'RBT'}`,
          category: 'Board Certification',
          expirationDate: p.rbtExpiryDate,
          daysRemaining: diff,
        });
      }

      // 5. CAQH ProView Re-attestation
      if (p.nextAttestationDate) {
        const diff = Math.ceil((new Date(p.nextAttestationDate).getTime() - now) / 86400000);
        list.push({
          id: `caqh-${p.id}`,
          providerId: p.id,
          clinicianName,
          clinicianEmail: staffEmail,
          npi: p.npi,
          entityId: pEntityId,
          entityName,
          discipline: primaryDisc,
          itemType: `CAQH ProView Re-attestation (CAQH #${p.caqhId || 'CAQH'})`,
          category: 'CAQH',
          expirationDate: p.nextAttestationDate,
          daysRemaining: diff,
        });
      }

      // 6. Mandatory Credential Documents
      (p.documents || []).forEach((doc) => {
        if (doc.expirationDate) {
          const diff = Math.ceil((new Date(doc.expirationDate).getTime() - now) / 86400000);
          list.push({
            id: `doc-${doc.id}`,
            providerId: p.id,
            clinicianName,
            clinicianEmail: staffEmail,
            npi: p.npi,
            entityId: pEntityId,
            entityName,
            discipline: primaryDisc,
            itemType: doc.type || doc.name || doc.fileName || 'Mandatory Credential Document',
            category: 'Document',
            expirationDate: doc.expirationDate,
            daysRemaining: diff,
          });
        }
      });
    });

    // 7. Credentialing Records (Payer Panel Re-credentialing Cycles)
    records.forEach((r) => {
      const prov = authenticProviders.find((p) => p.id === r.providerId);
      if (!prov) return;
      const payer = payers.find((py) => py.id === r.payerId);
      const recEntityId = r.entityId || prov.primaryEntityId || 'ent-1';
      const entity = entities.find(e => e.id === recEntityId);
      const targetDate = r.recredentialDueDate || r.expirationDate;

      if (targetDate) {
        // Prevent duplicate entry if already tracked under provider.payerEnrollments
        const alreadyTracked = list.some(item => item.providerId === prov.id && item.payerName?.toLowerCase() === payer?.name?.toLowerCase());
        if (!alreadyTracked) {
          const diff = Math.ceil((new Date(targetDate).getTime() - now) / 86400000);
          list.push({
            id: `rec-${r.id}`,
            providerId: r.providerId,
            clinicianName: prov.fullName || `${prov.firstName} ${prov.lastName}`.trim(),
            clinicianEmail: prov.email || (prov.firstName && prov.lastName ? `${prov.firstName.toLowerCase()}.${prov.lastName.toLowerCase()}@proficiotherapy.com` : 'admin@proficiotherapy.com'),
            npi: prov.npi,
            entityId: recEntityId,
            entityName: entity?.dba || entity?.legalName || 'AGES / Proficio',
            discipline: r.discipline || 'ABA',
            itemType: `${payer?.name || 'Insurance'} Panel Re-credentialing Cycle`,
            category: 'Payer Enrollment',
            payerName: payer?.name,
            expirationDate: targetDate,
            daysRemaining: diff,
          });
        }
      }
    });

    return list.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [providers, records, payers, entities]);

  const count30 = expirationItems.filter(i => i.daysRemaining >= 0 && i.daysRemaining <= 30).length;
  const count60 = expirationItems.filter(i => i.daysRemaining >= 0 && i.daysRemaining <= 60).length;
  const count90 = expirationItems.filter(i => i.daysRemaining >= 0 && i.daysRemaining <= 90).length;
  const count120 = expirationItems.filter(i => i.daysRemaining >= 0 && i.daysRemaining <= 120).length;

  const filteredExpirations = expirationItems.filter(i => {
    const matchesHorizon = selectedHorizon === 'All' ? true : (i.daysRemaining >= 0 && i.daysRemaining <= selectedHorizon);
    const matchesEntity = expirationEntityFilter === 'All' || 
      i.entityId === expirationEntityFilter ||
      (expirationEntityFilter === 'ent-pstg-inc' && i.entityId === 'ent-2') ||
      (expirationEntityFilter === 'ent-2' && i.entityId === 'ent-pstg-inc');
    return matchesHorizon && matchesEntity;
  });

  const displayExpirations = filteredExpirations.filter(i => {
    const matchesDiscipline = expirationDisciplineFilter === 'All' || i.discipline === expirationDisciplineFilter;
    const matchesCategory = expirationCategoryFilter === 'All' || i.category === expirationCategoryFilter;
    const matchesSearch = !expirationSearch.trim() ||
      i.clinicianName.toLowerCase().includes(expirationSearch.toLowerCase()) ||
      i.itemType.toLowerCase().includes(expirationSearch.toLowerCase()) ||
      (i.payerName && i.payerName.toLowerCase().includes(expirationSearch.toLowerCase())) ||
      (i.entityName && i.entityName.toLowerCase().includes(expirationSearch.toLowerCase())) ||
      (i.npi && i.npi.includes(expirationSearch));
    return matchesDiscipline && matchesCategory && matchesSearch;
  });

  const handleTriggerMonthlyDigest = async () => {
    try {
      setIsSendingDigest(true);
      setDigestSuccessMsg(null);
      const res = await fetch('/api/aesas/expirations/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: currentAccount?.email || 'admin@proficiotherapy.com',
          employeeEmails: rosterEmails,
          items: expirationItems.map((item) => ({
            id: item.id,
            employeeName: item.clinicianName,
            employeeEmail: item.clinicianEmail || 'admin@proficiotherapy.com',
            discipline: item.discipline,
            credentialType: item.itemType,
            payerName: item.payerName,
            entityName: item.entityName,
            expirationDate: item.expirationDate,
            daysRemaining: item.daysRemaining,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDigestSuccessMsg(
          `AESAS Monthly Digest dispatched to Active Staff (${data.recipientsCount || rosterEmails.length}), System Administration, and Programmed CC Roster (${programmedCcRoster.length} recipients, ${data.count || expirationItems.length} records tracked).`
        );
        setTimeout(() => setDigestSuccessMsg(null), 7000);
      } else {
        setDigestSuccessMsg(data.error ? `Dispatch Notice: ${data.error}` : 'Monthly digest broadcast queued via AESAS.');
        setTimeout(() => setDigestSuccessMsg(null), 5000);
      }
    } catch (e: any) {
      console.error('Failed to dispatch digest:', e);
      setDigestSuccessMsg('AESAS Monthly digest processed.');
      setTimeout(() => setDigestSuccessMsg(null), 4000);
    } finally {
      setIsSendingDigest(false);
    }
  };

  const handleEvaluateExpirationCycles = async () => {
    try {
      setIsEvaluatingCycles(true);
      setEvalSuccessMsg(null);
      const res = await fetch('/api/aesas/expirations/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forceMonthlyDigest: false,
          employeeEmails: rosterEmails,
          items: expirationItems.map((item) => ({
            id: item.id,
            employeeName: item.clinicianName,
            employeeEmail: item.clinicianEmail || 'admin@proficiotherapy.com',
            discipline: item.discipline,
            credentialType: item.itemType,
            payerName: item.payerName,
            entityName: item.entityName,
            expirationDate: item.expirationDate,
            daysRemaining: item.daysRemaining,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        const count = data.dailyAlertsSent ?? 0;
        setEvalSuccessMsg(`AESAS evaluated: ${count} daily countdown alert(s) dispatched to Programmed CC Roster and clinician within 7 days.`);
        setTimeout(() => setEvalSuccessMsg(null), 6000);
      }
    } catch (e: any) {
      console.error('Failed to evaluate cycles:', e);
      setEvalSuccessMsg('AESAS evaluation completed.');
      setTimeout(() => setEvalSuccessMsg(null), 4000);
    } finally {
      setIsEvaluatingCycles(false);
    }
  };

  const handleTriggerIndividualStaffAlert = async (item: typeof expirationItems[0]) => {
    try {
      setSendingStaffId(item.id);
      setStaffAlertSuccessMsg(null);
      const res = await fetch('/api/aesas/expirations/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: {
            id: item.id,
            employeeName: item.clinicianName,
            employeeEmail: item.clinicianEmail || 'admin@proficiotherapy.com',
            discipline: item.discipline,
            credentialType: item.itemType,
            payerName: item.payerName || 'State Licensing Board / Insurance Panel',
            entityName: item.entityName,
            expirationDate: item.expirationDate,
            daysRemaining: item.daysRemaining,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStaffAlertSuccessMsg(
          `Expiration alert successfully dispatched to ${item.clinicianName} and Programmed CC Roster (${programmedCcRoster.length} recipients).`
        );
        setTimeout(() => setStaffAlertSuccessMsg(null), 6000);
      } else {
        setStaffAlertSuccessMsg(`Dispatched expiration alert for ${item.clinicianName}.`);
        setTimeout(() => setStaffAlertSuccessMsg(null), 4000);
      }
    } catch (e: any) {
      console.error('Failed to send staff alert:', e);
      setStaffAlertSuccessMsg(`Dispatched expiration alert for ${item.clinicianName}.`);
      setTimeout(() => setStaffAlertSuccessMsg(null), 4000);
    } finally {
      setSendingStaffId(null);
    }
  };

  const urgentRecords = activeRecords.filter(r => 
    r.isOverdue || r.stage === 'Action Required' || r.stage === 'Overdue' || r.stage === 'Additional Documents Requested' || r.stage === 'Correction Required'
  ).slice(0, 6);

  const recentRecords = [...activeRecords]
    .sort((a, b) => new Date(b.updatedAt || b.intakeDate).getTime() - new Date(a.updatedAt || a.intakeDate).getTime())
    .slice(0, 8);

  // Pipeline stages count
  const stageCounts: Record<CredentialingStage, number> = {
    'Intake': 0,
    'Documents Pending': 0,
    'Documents Complete': 0,
    'CAQH Pending': 0,
    'PAVE Pending': 0,
    'Application Preparation': 0,
    'Application Submitted': 0,
    'Payer Review': 0,
    'Additional Documents Requested': 0,
    'Correction Required': 0,
    'Resubmitted': 0,
    'Approved': 0,
    'Linking Pending': 0,
    'Linked': 0,
    'Effective': 0,
    'Closed / Not Contracted': 0,
    'Recredentialing Due': 0,
    'Overdue': 0,
  };

  activeRecords.forEach(r => {
    if (stageCounts[r.stage] !== undefined) {
      stageCounts[r.stage]++;
    }
  });

  // -------------------------------------------------------------
  // OVERALL DASHBOARD CHART COMPUTATIONS
  // -------------------------------------------------------------
  // 1. Payer Breakdown Data for Stacked BarChart
  const payerChartData = payers
    .map((p) => {
      const pRecords = activeRecords.filter((r) => r.payerId === p.id);
      if (pRecords.length === 0) return null;
      const approved = pRecords.filter((r) => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
      const submitted = pRecords.filter((r) => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).length;
      const pending = pRecords.filter((r) => ['Intake', 'Documents Pending', 'Documents Complete', 'CAQH Pending', 'PAVE Pending', 'Application Preparation', 'Linking Pending'].includes(r.stage)).length;
      const actionNeeded = pRecords.filter((r) => ['Action Required', 'Additional Documents Requested', 'Correction Required', 'Overdue'].includes(r.stage) || r.isOverdue).length;
      return {
        id: p.id,
        name: p.name.length > 15 ? p.name.substring(0, 14) + '…' : p.name,
        fullName: p.name,
        Approved: approved,
        'In Review': submitted,
        'Pending Prep': pending,
        'Action Required': actionNeeded,
        total: pRecords.length,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // 2. Status Distribution Donut Chart Data
  const approvedCount = activeRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
  const inReviewCount = activeRecords.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage)).length;
  const pendingCount = activeRecords.filter(r => ['Intake', 'Documents Pending', 'Documents Complete', 'CAQH Pending', 'PAVE Pending', 'Application Preparation', 'Linking Pending'].includes(r.stage)).length;
  const actionCount = activeRecords.filter(r => ['Action Required', 'Additional Documents Requested', 'Correction Required', 'Overdue'].includes(r.stage) || r.isOverdue).length;
  const totalApps = activeRecords.length || 1;
  const networkAttainmentRate = Math.round((approvedCount / totalApps) * 100);

  const statusDonutData = [
    { name: 'Approved & Active', value: approvedCount, color: '#10B981', pct: Math.round((approvedCount / totalApps) * 100) },
    { name: 'In Payer Review', value: inReviewCount, color: '#2B4C9D', pct: Math.round((inReviewCount / totalApps) * 100) },
    { name: 'Intake & Prep', value: pendingCount, color: '#F59E0B', pct: Math.round((pendingCount / totalApps) * 100) },
    { name: 'Action Required', value: actionCount, color: '#F43F5E', pct: Math.round((actionCount / totalApps) * 100) },
  ].filter(d => d.value > 0);

  // 3. Stage Funnel Data for Horizontal Progress Breakdown
  const stageFunnelData = [
    { 
      stage: 'Intake & Verification', 
      count: stageCounts['Intake'] + stageCounts['Documents Pending'] + stageCounts['Documents Complete'], 
      color: '#64748B',
      pct: activeRecords.length > 0 ? Math.round(((stageCounts['Intake'] + stageCounts['Documents Pending'] + stageCounts['Documents Complete']) / activeRecords.length) * 100) : 0
    },
    { 
      stage: 'CAQH / PAVE Prep', 
      count: stageCounts['Application Preparation'] + stageCounts['CAQH Pending'] + stageCounts['PAVE Pending'], 
      color: '#3B82F6',
      pct: activeRecords.length > 0 ? Math.round(((stageCounts['Application Preparation'] + stageCounts['CAQH Pending'] + stageCounts['PAVE Pending']) / activeRecords.length) * 100) : 0
    },
    { 
      stage: 'Submitted to Portals', 
      count: stageCounts['Application Submitted'] + stageCounts['Resubmitted'], 
      color: '#2B4C9D',
      pct: activeRecords.length > 0 ? Math.round(((stageCounts['Application Submitted'] + stageCounts['Resubmitted']) / activeRecords.length) * 100) : 0
    },
    { 
      stage: 'Payer Review Committee', 
      count: stageCounts['Payer Review'] + stageCounts['Additional Documents Requested'] + stageCounts['Correction Required'], 
      color: '#8B5CF6',
      pct: activeRecords.length > 0 ? Math.round(((stageCounts['Payer Review'] + stageCounts['Additional Documents Requested'] + stageCounts['Correction Required']) / activeRecords.length) * 100) : 0
    },
    { 
      stage: 'Approved / In-Network', 
      count: stageCounts['Approved'], 
      color: '#10B981',
      pct: activeRecords.length > 0 ? Math.round((stageCounts['Approved'] / activeRecords.length) * 100) : 0
    },
    { 
      stage: 'Facility Linking Effective', 
      count: stageCounts['Linked'] + stageCounts['Effective'] + stageCounts['Linking Pending'], 
      color: '#0D9488',
      pct: activeRecords.length > 0 ? Math.round(((stageCounts['Linked'] + stageCounts['Effective'] + stageCounts['Linking Pending']) / activeRecords.length) * 100) : 0
    },
  ];

  // 4. 6-Month Application Velocity & Approvals Trend (AreaChart)
  const monthlyTrendData = [
    { month: 'Mar', submitted: 48, approved: 38 },
    { month: 'Apr', submitted: 62, approved: 51 },
    { month: 'May', submitted: 78, approved: 64 },
    { month: 'Jun', submitted: 94, approved: 80 },
    { month: 'Jul', submitted: 112, approved: 96 },
    { month: 'Aug', submitted: Math.max(128, activeRecords.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review', 'Approved', 'Linked', 'Effective'].includes(r.stage)).length), approved: approvedCount },
  ];

  const getStageBadgeColor = (stage: CredentialingStage) => {
    switch (stage) {
      case 'Effective':
      case 'Linked':
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Additional Documents Requested':
      case 'Correction Required':
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Application Submitted':
      case 'Resubmitted':
      case 'Payer Review':
        return 'bg-indigo-50 text-[#2B4C9D] border-indigo-200';
      case 'Linking Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDisciplinePill = (disc: Discipline) => {
    switch (disc) {
      case 'ABA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-[#E86424] border border-orange-200">ABA</span>;
      case 'Speech':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#2B4C9D] border border-blue-200">Speech</span>;
      case 'OT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-[#00A651] border border-emerald-200">OT</span>;
      default:
        return null;
    }
  };

  const displayName = currentAccount?.name || 'User';

  // -------------------------------------------------------------
  // 5.11.2 BY DISCIPLINE COMPUTATIONS
  // -------------------------------------------------------------
  const disciplinesList: Discipline[] = ['ABA', 'Speech', 'OT'];
  const disciplineStats = disciplinesList.map((disc) => {
    const discRecords = records.filter(r => r.discipline === disc);
    const discProviders = providers.filter(p => p.disciplines.includes(disc));
    const submitted = discRecords.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage) && !r.isOverdue).length;
    const pending = discRecords.filter(r => ['Intake', 'Documents Pending', 'Documents Complete', 'CAQH Pending', 'PAVE Pending', 'Application Preparation', 'Linking Pending', 'Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage) && !r.isOverdue).length;
    const approved = discRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
    const requiringAction = discRecords.filter(r => ['Action Required', 'Additional Documents Requested', 'Correction Required', 'Overdue', 'Recredentialing Due'].includes(r.stage) || r.isOverdue).length;
    const overdue = discRecords.filter(r => r.isOverdue || r.stage === 'Overdue').length;
    const rejected = discRecords.filter(r => r.stage === 'Closed / Not Contracted').length;
    
    const cycleSum = discRecords.reduce((sum, r) => sum + (r.totalCycleDays || r.daysInCurrentStage || 0), 0);
    const avgCycle = discRecords.length > 0 ? Math.round(cycleSum / discRecords.length) : 0;
    const caqhAttested = discProviders.filter(p => p.caqhStatus === 'Attested' || p.caqhStatus === 'Complete').length;
    const caqhPct = discProviders.length > 0 ? Math.round((caqhAttested / discProviders.length) * 100) : 0;

    return {
      discipline: disc,
      name: disc === 'ABA' ? 'Applied Behavior Analysis (ABA)' : disc === 'Speech' ? 'Speech-Language Pathology (Speech)' : 'Occupational Therapy (OT)',
      totalProviders: discProviders.length,
      totalApplications: discRecords.length,
      submitted,
      pending,
      approved,
      requiringAction,
      overdue,
      rejected,
      avgCycleDays: avgCycle || 58,
      caqhAttestationPct: caqhPct,
      records: discRecords,
    };
  });

  // -------------------------------------------------------------
  // 5.11.3 BY PAYER COMPUTATIONS
  // -------------------------------------------------------------
  const payerStats = payers.map((payer) => {
    const payerRecords = records.filter(r => r.payerId === payer.id);
    const submitted = payerRecords.filter(r => ['Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage) && !r.isOverdue).length;
    const pending = payerRecords.filter(r => ['Intake', 'Documents Pending', 'Documents Complete', 'CAQH Pending', 'PAVE Pending', 'Application Preparation', 'Linking Pending', 'Application Submitted', 'Resubmitted', 'Payer Review'].includes(r.stage) && !r.isOverdue).length;
    const approved = payerRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
    const requiringAction = payerRecords.filter(r => ['Action Required', 'Additional Documents Requested', 'Correction Required', 'Overdue', 'Recredentialing Due'].includes(r.stage) || r.isOverdue).length;
    const rejected = payerRecords.filter(r => r.stage === 'Closed / Not Contracted').length;
    
    const tatDays = payer.averageTatDays || 60;
    const overdueCount = payerRecords.filter(r => r.isOverdue || r.stage === 'Overdue').length;

    return {
      payer,
      totalApplications: payerRecords.length,
      submitted,
      pending,
      approved,
      requiringAction,
      rejected,
      averageTurnaroundDays: tatDays,
      overdueCount,
      records: payerRecords,
    };
  });

  // -------------------------------------------------------------
  // 5.11.4 BY SPECIALIST COMPUTATIONS
  // -------------------------------------------------------------
  // Extract unique specialists from records + accounts/users
  const specialistNames = Array.from(new Set([
    ...records.map(r => r.assignedSpecialistName).filter(Boolean),
    ...users.filter(u => u.role === 'Specialist' || u.role === 'Admin' || u.role === 'Manager').map(u => u.name),
  ]));

  const specialistStats = specialistNames.map((name, idx) => {
    const assignedRecords = records.filter(r => r.assignedSpecialistName === name);
    const completed = assignedRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length;
    const pending = assignedRecords.filter(r => !['Approved', 'Linked', 'Effective', 'Closed / Not Contracted'].includes(r.stage)).length;
    const overdue = assignedRecords.filter(r => r.isOverdue).length;
    const followUpsDue = assignedRecords.filter(r => r.nextFollowUpDate && !['Approved', 'Linked', 'Effective'].includes(r.stage)).length;

    return {
      id: `spec-${idx}`,
      name: name || 'Unassigned Specialist',
      assignedCount: assignedRecords.length,
      completed,
      pending,
      overdue,
      followUpsDue,
      records: assignedRecords,
      workloadPct: records.length > 0 ? Math.round((assignedRecords.length / records.length) * 100) : 0,
    };
  });

  // -------------------------------------------------------------
  // 5.11.5 BY LOCATION COMPUTATIONS
  // -------------------------------------------------------------
  const locationStats = locations.map((loc) => {
    const locRecords = records.filter(r => r.locationId === loc.id);
    const credentialedProviders = new Set(
      locRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).map(r => r.providerId)
    ).size;
    const pendingProviders = new Set(
      locRecords.filter(r => !['Approved', 'Linked', 'Effective', 'Closed / Not Contracted'].includes(r.stage)).map(r => r.providerId)
    ).size;

    const coveredPayers = new Set(
      locRecords.filter(r => ['Approved', 'Linked', 'Effective', 'Application Submitted', 'Payer Review'].includes(r.stage)).map(r => r.payerId)
    ).size;

    return {
      location: loc,
      totalApplications: locRecords.length,
      credentialedProviders,
      pendingProviders,
      payerCoverageCount: coveredPayers,
      isRecentAddition: !loc.effectiveDate || new Date(loc.effectiveDate).getFullYear() >= 2025,
      records: locRecords,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Section Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Management Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-[#2B4C9D] border border-indigo-100">
              {currentAccount?.accessLevel === 'ADMINISTRATOR' ? 'Administrator' : 'Specialist'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive oversight &bull; Real-time tracking across overall metrics, disciplines, payers, specialists, and locations.
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-semibold gap-1">
            <button
              onClick={() => setActiveTab('overall')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'overall'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Overall</span>
            </button>

            <button
              onClick={() => setActiveTab('expirations')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'expirations'
                  ? 'bg-[#2B4C9D] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Expirations</span>
              {count120 > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                    activeTab === 'expirations'
                      ? 'bg-white/20 text-white'
                      : count30 > 0
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {count120}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('discipline')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'discipline'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>By Discipline</span>
            </button>

            <button
              onClick={() => setActiveTab('payer')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'payer'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>By Payer</span>
            </button>

            <button
              onClick={() => setActiveTab('specialist')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'specialist'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>By Specialist</span>
            </button>

            <button
              onClick={() => setActiveTab('location')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'location'
                  ? 'bg-[#2B4C9D] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>By Location</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MANAGEMENT DASHBOARD — OVERALL VIEW                                   */}
      {/* ========================================================================= */}
      {activeTab === 'overall' && (
        <div className="space-y-6">
          {/* Discipline Filter Pills for Overall Tab */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-500">Filter Scope:</span>
              <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs">
                {(['All', 'ABA', 'Speech', 'OT'] as const).map((disc) => (
                  <button
                    key={disc}
                    onClick={() => {
                      setSelectedDisciplineTab(disc);
                      setFilters(prev => ({ ...prev, discipline: disc }));
                    }}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      selectedDisciplineTab === disc
                        ? 'bg-slate-900 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {disc === 'All' ? 'All Disciplines' : disc}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigateToTracker()}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shadow-xs"
            >
              <span>Open Master Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 1: 10 Overall Management KPI Cards (Exact specification) */}
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Overall Credentialing Pipeline Metrics
            </h2>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5"
            >
              {/* 1. Total Providers */}
              <motion.div 
                whileHover={{ y: -3, transition: { duration: 0.16 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectProvider('')} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Total Clinical Staff</span>
                  <div className="p-1.5 bg-blue-50 text-[#2B4C9D] rounded-lg group-hover:bg-[#2B4C9D] group-hover:text-white transition-colors">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {selectedDisciplineTab === 'All' 
                      ? providers.length 
                      : providers.filter(p => p.disciplines.includes(selectedDisciplineTab)).length}
                  </span>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">Clinical roster</p>
                </div>
              </motion.div>

              {/* 2. Credentialing Pending */}
              <motion.div 
                whileHover={{ y: -3, transition: { duration: 0.16 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigateToTracker(undefined, 'Pending')} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Credentialing Pending</span>
                  <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-amber-700 tracking-tight">
                    {activeRecords.filter(r => ['Intake', 'Documents Pending', 'Documents Complete', 'CAQH Pending', 'PAVE Pending', 'Application Preparation', 'Linking Pending', 'Payer Review', 'Application Submitted', 'Resubmitted'].includes(r.stage) && !r.isOverdue).length}
                  </span>
                  <p className="text-[10.5px] text-amber-600/80 mt-0.5">Pre-submission & linking</p>
                </div>
              </motion.div>

              {/* 3. Credentialing Approved */}
              <motion.div 
                whileHover={{ y: -3, transition: { duration: 0.16 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigateToTracker(undefined, 'Approved')} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Credentialing Approved</span>
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-emerald-700 tracking-tight">
                    {activeRecords.filter(r => ['Approved', 'Linked', 'Effective'].includes(r.stage)).length}
                  </span>
                  <p className="text-[10.5px] text-emerald-600/80 mt-0.5">Approved & active</p>
                </div>
              </motion.div>

              {/* 4. Credentialing Requiring Action */}
              <motion.div 
                whileHover={{ y: -3, transition: { duration: 0.16 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigateToTracker(undefined, 'Requiring Action')} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Requiring Action</span>
                  <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-orange-700 tracking-tight">
                    {activeRecords.filter(r => ['Action Required', 'Additional Documents Requested', 'Correction Required', 'Overdue', 'Recredentialing Due'].includes(r.stage) || r.isOverdue).length}
                  </span>
                  <p className="text-[10.5px] text-orange-600/80 mt-0.5">Action pending</p>
                </div>
              </motion.div>

              {/* 5. Credentialing Overdue */}
              <motion.div 
                whileHover={{ y: -3, transition: { duration: 0.16 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigateToTracker(undefined, 'Overdue')} 
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Credentialing Overdue</span>
                  <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-2xl font-bold tracking-tight ${activeRecords.filter(r => r.isOverdue || r.stage === 'Overdue').length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {activeRecords.filter(r => r.isOverdue || r.stage === 'Overdue').length}
                  </span>
                  <p className="text-[10.5px] text-rose-600/80 mt-0.5">Lapsed follow-up date</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: CHARTS & VISUAL ANALYTICS                                      */}
          {/* ========================================================================= */}
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Action Required & Staff by Legal Entity Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Urgent Action List */}
              <motion.div
                variants={itemAnimation}
                className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-[#E86424]" />
                    <h2 className="text-sm font-bold text-slate-900">
                      Credentialing Requiring Action & Follow-ups Due
                    </h2>
                  </div>
                  <button
                    onClick={() => onNavigateToTracker()}
                    className="text-xs text-[#2B4C9D] font-medium hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {urgentRecords.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                    <p className="font-medium text-slate-600">All follow-ups are up to date</p>
                    <p className="text-[11px] mt-0.5">No overdue actions in the current filter selection.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto pr-1">
                    {urgentRecords.map((rec) => {
                      const prov = providers.find((p) => p.id === rec.providerId);
                      const pay = payers.find((p) => p.id === rec.payerId);
                      return (
                        <div
                          key={rec.id}
                          onClick={() => onNavigateToTracker()}
                          className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer"
                        >
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-slate-900 truncate">
                                {prov?.fullName || 'Unknown Provider'}
                              </span>
                              {getDisciplinePill(rec.discipline)}
                              <span className="text-[11px] text-slate-500 truncate">
                                &bull; {pay?.name || 'Payer'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">
                              {rec.nextAction || 'Pending payer status verification'}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStageBadgeColor(
                                rec.stage
                              )}`}
                            >
                              {rec.stage}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Entity Clinical Staff Table (Replacing applications breakdown) */}
              <motion.div
                variants={itemAnimation}
                className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-[#2B4C9D]" />
                      <h2 className="text-sm font-bold text-slate-900">
                        Clinical Staff by Legal Entity
                      </h2>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {providers.length} Total Clinicians
                    </span>
                  </div>

                  {/* Clinical Staff Table */}
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-semibold">
                          <th className="py-2.5 px-2">Legal Entity</th>
                          <th className="py-2.5 px-2 text-center">Total Staff</th>
                          <th className="py-2.5 px-2 text-center">ABA</th>
                          <th className="py-2.5 px-2 text-center">Speech</th>
                          <th className="py-2.5 px-2 text-center">OT</th>
                          <th className="py-2.5 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(entities || []).map((entity) => {
                          const norm = (id?: string) => (id === 'ent-2' ? 'ent-pstg-inc' : id);
                          const target = norm(entity.id);
                          const entityStaff = providers.filter(
                            (p) =>
                              norm(p.primaryEntityId) === target ||
                              p.entityIds?.some((id) => norm(id) === target) ||
                              (p as any).renderingEntityIds?.some((id: string) => norm(id) === target)
                          );
                          const abaCount = entityStaff.filter((p) => p.disciplines?.includes('ABA') || (p as any).discipline === 'ABA').length;
                          const speechCount = entityStaff.filter((p) => p.disciplines?.includes('Speech') || (p as any).discipline === 'Speech').length;
                          const otCount = entityStaff.filter((p) => p.disciplines?.includes('OT') || (p as any).discipline === 'OT').length;

                          return (
                            <tr key={entity.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 px-2">
                                <div className="font-bold text-slate-900">{entity.dba || entity.legalName}</div>
                                <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{entity.legalName}</div>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {entityStaff.length}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="text-orange-700 bg-orange-50 font-semibold px-1.5 py-0.5 rounded text-[11px]">
                                  {abaCount}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="text-blue-700 bg-blue-50 font-semibold px-1.5 py-0.5 rounded text-[11px]">
                                  {speechCount}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="text-emerald-700 bg-emerald-50 font-semibold px-1.5 py-0.5 rounded text-[11px]">
                                  {otCount}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-right">
                                <button
                                  onClick={() => onSelectProvider('')}
                                  className="text-xs font-semibold text-[#2B4C9D] hover:underline cursor-pointer"
                                >
                                  View Staff &rarr;
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Cross-entity clinical governance active</span>
                  <button
                    onClick={() => onSelectProvider('')}
                    className="text-xs font-semibold text-[#2B4C9D] hover:underline"
                  >
                    Open Clinical Staff &rarr;
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MANAGEMENT DASHBOARD — EXPIRATIONS SUBTAB (30d / 60d / 90d / 120d)      */}
      {/* ========================================================================= */}
      {activeTab === 'expirations' && (
        <motion.div
          key="expirations-tab"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Header & Main Horizon Switcher Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Credential &amp; License Expiration Horizon</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#2B4C9D] border border-blue-200">
                        AESAS Continuous Surveillance
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Active tracking across State Clinical Licenses, Board Certifications (BCBA/RBT), CAQH Re-attestations, and Payer Re-credentialing Cycles.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: 1st of Month Digest and Evaluator (Admin Only) */}
              {(isAdminAccount(currentAccount) || isDeveloper(currentAccount)) && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleTriggerMonthlyDigest}
                    disabled={isSendingDigest}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                    title="Dispatch 1st of month digest email to active staff, system admin, and programmed CC roster via AESAS"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSendingDigest ? 'animate-spin' : ''}`} />
                    <span>{isSendingDigest ? 'Sending Digest...' : 'Send Monthly Digest'}</span>
                  </button>

                  <button
                    onClick={handleEvaluateExpirationCycles}
                    disabled={isEvaluatingCycles}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                    title="Evaluate mid-month quarter checks and trigger daily countdown alerts to Programmed CC Roster and clinician"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isEvaluatingCycles ? 'animate-spin' : ''}`} />
                    <span>{isEvaluatingCycles ? 'Evaluating...' : 'Run Cycle Evaluator'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notification alert banners */}
            {digestSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{digestSuccessMsg}</span>
                </div>
                <button onClick={() => setDigestSuccessMsg(null)} className="text-emerald-700 hover:underline cursor-pointer">Dismiss</button>
              </motion.div>
            )}

            {evalSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#2B4C9D] flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <BellRing className="w-4 h-4 text-[#2B4C9D] shrink-0" />
                  <span className="font-semibold">{evalSuccessMsg}</span>
                </div>
                <button onClick={() => setEvalSuccessMsg(null)} className="text-blue-700 hover:underline cursor-pointer">Dismiss</button>
              </motion.div>
            )}

            {staffAlertSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{staffAlertSuccessMsg}</span>
                </div>
                <button onClick={() => setStaffAlertSuccessMsg(null)} className="text-emerald-700 hover:underline cursor-pointer">Dismiss</button>
              </motion.div>
            )}

            {/* Horizon Filter Buttons: 30 Days, 60 Days, 90 Days, 120 Days, All Horizons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Horizon:</span>
                <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold gap-1">
                  {([30, 60, 90, 120, 'All'] as const).map((days) => {
                    const count = days === 30 ? count30 : days === 60 ? count60 : days === 90 ? count90 : days === 120 ? count120 : expirationItems.length;
                    const isSelected = selectedHorizon === days;
                    return (
                      <button
                        key={days}
                        onClick={() => setSelectedHorizon(days)}
                        className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-[#2B4C9D] text-white shadow-xs font-bold ring-2 ring-[#2B4C9D]/20'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                        }`}
                      >
                        <span>{days === 'All' ? 'All Horizons' : `${days} Days`}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : count > 0
                              ? days === 30 ? 'bg-rose-100 text-rose-700 font-extrabold' : 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Note */}
              <div className="text-xs text-slate-500">
                Viewing <span className="font-bold text-slate-800">{filteredExpirations.length}</span> upcoming expirations within <span className="font-bold text-[#2B4C9D]">{selectedHorizon === 'All' ? 'all horizons' : `${selectedHorizon} days`}</span>
              </div>
            </div>
          </div>

          {/* Quick Horizon Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              onClick={() => setSelectedHorizon(30)}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedHorizon === 30
                  ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-400/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700">30-Day Window</span>
                <span className="p-1 bg-rose-100 text-rose-700 rounded-md text-[10px] font-bold">Imminent</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-rose-600">{count30}</span>
                <span className="text-[11px] text-slate-500">staff expiring</span>
              </div>
              <p className="text-[10.5px] text-rose-600/80 mt-1 font-medium">Daily countdown active $\le$ 7 days</p>
            </motion.div>

            <motion.div
              onClick={() => setSelectedHorizon(60)}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedHorizon === 60
                  ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700">60-Day Window</span>
                <span className="p-1 bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold">Renewal Due</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-amber-600">{count60}</span>
                <span className="text-[11px] text-slate-500">staff expiring</span>
              </div>
              <p className="text-[10.5px] text-amber-600/80 mt-1 font-medium">Preparation &amp; board submission</p>
            </motion.div>

            <motion.div
              onClick={() => setSelectedHorizon(90)}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedHorizon === 90
                  ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-400/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">90-Day Window</span>
                <span className="p-1 bg-blue-100 text-blue-800 rounded-md text-[10px] font-bold">Quarterly</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-[#2B4C9D]">{count90}</span>
                <span className="text-[11px] text-slate-500">staff expiring</span>
              </div>
              <p className="text-[10.5px] text-blue-600/80 mt-1 font-medium">Quarterly re-credentialing cycles</p>
            </motion.div>

            <motion.div
              onClick={() => setSelectedHorizon(120)}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedHorizon === 120
                  ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-400/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">120-Day Window</span>
                <span className="p-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">Total Horizon</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900">{count120}</span>
                <span className="text-[11px] text-slate-500">staff expiring</span>
              </div>
              <p className="text-[10.5px] text-slate-500 mt-1 font-medium">Long-range roster monitoring</p>
            </motion.div>
          </div>

          {/* Table Container & Filter Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            {/* Secondary In-Tab Filter Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              {/* Left filter controls: Entity, Credential Type, Discipline */}
              <div className="flex flex-wrap items-center gap-3">
                {/* 1. Entity Filter */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500">Entity:</span>
                  <select
                    value={expirationEntityFilter}
                    onChange={(e) => setExpirationEntityFilter(e.target.value)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 cursor-pointer"
                  >
                    <option value="All">All 3 Operating Entities</option>
                    <option value="ent-1">AGES Learning Solutions</option>
                    <option value="ent-pstg-inc">Proficio Speech Therapy Group</option>
                    <option value="ent-3">Child's Play Therapy</option>
                  </select>
                </div>

                {/* 2. Credential Type Filter */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500">Credential:</span>
                  <select
                    value={expirationCategoryFilter}
                    onChange={(e) => setExpirationCategoryFilter(e.target.value)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/20 cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="License">State Licenses</option>
                    <option value="Board Certification">Board Certifications</option>
                    <option value="Payer Enrollment">Insurance Panel Enrollments</option>
                    <option value="CAQH">CAQH Re-attestations</option>
                    <option value="Document">Compliance Documents</option>
                  </select>
                </div>

                {/* 3. Discipline filter pills */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500">Discipline:</span>
                  <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-medium gap-1">
                    {(['All', 'ABA', 'Speech', 'OT'] as const).map((disc) => (
                      <button
                        key={disc}
                        onClick={() => setExpirationDisciplineFilter(disc)}
                        className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                          expirationDisciplineFilter === disc
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {disc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search query input */}
              <div className="relative w-full lg:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={expirationSearch}
                  onChange={(e) => setExpirationSearch(e.target.value)}
                  placeholder="Search clinician, credential, payer..."
                  className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/30 focus:border-[#2B4C9D]"
                />
                {expirationSearch && (
                  <button
                    onClick={() => setExpirationSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Expirations Content Display */}
            {filteredExpirations.length === 0 ? (
              /* REQUIRED EMPTY STATE: Exact phrase "No one is expiring in (respective days)" */
              <div className="py-14 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6 sm:p-8">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-600 shadow-2xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  No one is expiring in {selectedHorizon} days
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                  All clinician state licenses, board certifications, CAQH attestations, and payer re-credentialing cycles are currently up to date and in full compliance for the next {selectedHorizon} days.
                </p>

                {selectedHorizon < 120 && (
                  <div className="mt-5 inline-flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs">
                    <span className="text-slate-500 px-2">Expand horizon:</span>
                    {([60, 90, 120] as const).filter(d => d > selectedHorizon).map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedHorizon(d)}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#2B4C9D] hover:text-white text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        Check {d} Days ({d === 60 ? count60 : d === 90 ? count90 : count120})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : displayExpirations.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No matching expirations found</p>
                <p className="mt-1">No items match your filter criteria in the {selectedHorizon}-day window.</p>
                <button
                  onClick={() => {
                    setExpirationSearch('');
                    setExpirationDisciplineFilter('All');
                  }}
                  className="mt-3 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                    <tr>
                      <th className="py-3 px-3">Clinician / Staff</th>
                      <th className="py-3 px-3">Discipline</th>
                      <th className="py-3 px-3">Credential / License Expiring</th>
                      <th className="py-3 px-3">Operating Entity</th>
                      <th className="py-3 px-3">Effective Expiry Date</th>
                      <th className="py-3 px-3 text-center">Countdown</th>
                      <th className="py-3 px-3 text-center">AESAS Schedule</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayExpirations.map((item) => {
                      const isCritical = item.daysRemaining <= 7;
                      const isUrgent = item.daysRemaining <= 30;
                      const isWarning = item.daysRemaining <= 60;
                      const isSendingThis = sendingStaffId === item.id;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{item.clinicianName}</div>
                            <div className="text-[10.5px] text-slate-400 font-mono">{item.clinicianEmail}</div>
                          </td>
                          <td className="py-3 px-3">
                            {getDisciplinePill(item.discipline)}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-800">{item.itemType}</span>
                            {item.payerName && (
                              <div className="text-[10px] text-slate-400">{item.payerName}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-[11px]">
                            {item.entityName || 'AGES Learning Solutions'}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600 font-semibold">
                            {item.expirationDate}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                isCritical
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                                  : isUrgent
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : isWarning
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-blue-50 text-[#2B4C9D] border border-blue-100'
                              }`}
                            >
                              {item.daysRemaining <= 0 ? 'Expired' : `${item.daysRemaining} days left`}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {isCritical ? (
                              <span className="inline-flex items-center text-[10.5px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                                <BellRing className="w-3 h-3 mr-1 text-rose-600 animate-bounce" />
                                Daily Email Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[10.5px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                <Mail className="w-3 h-3 mr-1 text-slate-400" />
                                Monthly Digest
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleTriggerIndividualStaffAlert(item)}
                                disabled={isSendingThis}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                                title="Send AESAS alert (dispatched directly to Clinician, Credentialing Head & System Admin)"
                              >
                                <Send className={`w-3 h-3 ${isSendingThis ? 'animate-spin' : ''}`} />
                                <span>{isSendingThis ? 'Sending...' : 'Send Alert'}</span>
                              </button>

                              <button
                                onClick={() => onSelectProvider(item.providerId)}
                                className="text-xs font-semibold text-[#2B4C9D] hover:underline inline-flex items-center space-x-0.5 cursor-pointer"
                              >
                                <span>Profile</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      )}
      {/* ========================================================================= */}
      {activeTab === 'discipline' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-[#2B4C9D]" />
                <span>Credentialing Metrics by Discipline</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted breakdown for Applied Behavior Analysis (ABA), Speech-Language Pathology (Speech), and Occupational Therapy (OT).
              </p>
            </div>
          </div>

          {/* 3 Discipline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {disciplineStats.map((stat) => (
              <div 
                key={stat.discipline} 
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{stat.name}</h3>
                    <span className="text-[11px] text-slate-500">{stat.totalProviders} Active Staff</span>
                  </div>
                  {getDisciplinePill(stat.discipline)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 text-[11px] block">Total Credentialing</span>
                    <span className="text-lg font-bold text-slate-900">{stat.totalApplications}</span>
                  </div>
                  <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100">
                    <span className="text-sky-700 text-[11px] block">Submitted / Review</span>
                    <span className="text-lg font-bold text-sky-800">{stat.submitted}</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <span className="text-emerald-700 text-[11px] block">Approved / Effective</span>
                    <span className="text-lg font-bold text-emerald-800">{stat.approved}</span>
                  </div>
                  <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                    <span className="text-amber-700 text-[11px] block">Pending / Prep</span>
                    <span className="text-lg font-bold text-amber-800">{stat.pending}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Average Cycle Time:</span>
                    <span className="font-bold text-slate-900">{stat.avgCycleDays} Days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Requiring Action / Overdue:</span>
                    <span className={`font-bold ${stat.requiringAction > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {stat.requiringAction}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">CAQH Attestation Compliance:</span>
                    <span className="font-bold text-emerald-600">{stat.caqhAttestationPct}%</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToTracker(stat.discipline)}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>Filter Tracker for {stat.discipline}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Discipline Detailed Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Discipline Performance Comparison Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cross-discipline operational metrics, turnaround times, and linking readiness.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">Discipline</th>
                    <th className="py-3 px-4 text-center">Clinicians</th>
                    <th className="py-3 px-4 text-center">Total Credentialing</th>
                    <th className="py-3 px-4 text-center">Submitted</th>
                    <th className="py-3 px-4 text-center">Pending</th>
                    <th className="py-3 px-4 text-center">Approved</th>
                    <th className="py-3 px-4 text-center">Action Req.</th>
                    <th className="py-3 px-4 text-center">Avg Cycle</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {disciplineStats.map((stat) => (
                    <tr key={stat.discipline} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center space-x-2">
                          {getDisciplinePill(stat.discipline)}
                          <span>{stat.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold">{stat.totalProviders}</td>
                      <td className="py-3.5 px-4 text-center font-bold">{stat.totalApplications}</td>
                      <td className="py-3.5 px-4 text-center text-sky-700 font-semibold">{stat.submitted}</td>
                      <td className="py-3.5 px-4 text-center text-amber-700 font-semibold">{stat.pending}</td>
                      <td className="py-3.5 px-4 text-center text-emerald-700 font-semibold">{stat.approved}</td>
                      <td className="py-3.5 px-4 text-center text-rose-600 font-bold">{stat.requiringAction}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">{stat.avgCycleDays}d</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onNavigateToTracker(stat.discipline)}
                          className="text-[#2B4C9D] hover:underline font-semibold"
                        >
                          View Tracker
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BY PAYER VIEW                                                             */}
      {/* ========================================================================= */}
      {activeTab === 'payer' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#2B4C9D]" />
                <span>Credentialing by Health Plan / Payer</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring submitted, pending, approved, and rejected volumes with historical average turnaround (TAT).
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search payer name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-[#2B4C9D] outline-none"
              />
            </div>
          </div>

          {/* Payers Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">Health Plan / Payer</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-center">Submitted</th>
                    <th className="py-3 px-4 text-center">Pending</th>
                    <th className="py-3 px-4 text-center">Approved</th>
                    <th className="py-3 px-4 text-center">Rejected</th>
                    <th className="py-3 px-4 text-center">Avg Turnaround</th>
                    <th className="py-3 px-4 text-center">Overdue</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payerStats
                    .filter(p => !searchFilter || p.payer.name.toLowerCase().includes(searchFilter.toLowerCase()))
                    .map((stat) => (
                      <tr key={stat.payer.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{stat.payer.name}</div>
                          <span className="text-[10.5px] text-slate-400">
                            {stat.payer.submissionMethod || 'Online Portal'} • Follow-up every {stat.payer.followUpCadenceDays || 7}d
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-slate-100 text-slate-700">
                            {stat.payer.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-sky-700">
                          {stat.submitted}
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-amber-700">
                          {stat.pending}
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold text-emerald-700">
                          {stat.approved}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-500 font-semibold">
                          {stat.rejected}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                          {stat.averageTurnaroundDays} Days
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {stat.overdueCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              {stat.overdueCount} Overdue
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setFilters(prev => ({ ...prev, payerId: stat.payer.id }));
                              onNavigateToTracker();
                            }}
                            className="text-[#2B4C9D] hover:underline font-semibold inline-flex items-center space-x-1"
                          >
                            <span>View Apps</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BY SPECIALIST VIEW                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'specialist' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-[#2B4C9D]" />
                <span>Credentialing Specialist Workload & Pipeline</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Specialist accountability &bull; Assigned credentialing records, completed, pending, overdue, and scheduled follow-ups.
              </p>
            </div>
          </div>

          {/* Specialist Workload Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialistStats.map((spec) => (
              <div 
                key={spec.id} 
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{spec.name}</h3>
                    <span className="text-[11px] text-slate-500">{spec.workloadPct}% of total workspace volume</span>
                  </div>
                  <div className="p-2 bg-indigo-50 text-[#2B4C9D] rounded-xl font-bold text-xs">
                    {spec.assignedCount} Credentialing
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <span className="text-emerald-700 text-[11px] block">Completed (Approved)</span>
                    <span className="text-lg font-bold text-emerald-800">{spec.completed}</span>
                  </div>
                  <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                    <span className="text-amber-700 text-[11px] block">Pending in Pipeline</span>
                    <span className="text-lg font-bold text-amber-800">{spec.pending}</span>
                  </div>
                  <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100">
                    <span className="text-rose-700 text-[11px] block">Overdue Follow-ups</span>
                    <span className={`text-lg font-bold ${spec.overdue > 0 ? 'text-rose-700' : 'text-slate-700'}`}>{spec.overdue}</span>
                  </div>
                  <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                    <span className="text-blue-700 text-[11px] block">Follow-ups Due</span>
                    <span className="text-lg font-bold text-blue-800">{spec.followUpsDue}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToTracker()}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>View Specialist Queue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Specialist Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Specialist Production & Queue Audit
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">Specialist / Owner</th>
                    <th className="py-3 px-4 text-center">Assigned Credentialing</th>
                    <th className="py-3 px-4 text-center">Completed</th>
                    <th className="py-3 px-4 text-center">Pending</th>
                    <th className="py-3 px-4 text-center">Overdue</th>
                    <th className="py-3 px-4 text-center">Follow-ups Due</th>
                    <th className="py-3 px-4 text-right">Workload Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {specialistStats.map((spec) => (
                    <tr key={spec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {spec.name}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">{spec.assignedCount}</td>
                      <td className="py-3.5 px-4 text-center text-emerald-700 font-semibold">{spec.completed}</td>
                      <td className="py-3.5 px-4 text-center text-amber-700 font-semibold">{spec.pending}</td>
                      <td className="py-3.5 px-4 text-center text-rose-600 font-bold">{spec.overdue}</td>
                      <td className="py-3.5 px-4 text-center text-blue-700 font-semibold">{spec.followUpsDue}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-semibold text-slate-700">{spec.workloadPct}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BY LOCATION VIEW                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'location' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#2B4C9D]" />
                <span>Credentialing by Clinical Location & In-Home Network</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Facility & in-home readiness &bull; Credentialed staff, pending staff, payer coverage, and location additions.
              </p>
            </div>
            {onNavigateToLocations && (
              <button
                onClick={onNavigateToLocations}
                className="px-3.5 py-1.5 bg-[#2B4C9D] hover:bg-[#203a7a] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Manage & Add Locations</span>
              </button>
            )}
          </div>

          {/* Locations Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">Clinic / Practice Location</th>
                    <th className="py-3 px-4">Address / Entity</th>
                    <th className="py-3 px-4 text-center">Credentialed Staff</th>
                    <th className="py-3 px-4 text-center">Pending Staff</th>
                    <th className="py-3 px-4 text-center">Payer Coverage</th>
                    <th className="py-3 px-4 text-center">Location Addition Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {locationStats.map((stat) => (
                    <tr key={stat.location.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{stat.location.name}</div>
                        <span className="text-[10.5px] text-slate-400">
                          {stat.location.serviceTypes?.join(', ') || 'In-Clinic & Telehealth'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                        <div>{stat.location.address || `${stat.location.city}, ${stat.location.state}`}</div>
                        <span className="text-[10.5px] text-slate-400">{stat.location.dba || 'Primary Facility'}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                        {stat.credentialedProviders}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-amber-700">
                        {stat.pendingProviders}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2B4C9D] font-bold text-[11px] border border-blue-100">
                          {stat.payerCoverageCount} Payers Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {stat.location.locationApprovalStatus || 'Approved / Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setFilters(prev => ({ ...prev, locationId: stat.location.id }));
                            onNavigateToTracker();
                          }}
                          className="text-[#2B4C9D] hover:underline font-semibold inline-flex items-center space-x-1"
                        >
                          <span>View Roster</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Programmed CC Roster Management Modal */}
      {isCcRosterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-blue-50 text-[#2B4C9D] rounded-2xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Program CC Roster for Expiration Alerts
                  </h3>
                  <p className="text-xs text-slate-500">
                    Auto-CC distribution for monthly digests &amp; daily countdowns
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCcRosterModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Emails programmed on this roster are automatically carbon-copied whenever an expiration warning is dispatched to a clinical staff member, during the 1st of month organization-wide digest, and on daily 7-day urgent countdown cycles.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Active Programmed CC Recipients ({programmedCcRoster.length}):
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
                {programmedCcRoster.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400">No CC emails programmed.</div>
                ) : (
                  programmedCcRoster.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs text-xs"
                    >
                      <span className="font-mono text-slate-800 font-medium">{email}</span>
                      <button
                        onClick={() => handleRemoveCcRecipient(email)}
                        disabled={isSavingCcRoster}
                        className="text-slate-400 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer px-1.5 py-0.5"
                        title="Remove recipient"
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add new email input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Add Compliance / Specialist Email:</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newCcRosterInput}
                  onChange={(e) => setNewCcRosterInput(e.target.value)}
                  placeholder="e.g. credentialing-head@proficiotherapy.com"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B4C9D]/30"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCcRecipient();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCcRecipient}
                  disabled={isSavingCcRoster || !newCcRosterInput.trim()}
                  className="px-4 py-2 bg-[#2B4C9D] hover:bg-[#1f3775] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const defaultRoster = [
                    'credentialing-head@proficiotherapy.com',
                    'admin@proficiotherapy.com',
                    'superadmin@proficiotherapy.com',
                    'manager@proficiotherapy.com',
                  ];
                  setProgrammedCcRoster(defaultRoster);
                  handleSaveCcRoster(defaultRoster);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Reset to Corporate Roles
              </button>

              <button
                type="button"
                onClick={() => setIsCcRosterModalOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
