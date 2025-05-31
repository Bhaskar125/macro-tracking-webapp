"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Trash2, Edit, Target, Calendar, Apple } from "lucide-react"
import { MacroGoals } from "@/components/ui/macro-goals"

// Mock data types
interface Food {
  id: string
  name: string
  brand?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  servingSize: string
  servingUnit: string
}

interface LoggedFood extends Food {
  logId: string
  quantity: number
  meal: "breakfast" | "lunch" | "dinner" | "snacks"
  timestamp: Date
}

interface MacroGoalsType {
  calories: number
  protein: number
  carbs: number
  fat: number
}

// Mock data
const mockFoods: Food[] = [
  {
    id: "1",
    name: "Chicken Breast",
    brand: "Generic",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    servingSize: "100",
    servingUnit: "g",
  },
  {
    id: "2",
    name: "Brown Rice",
    brand: "Uncle Ben's",
    calories: 112,
    protein: 2.6,
    carbs: 22,
    fat: 0.9,
    fiber: 1.8,
    servingSize: "100",
    servingUnit: "g",
  },
  {
    id: "3",
    name: "Greek Yogurt",
    brand: "Fage",
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    servingSize: "100",
    servingUnit: "g",
  },
  {
    id: "4",
    name: "Banana",
    brand: "Fresh",
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    servingSize: "1",
    servingUnit: "medium",
  },
  {
    id: "5",
    name: "Almonds",
    brand: "Raw",
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    fiber: 12,
    servingSize: "100",
    servingUnit: "g",
  },
]

export function FoodLogger() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [quantity, setQuantity] = useState("1")
  const [selectedMeal, setSelectedMeal] = useState<"breakfast" | "lunch" | "dinner" | "snacks">("breakfast")
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([
    {
      ...mockFoods[0],
      logId: "log1",
      quantity: 150,
      meal: "lunch",
      timestamp: new Date(),
    },
    {
      ...mockFoods[1],
      logId: "log2",
      quantity: 80,
      meal: "lunch",
      timestamp: new Date(),
    },
    {
      ...mockFoods[3],
      logId: "log3",
      quantity: 1,
      meal: "breakfast",
      timestamp: new Date(),
    },
  ])
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false)
  const [macroGoals, setMacroGoals] = useState<MacroGoalsType>({
    calories: 2200,
    protein: 165,
    carbs: 220,
    fat: 73,
  })

  const filteredFoods = mockFoods.filter(
    (food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const calculateTotals = () => {
    return loggedFoods.reduce(
      (totals, food) => {
        const multiplier = food.quantity / Number.parseFloat(food.servingSize)
        return {
          calories: totals.calories + food.calories * multiplier,
          protein: totals.protein + food.protein * multiplier,
          carbs: totals.carbs + food.carbs * multiplier,
          fat: totals.fat + food.fat * multiplier,
        }
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }

  const getMealFoods = (meal: string) => {
    return loggedFoods.filter((food) => food.meal === meal)
  }

  const addFood = () => {
    if (!selectedFood) return

    const newLoggedFood: LoggedFood = {
      ...selectedFood,
      logId: `log${Date.now()}`,
      quantity: Number.parseFloat(quantity),
      meal: selectedMeal,
      timestamp: new Date(),
    }

    setLoggedFoods([...loggedFoods, newLoggedFood])
    setIsAddFoodOpen(false)
    setSelectedFood(null)
    setQuantity("1")
  }

  const removeFood = (logId: string) => {
    setLoggedFoods(loggedFoods.filter((food) => food.logId !== logId))
  }

  const totals = calculateTotals()

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Food Logger</h1>
          <p className="text-muted-foreground">Track your daily nutrition and reach your macro goals</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Today
          </Button>
          <Dialog open={isAddFoodOpen} onOpenChange={setIsAddFoodOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Food to Log</DialogTitle>
                <DialogDescription>Search for a food item and add it to your daily log</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Food Results */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredFoods.map((food) => (
                    <Card
                      key={food.id}
                      className={`cursor-pointer transition-colors ${
                        selectedFood?.id === food.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{food.name}</h4>
                            {food.brand && <p className="text-sm text-muted-foreground">{food.brand}</p>}
                            <p className="text-sm text-muted-foreground">
                              {food.servingSize} {food.servingUnit}
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-medium">{food.calories} cal</div>
                            <div className="text-muted-foreground">
                              P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add Food Form */}
                {selectedFood && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          step="0.1"
                          min="0.1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="meal">Meal</Label>
                        <Select value={selectedMeal} onValueChange={(value: "breakfast" | "lunch" | "dinner" | "snacks") => setSelectedMeal(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                            <SelectItem value="snacks">Snacks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddFoodOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addFood}>Add to Log</Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Goals and Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Macro Goals */}
          <MacroGoals goals={macroGoals} onGoalsChange={setMacroGoals} />

          {/* Daily Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Calories */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(totals.calories)} / {macroGoals.calories}
                  </span>
                </div>
                <Progress value={(totals.calories / macroGoals.calories) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {macroGoals.calories - Math.round(totals.calories)} remaining
                </div>
              </div>

              {/* Protein */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(totals.protein)}g / {macroGoals.protein}g
                  </span>
                </div>
                <Progress value={(totals.protein / macroGoals.protein) * 100} className="h-2" />
              </div>

              {/* Carbs */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Carbohydrates</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(totals.carbs)}g / {macroGoals.carbs}g
                  </span>
                </div>
                <Progress value={(totals.carbs / macroGoals.carbs) * 100} className="h-2" />
              </div>

              {/* Fat */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Fat</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(totals.fat)}g / {macroGoals.fat}g
                  </span>
                </div>
                <Progress value={(totals.fat / macroGoals.fat) * 100} className="h-2" />
              </div>

              {/* Macro Breakdown */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Macro Breakdown</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round(((totals.protein * 4) / totals.calories) * 100) || 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(((totals.carbs * 4) / totals.calories) * 100) || 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">
                      {Math.round(((totals.fat * 9) / totals.calories) * 100) || 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Food Log */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5" />
                Food Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="breakfast" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                  <TabsTrigger value="lunch">Lunch</TabsTrigger>
                  <TabsTrigger value="dinner">Dinner</TabsTrigger>
                  <TabsTrigger value="snacks">Snacks</TabsTrigger>
                </TabsList>

                {["breakfast", "lunch", "dinner", "snacks"].map((meal) => (
                  <TabsContent key={meal} value={meal} className="space-y-4">
                    <div className="space-y-2">
                      {getMealFoods(meal).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Apple className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No foods logged for {meal}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setSelectedMeal(meal as "breakfast" | "lunch" | "dinner" | "snacks")
                              setIsAddFoodOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Food
                          </Button>
                        </div>
                      ) : (
                        getMealFoods(meal).map((food) => {
                          const multiplier = food.quantity / Number.parseFloat(food.servingSize)
                          return (
                            <Card key={food.logId}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="font-medium">{food.name}</h4>
                                    {food.brand && <p className="text-sm text-muted-foreground">{food.brand}</p>}
                                    <p className="text-sm text-muted-foreground">
                                      {food.quantity} {food.servingUnit}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">{Math.round(food.calories * multiplier)} cal</div>
                                    <div className="text-sm text-muted-foreground">
                                      P: {Math.round(food.protein * multiplier)}g | C:{" "}
                                      {Math.round(food.carbs * multiplier)}g | F: {Math.round(food.fat * multiplier)}g
                                    </div>
                                  </div>
                                  <div className="flex gap-1 ml-4">
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => removeFood(food.logId)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
