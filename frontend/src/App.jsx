import { useState, Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/boilerplate/Header'
import { Toaster } from "./components/ui/toaster"
import { Spinner } from "./components/ui/Spinner"

const CreateSurvey = lazy(() => import('./components/Survey/CreateSurvey/create-survey'))
const DisplaySurvey = lazy(() => import('./components/Survey/DisplaySurvey/DisplaySurvey'))
const DisplaySurveyList = lazy(() => import('./components/Survey/DisplaySurveyList'))
const DisplayResult = lazy(() => import('./components/Survey/SurveyResult/DisplayResult'))
const DataGrid = lazy(() => import('./components/Grid/DataGrid'))
const SurveySubmit = lazy(() => import('./components/Survey/SurveySubmit'))
const EditSurvey = lazy(() => import('./components/Survey/EditSurvey'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Welcome = lazy(() => import('./pages/Welcome'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  const [currentSurveyId, setCurrentSurveyId] = useState(null)

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute><DisplaySurveyList sendSurveyId={setCurrentSurveyId} /></PrivateRoute>} />
            <Route path="/create-survey" element={<PrivateRoute><CreateSurvey surveyId={currentSurveyId} sendSurveyId={setCurrentSurveyId} /></PrivateRoute>} />
            <Route path="/create-survey/:id" element={<PrivateRoute><CreateSurvey surveyId={currentSurveyId} sendSurveyId={setCurrentSurveyId} /></PrivateRoute>} />
            <Route path="/display-results/:id" element={<PrivateRoute><DisplayResult /></PrivateRoute>} />
            <Route path="/display-data-grid" element={<PrivateRoute><DataGrid /></PrivateRoute>} />
            <Route path="/display-survey/:id" element={<DisplaySurvey sendSurveyId={setCurrentSurveyId} />} />
            <Route path="/submit-survey/:id" element={<SurveySubmit />} />
            <Route path="/edit-survey/:id" element={<PrivateRoute><EditSurvey /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Toaster />
    </div>
  )
}

export default App