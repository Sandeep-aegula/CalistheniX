'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  Zap, 
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Fingerprint
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Failed to create account')

      toast.success('Account created!')

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (signInResult?.error) {
        router.push('/signin')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error(error.message || 'Error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E1012] flex flex-col items-center p-4 sm:p-6 font-sans relative overflow-x-hidden pt-12 sm:pt-20 pb-12 sm:pb-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 steel-texture" />

      <motion.div 
        className="w-full max-w-[420px] relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-[#1A1C1E] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 shadow-2xl border border-white/5">
          <h1 className="text-white text-2xl sm:text-3xl font-black text-center mb-6 sm:mb-8 tracking-tight leading-tight uppercase">
            Join The<br/>Gains Game.
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-white/60 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1-2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-[48px] sm:h-[54px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white outline-none focus:border-primary/50 transition-all text-sm"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-white/60 ml-1">Username</label>
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1-2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full h-[48px] sm:h-[54px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white outline-none focus:border-primary/50 transition-all text-sm"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-white/60 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1-2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-[48px] sm:h-[54px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white outline-none focus:border-primary/50 transition-all text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-white/60 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-[48px] sm:h-[54px] pl-12 pr-12 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white outline-none focus:border-primary/50 transition-all text-sm"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-white/60 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full h-[48px] sm:h-[54px] pl-12 pr-12 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white outline-none focus:border-primary/50 transition-all text-sm"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[54px] sm:h-[60px] bg-gradient-to-r from-[#B8860B] to-[#DAA520] hover:brightness-110 text-black font-black uppercase tracking-widest text-[12px] rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 mt-4 sm:mt-6 flex items-center justify-center leading-none px-4 text-center"
            >
              {isLoading ? 'Initializing...' : 'Create Your Warrior Account'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center flex flex-col items-center gap-2 text-[13px] font-bold text-white/40">
          <p>Already have an account?</p>
          <Link 
            href="/signin" 
            className="text-white hover:text-primary underline underline-offset-4 decoration-white/10"
          >
            Sign in here
          </Link>
        </div>
      </motion.div>
    </div>
  )
}