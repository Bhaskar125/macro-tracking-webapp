import { FoodLogger } from "@/components/ui/food-logger"
import { UserNav } from "@/components/ui/user-nav"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with User Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">MacroTrack Dashboard</h1>
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <FoodLogger />
    </div>
  )
}
