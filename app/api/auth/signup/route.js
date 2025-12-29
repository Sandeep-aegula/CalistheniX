import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models'

export async function POST(request) {
  try {
    const { name, username, email, password } = await request.json()

    // Validation
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    })

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'username'
      return NextResponse.json(
        { message: `User with this ${field} already exists` },
        { status: 400 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user with all stats initialized to zero
    const user = await User.create({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      // Gamification stats - all start at zero
      xp: 0,
      level: 0,
      missionLevel: 'beginner',
      totalWorkouts: 0,
      currentStreak: 0,
      longestStreak: 0,
      unlockedSkills: [],
      badges: [],
      skillBadges: [],
      milestones: [],
      bodyWeight: []
    })

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user.toObject()
    
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: userWithoutPassword._id.toString(),
          name: userWithoutPassword.name,
          username: userWithoutPassword.username,
          email: userWithoutPassword.email,
          xp: userWithoutPassword.xp,
          level: userWithoutPassword.level
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    
    if (error.code === 11000) {
      const field = error.keyPattern?.email ? 'email' : 'username'
      return NextResponse.json(
        { message: `User with this ${field} already exists` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}