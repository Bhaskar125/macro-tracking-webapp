import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/user-service"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // Create the user
    const user = await createUser({ name, email, password })

    return NextResponse.json(
      { 
        message: "User registered successfully", 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        }
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
} 