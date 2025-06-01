import bcrypt from 'bcrypt'
import { prisma } from './prisma'
import type { User } from '../generated/prisma'

export interface CreateUserData {
  email: string
  password: string
  name: string
}

const SALT_ROUNDS = 12

export async function createUser(userData: CreateUserData): Promise<User> {
  const { email, password, name } = userData

  // Check if user already exists
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new Error('User already exists with this email')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

  // Create user using Prisma
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })

  return user
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  return user
}

export async function verifyUserCredentials(email: string, password: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return null
  }

  // Return user (password is still included, but can be omitted if needed)
  return user
}

export async function getAllUsers(): Promise<Omit<User, 'password'>[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return users
}

export async function getUserById(id: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  return user
}

export async function updateUser(id: number, data: Partial<Pick<User, 'name' | 'email'>>): Promise<User> {
  const user = await prisma.user.update({
    where: { id },
    data,
  })

  return user
}

export async function deleteUser(id: number): Promise<void> {
  await prisma.user.delete({
    where: { id },
  })
} 