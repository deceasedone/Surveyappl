'use client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuthContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Plus, Trash2 } from 'lucide-react'

const questionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'radio', label: 'Single Choice' },
  { value: 'checkbox', label: 'Multiple Choice' },
  { value: 'boolean', label: 'True/False' }
]

export default function CreateSurvey() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState([{ text: '', type: 'text', options: [] }])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', type: 'text', options: [] }])
  }

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    if (value === 'boolean') {
      newQuestions[index].options = ['True', 'False']
    } else if (value === 'text' || value === 'number') {
      newQuestions[index].options = []
    }
    setQuestions(newQuestions)
  }

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options.push('')
    setQuestions(newQuestions)
  }

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options.splice(optionIndex, 1)
    setQuestions(newQuestions)
  }

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!user) {
        throw new Error('You must be logged in to create a survey')
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/surveys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          title,
          description,
          questions,
          userId: user.id
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create survey')
      }

      const data = await response.json()
      console.log('Survey created:', data)

      toast({
        title: "Success",
        description: "Survey created successfully!",
      })

      navigate('/dashboard')
    } catch (error) {
      console.error('Survey submission error:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl font-bold">Create New Survey</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="edit" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit Survey</TabsTrigger>
                <TabsTrigger value="preview">Preview Survey</TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Survey Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter survey title"
                        required
                        className="bg-white dark:bg-gray-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter survey description"
                        required
                        className="bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label>Questions</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddQuestion}
                        className="bg-purple-100 hover:bg-purple-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </div>

                    {questions.map((question, index) => (
                      <Card key={index} className="p-4 bg-white dark:bg-gray-800 shadow-md">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Question {index + 1}</h3>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => handleRemoveQuestion(index)}
                              disabled={questions.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Question Text</Label>
                              <Input
                                value={question.text}
                                onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                                placeholder="Enter your question"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Question Type</Label>
                              <Select
                                value={question.type}
                                onValueChange={(value) => handleQuestionChange(index, 'type', value)}
                              >
                                <SelectTrigger>
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
                            </div>

                            {(question.type === 'radio' || question.type === 'checkbox') && (
                              <div className="space-y-2">
                                <Label>Options</Label>
                                {question.options.map((option, optionIndex) => (
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
                                      onClick={() => handleRemoveOption(index, optionIndex)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleAddOption(index)}
                                  className="w-full"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Option
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Survey...
                      </>
                    ) : (
                      'Create Survey'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="preview">
                <Card className="p-6 bg-white dark:bg-gray-800">
                  <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">{title || 'Survey Preview'}</h1>
                    {description && <p className="text-gray-600 dark:text-gray-300 mb-8">{description}</p>}
                    
                    <div className="space-y-8">
                      {questions.map((question, index) => (
                        <div key={index} className="space-y-4">
                          <h3 className="font-medium">
                            {index + 1}. {question.text || 'Question text'}
                          </h3>
                          
                          {(question.type === 'text') && (
                            <Input placeholder="Your answer" disabled />
                          )}
                          
                          {question.type === 'number' && (
                            <Input type="number" placeholder="Your answer" disabled />
                          )}
                          
                          {question.type === 'boolean' && (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <input type="radio" id={`q${index}-true`} name={`q${index}`} disabled />
                                <Label htmlFor={`q${index}-true`}>True</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="radio" id={`q${index}-false`} name={`q${index}`} disabled />
                                <Label htmlFor={`q${index}-false`}>False</Label>
                              </div>
                            </div>
                          )}
                          
                          {question.type === 'radio' && (
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <input 
                                    type="radio" 
                                    id={`q${index}-o${optionIndex}`} 
                                    name={`q${index}`} 
                                    disabled 
                                  />
                                  <Label htmlFor={`q${index}-o${optionIndex}`}>
                                    {option || `Option ${optionIndex + 1}`}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {question.type === 'checkbox' && (
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <input 
                                    type="checkbox" 
                                    id={`q${index}-o${optionIndex}`} 
                                    disabled 
                                  />
                                  <Label htmlFor={`q${index}-o${optionIndex}`}>
                                    {option || `Option ${optionIndex + 1}`}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}