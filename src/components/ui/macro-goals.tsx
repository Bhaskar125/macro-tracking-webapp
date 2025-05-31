"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Target, Settings, Calculator, Info, Save, RotateCcw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MacroGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface UserProfile {
  age: number
  gender: "male" | "female"
  weight: number // kg
  height: number // cm
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
  goal: "lose" | "maintain" | "gain"
}

interface MacroGoalsProps {
  goals: MacroGoals
  onGoalsChange: (goals: MacroGoals) => void
}

export function MacroGoals({ goals, onGoalsChange }: MacroGoalsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [tempGoals, setTempGoals] = useState<MacroGoals>(goals)
  const [profile, setProfile] = useState<UserProfile>({
    age: 30,
    gender: "male",
    weight: 75,
    height: 175,
    activityLevel: "moderate",
    goal: "maintain",
  })
  const [calculatedGoals, setCalculatedGoals] = useState<MacroGoals | null>(null)

  // Activity level multipliers for TDEE calculation
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    const { weight, height, age, gender } = profile
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  }

  // Calculate TDEE and macro goals
  const calculateMacros = () => {
    const bmr = calculateBMR()
    const tdee = bmr * activityMultipliers[profile.activityLevel]

    let targetCalories = tdee
    if (profile.goal === "lose") {
      targetCalories = tdee - 500 // 500 calorie deficit for ~1lb/week loss
    } else if (profile.goal === "gain") {
      targetCalories = tdee + 300 // 300 calorie surplus for lean gains
    }

    // Standard macro distribution
    const proteinCalories = targetCalories * 0.25 // 25% protein
    const fatCalories = targetCalories * 0.25 // 25% fat
    const carbCalories = targetCalories * 0.5 // 50% carbs

    const calculated: MacroGoals = {
      calories: Math.round(targetCalories),
      protein: Math.round(proteinCalories / 4), // 4 calories per gram
      carbs: Math.round(carbCalories / 4), // 4 calories per gram
      fat: Math.round(fatCalories / 9), // 9 calories per gram
    }

    setCalculatedGoals(calculated)
  }

  const saveGoals = () => {
    onGoalsChange(tempGoals)
    setIsEditOpen(false)
  }

  const resetToCalculated = () => {
    if (calculatedGoals) {
      setTempGoals(calculatedGoals)
    }
  }

  const useCalculatedGoals = () => {
    if (calculatedGoals) {
      setTempGoals(calculatedGoals)
      onGoalsChange(calculatedGoals)
      setIsCalculatorOpen(false)
    }
  }

  // Calculate macro percentages
  const getPercentages = (macros: MacroGoals) => {
    const totalCalories = macros.calories
    return {
      protein: Math.round(((macros.protein * 4) / totalCalories) * 100),
      carbs: Math.round(((macros.carbs * 4) / totalCalories) * 100),
      fat: Math.round(((macros.fat * 9) / totalCalories) * 100),
    }
  }

  const percentages = getPercentages(goals)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Macro Goals
          </CardTitle>
          <div className="flex gap-2">
            <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={calculateMacros}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Macro Calculator</DialogTitle>
                  <DialogDescription>
                    Calculate your daily macro goals based on your profile and fitness goals
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Profile Input */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={profile.age}
                        onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={profile.gender}
                        onValueChange={(value: "male" | "female") => setProfile({ ...profile, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={profile.weight}
                        onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={profile.height}
                        onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="activity">Activity Level</Label>
                    <Select
                      value={profile.activityLevel}
                      onValueChange={(value: "sedentary" | "light" | "moderate" | "active" | "very_active") => setProfile({ ...profile, activityLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                        <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                        <SelectItem value="very_active">Very Active (very hard exercise, physical job)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="goal">Goal</Label>
                    <Select
                      value={profile.goal}
                      onValueChange={(value: "lose" | "maintain" | "gain") => setProfile({ ...profile, goal: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose">Lose Weight (-500 cal/day)</SelectItem>
                        <SelectItem value="maintain">Maintain Weight</SelectItem>
                        <SelectItem value="gain">Gain Weight (+300 cal/day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={calculateMacros} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate My Macros
                  </Button>

                  {/* Calculated Results */}
                  {calculatedGoals && (
                    <div className="space-y-4 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium">Calculated Goals</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{calculatedGoals.calories}</div>
                          <div className="text-sm text-muted-foreground">Calories</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{calculatedGoals.protein}g</div>
                          <div className="text-sm text-muted-foreground">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{calculatedGoals.carbs}g</div>
                          <div className="text-sm text-muted-foreground">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{calculatedGoals.fat}g</div>
                          <div className="text-sm text-muted-foreground">Fat</div>
                        </div>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          These calculations are estimates based on standard formulas. Adjust based on your progress and
                          individual needs.
                        </AlertDescription>
                      </Alert>

                      <div className="flex gap-2">
                        <Button onClick={useCalculatedGoals} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Use These Goals
                        </Button>
                        <Button variant="outline" onClick={() => setIsCalculatorOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Macro Goals</DialogTitle>
                  <DialogDescription>Set your daily nutrition targets</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="calories">Daily Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={tempGoals.calories}
                      onChange={(e) => setTempGoals({ ...tempGoals, calories: Number(e.target.value) })}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="protein">Protein (g)</Label>
                      <Input
                        id="protein"
                        type="number"
                        value={tempGoals.protein}
                        onChange={(e) => setTempGoals({ ...tempGoals, protein: Number(e.target.value) })}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round(((tempGoals.protein * 4) / tempGoals.calories) * 100)}% of calories
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="carbs">Carbs (g)</Label>
                      <Input
                        id="carbs"
                        type="number"
                        value={tempGoals.carbs}
                        onChange={(e) => setTempGoals({ ...tempGoals, carbs: Number(e.target.value) })}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round(((tempGoals.carbs * 4) / tempGoals.calories) * 100)}% of calories
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="fat">Fat (g)</Label>
                      <Input
                        id="fat"
                        type="number"
                        value={tempGoals.fat}
                        onChange={(e) => setTempGoals({ ...tempGoals, fat: Number(e.target.value) })}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round(((tempGoals.fat * 9) / tempGoals.calories) * 100)}% of calories
                      </div>
                    </div>
                  </div>

                  {calculatedGoals && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={resetToCalculated}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Use Calculated Goals
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={saveGoals}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Goals
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Goals Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{goals.calories}</div>
            <div className="text-sm text-muted-foreground">Calories</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Protein</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{percentages.protein}%</Badge>
                <span className="text-sm font-bold text-blue-600">{goals.protein}g</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Carbs</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{percentages.carbs}%</Badge>
                <span className="text-sm font-bold text-green-600">{goals.carbs}g</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Fat</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{percentages.fat}%</Badge>
                <span className="text-sm font-bold text-orange-600">{goals.fat}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            • Protein: {goals.protein * 4} calories ({percentages.protein}%)
          </div>
          <div>
            • Carbs: {goals.carbs * 4} calories ({percentages.carbs}%)
          </div>
          <div>
            • Fat: {goals.fat * 9} calories ({percentages.fat}%)
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
