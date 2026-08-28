import { AccessLevel, SystemRole } from '../types';

export interface SystemRoleDefinition {
  id: SystemRole;
  title: string;
  category: string;
  defaultAccessLevel: AccessLevel;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  description: string;
  responsibilities: string[];
}

export const SYSTEM_ROLES: SystemRoleDefinition[] = [
  {
    id: 'Credentialing Specialist',
    title: 'Credentialing Specialist',
    category: 'Credentialing Operations',
    defaultAccessLevel: 'USER',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200',
    bgColor: 'bg-sky-50/60',
    description: 'Executes core day-to-day credentialing workflows, primary source document verification, payer submissions, and follow-ups.',
    responsibilities: [
      'Provider intake and document verification',
      'CAQH, NPI coordination, PAVE, Medicaid enrollment',
      'Payer applications and follow-ups',
      'Additional documentation and application corrections',
      'Approval and effective-date tracking',
      'Updating credentialing records and monthly reporting',
      'W-9 and group financial information required by payers',
      'Manage discipline, payer, entity, and location master data',
    ],
  },
  {
    id: 'Credentialing Lead / Manager',
    title: 'Credentialing Lead / Manager',
    category: 'Operational Leadership',
    defaultAccessLevel: 'ADMINISTRATOR',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    bgColor: 'bg-indigo-50/60',
    description: 'Oversees team throughput, allocates provider files, monitors SLA turnaround compliance, and drives process improvements.',
    responsibilities: [
      'Work allocation and quality control',
      'Escalations and payer issue resolution',
      'KPI monitoring, process improvement, and team training',
      'Management reporting and audit oversight',
    ],
  },
  {
    id: 'Provider',
    title: 'Provider',
    category: 'Clinical Staff & Rendering Providers',
    defaultAccessLevel: 'USER',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    bgColor: 'bg-teal-50/60',
    description: 'Practitioner profile management, credentialing attestations, licensure disclosures, and document renewal submissions.',
    responsibilities: [
      'Providing accurate information and completing required forms',
      'Maintaining CAQH profile',
      'Providing licenses / certifications / requested documents',
      'Responding to credentialing requests',
    ],
  },
  {
    id: 'HR/Operations',
    title: 'HR/Operations',
    category: 'People & Resource Operations',
    defaultAccessLevel: 'USER',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50/60',
    description: 'Coordinates provider hire dates, clinic location assignments, legal entity affiliations, and credentialing readiness schedules.',
    responsibilities: [
      'Provider onboarding information (start date, location, group assignment)',
      'Coordination with credentialing on new-hire timelines',
    ],
  },
  {
    id: 'Clinical Team',
    title: 'Clinical Team',
    category: 'Clinical Governance',
    defaultAccessLevel: 'USER',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50/60',
    description: 'Assists with specialty verification, scope of practice alignment, clinical peer references, and supervision agreements.',
    responsibilities: [
      'Clinical documentation and verification support',
      'License, board certification, and reference support',
    ],
  },
  {
    id: 'Billing and Claims',
    title: 'Billing and Claims',
    category: 'Revenue Cycle Management',
    defaultAccessLevel: 'USER',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    bgColor: 'bg-rose-50/60',
    description: 'Monitors payer effective dates, billing provider NPI linking status, and coordinates with credentialing to resolve claim denials.',
    responsibilities: [
      'Payer contract financial coordination',
      'Coordinate with credentialling team regarding denials.',
    ],
  },
  {
    id: 'Leadership / Management',
    title: 'Leadership / Management',
    category: 'Executive & Strategic Oversight',
    defaultAccessLevel: 'ADMINISTRATOR',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50/60',
    description: 'Drives health plan contracting, in-network rate negotiations, strategic market expansion, and executive performance analytics.',
    responsibilities: [
      'Strategic decisions, contracting decisions, and rate negotiations',
      'Payer network expansion and entity / location approvals',
      'Resource allocation',
      'Reviewing credentialing KPIs and escalations',
    ],
  },
  {
    id: 'System Administrator',
    title: 'System Administrator',
    category: 'IT & System Governance',
    defaultAccessLevel: 'ADMINISTRATOR',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50/60',
    description: 'Manages user identities, security privileges, workflow milestones, turnaround SLAs, notification templates, and analytics integrations.',
    responsibilities: [
      'Manage users, roles, and permissions',
      'Configure workflow stages, SLAs, notification templates, payer requirements',
      'Manage integrations (email, Power BI dataset)',
    ],
  },
];
