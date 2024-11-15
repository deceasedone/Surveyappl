'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2, Download } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import * as XLSX from 'xlsx'
import { useAuth } from '@/hooks/useAuthContext'
import { useToast } from "@/hooks/use-toast"

export default function DataGridComponent() {
  const [surveys, setSurveys] = useState([])
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchAllSurveyData()
  }, [])

  const fetchAllSurveyData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surveys/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch surveys')
      const data = await response.json()
      setSurveys(data)
      if (data.length > 0) setSelectedSurvey(data[0])
    } catch (e) {
      setError('An error occurred while fetching surveys')
      console.error(e)
      toast({
        title: "Error",
        description: "Failed to fetch surveys. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSurveyChange = (surveyId) => {
    const survey = surveys.find(s => s._id === surveyId)
    if (survey) setSelectedSurvey(survey)
  }

  const filteredResponses = selectedSurvey?.questions[0].responses.filter(response => 
    selectedSurvey.questions.some(question => 
      question.responses.find(r => r.time === response.time)?.response.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || []

  const exportToExcel = () => {
    if (!selectedSurvey) return

    const worksheet = XLSX.utils.json_to_sheet(filteredResponses.map(response => {
      const row = { 'Submission Date': new Date(response.time).toLocaleDateString() }
      selectedSurvey.questions.forEach(question => {
        const answer = question.responses.find(r => r.time === response.time)?.response || ''
        row[question.question] = answer
      })
      return row
    }))

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses")
    XLSX.writeFile(workbook, `${selectedSurvey.title}_responses.xlsx`)
    toast({
      title: "Export Successful",
      description: "Survey responses have been exported to Excel.",
    })
  }

  if (!user || user.role !== 'admin') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You are not authorized to view this page. Please log in as an admin.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Survey Data</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0 md:space-x-2">
              <Select onValueChange={handleSurveyChange} className="w-full md:w-[280px]">
                <SelectTrigger>
                  <SelectValue placeholder="Select a survey" />
                </SelectTrigger>
                <SelectContent>
                  {surveys.map((survey) => (
                    <SelectItem key={survey._id} value={survey._id}>{survey.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Search responses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-[280px]"
              />
              <Button onClick={exportToExcel} className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" /> Export to Excel
              </Button>
            </div>
            {selectedSurvey && (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submission Date</TableHead>
                      {selectedSurvey.questions.map((question, index) => (
                        <TableHead key={index} className={question.type === 'new section' ? 'bg-muted' : ''}>
                          {question.question}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResponses.map((response, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell>{new Date(response.time).toLocaleDateString()}</TableCell>
                        {selectedSurvey.questions.map((question, colIndex) => (
                          <TableCell key={colIndex}>
                            {question.responses.find(r => r.time === response.time)?.response || ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}