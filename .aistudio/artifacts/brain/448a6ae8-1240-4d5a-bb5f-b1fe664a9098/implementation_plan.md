# Dedicated Weekly & Monthly Google Sheets Integration

Integrate the user's two dedicated Google Sheets directly into the credentialing system (Weekly: `1Iw3o7DNPxCkA5ZBaGoJ9w0a4FuExzz6uF9RwKjCoLx8`, Monthly: `1x1EJw6VaUJZq5pfxw_ew7LDRab3qolVclrbhstC1rZg`), remove friction from OAuth sign-in popups and manual attachment forms, and provide a unified dual-sheet management bar in the Reports view.

### User Review & Critical Decisions

> [!IMPORTANT]
> The two Google Sheets provided by the user are now the official, permanent endpoints for weekly and monthly reports. Manual Google sign-in popups and link input modals will be replaced by direct 1-click sync and open actions.

- **Weekly Report Sheet**: Attached permanently to `https://docs.google.com/spreadsheets/d/1Iw3o7DNPxCkA5ZBaGoJ9w0a4FuExzz6uF9RwKjCoLx8/edit`.
- **Monthly Report Sheet**: Attached permanently to `https://docs.google.com/spreadsheets/d/1x1EJw6VaUJZq5pfxw_ew7LDRab3qolVclrbhstC1rZg/edit`.
- **Authentication & Attachment Friction**: All manual Google sign-in buttons (`signInWithPopup`), domain restriction warnings, and manual URL input modals are removed from the default workflow. Both sheets are attached automatically.
- **Branded Layout & Data Formatting**: Both sheets will be formatted with the official Proficio Therapy Services dark-navy top bar, live `=IMAGE(...)` company logo formula in row 1, color-coded stage status badges (#d1fae5 for Approved, #fef3c7 for Submitted, #fee2e2 for Delayed), and complete clinician roster records.
- **Permission Strategy**: Configured for immediate synchronization under "Anyone with link" and prepared for future organizational restriction with 1-click formatted clipboard sync as a fail-safe.

---

### 1. Overview & Core Concept

- **What It Delivers**: Direct, native attachment of the user's two Google Sheets into the Reports dashboard. A single, unified Google Sheets command bar at the top of the Reports view gives one-click access to open, sync, and copy formatted data for both Weekly Status and Monthly Review reporting.
- **Target Audience**: Credentialing coordinators, operations directors, and executive leadership who need instant visibility across weekly operational cadences and monthly payer enrollment milestones.
- **Key Value**: Zero sign-in errors, zero popup blocks, zero manual copying of sheet IDs, and immediate access to cleanly branded Google Sheets with company logo and live status colors.

---

### 2. User Experience & Visual Design

- **Unified Sheets Bar in Reports View**:
  - Replaces the generic single-sheet banner with an executive dual-card command bar.
  - **Left Station — Weekly Status Workbook**:
    - Status badge: `Attached & Active` (Emerald)
    - Action 1: `Open Weekly Sheet ↗` (direct link to `1Iw3o7DNPxCkA5ZBaGoJ9w0a4FuExzz6uF9RwKjCoLx8`)
    - Action 2: `Sync Weekly Records` (triggers direct export of weekly cadence data)
    - Action 3: `Copy Weekly Data` (copies ready-to-paste TSV with logo formula and weekly records)
  - **Right Station — Monthly Review Workbook**:
    - Status badge: `Attached & Active` (Blue)
    - Action 1: `Open Monthly Sheet ↗` (direct link to `1x1EJw6VaUJZq5pfxw_ew7LDRab3qolVclrbhstC1rZg`)
    - Action 2: `Sync Monthly Records` (triggers direct export of monthly review snapshot)
    - Action 3: `Copy Monthly Data` (copies ready-to-paste TSV with logo formula, KPI cards, and monthly records)
  - **Universal Download**: Quick button to download complete multi-tab `.xlsx` workbook containing both Weekly and Monthly sheets.
- **Master Workbook (Live Sheet) In-App View**:
  - Updates the in-app interactive spreadsheet viewer with dedicated sub-sheet tabs for `Weekly_Cadence` and `Monthly_Review`, allowing users to inspect both datasets directly inside the software without leaving the tab.
- **Visual Palette & Typography**:
  - Header: Deep Navy (`#0f2b5c`) with crisp white typography and logo emblem.
  - KPI & Stage Statuses: Pastel fills with high-contrast text conforming to WCAG AA (Approved: `#d1fae5` / `#065f46`, In Review: `#fef3c7` / `#92400e`, Overdue: `#fee2e2` / `#991b1b`).
  - Numbers: Strictly tabular monospace (`tabular-nums font-mono`) for exact alignment.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Pre-Configured Endpoints vs. Single Sheet**:
  - *Chosen Approach*: Store both `weeklySheet` and `monthlySheet` explicitly in the system configuration (`report_config.json` and client state).
  - *Why*: The user maintains distinct operational rhythms for weekly follow-up reviews and monthly executive summaries; separating them into dedicated workbooks prevents clutter and data collisions.
- **Decision 2: Removal of OAuth Sign-In Friction**:
  - *Chosen Approach*: Completely bypass `signInWithPopup` and domain authorization checks by treating the user's provided URLs as pre-authorized application endpoints.
  - *Why*: Eliminates `auth/unauthorized-domain` and `auth/popup-blocked` errors permanently.
- **Decision 3: Two-Tier Data Sync (Direct API / GViz + 1-Click Clipboard)**:
  - *Chosen Approach*: Implement direct sheet sync when permissions allow (`Anyone with link`), with an instant "Copy Ready-to-Paste Formatted Data" clipboard feature that guarantees 100% data integrity even if the sheet becomes restricted to organization email in the future.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Reports Dashboard View                          │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │           Unified Sheets Bar (Attached Workbooks)              │   │
│   │                                                                │   │
│   │   [Weekly Workbook: 1Iw3o7...Lx8]    [Monthly: 1x1EJw...rZg]   │   │
│   │    • Open Weekly Sheet ↗              • Open Monthly Sheet ↗   │   │
│   │    • Sync Weekly Records              • Sync Monthly Records   │   │
│   │    • Copy Weekly TSV                  • Copy Monthly TSV       │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌─────────────────┐ ┌──────────────────┐ ┌───────────────────────┐   │
│   │ Weekly Tab View │ │ Monthly Tab View │ │ Master Sheet Live Tab │   │
│   └─────────────────┘ └──────────────────┘ └───────────────────────┘   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Data Formatting & Service Engine                     │
│                                                                        │
│   • generateWeeklySheetTsv()   -> Branded Navy Bar + Weekly Records    │
│   • generateMonthlySheetTsv()  -> Branded Navy Bar + Monthly Review    │
│   • report_config.json         -> Persisted weekly & monthly IDs       │
│   • /api/reports/sync-sheets   -> Direct push / download endpoints     │
└────────────────────────────────────────────────────────────────────────┘
```

- **Configuration Schema (`report_config.json`)**:
  ```json
  {
    "weeklySheet": {
      "spreadsheetId": "1Iw3o7DNPxCkA5ZBaGoJ9w0a4FuExzz6uF9RwKjCoLx8",
      "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/1Iw3o7DNPxCkA5ZBaGoJ9w0a4FuExzz6uF9RwKjCoLx8/edit",
      "title": "Proficio Therapy Services — Weekly Credentialing Status Workbook",
      "lastSyncedAt": null
    },
    "monthlySheet": {
      "spreadsheetId": "1x1EJw6VaUJZq5pfxw_ew7LDRab3qolVclrbhstC1rZg",
      "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/1x1EJw6VaUJZq5pfxw_ew7LDRab3qolVclrbhstC1rZg/edit",
      "title": "Proficio Therapy Services — Monthly Credentialing Review Workbook",
      "lastSyncedAt": null
    }
  }
  ```
- **Event Handlers & Interactivity**:
  - `handleOpenWeeklySheet`: Opens the weekly sheet in a new tab.
  - `handleOpenMonthlySheet`: Opens the monthly sheet in a new tab.
  - `handleCopyWeeklyData`: Copies formatted weekly TSV (including `=IMAGE("...")` formula in cell A1 and all records).
  - `handleCopyMonthlyData`: Copies formatted monthly TSV (including `=IMAGE("...")` formula and monthly breakdown).
  - `handleSyncWeeklySheet` / `handleSyncMonthlySheet`: Syncs data directly and updates timestamp.
