'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Trash2 } from 'lucide-react'

const questionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'radio', label: 'Single Choice' },
  { value: 'checkbox', label: 'Multiple Choice' },
  { value: 'boolean', label: 'True/False' }
]

export default function EditSurvey() {
  const { id } = useParams()
  const [survey, setSurvey] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      fetchSurvey()
    }
  }, [id])

  const fetchSurvey = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/surveys/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Survey not found')
        }
        throw new Error('Failed to fetch survey')
      }
      const data = await response.json()
      setSurvey(data)
    } catch (err) {
      setError(err.message || 'Failed to load survey. Please try again.')
      toast({
        title: "Error",
        description: err.message || "Failed to load survey. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e, questionIndex = null) => {
    if (questionIndex !== null) {
      const updatedQuestions = [...survey.questions]
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [e.target.name]: e.target.value
      }
      setSurvey({ ...survey, questions: updatedQuestions })
    } else {
      setSurvey({ ...survey, [e.target.name]: e.target.value })
    }
  }

  const handleQuestionTypeChange = (value, questionIndex) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      type: value,
      options: value === 'boolean' ? ['True', 'False'] : (value === 'radio' || value === 'checkbox' ? [] : undefined)
    }
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const addQuestion = () => {
    setSurvey({
      ...survey,
      questions: [
        ...survey.questions,
        { question: '', type: 'text' }
      ]
    })
  }

  const removeQuestion = (index) => {
    const updatedQuestions = survey.questions.filter((_, i) => i !== index)
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const addOption = (questionIndex) => {
    const updatedQuestions = [...survey.questions]
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = []
    }
    updatedQuestions[questionIndex].options.push('')
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[questionIndex].options.splice(optionIndex, 1)
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...survey.questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setSurvey({ ...survey, questions: updatedQuestions })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/surveys/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(survey),
      })
      if (!response.ok) {
        throw new Error('Failed to update survey')
      }
      toast({
        title: "Success",
        description: "Survey updated successfully.",
      })
      navigate('/dashboard')
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update survey. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!survey) {
    return null
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Survey</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={survey.title}
                onChange={handleChange}
                className="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={survey.description}
                onChange={handleChange}
                className="w-full mt-1"
                rows={3}
              />
            </div>
            {survey.questions.map((question, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-md">
                <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
                <Input
                  id={`question-${index}`}
                  name="question"
                  value={question.question}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full mt-1"
                />
                <Label htmlFor={`type-${index}`}>Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value) => handleQuestionTypeChange(value, index)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(question.type === 'radio' || question.type === 'checkbox') && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {question.options && question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeOption(index, optionIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addOption(index)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                )}
                <Button type="button" variant="destructive" onClick={() => removeQuestion(index)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Remove Question
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addQuestion} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Survey...
                </>
              ) : (
                'Update Survey'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}