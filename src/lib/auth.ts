import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyUserCredentials } from "./user-service"

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

        try {
          const user = await verifyUserCredentials(
            credentials.email as string,
            credentials.password as string
          )

          if (user) {
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
            }
          }
        } catch (error) {
          console.error("Auth error:", error)
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