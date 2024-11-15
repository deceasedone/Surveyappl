import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

export default function DisplaySurvey() {
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

  const handleChange = (questionId, value, isMultiple = false) => {
    if (!survey) return
    setSurvey(prevSurvey => ({
      ...prevSurvey,
      questions: prevSurvey.questions.map((q) => {
        if (q._id === questionId) {
          if (isMultiple) {
            const currentResponses = Array.isArray(q.response) ? q.response : []
            const updatedResponses = currentResponses.includes(value)
              ? currentResponses.filter(item => item !== value)
              : [...currentResponses, value]
            return { ...q, response: updatedResponses }
          } else {
            return { ...q, response: value }
          }
        }
        return q
      }),
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!survey) return
    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/surveys/submit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          responses: survey.questions.map(q => ({
            questionId: q._id,
            answer: q.response
          })),
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit survey')
      }
      toast({
        title: "Survey Submitted",
        description: "Your responses have been successfully submitted.",
      })
      navigate(`/submit-survey/${id}`)
    } catch (err) {
      console.error('Survey submission error:', err)
      toast({
        title: "Error",
        description: err.message || "Failed to submit survey. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )

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
          <CardTitle className="text-2xl font-bold">{survey.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-600">{survey.description}</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {survey.questions && survey.questions.map((question, index) => (
              <div key={question._id} className="space-y-2">
                <Label htmlFor={question._id} className="text-lg font-semibold">
                  {question.text}
                </Label>
                {question.type === 'checkbox' && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${question._id}-${optionIndex}`}
                          checked={(question.response || []).includes(option)}
                          onCheckedChange={(checked) => handleChange(question._id, option, true)}
                        />
                        <Label htmlFor={`${question._id}-${optionIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                )}
                {question.type === 'radio' && (
                  <RadioGroup
                    onValueChange={(value) => handleChange(question._id, value)}
                    value={question.response || ''}
                    className="flex flex-col space-y-2"
                  >
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question._id}-${optionIndex}`} />
                        <Label htmlFor={`${question._id}-${optionIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {question.type === 'text' && (
                  <Input
                    id={question._id}
                    value={question.response || ''}
                    onChange={(e) => handleChange(question._id, e.target.value)}
                    className="w-full"
                  />
                )}
                {question.type === 'number' && (
                  <Input
                    id={question._id}
                    type="number"
                    value={question.response || ''}
                    onChange={(e) => handleChange(question._id, e.target.value)}
                    className="w-full"
                  />
                )}
                {question.type === 'boolean' && (
                  <RadioGroup
                    onValueChange={(value) => handleChange(question._id, value)}
                    value={question.response || ''}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id={`${question._id}-true`} />
                      <Label htmlFor={`${question._id}-true`}>True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id={`${question._id}-false`} />
                      <Label htmlFor={`${question._id}-false`}>False</Label>
                    </div>
                  </RadioGroup>
                )}
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Survey'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}