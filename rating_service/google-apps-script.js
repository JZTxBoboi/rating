/**
 * Rating Service System - Google Apps Script Web App
 *
 * Deployment target:
 * - Execute as: Me
 * - Who has access: Anyone
 *
 * Recommended setup:
 * 1. Create a Google Sheet.
 * 2. Rename the first tab to "Ratings".
 * 3. Open Extensions > Apps Script.
 * 4. Paste this whole file into Code.gs.
 * 5. Deploy > New deployment > Web app.
 */

const SHEET_NAME = 'Ratings';

// Optional: paste your Spreadsheet ID here if this script is not bound to the Google Sheet.
// Leave blank when the script is created from Extensions > Apps Script inside the Sheet.
const SPREADSHEET_ID = '';

const HEADERS = [
  'Timestamp',
  'Technician ID',
  'Technician Name',
  'Rating Value',
  'Rating Label',
  'Emoji Selected',
  'Device Type',
  'User Agent',
];

function doGet(e) {
  try {
    const sheet = getRatingSheet_();
    ensureHeaderRow_(sheet);

    const action = e && e.parameter && e.parameter.action ? e.parameter.action : 'list';

    if (action !== 'list') {
      return jsonResponse_({ success: false, message: 'Unsupported action.' });
    }

    const records = readRecords_(sheet);
    return jsonResponse_({ success: true, records });
  } catch (error) {
    return jsonResponse_({ success: false, message: error.message || 'Unable to fetch ratings.' });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const payload = parseRequestBody_(e);
    const validationError = validatePayload_(payload);

    if (validationError) {
      return jsonResponse_({ success: false, message: validationError });
    }

    const sheet = getRatingSheet_();
    ensureHeaderRow_(sheet);

    sheet.appendRow([
      new Date(),
      String(payload.technicianId).trim(),
      String(payload.technicianName).trim(),
      Number(payload.ratingValue),
      String(payload.ratingLabel || '').trim(),
      String(payload.emojiSelected || '').trim(),
      String(payload.deviceType || '').trim(),
      String(payload.userAgent || '').trim(),
    ]);

    return jsonResponse_({ success: true, message: 'Rating saved successfully.' });
  } catch (error) {
    return jsonResponse_({ success: false, message: error.message || 'Unable to save rating.' });
  } finally {
    try {
      lock.releaseLock();
    } catch (releaseError) {
      // Lock may not have been acquired. No action required.
    }
  }
}

/**
 * Some clients send OPTIONS during preflight. Apps Script support is limited, but this gives
 * a JSON response if the request reaches the script.
 */
function doOptions() {
  return jsonResponse_({ success: true });
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error('No active spreadsheet found. Bind this script to a Google Sheet or set SPREADSHEET_ID.');
  }
  return active;
}

function getRatingSheet_() {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function ensureHeaderRow_(sheet) {
  const firstRowRange = sheet.getRange(1, 1, 1, HEADERS.length);
  const currentHeaders = firstRowRange.getValues()[0];
  const isMissing = currentHeaders.every((cell) => cell === '');
  const isDifferent = HEADERS.some((header, index) => currentHeaders[index] !== header);

  if (isMissing || isDifferent) {
    firstRowRange.setValues([HEADERS]);
    firstRowRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function parseRequestBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  const contents = e.postData.contents;

  try {
    return JSON.parse(contents);
  } catch (jsonError) {
    // Optional fallback if a future client sends payload as form data.
    if (e.parameter && e.parameter.payload) {
      try {
        return JSON.parse(e.parameter.payload);
      } catch (payloadError) {
        return {};
      }
    }
    return {};
  }
}

function validatePayload_(payload) {
  if (!payload.technicianId || String(payload.technicianId).trim() === '') {
    return 'technicianId is required.';
  }

  if (!payload.technicianName || String(payload.technicianName).trim() === '') {
    return 'technicianName is required.';
  }

  if (payload.ratingValue === undefined || payload.ratingValue === null || payload.ratingValue === '') {
    return 'ratingValue is required.';
  }

  const ratingValue = Number(payload.ratingValue);
  if (Number.isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    return 'ratingValue must be between 1 and 5.';
  }

  return '';
}

function readRecords_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();

  return values
    .filter((row) => row.some((cell) => cell !== ''))
    .map((row) => ({
      timestamp: row[0] instanceof Date ? row[0].toISOString() : row[0],
      technicianId: row[1],
      technicianName: row[2],
      ratingValue: row[3],
      ratingLabel: row[4],
      emojiSelected: row[5],
      deviceType: row[6],
      userAgent: row[7],
    }));
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
