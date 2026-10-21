# Automated Google Sheets Sync & Multi-Month Subsheet Architecture

Directly synchronize live credentialing database records into your designated Weekly (`1Iw3o7DNPxCkA5ZBaGoJ9w0a4FuExzz6uF9RwKjCoLx8`) and Monthly (`1x1EJw6VaUJZq5pfxw_ew7LDRab3qolVclrbhstC1rZg`) Google Sheets, implementing the exact multi-tab structure from your reference templates (`1tQu_HAFaUi8uePJIvkuBJ70Xw6e4AZecoFMBSHZ8eXw` and `1gN_yYaNDtxps8_VEYvn0O83SmolKIsgiT_W3cVhIIT8`) with zero manual copy-paste.

### User Review & Critical Decisions

> [!IMPORTANT]
> Template data will NOT be imported. The live database records currently in the system will completely replace all sheet rows while adopting the exact multi-tab layout and formulas from your reference templates. All manual copy-paste is removed in favor of 1-click automated synchronization.

- **Destination Sheets (Permanently Linked)**:
  - **Weekly Report Workbook**: `https://docs.google.com/spreadsheets/d/1Iw3o7DNPxCkA5ZBaGoJ9w0a4FuExzz6uF9RwKjCoLx8/edit`
  - **Monthly Report Workbook**: `https://docs.google.com/spreadsheets/d/1x1EJw6VaUJZq5pfxw_ew7LDRab3qolVclrbhstC1rZg/edit`
- **Reference Templates (Structural Blueprint Only)**:
  - **Weekly Template**: `https://docs.google.com/spreadsheets/d/1tQu_HAFaUi8uePJIvkuBJ70Xw6e4AZecoFMBSHZ8eXw/edit`
  - **Monthly Template**: `https://docs.google.com/spreadsheets/d/1gN_yYaNDtxps8_VEYvn0O83SmolKIsgiT_W3cVhIIT8/edit`
- **Multi-Tab Architecture Generated in Each Workbook**:
  1. **`About`**: Purpose, Family of Companies breakdown (AGES Learning Solutions, Proficio Speech Therapy Group, Child's Play Therapy Services), workbook contents index, data dictionary, and HIPAA §164.312 classification. Prepared by Joel Mathew Reji.
  2. **`Dashboard`**: Formula-driven KPI summary cards, stage breakdown, practice entity metrics, discipline breakdown, and payer distributions.
  3. **`Weekly Report` / `Monthly Report`**: Full 19-column master register with stage color-coding (#d1fae5 Approved, #fef3c7 Submitted, #fee2e2 Overdue/Delayed) populated directly from the live application database.
  4. **Dynamic Active Month Subsheets (`[Month Year]`)**: Automatically generated for each month with active follow-ups/reviews in the database (e.g. `Oct 2026`, `Jun 2026`, `Jul 2026`).
  5. **`No Follow-Up`**: Dedicated queue sheet for Approved/Linked records with no follow-up scheduled.
- **Automated Direct Synchronization Engine (Zero Copy-Paste)**:
  - You deploy a lightweight, pre-configured Google Apps Script Web App bound to your target spreadsheets (setup takes ~60 seconds via `Extensions > Apps Script`).
  - Clicking **"Auto-Sync to Google Sheets"** pushes the full multi-tab JSON payload directly from the software into your sheets, writing all subsheets, formulas, and formatting in the background.

---

### 1. Overview & Core Concept

- **What It Delivers**: Replaces manual clipboard operations with an automated pipeline. Live credentialing records in the software are structured into your official 5+ tab format and published directly into your Google Sheets on demand or on schedule.
- **Target Persona**: Joel Mathew Reji and Credentialing Operations leads who need the Google Sheets to stay 100% synchronized with live database state without tedious copy-paste.
- **Key Value**: Zero data-entry errors, dynamic month subsheets reflecting actual operational queues, and total structural fidelity to your reference templates.

---

### 2. User Experience & Visual Design

- **Unified Google Sheets Command Bar**:
  - Located at the top of the **Reports** view.
  - **Weekly Station**:
    - Title: `Weekly Status Workbook`
    - Target: `1Iw3o7...Lx8`
    - Actions: `Open Weekly Sheet ↗`, `1-Click Auto-Sync`, `Webhook Settings`
  - **Monthly Station**:
    - Title: `Monthly Review Workbook`
    - Target: `1x1EJw...rZg`
    - Actions: `Open Monthly Sheet ↗`, `1-Click Auto-Sync`, `Webhook Settings`
  - **Live Sheet View**: Switches to in-app multi-tab viewer.
  - **Download .xlsx**: Universal multi-tab Excel download matching the template structure.
- **In-App Interactive Spreadsheet Viewer**:
  - Tab navigation matching Google Sheets: `About` | `Dashboard` | `Weekly/Monthly Report` | `Oct 2026` | `Jun 2026` | `No Follow-Up`.
  - Formatted navy top bar with company logo and live stage status badges.
- **1-Click Webhook Setup Modal**:
  - Provides a single copyable Google Apps Script file (`Code.gs`) that handles creating/updating tabs, setting cell formulas, and formatting colors.
  - Input field to save your Webhook URL with instant connection test.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Apps Script Webhook vs. In-Browser Manual Copy-Paste**:
  - *Chosen Approach*: Apps Script Webhook endpoint.
  - *Why*: Eliminates the manual copy-paste friction you identified while avoiding OAuth domain restrictions in preview environments.
- **Decision 2: Dynamic Follow-Up Month Subsheets vs. Static 12 Months**:
  - *Chosen Approach*: Scan live records and dynamically generate subsheets only for active months (e.g. `Oct 2026`, `Jun 2026`), plus `No Follow-Up`.
  - *Why*: Exactly reflects your template design and ensures coordinators only see relevant monthly follow-up queues.
- **Decision 3: Replacing Template Sample Data with Database Records**:
  - *Chosen Approach*: The application database records replace all row data on sync.
  - *Why*: Ensures the sheet is an exact reflection of the software database at all times.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Reports Dashboard View                          │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │        Unified Sheets Command Bar (Auto-Sync Webhook)          │   │
│   │                                                                │   │
│   │   [Weekly Workbook: 1Iw3o7...Lx8]    [Monthly: 1x1EJw...rZg]   │   │
│   │    • Open Weekly Sheet ↗              • Open Monthly Sheet ↗   │   │
│   │    • 1-Click Auto-Sync                • 1-Click Auto-Sync      │   │
│   │    • Status: Connected                • Status: Connected      │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌───────┐ ┌───────────┐ ┌───────────────┐ ┌──────────┐ ┌───────────┐ │
│   │ About │ │ Dashboard │ │ Weekly Report │ │ Oct 2026 │ │ No Follow │ │
│   └───────┘ └───────────┘ └───────────────┘ └──────────┘ └───────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Automated POST Payload
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             Google Apps Script Webhook Engine (/exec POST)             │
│                                                                        │
│   1. Generates "About" tab with entity scopes & Joel Mathew Reji meta  │
│   2. Generates "Dashboard" tab with KPI cards & stage breakdowns       │
│   3. Populates "Weekly/Monthly Report" with live database records      │
│   4. Partitions records into active Month Subsheets (Oct 2026, etc.)   │
│   5. Populates "No Follow-Up" queue for unassigned/approved records    │
│   6. Applies #d1fae5 / #fef3c7 / #fee2e2 stage colors & column widths │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Direct Spreadsheet Write
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│              Live Google Sheets (Weekly & Monthly Workbooks)           │
└────────────────────────────────────────────────────────────────────────┘
```

- **Payload Structure**:
  - Tab definitions, header metadata, KPI summary objects, row data mapped to the 19 standard columns, and styling parameters.
- **Fallback Capability**:
  - If the Webhook is not yet configured, the system provides 1-click clipboard and multi-tab `.xlsx` download to prevent workflow interruption.
