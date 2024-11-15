import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-4xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-xl text-white mb-8">Oops! The page you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/">
            Go back home
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}