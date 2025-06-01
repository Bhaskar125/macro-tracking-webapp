import { NextResponse } from "next/server"
import { getAllUsers } from "@/lib/user-service"

export async function GET() {
  try {
    const users = await getAllUsers()
    return NextResponse.json({
      message: "Current users in the system",
      count: users.length,
      users: users
    })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
} 