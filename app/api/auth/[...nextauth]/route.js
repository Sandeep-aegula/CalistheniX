import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        username: { label: 'Username', type: 'text' }
      },
      async authorize(credentials) {
        try {
          await dbConnect()
          
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required')
          }

          const user = await User.findOne({ email: credentials.email })
          
          if (!user) {
            throw new Error('No user found with this email')
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            image: user.image,
          }
        } catch (error) {
          console.error('Authorize error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google') {
          await dbConnect()
          
          const existingUser = await User.findOne({ email: user.email })
          
          if (!existingUser) {
            // Create new user from Google profile
            const username = user.email.split('@')[0] + Math.random().toString(36).substring(2, 8)
            
            const newUser = new User({
              email: user.email,
              name: user.name,
              username,
              image: user.image,
              // Default gamification values are set in schema
            })
            
            await newUser.save()
          }
        }
        return true
      } catch (error) {
        console.error('SignIn callback error:', error.message)
        // Return true to allow signin even if DB operations fail
        return true
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user?.email) {
          await dbConnect()
          const dbUser = await User.findOne({ email: session.user.email }).select('-password')
          
          if (dbUser) {
            session.user.id = dbUser._id.toString()
            session.user.username = dbUser.username
            session.user.xp = dbUser.xp
            session.user.level = dbUser.level
            session.user.currentStreak = dbUser.currentStreak
          }
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error.message)
        return session
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.username = user.username
        }
        return token
      } catch (error) {
        console.error('JWT callback error:', error.message)
        return token
      }
    }
  },
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
})

export { handler as GET, handler as POST }