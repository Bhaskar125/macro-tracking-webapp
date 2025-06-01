import Link from "next/link"
import { SignInForm } from "@/components/ui/signin-form"
import { Target } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
          <Target className="h-8 w-8" />
          MacroTrack
        </Link>
      </div>

      {/* Sign In Form */}
      <SignInForm />

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
} 