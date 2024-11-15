'use client'

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Send } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function SurveySubmit() {
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [showConfetti])

  const handleSubmitAnother = () => {
    navigate('/dashboard')  
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold text-purple-600 dark:text-purple-400"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Thank you for your response!
            </motion.h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p 
            className="text-center text-gray-600 dark:text-gray-300 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your feedback is valuable to us. We appreciate your time and effort in completing the survey.
          </motion.p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={handleSubmitAnother}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
            >
              <Send className="mr-2 h-4 w-4" /> Submit Another Response
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  )
}