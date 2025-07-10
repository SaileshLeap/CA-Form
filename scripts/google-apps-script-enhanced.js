// Enhanced Google Apps Script for Campus Ambassador Applications
// This script handles form submissions, file uploads to Drive, and data storage in Sheets

// Declare global variables
const Utilities = SpreadsheetApp.newDateRange
const Session = SpreadsheetApp.getActiveSpreadsheet
const DriveApp = SpreadsheetApp.newFolder
const SpreadsheetApp = SpreadsheetApp
const MailApp = SpreadsheetApp.newEmail
const ContentService = SpreadsheetApp.newContentService

// Configuration - Update these values
const CONFIG = {
  SPREADSHEET_ID: "", // Your Google Sheets ID (get from URL)
  DRIVE_FOLDER_NAME: "Campus Ambassador Applications",
  NOTIFICATION_EMAIL: "campus@leapscholar.com", // Email for notifications
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ALLOWED_FILE_TYPES: ["application/pdf"],
}

/**
 * Main function to handle POST requests
 */
function doPost(e) {
  try {
    console.log("Received POST request")

    // Parse the incoming data
    const data = parseRequestData(e)
    console.log("Parsed data:", data)

    // Validate the data
    const validation = validateFormData(data)
    if (!validation.isValid) {
      return createErrorResponse(validation.errors)
    }

    // Handle file upload if present
    let fileInfo = null
    if (data.resumeFile) {
      fileInfo = handleFileUpload(data.resumeFile, data.fullName)
      if (fileInfo.error) {
        return createErrorResponse([fileInfo.error])
      }
    }

    // Save to Google Sheets
    const sheetResult = saveToSheet(data, fileInfo)
    if (!sheetResult.success) {
      return createErrorResponse([sheetResult.error])
    }

    // Send notification email
    sendNotificationEmail(data, fileInfo)

    // Return success response
    return createSuccessResponse({
      message: "Application submitted successfully",
      rowNumber: sheetResult.rowNumber,
      fileUrl: fileInfo ? fileInfo.url : null,
    })
  } catch (error) {
    console.error("Error in doPost:", error)
    return createErrorResponse(["Internal server error: " + error.toString()])
  }
}

/**
 * Parse request data from different content types
 */
function parseRequestData(e) {
  let data = {}

  try {
    if (e.postData.type === "application/json") {
      // Handle JSON data
      data = JSON.parse(e.postData.contents)
    } else if (e.postData.type.includes("multipart/form-data")) {
      // Handle form data with files
      data = e.parameter

      // Handle file if present
      if (e.parameters.resumeFile && e.parameters.resumeFile[0]) {
        data.resumeFile = {
          content: e.parameters.resumeFile[0],
          name: e.parameters.resumeFileName ? e.parameters.resumeFileName[0] : "resume.pdf",
        }
      }
    } else {
      // Try to parse as JSON anyway
      data = JSON.parse(e.postData.contents)
    }
  } catch (parseError) {
    console.error("Error parsing request data:", parseError)
    throw new Error("Invalid request format")
  }

  return data
}

/**
 * Validate form data
 */
function validateFormData(data) {
  const errors = []
  const required = [
    "fullName",
    "email",
    "phone",
    "currentCourse",
    "currentYear",
    "studyAbroadPlans",
    "excitement",
    "personalQualities",
    "collegeActivities",
    "expectedGains",
    "promotionStrategy",
    "availability",
  ]

  // Check required fields
  required.forEach((field) => {
    if (!data[field] || data[field].toString().trim() === "") {
      errors.push(`${field} is required`)
    }
  })

  // Validate email format
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Invalid email format")
  }

  // Validate phone format (basic)
  if (data.phone && !/^[+]?[0-9\s\-()]{10,}$/.test(data.phone)) {
    errors.push("Invalid phone number format")
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  }
}

/**
 * Handle file upload to Google Drive
 */
function handleFileUpload(fileData, applicantName) {
  try {
    if (!fileData || !fileData.content) {
      return { error: "No file data provided" }
    }

    // Decode base64 file content
    let fileBlob
    try {
      const binaryData = Utilities.base64Decode(fileData.content)
      fileBlob = Utilities.newBlob(binaryData, "application/pdf", fileData.name)
    } catch (decodeError) {
      console.error("Error decoding file:", decodeError)
      return { error: "Invalid file format" }
    }

    // Validate file size
    if (fileBlob.getBytes().length > CONFIG.MAX_FILE_SIZE) {
      return { error: "File size exceeds 5MB limit" }
    }

    // Get or create main folder
    const mainFolder = getOrCreateFolder(CONFIG.DRIVE_FOLDER_NAME)

    // Create monthly subfolder
    const currentDate = new Date()
    const monthYear = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "MMMM yyyy")
    const monthFolder = getOrCreateFolder(monthYear, mainFolder)

    // Generate unique filename
    const timestamp = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyyMMdd_HHmmss")
    const sanitizedName = applicantName.replace(/[^a-zA-Z0-9]/g, "_")
    const fileName = `${sanitizedName}_Resume_${timestamp}.pdf`

    // Save file to Drive
    const file = monthFolder.createFile(fileBlob.setName(fileName))

    // Set file permissions
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)

    return {
      success: true,
      url: file.getUrl(),
      id: file.getId(),
      name: fileName,
      size: fileBlob.getBytes().length,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { error: "File upload failed: " + error.toString() }
  }
}

/**
 * Get or create a folder in Google Drive
 */
function getOrCreateFolder(folderName, parentFolder = null) {
  let folder

  if (parentFolder) {
    const folders = parentFolder.getFoldersByName(folderName)
    if (folders.hasNext()) {
      folder = folders.next()
    } else {
      folder = parentFolder.createFolder(folderName)
    }
  } else {
    const folders = DriveApp.getFoldersByName(folderName)
    if (folders.hasNext()) {
      folder = folders.next()
    } else {
      folder = DriveApp.createFolder(folderName)
    }
  }

  return folder
}

/**
 * Save data to Google Sheets
 */
function saveToSheet(data, fileInfo) {
  try {
    let sheet

    if (CONFIG.SPREADSHEET_ID) {
      // Use specific spreadsheet
      const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
      sheet = spreadsheet.getActiveSheet()
    } else {
      // Use active spreadsheet
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
    }

    // Check if headers exist, if not create them
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Timestamp",
        "Full Name",
        "Email",
        "Phone",
        "LinkedIn",
        "Current Course",
        "Current Year",
        "Study Abroad Plans",
        "Excitement Level",
        "Personal Qualities",
        "College Activities",
        "Expected Gains",
        "Promotion Strategy",
        "Availability",
        "Resume File Name",
        "Resume Drive URL",
        "Resume File ID",
        "File Size (bytes)",
        "Application Status",
      ]
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])

      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length)
      headerRange.setFontWeight("bold")
      headerRange.setBackground("#4285f4")
      headerRange.setFontColor("white")
      headerRange.setFontSize(11)
    }

    // Prepare row data
    const rowData = [
      new Date(),
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.linkedin || "",
      data.currentCourse || "",
      data.currentYear || "",
      data.studyAbroadPlans || "",
      data.excitement || "",
      data.personalQualities || "",
      data.collegeActivities || "",
      data.expectedGains || "",
      data.promotionStrategy || "",
      data.availability || "",
      fileInfo ? fileInfo.name : "",
      fileInfo ? fileInfo.url : "",
      fileInfo ? fileInfo.id : "",
      fileInfo ? fileInfo.size : "",
      "New",
    ]

    // Append data to sheet
    const newRow = sheet.getLastRow() + 1
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData])

    // Auto-resize columns
    sheet.autoResizeColumns(1, rowData.length)

    return {
      success: true,
      rowNumber: newRow,
    }
  } catch (error) {
    console.error("Error saving to sheet:", error)
    return {
      success: false,
      error: "Failed to save to spreadsheet: " + error.toString(),
    }
  }
}

/**
 * Send notification email
 */
function sendNotificationEmail(data, fileInfo) {
  try {
    if (!CONFIG.NOTIFICATION_EMAIL) {
      console.log("No notification email configured")
      return
    }

    const subject = `New Campus Ambassador Application - ${data.fullName}`

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4285f4;">New Campus Ambassador Application</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Applicant Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td style="padding: 8px 0;">${data.fullName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;">${data.email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="padding: 8px 0;">${data.phone}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">LinkedIn:</td><td style="padding: 8px 0;">${data.linkedin || "Not provided"}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Course:</td><td style="padding: 8px 0;">${data.currentCourse}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Year:</td><td style="padding: 8px 0;">${data.currentYear}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Study Abroad Plans:</td><td style="padding: 8px 0;">${data.studyAbroadPlans}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Availability:</td><td style="padding: 8px 0;">${data.availability}</td></tr>
          </table>
        </div>
        
        <div style="background-color: #e8f0fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Application Responses</h3>
          
          <div style="margin: 15px 0;">
            <strong>Excitement Level & Motivation:</strong>
            <p style="margin: 5px 0; padding: 10px; background-color: white; border-radius: 4px;">${data.excitement}</p>
          </div>
          
          <div style="margin: 15px 0;">
            <strong>Personal Qualities:</strong>
            <p style="margin: 5px 0; padding: 10px; background-color: white; border-radius: 4px;">${data.personalQualities}</p>
          </div>
          
          <div style="margin: 15px 0;">
            <strong>College Activities:</strong>
            <p style="margin: 5px 0; padding: 10px; background-color: white; border-radius: 4px;">${data.collegeActivities}</p>
          </div>
          
          <div style="margin: 15px 0;">
            <strong>Expected Gains:</strong>
            <p style="margin: 5px 0; padding: 10px; background-color: white; border-radius: 4px;">${data.expectedGains}</p>
          </div>
          
          <div style="margin: 15px 0;">
            <strong>Promotion Strategy:</strong>
            <p style="margin: 5px 0; padding: 10px; background-color: white; border-radius: 4px;">${data.promotionStrategy}</p>
          </div>
        </div>
        
        ${
          fileInfo
            ? `
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Resume Information</h3>
          <p><strong>File Name:</strong> ${fileInfo.name}</p>
          <p><strong>File Size:</strong> ${(fileInfo.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Drive URL:</strong> <a href="${fileInfo.url}" target="_blank">View Resume</a></p>
        </div>
        `
            : `
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Note:</strong> No resume was uploaded with this application.</p>
        </div>
        `
        }
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${CONFIG.SPREADSHEET_ID ? `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}` : SpreadsheetApp.getActiveSpreadsheet().getUrl()}" 
             style="background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View All Applications
          </a>
        </div>
        
        <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
          <p>This email was automatically generated by the Campus Ambassador Application System.</p>
        </div>
      </div>
    `

    // Send HTML email
    MailApp.sendEmail({
      to: CONFIG.NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: htmlBody,
    })

    console.log("Notification email sent successfully")
  } catch (error) {
    console.error("Error sending notification email:", error)
  }
}

/**
 * Create success response
 */
function createSuccessResponse(data) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      ...data,
    }),
  )
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    })
}

/**
 * Create error response
 */
function createErrorResponse(errors) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      errors: errors,
    }),
  )
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    })
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    "Campus Ambassador Application API is running. Use POST to submit applications.",
  ).setMimeType(ContentService.MimeType.TEXT)
}

/**
 * Handle OPTIONS requests for CORS
 */
function doOptions(e) {
  return ContentService.createTextOutput("").setHeaders({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
}

/**
 * Test function to verify setup
 */
function testSetup() {
  try {
    console.log("Testing Google Apps Script setup...")

    // Test Drive access
    const testFolder = getOrCreateFolder("Test Folder")
    console.log("✓ Drive access working")

    // Test Sheets access
    let sheet
    if (CONFIG.SPREADSHEET_ID) {
      sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getActiveSheet()
    } else {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
    }
    console.log("✓ Sheets access working")

    // Test email (optional)
    if (CONFIG.NOTIFICATION_EMAIL) {
      MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, "Test Email", "Google Apps Script setup test successful!")
      console.log("✓ Email sending working")
    }

    console.log("✓ All tests passed! Setup is complete.")
    return "Setup test successful!"
  } catch (error) {
    console.error("Setup test failed:", error)
    return "Setup test failed: " + error.toString()
  }
}

/**
 * Initialize the spreadsheet with proper headers and formatting
 */
function initializeSpreadsheet() {
  try {
    let sheet

    if (CONFIG.SPREADSHEET_ID) {
      const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
      sheet = spreadsheet.getActiveSheet()
    } else {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
    }

    // Clear existing content
    sheet.clear()

    // Set up headers
    const headers = [
      "Timestamp",
      "Full Name",
      "Email",
      "Phone",
      "LinkedIn",
      "Current Course",
      "Current Year",
      "Study Abroad Plans",
      "Excitement Level",
      "Personal Qualities",
      "College Activities",
      "Expected Gains",
      "Promotion Strategy",
      "Availability",
      "Resume File Name",
      "Resume Drive URL",
      "Resume File ID",
      "File Size (bytes)",
      "Application Status",
    ]

    // Set headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length)
    headerRange.setFontWeight("bold")
    headerRange.setBackground("#4285f4")
    headerRange.setFontColor("white")
    headerRange.setFontSize(11)

    // Set column widths
    sheet.setColumnWidth(1, 150) // Timestamp
    sheet.setColumnWidth(2, 200) // Full Name
    sheet.setColumnWidth(3, 250) // Email
    sheet.setColumnWidth(4, 150) // Phone
    sheet.setColumnWidth(5, 250) // LinkedIn
    sheet.setColumnWidth(6, 300) // Current Course
    sheet.setColumnWidth(7, 120) // Current Year
    sheet.setColumnWidth(8, 150) // Study Abroad Plans
    sheet.setColumnWidth(9, 400) // Excitement Level
    sheet.setColumnWidth(10, 400) // Personal Qualities
    sheet.setColumnWidth(11, 400) // College Activities
    sheet.setColumnWidth(12, 400) // Expected Gains
    sheet.setColumnWidth(13, 400) // Promotion Strategy
    sheet.setColumnWidth(14, 150) // Availability
    sheet.setColumnWidth(15, 250) // Resume File Name
    sheet.setColumnWidth(16, 300) // Resume Drive URL
    sheet.setColumnWidth(17, 200) // Resume File ID
    sheet.setColumnWidth(18, 120) // File Size
    sheet.setColumnWidth(19, 150) // Application Status

    // Freeze header row
    sheet.setFrozenRows(1)

    console.log("Spreadsheet initialized successfully")
    return "Spreadsheet initialized successfully!"
  } catch (error) {
    console.error("Error initializing spreadsheet:", error)
    return "Error initializing spreadsheet: " + error.toString()
  }
}
