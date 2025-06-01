import { prisma } from './prisma'
import type { Food, FoodLog, DailyGoal } from '../generated/prisma'

export interface CreateFoodData {
  name: string
  brand?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
}

export interface CreateFoodLogData {
  userId: number
  foodId: number
  quantity: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

export interface CreateDailyGoalData {
  userId: number
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
}

// Food CRUD operations
export async function createFood(data: CreateFoodData): Promise<Food> {
  const food = await prisma.food.create({
    data,
  })
  return food
}

export async function getFoodById(id: number): Promise<Food | null> {
  return await prisma.food.findUnique({
    where: { id },
  })
}

export async function searchFoods(query: string): Promise<Food[]> {
  return await prisma.food.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 20, // Limit results
    orderBy: { name: 'asc' },
  })
}

export async function getAllFoods(): Promise<Food[]> {
  return await prisma.food.findMany({
    orderBy: { name: 'asc' },
  })
}

// Food Log operations
export async function createFoodLog(data: CreateFoodLogData): Promise<FoodLog> {
  const foodLog = await prisma.foodLog.create({
    data,
    include: {
      food: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  })
  return foodLog
}

export async function getUserFoodLogs(userId: number, date?: Date): Promise<FoodLog[]> {
  const startOfDay = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : new Date()
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(endOfDay.getDate() + 1)

  return await prisma.foodLog.findMany({
    where: {
      userId,
      loggedAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    include: {
      food: true,
    },
    orderBy: { loggedAt: 'desc' },
  })
}

export async function deleteFoodLog(id: number, userId: number): Promise<void> {
  await prisma.foodLog.delete({
    where: {
      id,
      userId, // Ensure user can only delete their own logs
    },
  })
}

// Daily Goal operations
export async function setDailyGoal(data: CreateDailyGoalData): Promise<DailyGoal> {
  const dailyGoal = await prisma.dailyGoal.upsert({
    where: { userId: data.userId },
    update: {
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      fiber: data.fiber,
    },
    create: data,
  })
  return dailyGoal
}

export async function getUserDailyGoal(userId: number): Promise<DailyGoal | null> {
  return await prisma.dailyGoal.findUnique({
    where: { userId },
  })
}

// Analytics functions
export async function getUserDailyTotals(userId: number, date?: Date) {
  const startOfDay = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : new Date()
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(endOfDay.getDate() + 1)

  const foodLogs = await prisma.foodLog.findMany({
    where: {
      userId,
      loggedAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    include: {
      food: true,
    },
  })

  const totals = foodLogs.reduce(
    (acc, log) => {
      const multiplier = log.quantity / 100 // Assuming quantity is in grams and nutrition is per 100g
      acc.calories += log.food.calories * multiplier
      acc.protein += log.food.protein * multiplier
      acc.carbs += log.food.carbs * multiplier
      acc.fat += log.food.fat * multiplier
      acc.fiber += (log.food.fiber || 0) * multiplier
      acc.sugar += (log.food.sugar || 0) * multiplier
      acc.sodium += (log.food.sodium || 0) * multiplier
      return acc
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    }
  )

  return {
    totals,
    foodLogs,
    date: startOfDay,
  }
} 