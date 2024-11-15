import { Routes, Route, Navigate, Suspense, lazy } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "./hooks/useAuthContext";
import Header from "./components/boilerplate/Header";
import PrivateRoute from "./components/PrivateRoute";
import { Spinner } from "@/components/ui/Spinner";

const CreateSurvey = lazy(() => import("./components/Survey/CreateSurvey/CreateSurvey"));
const DisplaySurvey = lazy(() => import("./components/Survey/DisplaySurvey/DisplaySurvey"));
const DisplaySurveyList = lazy(() => import("./components/Survey/DisplaySurveyList"));
const DisplayResult = lazy(() => import("./components/Survey/SurveyResult/DisplayResult"));
const DataGrid = lazy(() => import("./components/Grid/DataGrid"));
const SurveySubmit = lazy(() => import("./components/Survey/SurveySubmit"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Welcome = lazy(() => import("./pages/Welcome"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

function App() {
  const { user } = useAuthContext();
  const [currentSurveyId, setCurrentSurveyId] = useState(null);

  return (
    <div className="app">
      <Header />
      <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spinner /></div>}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DisplaySurveyList sendSurveyId={setCurrentSurveyId} />
            </PrivateRoute>
          } />
          <Route path="/create-survey" element={
            <PrivateRoute>
              <CreateSurvey surveyId={currentSurveyId} sendSurveyId={setCurrentSurveyId} />
            </PrivateRoute>
          } />
          <Route path="/create-survey/:id" element={
            <PrivateRoute>
              <CreateSurvey surveyId={currentSurveyId} sendSurveyId={setCurrentSurveyId} />
            </PrivateRoute>
          } />
          <Route path="/display-results/:id" element={
            <PrivateRoute>
              <DisplayResult />
            </PrivateRoute>
          } />
          <Route path="/display-data-grid" element={
            <PrivateRoute>
              <DataGrid />
            </PrivateRoute>
          } />
          <Route path="/display-survey/:id" element={<DisplaySurvey sendSurveyId={setCurrentSurveyId} />} />
          <Route path="/submit-survey/:id" element={<SurveySubmit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;