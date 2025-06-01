import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

// In-memory user storage (replace with database in production)
const users: Array<{
  id: string
  email: string
  password: string
  name: string
}> = []

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = users.find(
          user => user.email === credentials.email && user.password === credentials.password
        )

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})

// Helper function to register new users
export function registerUser(email: string, password: string, name: string) {
  // Check if user already exists
  const existingUser = users.find(user => user.email === email)
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email,
    password, // In production, hash the password
    name,
  }

  users.push(newUser)
  return { id: newUser.id, email: newUser.email, name: newUser.name }
}

// Helper function to get all users (for debugging)
export function getUsers() {
  return users.map(user => ({ id: user.id, email: user.email, name: user.name }))
} 