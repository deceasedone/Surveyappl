'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { user, dispatch } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
  };

  const menuVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            <span className="relative">
              Survey
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400 transform skew-x-12"></span>
            </span>
            <span className="text-yellow-400">App</span>
          </Link>
          <div className="hidden md:flex space-x-4 items-center">
            {user ? (
              <>
                <Button asChild variant="ghost" className="text-white hover:text-yellow-400">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild variant="ghost" className="text-white hover:text-yellow-400">
                  <Link to="/create-survey">Create Survey</Link>
                </Button>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="text-purple-600 bg-white hover:bg-purple-600 hover:text-white transition-colors"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-white hover:text-yellow-400">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" className="text-purple-600 bg-white border-white hover:bg-purple-600 hover:text-white transition-colors">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 space-y-2"
            >
              {user ? (
                <>
                  <Button asChild variant="ghost" className="w-full text-left text-white hover:text-yellow-400">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full text-left text-white hover:text-yellow-400">
                    <Link to="/create-survey" onClick={() => setIsOpen(false)}>Create Survey</Link>
                  </Button>
                  <Button onClick={() => { handleLogout(); setIsOpen(false); }} variant="outline" className="w-full text-white border-white hover:bg-white hover:text-purple-600">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="w-full text-left text-white hover:text-yellow-400">
                    <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full text-purple-600 bg-white border-white hover:bg-purple-600 hover:text-white transition-colors">
                    <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
