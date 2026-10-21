/**
 * GOOGLE APPS SCRIPT TEMPLATE (Code.gs)
 * 
 * Production-ready Google Apps Script to be deployed as a Web App bound to the user's Google Sheets:
 * - Weekly Status Workbook (1Iw3o7DNPxCkA5ZBaGoJ9w0a4FuExzz6uF9RwKjCoLx8)
 * - Monthly Review Workbook (1x1EJw6VaUJZq5pfxw_ew7LDRab3qolVclrbhstC1rZg)
 * 
 * Features:
 * - Creates / updates all subsheets automatically without manual copy-paste:
 *   1. "About" (Workbook overview, Family of Companies, Contents index, Data dictionary, Prepared by Joel Mathew Reji)
 *   2. "Dashboard" (Formula-driven KPI summary cards, Stage breakdown, Practice entities, Disciplines)
 *   3. "Weekly Report" / "Monthly Report" (Full 19-column master register with stage color-coding)
 *   4. Active Month Subsheets (e.g. "Oct 2026", "Jun 2026", etc. filtered dynamically)
 *   5. "No Follow-Up" (Approved & Linked records with no scheduled follow-up)
 * - Sets formulas, header styles (#0f2b5c navy), frozen top rows, and light stage color fills.
 */

export const GOOGLE_APPS_SCRIPT_SOURCE = `/**
 * AGES LEARNING SOLUTIONS & PROFICIO THERAPY SERVICES
 * Automated Credentialing Multi-Sheet Synchronization Engine
 * 
 * Prepared for: Joel Mathew Reji & Credentialing Operations
 * Documented under HIPAA §164.312 Classification
 * 
 * Instructions:
 * 1. Open your target Google Sheet (Weekly or Monthly).
 * 2. Click Extensions > Apps Script.
 * 3. Delete any default code in Code.gs and paste this ENTIRE file.
 * 4. Click 'Save' (floppy icon).
 * 5. Click 'Deploy' > 'New deployment'.
 * 6. Select type: 'Web app'.
 *    - Description: Credentialing Sync Webhook
 *    - Execute as: 'Me' (your Google account)
 *    - Who has access: 'Anyone'
 * 7. Click 'Deploy', authorize permissions, and copy the Web App URL (ends in /exec).
 * 8. Paste that Web App URL into the Credentialing Software Webhook Settings.
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ONLINE',
    service: 'AGES & Proficio Credentialing Webhook Sync Engine',
    timestamp: new Date().toISOString(),
    spreadsheetName: SpreadsheetApp.getActiveSpreadsheet().getName(),
    spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var raw = e.postData.contents;
    var data = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var reportType = data.reportType || 'weekly'; // 'weekly' or 'monthly'
    var masterSheetTitle = reportType === 'weekly' ? 'Weekly Report' : 'Monthly Report';
    var tabsUpdated = [];

    // 1. UPDATE OR CREATE "About" TAB
    if (data.aboutRows && data.aboutRows.length > 0) {
      var aboutSheet = getOrCreateSheet(ss, 'About');
      aboutSheet.clear();
      aboutSheet.getRange(1, 1, data.aboutRows.length, data.aboutRows[0].length).setValues(data.aboutRows);
      
      // Styling About sheet
      aboutSheet.setTabColor('#0f2b5c');
      aboutSheet.getRange('B2').setFontWeight('bold').setFontSize(14).setFontColor('#0f2b5c');
      aboutSheet.getRange('B4:B5').setFontColor('#64748b').setFontSize(10);
      
      // Section Headers in Column B
      var sectionHeaders = ['ABOUT THIS WORKBOOK', 'FAMILY OF COMPANIES', 'WORKBOOK CONTENTS', 'DATA DICTIONARY', 'NOTES'];
      for (var r = 1; r <= data.aboutRows.length; r++) {
        var cellVal = String(data.aboutRows[r - 1][1] || '').trim();
        if (sectionHeaders.indexOf(cellVal) !== -1) {
          aboutSheet.getRange(r, 2, 1, 5).setBackground('#0f2b5c').setFontColor('#ffffff').setFontWeight('bold');
        }
      }
      aboutSheet.autoResizeColumns(1, 6);
      tabsUpdated.push('About');
    }

    // 2. UPDATE OR CREATE "Dashboard" TAB
    if (data.dashboardRows && data.dashboardRows.length > 0) {
      var dashSheet = getOrCreateSheet(ss, 'Dashboard');
      dashSheet.clear();
      dashSheet.getRange(1, 1, data.dashboardRows.length, data.dashboardRows[0].length).setValues(data.dashboardRows);
      dashSheet.setTabColor('#2563eb');
      
      // Format Title Banner
      dashSheet.getRange('B2').setFontWeight('bold').setFontSize(14).setFontColor('#0f2b5c');
      dashSheet.getRange('B4:B5').setFontColor('#64748b').setFontSize(10);
      
      // Format Metric Header Bars
      for (var dr = 1; dr <= data.dashboardRows.length; dr++) {
        var dVal = String(data.dashboardRows[dr - 1][1] || '').trim();
        if (dVal.indexOf('PIPELINE') !== -1 || dVal.indexOf('BREAKDOWN') !== -1 || dVal.indexOf('METRICS') !== -1) {
          dashSheet.getRange(dr, 2, 1, 6).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
        }
      }
      dashSheet.autoResizeColumns(1, 7);
      tabsUpdated.push('Dashboard');
    }

    // 3. UPDATE OR CREATE MASTER REGISTER TAB ("Weekly Report" / "Monthly Report")
    if (data.masterRows && data.masterRows.length > 0) {
      var masterSheet = getOrCreateSheet(ss, masterSheetTitle);
      masterSheet.clear();
      masterSheet.getRange(1, 1, data.masterRows.length, data.masterRows[0].length).setValues(data.masterRows);
      masterSheet.setTabColor(reportType === 'weekly' ? '#059669' : '#3b82f6');
      
      // Freeze top 5 rows
      masterSheet.setFrozenRows(5);
      
      // Navy top bar
      masterSheet.getRange(1, 1, 3, data.masterRows[0].length)
        .setBackground('#0f2b5c')
        .setFontColor('#ffffff')
        .setFontWeight('bold');
        
      // Table Header Row 5
      masterSheet.getRange(5, 1, 1, data.masterRows[0].length)
        .setBackground('#1e293b')
        .setFontColor('#ffffff')
        .setFontWeight('bold');
        
      // Apply Stage Color Coding to Column G (Stage)
      applyStageColors(masterSheet, 6, data.masterRows.length, 7);
      masterSheet.autoResizeColumns(1, data.masterRows[0].length);
      tabsUpdated.push(masterSheetTitle);
    }

    // 4. UPDATE OR CREATE DYNAMIC ACTIVE MONTH SUBSHEETS (e.g. "Oct 2026", "Jun 2026")
    if (data.monthSubsheets && Array.isArray(data.monthSubsheets)) {
      for (var m = 0; m < data.monthSubsheets.length; m++) {
        var mItem = data.monthSubsheets[m];
        if (mItem.tabName && mItem.rows && mItem.rows.length > 0) {
          var mSheet = getOrCreateSheet(ss, mItem.tabName);
          mSheet.clear();
          mSheet.getRange(1, 1, mItem.rows.length, mItem.rows[0].length).setValues(mItem.rows);
          mSheet.setTabColor('#0284c7');
          mSheet.setFrozenRows(5);
          
          mSheet.getRange(1, 1, 3, mItem.rows[0].length)
            .setBackground('#0f2b5c')
            .setFontColor('#ffffff')
            .setFontWeight('bold');
            
          mSheet.getRange(5, 1, 1, mItem.rows[0].length)
            .setBackground('#1e293b')
            .setFontColor('#ffffff')
            .setFontWeight('bold');
            
          applyStageColors(mSheet, 6, mItem.rows.length, 7);
          mSheet.autoResizeColumns(1, mItem.rows[0].length);
          tabsUpdated.push(mItem.tabName);
        }
      }
    }

    // 5. UPDATE OR CREATE "No Follow-Up" TAB
    if (data.noFollowUpRows && data.noFollowUpRows.length > 0) {
      var noFollowSheet = getOrCreateSheet(ss, 'No Follow-Up');
      noFollowSheet.clear();
      noFollowSheet.getRange(1, 1, data.noFollowUpRows.length, data.noFollowUpRows[0].length).setValues(data.noFollowUpRows);
      noFollowSheet.setTabColor('#64748b');
      noFollowSheet.setFrozenRows(5);
      
      noFollowSheet.getRange(1, 1, 3, data.noFollowUpRows[0].length)
        .setBackground('#0f2b5c')
        .setFontColor('#ffffff')
        .setFontWeight('bold');
        
      noFollowSheet.getRange(5, 1, 1, data.noFollowUpRows[0].length)
        .setBackground('#1e293b')
        .setFontColor('#ffffff')
        .setFontWeight('bold');
        
      applyStageColors(noFollowSheet, 6, data.noFollowUpRows.length, 7);
      noFollowSheet.autoResizeColumns(1, data.noFollowUpRows[0].length);
      tabsUpdated.push('No Follow-Up');
    }

    // Move "About" and "Dashboard" to first positions
    reorderTabs(ss, ['About', 'Dashboard', masterSheetTitle]);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      reportType: reportType,
      tabsUpdated: tabsUpdated,
      totalTabs: tabsUpdated.length,
      recordsSynced: data.totalRecords || (data.masterRows ? data.masterRows.length - 5 : 0),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message || error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function reorderTabs(ss, preferredOrder) {
  try {
    for (var i = 0; i < preferredOrder.length; i++) {
      var s = ss.getSheetByName(preferredOrder[i]);
      if (s) {
        ss.setActiveSheet(s);
        ss.moveActiveSheet(i + 1);
      }
    }
  } catch(e) {}
}

function applyStageColors(sheet, startRow, endRow, stageCol) {
  if (endRow < startRow) return;
  var numRows = endRow - startRow + 1;
  var range = sheet.getRange(startRow, stageCol, numRows, 1);
  var values = range.getValues();
  var backgrounds = [];
  var fontColors = [];

  for (var i = 0; i < values.length; i++) {
    var val = String(values[i][0]).toLowerCase();
    if (val.indexOf('approved') !== -1 || val.indexOf('linked') !== -1 || val.indexOf('effective') !== -1) {
      backgrounds.push(['#d1fae5']); // Light emerald
      fontColors.push(['#065f46']);
    } else if (val.indexOf('overdue') !== -1 || val.indexOf('delayed') !== -1 || val.indexOf('escalat') !== -1) {
      backgrounds.push(['#fee2e2']); // Light rose/red
      fontColors.push(['#991b1b']);
    } else if (val.indexOf('submitted') !== -1 || val.indexOf('review') !== -1 || val.indexOf('cadence') !== -1) {
      backgrounds.push(['#fef3c7']); // Light amber
      fontColors.push(['#92400e']);
    } else {
      backgrounds.push(['#f1f5f9']); // Slate neutral
      fontColors.push(['#334155']);
    }
  }

  range.setBackgrounds(backgrounds);
  range.setFontColors(fontColors);
  range.setFontWeight('bold');
}
`;
