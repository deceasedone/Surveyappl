import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316']

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function ShortResponseResult({ question, index }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-700 dark:text-blue-300">Question {index}: {question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-blue-600 dark:text-blue-400">Responses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {question.responses.map((response, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-gray-700 dark:text-gray-300">{i + 1}. {response.response}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function TrueOrFalseResult({ question, index }) {
  const trueCount = question.responses.filter(r => r.response === 'True').length
  const falseCount = question.responses.length - trueCount

  const data = [
    { name: 'True', value: trueCount },
    { name: 'False', value: falseCount },
  ]

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-700 dark:text-purple-300">Question {index}: {question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function NewSection({ question }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{question.question}</CardTitle>
        </CardHeader>
      </Card>
    </motion.div>
  )
}