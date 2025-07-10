function doPost(e) {
  try {
    // Get the spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()

    // Handle both JSON data and file uploads
    let data = {}
    let fileUrl = ""

    if (e.postData.type === "multipart/form-data") {
      // Handle multipart form data (with files)
      const blobs = e.parameter

      // Extract form data
      Object.keys(blobs).forEach((key) => {
        if (key !== "resume") {
          data[key] = blobs[key]
        }
      })

      // Handle file upload
      if (e.parameters.resume && e.parameters.resume[0]) {
        const fileBlob = Utilities.newBlob(
          Utilities.base64Decode(e.parameters.resume[0]),
          "application/pdf",
          `${data.fullName || "Unknown"}_Resume.pdf`,
        )

        fileUrl = saveFileToDrive(fileBlob, data.fullName || "Unknown")
      }
    } else {
      // Handle JSON data (no file)
      data = JSON.parse(e.postData.contents)
    }

    // Prepare the row data
    const rowData = [
      new Date(), // Timestamp
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
      fileUrl || "", // Google Drive file URL
    ]

    // Append the data to the sheet
    sheet.appendRow(rowData)

    // Send email notification
    sendEmailNotification(data, fileUrl)

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Application submitted successfully", fileUrl: fileUrl }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    console.error("Error:", error)
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(
      ContentService.MimeType.JSON,
    )
  }
}

function saveFileToDrive(fileBlob, applicantName) {
  try {
    // Create or get the "Campus Ambassador Applications" folder
    const folderName = "Campus Ambassador Applications"
    let folder

    const folders = DriveApp.getFoldersByName(folderName)
    if (folders.hasNext()) {
      folder = folders.next()
    } else {
      folder = DriveApp.createFolder(folderName)
    }

    // Create a subfolder for the current month
    const currentDate = new Date()
    const monthYear = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "MMMM yyyy")
    let monthFolder

    const monthFolders = folder.getFoldersByName(monthYear)
    if (monthFolders.hasNext()) {
      monthFolder = monthFolders.next()
    } else {
      monthFolder = folder.createFolder(monthYear)
    }

    // Generate unique filename
    const timestamp = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyyMMdd_HHmmss")
    const fileName = `${applicantName.replace(/[^a-zA-Z0-9]/g, "_")}_Resume_${timestamp}.pdf`

    // Save file to Drive
    const file = monthFolder.createFile(fileBlob.setName(fileName))

    // Make file accessible (optional - you can set specific permissions)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)

    // Return the file URL
    return file.getUrl()
  } catch (error) {
    console.error("File upload error:", error)
    return "File upload failed: " + error.toString()
  }
}

function sendEmailNotification(data, fileUrl) {
  try {
    const subject = `New Campus Ambassador Application - ${data.fullName}`
    const body = `
New Campus Ambassador Application Received:

Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
LinkedIn: ${data.linkedin}
Course: ${data.currentCourse}
Year: ${data.currentYear}
Study Abroad Plans: ${data.studyAbroadPlans}
Availability: ${data.availability}

Excitement Level: ${data.excitement}

Personal Qualities: ${data.personalQualities}

College Activities: ${data.collegeActivities}

Expected Gains: ${data.expectedGains}

Promotion Strategy: ${data.promotionStrategy}

Resume: ${fileUrl ? `Uploaded - ${fileUrl}` : "Not provided"}

View all applications: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
    `

    // Replace with your actual email address
    const emailAddress = "your-email@example.com"
    MailApp.sendEmail(emailAddress, subject, body)
  } catch (error) {
    console.error("Email error:", error)
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Campus Ambassador Application API is running").setMimeType(
    ContentService.MimeType.TEXT,
  )
}

// Test function to verify permissions
function testDriveAccess() {
  try {
    const folders = DriveApp.getFolders()
    console.log("Drive access successful")
    return "Success"
  } catch (error) {
    console.error("Drive access error:", error)
    return "Error: " + error.toString()
  }
}
