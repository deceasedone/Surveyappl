'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function ConditionalQuestion({ question, index, onChange, responseId }) {
  const [selectedOption, setSelectedOption] = useState("")
  const [inputValue, setInputValue] = useState("")

  const handleRadioChange = (value) => {
    setSelectedOption(value)
    onChange({ target: { value } }, responseId)
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    onChange(e, responseId)
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card className="mt-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-green-700 dark:text-green-300">Question {index + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-gray-700 dark:text-gray-300">{question.question}</Label>
          <RadioGroup value={selectedOption} onValueChange={handleRadioChange} className="flex space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`true-${question._id}`} />
              <Label htmlFor={`true-${question._id}`} className="text-gray-600 dark:text-gray-400">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`false-${question._id}`} />
              <Label htmlFor={`false-${question._id}`} className="text-gray-600 dark:text-gray-400">False</Label>
            </div>
          </RadioGroup>
          {selectedOption === "true" && (
            <div className="mt-4">
              <Label htmlFor={`subquestion-${question._id}`} className="text-gray-700 dark:text-gray-300">Additional Information</Label>
              <Input
                id={`subquestion-${question._id}`}
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Your answer"
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function TrueFalse({ question, index, onChange, responseId }) {
  const [selectedValue, setSelectedValue] = useState("")

  const handleChange = (value) => {
    setSelectedValue(value)
    onChange({ target: { value } }, responseId)
  }

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">Question {index + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-gray-700 dark:text-gray-300">{question.question}</Label>
          <RadioGroup value={selectedValue} onValueChange={handleChange} className="flex space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`true-${question._id}`} />
              <Label htmlFor={`true-${question._id}`} className="text-gray-600 dark:text-gray-400">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`false-${question._id}`} />
              <Label htmlFor={`false-${question._id}`} className="text-gray-600 dark:text-gray-400">False</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function NewSection({ question }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardContent className="pt-6">
          <h3 className="text-2xl font-bold text-center">{question.question}</h3>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function SurveyTitle({ survey }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold text-center">{survey.title}</h1>
          <p className="text-center mt-4 text-gray-200">{survey.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}