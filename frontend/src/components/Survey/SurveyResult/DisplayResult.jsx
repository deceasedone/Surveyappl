'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuthContext'
import { ShortResponseResult, NewSection, TrueOrFalseResult } from './resultComponents'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useToast } from "@/hooks/use-toast"

export default function DisplayResult() {
  const { id } = useParams()
  const { user } = useAuth()
  const [survey, setSurvey] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!user || !id) return
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surveys/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        })
        if (!response.ok) throw new Error('Failed to fetch survey')
        const data = await response.json()
        setSurvey(data)
      } catch (e) {
        setError('Failed to load survey results. Please try again.')
        toast({
          title: "Error",
          description: "Failed to load survey results. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchSurvey()
  }, [user, id, toast])

  const exportAsXLSX = () => {
    if (!survey) return
    const workbook = XLSX.utils.book_new()
    const sheetName = "Survey Result"

    const data = [survey.questions.map(q => q.question)]
    const maxResponses = Math.max(...survey.questions.map(q => q.responses.length))

    for (let i = 0; i < maxResponses; i++) {
      const row = survey.questions.map(question => question.responses[i]?.response || '')
      data.push(row)
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    const fileBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" })
    const blob = new Blob([fileBuffer], { type: "application/octet-stream" })
    saveAs(blob, `${survey.title}.xlsx`)
    toast({
      title: "Export Successful",
      description: "Survey results have been exported to Excel.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !survey) {
    return <div className="text-center text-red-500">{error || 'Survey not found'}</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl font-bold">{survey.title}</CardTitle>
          <p className="text-lg">Survey Results</p>
          <Button onClick={exportAsXLSX} className="absolute top-4 right-4">
            Export to Excel
          </Button>
        </CardHeader>
      </Card>
      <div className="space-y-8">
        {survey.questions.map((question, index) => {
          switch (question.type) {
            case 'new section':
              return <NewSection key={question._id} question={question} />
            case 'short response':
            case 'paragraph':
              return <ShortResponseResult key={question._id} question={question} index={index + 1} />
            case 'true/false':
              return <TrueOrFalseResult key={question._id} question={question} index={index + 1} />
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}