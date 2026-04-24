// Google Sheets CMS - For remote content editing
// CEO can edit in Google Sheets, changes reflect instantly on website

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Replace with your actual Google Sheet ID
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv`;

/**
 * Fetch data from a specific sheet tab
 * @param {string} sheetName - Name of the sheet tab (home, studio, contact, etc.)
 * @param {string} gid - The GID of the sheet tab
 * @returns {Promise<Object>} Parsed JSON data
 */
export async function fetchSheetData(sheetName, gid = '0') {
  try {
    const url = `${BASE_URL}&gid=${gid}`;
    const response = await fetch(url);
    const csvText = await response.text();
    return parseCSVToJSON(csvText);
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error);
    return null;
  }
}

/**
 * Parse CSV to JSON with nested object support
 * Format: key.subkey = value
 */
function parseCSVToJSON(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return {};

  const headers = parseCSVLine(lines[0]);
  const result = {};

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 2) continue;

    const key = values[0].trim();
    const value = values[1].trim();

    // Handle nested objects with dot notation (e.g., hero.heading)
    if (key.includes('.')) {
      const parts = key.split('.');
      let current = result;
      for (let j = 0; j < parts.length - 1; j++) {
        if (!current[parts[j]]) current[parts[j]] = {};
        current = current[parts[j]];
      }
      current[parts[parts.length - 1]] = value;
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Fetch all content at once
 */
export async function fetchAllContent() {
  // GIDs for each sheet - you'll get these from your Google Sheet URL
  const sheetConfig = {
    home: { gid: '0' },
    studio: { gid: '123456789' },
    contact: { gid: '987654321' },
    careers: { gid: '111222333' },
    faq: { gid: '444555666' },
    privacy: { gid: '777888999' },
    terms: { gid: '000111222' }
  };

  const promises = Object.entries(sheetConfig).map(async ([name, config]) => {
    const data = await fetchSheetData(name, config.gid);
    return [name, data];
  });

  const results = await Promise.all(promises);
  return Object.fromEntries(results);
}
