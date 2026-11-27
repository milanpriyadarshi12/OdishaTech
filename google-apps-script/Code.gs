const SPREADSHEET_ID = "1AbCdEfGhIjKlMnOpQrStUvWxYz123456789";
const SHEET_NAME = "Reviews";
const HEADERS = ["Name", "Rating", "Review", "Date", "Status"];

const MAX_NAME_LENGTH = 80;
const MAX_REVIEW_LENGTH = 2000;

function doGet(event) {
  const action = event && event.parameter
    ? event.parameter.action : "";

  if (action !== "reviews") {
    return jsonOutput({ ok: false, error: "Unsupported action." });
  }

  try {
    const sheet = getReviewsSheet();
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return jsonOutput({ ok: true, reviews: [] });
    }

    const rows = sheet.getRange(2, 1, lastRow - 1, 5).getValues();

    const reviews = rows
      .filter(row =>
        String(row[4]).trim().toLowerCase() === "published"
      )
      .map(row => {
        const date = row[3] instanceof Date
          ? row[3] : new Date(row[3]);

        const rating = Number(row[1]);
        const name = displaySheetText(row[0]).trim();
        const review = displaySheetText(row[2]).trim();

        if (
          !name ||
          !review ||
          !Number.isInteger(rating) ||
          rating < 1 ||
          rating > 5 ||
          isNaN(date.getTime())
        ) {
          return null;
        }

        return {
          name: name,
          rating: rating,
          review: review,
          date: date.toISOString()
        };
      })
      .filter(Boolean)
      .sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );

    return jsonOutput({ ok: true, reviews: reviews });

  } catch (error) {
    console.error(error);
    return jsonOutput({
      ok: false,
      error: "Unable to load reviews."
    });
  }
}

function doPost(event) {
  const parameters = event && event.parameter
    ? event.parameter : {};

  if (parameters.action !== "submit") {
    return jsonOutput({ ok: false, error: "Unsupported action." });
  }

  const name = cleanText(parameters.name, MAX_NAME_LENGTH);
  const review = cleanText(parameters.review, MAX_REVIEW_LENGTH);
  const rating = Number(parameters.rating);
  const submissionId = cleanText(parameters.submissionId, 100);

  if (
    !name ||
    !review ||
    !submissionId ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return jsonOutput({
      ok: false,
      error: "Enter your name, review and a rating from 1 to 5."
    });
  }

  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const properties = PropertiesService.getScriptProperties();
    const duplicateKey = "submission_" + submissionId;

    if (properties.getProperty(duplicateKey)) {
      return jsonOutput({ ok: true, duplicate: true });
    }

    const sheet = getReviewsSheet();
    const nextRow = sheet.getLastRow() + 1;

    sheet.getRange(nextRow, 1, 1, 5).setValues([[
      safeSheetText(name),
      rating,
      safeSheetText(review),
      new Date(),
      "Pending"
    ]]);

    sheet.getRange(nextRow, 4)
      .setNumberFormat("dd mmmm yyyy");

    properties.setProperty(duplicateKey, "true");

    return jsonOutput({ ok: true });

  } catch (error) {
    console.error(error);
    return jsonOutput({
      ok: false,
      error: "Unable to save your review. Please try again."
    });

  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function getReviewsSheet() {
  if (
    !SPREADSHEET_ID ||
    SPREADSHEET_ID === "PASTE_YOUR_GOOGLE_SHEET_ID_HERE" ||
    SPREADSHEET_ID === "1AbCdEfGhIjKlMnOpQrStUvWxYz123456789"
  ) {
    throw new Error("SPREADSHEET_ID is still the placeholder. Paste the real ID from your Google Sheet URL (docs.google.com/spreadsheets/d/<ID>/edit).");
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error("Reviews sheet not found.");
  }

  const existingHeaders = sheet
    .getRange(1, 1, 1, 5)
    .getDisplayValues()[0];

  if (
    HEADERS.some((header, index) =>
      existingHeaders[index] !== header
    )
  ) {
    throw new Error("Google Sheet headings do not match.");
  }

  return sheet;
}

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";

  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function safeSheetText(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function displaySheetText(value) {
  const text = String(value == null ? "" : value);
  return text.replace(/^'([=+\-@])/, "$1");
}

function jsonOutput(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------- Manual checks: run these from the Apps Script editor (Run button) ---------- */

/* Read-only: confirms the spreadsheet ID, the "Reviews" tab and the headings. Writes nothing. */
function checkSetup() {
  const sheet = getReviewsSheet();
  console.log("OK. Sheet found: " + sheet.getParent().getName() + " / " + sheet.getName() +
    " — rows: " + sheet.getLastRow());
}

/* Appends ONE clearly labelled Pending test row through the real doPost code path. */
function testSubmitReview() {
  const result = doPost({
    parameter: {
      action: "submit",
      name: "TEST - please delete",
      rating: "5",
      review: "Test review from the Apps Script editor.",
      submissionId: "editor-test-" + Date.now()
    }
  });
  console.log(result.getContent());
}