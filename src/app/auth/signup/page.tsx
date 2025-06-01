import Link from "next/link"
import { RegisterForm } from "@/components/ui/register-form"
import { Target } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
          <Target className="h-8 w-8" />
          MacroTrack
        </Link>
      </div>

      {/* Registration Form */}
      <RegisterForm />

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 