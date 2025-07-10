import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import { ApplicationForm } from "@/lib/applicationForm.model"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const data = await req.json()
    const application = await ApplicationForm.create(data)
    return NextResponse.json({ success: true, application }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Server error" }, { status: 500 })
  }
} 