import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function Welcome() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Welcome, {user.name}!</CardTitle>
            <CardDescription>You've successfully logged in.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center">What would you like to do today?</p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
            <Button onClick={() => navigate('/create-survey')} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              Create New Survey
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}