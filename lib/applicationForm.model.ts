import mongoose, { Schema, model, models } from "mongoose"

const ApplicationFormSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    linkedin: { type: String },
    currentCourse: { type: String, required: true },
    currentYear: { type: String, required: true },
    studyAbroadPlans: { type: String, required: true },
    excitement: { type: String, required: true },
    personalQualities: { type: String, required: true },
    collegeActivities: { type: String, required: true },
    expectedGains: { type: String, required: true },
    promotionStrategy: { type: String, required: true },
    availability: { type: String, required: true },
    resumeFile: { type: String }, // base64 string (optional)
    resumeFileName: { type: String }, // original file name (optional)
  },
  { timestamps: true }
)

export const ApplicationForm = models.ApplicationForm || model("ApplicationForm", ApplicationFormSchema) 