'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn, getProviders, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  Zap, 
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ChevronRight,
  Shield,
  Dumbbell
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

function SignInContent() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [providers, setProviders] = useState({})
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const error = searchParams.get('error')

  useEffect(() => {
    if (session) {
      router.push(callbackUrl)
    }
  }, [session, router, callbackUrl])

  useEffect(() => {
    getProviders().then(setProviders)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl,
        redirect: false
      })

      if (result?.error) {
        toast.error('authorization failed')
      } else if (result?.ok) {
        router.push(callbackUrl)
      }
    } catch (error) {
      toast.error('system error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true)
    signIn('google', { callbackUrl })
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
          <h1 className="text-white text-2xl sm:text-3xl font-black text-center mb-6 sm:mb-10 tracking-tight leading-tight uppercase">
            Welcome Back<br/>Warrior.
          </h1>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/60 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-[48px] sm:h-[56px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white outline-none focus:border-primary/50 transition-all text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-white/60 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full h-[48px] sm:h-[56px] pl-12 pr-12 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-white outline-none focus:border-primary/50 transition-all text-sm"
                    placeholder="Enter your password"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[54px] sm:h-[56px] bg-gradient-to-r from-[#B8860B] to-[#DAA520] hover:brightness-110 text-black font-black uppercase tracking-widest text-sm rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 mt-2 sm:mt-4 flex items-center justify-center font-bold"
              >
                {isLoading ? 'Processing...' : 'Sign In'}
              </button>
            </form>

            <div className="relative py-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center">
                <span className="bg-[#1A1C1E] px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white h-[56px] rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70 uppercase text-[12px] tracking-wider"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/signup" 
            className="text-[13px] font-bold text-white/40 hover:text-white underline underline-offset-4 decoration-white/10"
          >
            create account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  )
}