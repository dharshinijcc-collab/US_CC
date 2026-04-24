// Google Sheets CMS - For remote content editing
// CEO can edit in Google Sheets, changes reflect instantly on website

// REPLACE THIS WITH YOUR ACTUAL GOOGLE SHEET ID
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv`;

// REPLACE THESE WITH YOUR ACTUAL GIDs FROM GOOGLE SHEET URL
const SHEET_GIDS = {
  home: '0',
  studio: '0',
  contact: '0',
  careers: '0',
  faq: '0',
  privacy: '0',
  terms: '0'
};

/**
 * Fetch data from a specific sheet tab
 * @param {string} sheetName - Name of the sheet tab (home, studio, contact, etc.)
 * @returns {Promise<Object>} Parsed JSON data
 */
export async function fetchSheetData(sheetName) {
  try {
    const gid = SHEET_GIDS[sheetName] || '0';
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
  const promises = Object.keys(SHEET_GIDS).map(async (name) => {
    const data = await fetchSheetData(name);
    return [name, data];
  });

  const results = await Promise.all(promises);
  return Object.fromEntries(results);
}
