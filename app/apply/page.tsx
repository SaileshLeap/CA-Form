"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, ArrowRight, ArrowLeft, FileText, Upload, X, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Replace this with your Google Apps Script Web App URL
const API_ROUTE = "/api/apply"

// Mobile-first animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
}

const slideIn = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: {
      duration: 0.3,
    },
  },
}

// Mobile-optimized floating animation
const float = {
  y: [-5, 5, -5],
  transition: {
    duration: 4,
    repeat: Number.POSITIVE_INFINITY,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  },
}

const floatReverse = {
  y: [5, -5, 5],
  transition: {
    duration: 5,
    repeat: Number.POSITIVE_INFINITY,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  },
}

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [submitError, setSubmitError] = useState<string>("")

  const totalSteps = 3

  const [formData, setFormData] = useState({
    // Section 1: Basic Details
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",

    // Section 2: Academic Details
    currentCourse: "",
    currentYear: "",

    // Section 3: Study Abroad Journey
    studyAbroadPlans: "",

    // Section 4: Motivation & Execution
    excitement: "",
    personalQualities: "",
    collegeActivities: "",
    expectedGains: "",
    promotionStrategy: "",

    // Section 5: Availability & Commitment
    availability: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
    if (submitError) {
      setSubmitError("")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        alert("Please select a PDF file only.")
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.")
        return
      }

      setResumeFile(file)
    }
  }

  const removeFile = () => {
    setResumeFile(null)
    // Reset the file input
    const fileInput = document.getElementById("resumeFile") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Convert file to base64 for Google Apps Script
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1]
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const validateStep = (step: number): string[] => {
    const errors: string[] = []

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) errors.push("Full Name is required")
        if (!formData.email.trim()) errors.push("Email Address is required")
        if (!formData.phone.trim()) errors.push("Phone Number is required")
        if (!formData.currentCourse.trim()) errors.push("Current Course & Branch is required")
        if (!formData.currentYear.trim()) errors.push("Current Year of Study is required")

        // Email validation
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.push("Please enter a valid email address")
        }

        // Phone validation (basic)
        if (formData.phone.trim() && !/^[+]?[0-9\s\-()]{10,}$/.test(formData.phone)) {
          errors.push("Please enter a valid phone number")
        }
        break

      case 2:
        if (!formData.studyAbroadPlans.trim()) errors.push("Study abroad plans selection is required")
        if (!formData.excitement.trim()) errors.push("Excitement and motivation response is required")
        if (!formData.personalQualities.trim()) errors.push("Personal qualities response is required")
        if (!formData.collegeActivities.trim()) errors.push("College activities response is required")
        if (!formData.expectedGains.trim()) errors.push("Expected gains response is required")
        if (!formData.promotionStrategy.trim()) errors.push("Promotion strategy response is required")
        break

      case 3:
        if (!formData.availability.trim()) errors.push("Availability commitment is required")
        break
    }

    return errors
  }

  const nextStep = () => {
    const errors = validateStep(currentStep)

    if (errors.length > 0) {
      setValidationErrors(errors)
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (currentStep < totalSteps) {
      setValidationErrors([])
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setValidationErrors([])
      setSubmitError("")
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Final validation
    const errors = validateStep(currentStep)
    if (errors.length > 0) {
      setValidationErrors(errors)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const submitData: any = { ...formData }

      // Handle file upload if present
      if (resumeFile) {
        try {
          const base64File = await fileToBase64(resumeFile)
          submitData.resumeFile = base64File
          submitData.resumeFileName = resumeFile.name
        } catch (fileError) {
          console.error("Error processing file:", fileError)
          setSubmitError("Error processing resume file. Please try again.")
          setIsSubmitting(false)
          return
        }
      }

      console.log("Submitting data to:", API_ROUTE)

      const response = await fetch(API_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit application.")
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError("Failed to submit application. Please check your internet connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderValidationErrors = () => {
    if (validationErrors.length === 0 && !submitError) return null

    const errorsToShow = submitError ? [submitError] : validationErrors

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8 p-4 sm:p-6 bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl"
      >
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">
              {submitError ? "Submission Error" : "Please fix the following errors:"}
            </h3>
            <ul className="space-y-1">
              {errorsToShow.map((error, index) => (
                <li key={index} className="text-sm sm:text-base text-red-700">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    )
  }

  const renderStepContent = () => {
    const stepContent = {
      1: {
        title: "Basic & Academic Details",
        subtitle: "Let's start with your basic information and current studies",
        fields: (
          <div className="space-y-6 sm:space-y-8">
            <div className="mb-8 sm:mb-12">
              <div className="space-y-4 sm:space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Label
                    htmlFor="fullName"
                    className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className={`h-12 sm:h-14 text-base sm:text-lg border-2 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-lg sm:rounded-xl ${
                      validationErrors.some((error) => error.includes("Full Name"))
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Label
                    htmlFor="email"
                    className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className={`h-12 sm:h-14 text-base sm:text-lg border-2 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-lg sm:rounded-xl ${
                      validationErrors.some((error) => error.includes("Email") || error.includes("email"))
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Label
                    htmlFor="phone"
                    className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 9876543210"
                    className={`h-12 sm:h-14 text-base sm:text-lg border-2 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-lg sm:rounded-xl ${
                      validationErrors.some((error) => error.includes("Phone") || error.includes("phone"))
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Label
                    htmlFor="linkedin"
                    className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                  >
                    LinkedIn Profile (if any)
                  </Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="h-12 sm:h-14 text-base sm:text-lg border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-lg sm:rounded-xl"
                  />
                </motion.div>
              </div>
            </div>

            <div>
              <div className="space-y-4 sm:space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Label
                    htmlFor="currentCourse"
                    className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                  >
                    Current Course & Branch <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="currentCourse"
                    value={formData.currentCourse}
                    onChange={(e) => handleInputChange("currentCourse", e.target.value)}
                    placeholder="e.g., B.Tech Computer Science Engineering"
                    className={`h-12 sm:h-14 text-base sm:text-lg border-2 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-lg sm:rounded-xl ${
                      validationErrors.some((error) => error.includes("Current Course"))
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Label
                    htmlFor="currentYear"
                    className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                  >
                    Current Year of Study <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("currentYear", value)} required>
                    <SelectTrigger
                      className={`h-12 sm:h-14 text-base sm:text-lg border-2 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-lg sm:rounded-xl ${
                        validationErrors.some((error) => error.includes("Current Year"))
                          ? "border-red-300 focus:border-red-500"
                          : "border-slate-200 focus:border-indigo-500"
                      }`}
                    >
                      <SelectValue placeholder="Select your current year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-final">Pre-Final Year</SelectItem>
                      <SelectItem value="final">Final Year</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </div>
          </div>
        ),
      },
      2: {
        title: "Study Abroad & Motivation",
        subtitle: "Tell us about your aspirations and what drives you",
        fields: (
          <div className="space-y-6 sm:space-y-8">
            <div className="mb-8 sm:mb-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Label
                  htmlFor="studyAbroadPlans"
                  className="text-base sm:text-lg font-semibold text-slate-700 mb-3 sm:mb-4 block"
                >
                  Are you planning to study abroad? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.studyAbroadPlans}
                  onValueChange={(value) => handleInputChange("studyAbroadPlans", value)}
                  className="space-y-3 sm:space-y-4"
                  required
                >
                  {[
                    { value: "yes-masters", label: "Yes – for Master's" },
                    { value: "maybe-not-sure", label: "Maybe / Not sure yet" },
                    { value: "no", label: "No" },
                  ].map((option, index) => (
                    <motion.div
                      key={option.value}
                      className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 ${
                        validationErrors.some((error) => error.includes("Study abroad"))
                          ? "border-red-200 bg-red-50/30"
                          : "border-slate-200"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="w-4 h-4 sm:w-5 sm:h-5" />
                      <Label htmlFor={option.value} className="text-base sm:text-lg cursor-pointer flex-1">
                        {option.label}
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </motion.div>
            </div>

            <div>
              <div className="space-y-6 sm:space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Label
                    htmlFor="excitement"
                    className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                  >
                    On a scale of 1–10, how excited are you about becoming a Campus Ambassador — and why do you want
                    this role? <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="excitement"
                    value={formData.excitement}
                    onChange={(e) => handleInputChange("excitement", e.target.value)}
                    placeholder="Rate your excitement (1-10) and explain why you want to be a Campus Ambassador..."
                    rows={4}
                    className={`text-base sm:text-lg border-2 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-lg sm:rounded-xl resize-none ${
                      validationErrors.some((error) => error.includes("Excitement"))
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Minimum 50 characters recommended</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Label
                    htmlFor="personalQualities"
                    className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                  >
                    What personal qualities would help you take initiative or lead something — and what might hold you
                    back? <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="personalQualities"
                    value={formData.personalQualities}
                    onChange={(e) => handleInputChange("personalQualities", e.target.value)}
                    placeholder="Describe your leadership qualities and potential challenges..."
                    rows={4}
                    className={`text-base sm:text-lg border-2 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-lg sm:rounded-xl resize-none ${
                      validationErrors.some((error) => error.includes("Personal qualities"))
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Minimum 50 characters recommended</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Label
                    htmlFor="collegeActivities"
                    className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                  >
                    Have you taken initiative or been actively involved in any activities during college — whether as an
                    individual, part of a club, or with a team? If yes, tell us what you did and what your role was.{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="collegeActivities"
                    value={formData.collegeActivities}
                    onChange={(e) => handleInputChange("collegeActivities", e.target.value)}
                    placeholder="Describe your college activities, initiatives, and your specific role..."
                    rows={5}
                    className={`text-base sm:text-lg border-2 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-lg sm:rounded-xl resize-none ${
                      validationErrors.some((error) => error.includes("College activities"))
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Minimum 50 characters recommended</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Label
                    htmlFor="expectedGains"
                    className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                  >
                    What do you hope to gain from this Campus Ambassador experience?{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="expectedGains"
                    value={formData.expectedGains}
                    onChange={(e) => handleInputChange("expectedGains", e.target.value)}
                    placeholder="Share what you hope to achieve and learn from this role..."
                    rows={4}
                    className={`text-base sm:text-lg border-2 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-lg sm:rounded-xl resize-none ${
                      validationErrors.some((error) => error.includes("Expected gains"))
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Minimum 30 characters recommended</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Label
                    htmlFor="promotionStrategy"
                    className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                  >
                    How would you promote Leap Scholar to your peers in a creative or impactful way?{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="promotionStrategy"
                    value={formData.promotionStrategy}
                    onChange={(e) => handleInputChange("promotionStrategy", e.target.value)}
                    placeholder="Describe your creative ideas for promoting Leap Scholar on campus..."
                    rows={4}
                    className={`text-base sm:text-lg border-2 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-lg sm:rounded-xl resize-none ${
                      validationErrors.some((error) => error.includes("Promotion strategy"))
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                    required
                  />
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Minimum 50 characters recommended</p>
                </motion.div>
              </div>
            </div>
          </div>
        ),
      },
      3: {
        title: "Availability & Final Details",
        subtitle: "Complete your application with commitment details",
        fields: (
          <div className="space-y-6 sm:space-y-8">
            <div className="mb-8 sm:mb-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Label
                  htmlFor="availability"
                  className="text-base sm:text-lg font-semibold text-slate-700 mb-3 sm:mb-4 block"
                >
                  Are you available to contribute 5–7 hours per week? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.availability}
                  onValueChange={(value) => handleInputChange("availability", value)}
                  className="space-y-3 sm:space-y-4"
                  required
                >
                  {[
                    { value: "yes", label: "Yes, I can commit 5-7 hours per week" },
                    { value: "no", label: "No, I cannot commit this much time" },
                  ].map((option, index) => (
                    <motion.div
                      key={option.value}
                      className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 ${
                        validationErrors.some((error) => error.includes("Availability"))
                          ? "border-red-200 bg-red-50/30"
                          : "border-slate-200"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`availability-${option.value}`}
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                      <Label
                        htmlFor={`availability-${option.value}`}
                        className="text-base sm:text-lg cursor-pointer flex-1"
                      >
                        {option.label}
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </motion.div>
            </div>

            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Label
                  htmlFor="resumeFile"
                  className="text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 block"
                >
                  Upload your Resume (optional)
                </Label>
                <p className="text-sm sm:text-base text-slate-500 mb-3 sm:mb-4">
                  Please upload your resume as a PDF file (max 5MB). It will be saved to Google Drive.
                </p>

                {!resumeFile ? (
                  <div className="relative">
                    <input
                      id="resumeFile"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-32 sm:h-36 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-lg sm:rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-indigo-50/50 transition-all duration-300 cursor-pointer">
                      <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 mb-2 sm:mb-3" />
                      <p className="text-base sm:text-lg font-medium text-slate-600 mb-1">
                        Click to upload your resume
                      </p>
                      <p className="text-sm text-slate-500">PDF files only, up to 5MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-green-200 bg-green-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-base sm:text-lg font-medium text-slate-800 truncate max-w-48 sm:max-w-64">
                            {resumeFile.name}
                          </p>
                          <p className="text-sm text-slate-500">{formatFileSize(resumeFile.size)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Supported format: PDF only. Maximum file size: 5MB. Files will be automatically saved to Google Drive.
                </p>
              </motion.div>
            </div>
          </div>
        ),
      },
    }

    return stepContent[currentStep as keyof typeof stepContent]
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-50 flex items-center justify-center relative overflow-hidden px-4">
        {/* Background decorations */}
        <motion.div
          animate={float}
          className="absolute top-10 left-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={floatReverse}
          className="absolute bottom-10 right-4 w-40 h-40 sm:w-56 sm:h-56 lg:w-80 lg:h-80 bg-gradient-to-br from-indigo-200/30 to-sky-200/30 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="container mx-auto py-8 sm:py-12 lg:py-16 max-w-2xl text-center relative z-10"
        >
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl"
            animate={{ scale: [1, 1.05, 1], rotate: [0, 360] }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Application Submitted Successfully!
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Thank you for applying to be a Leap Scholar Campus Ambassador. We'll review your application and get back to
            you within 48 hours via email. {resumeFile && "Your resume has been securely saved to our Google Drive."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto inline-block"
          >
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 w-full sm:w-auto"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Mobile-optimized background decorations */}
      <motion.div
        animate={float}
        className="absolute top-10 left-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-gradient-to-br from-indigo-200/20 to-sky-200/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={floatReverse}
        className="absolute bottom-10 right-4 w-40 h-40 sm:w-56 sm:h-56 lg:w-96 lg:h-96 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-3xl"
      />

      {/* Mobile-first Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 shadow-lg backdrop-blur-xl border-b border-slate-200/50"
      >
        <div className="w-full max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leap-scholar-logo-5gztfsARKyifHBCntcv3zEYtsVinVB.png"
              alt="Leap Scholar Logo"
              width={140}
              height={40}
              className="h-6 sm:h-8 lg:h-10 w-auto"
              priority
            />
          </Link>
          <div className="text-xs sm:text-sm text-slate-600">Campus Ambassador Application</div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-20 sm:py-24 lg:py-32 max-w-4xl relative z-10">
        {/* Mobile-optimized progress indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8">
            {[...Array(totalSteps)].map((_, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    index + 1 <= currentStep ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-200 text-slate-500"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    scale: index + 1 === currentStep ? [1, 1.05, 1] : 1,
                    boxShadow: index + 1 === currentStep ? "0 0 15px rgba(99, 102, 241, 0.4)" : "none",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm sm:text-base">{index + 1}</span>
                </motion.div>
                {index < totalSteps - 1 && (
                  <motion.div
                    className={`w-8 sm:w-12 lg:w-16 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded transition-all duration-300 ${
                      index + 1 < currentStep ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: index + 1 < currentStep ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-slate-600 text-base sm:text-lg">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </motion.div>

        <motion.div
          key={currentStep}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideIn}
          className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 border border-slate-200/50"
        >
          <motion.div variants={fadeIn} className="mb-6 sm:mb-8 lg:mb-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
              {renderStepContent().title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">{renderStepContent().subtitle}</p>
          </motion.div>

          {renderValidationErrors()}

          <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
            <motion.div variants={fadeIn}>{renderStepContent().fields}</motion.div>

            {/* Mobile-optimized navigation buttons */}
            <motion.div
              className="flex flex-col sm:flex-row justify-between items-center mt-8 sm:mt-12 gap-4"
              variants={fadeIn}
            >
              <div className="flex space-x-3 sm:space-x-4 order-2 sm:order-1">
                {currentStep > 1 && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl border-2 border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 bg-transparent"
                    >
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Previous
                    </Button>
                  </motion.div>
                )}
              </div>

              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="order-1 sm:order-2 w-full sm:w-auto"
              >
                {currentStep === totalSteps ? (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 sm:px-12 sm:py-4 text-base sm:text-lg font-bold rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70 w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full mr-2 sm:mr-3"
                      />
                    ) : (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 sm:px-12 sm:py-4 text-base sm:text-lg font-bold rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 w-full sm:w-auto"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </form>
        </motion.div>

        {/* Mobile-optimized help text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 sm:mt-8"
        >
          <p className="text-slate-500 text-sm sm:text-base">
            Having trouble? Email us at{" "}
            <a href="mailto:campus@leapscholar.com" className="text-indigo-600 hover:underline">
              campus@leapscholar.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
