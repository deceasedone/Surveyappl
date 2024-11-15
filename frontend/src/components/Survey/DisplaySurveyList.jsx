import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DisplaySurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.id) {
      fetchSurveys();
    } else {
      setError('User not authenticated. Please log in.');
      setIsLoading(false);
    }
  }, [user]);

  const fetchSurveys = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/surveys/surveys-by-user/${user.id}`;
      console.log('Fetching surveys from:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched surveys:', data);
      setSurveys(data);
    } catch (err) {
      console.error('Error fetching surveys:', err);
      setError(`Failed to load surveys. ${err.message}`);
      toast({
        title: "Error",
        description: `Failed to load surveys. ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSurvey = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/surveys/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete survey');
      }

      setSurveys(surveys.filter((survey) => survey._id !== id));
      setSurveyToDelete(null);
      toast({
        title: "Success",
        description: "Survey deleted successfully.",
      });
    } catch (err) {
      console.error('Error deleting survey:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredSurveys = surveys.filter(survey => 
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-700 dark:text-purple-300">Survey Dashboard</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search surveys..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3"
        />
      </div>
      {filteredSurveys.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">No surveys found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurveys.map((survey) => (
            <motion.div key={survey._id} variants={fadeIn} initial="hidden" animate="visible">
              <Card className="flex flex-col justify-between h-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-purple-600 dark:text-purple-400">{survey.title}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">{survey.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Responses: {survey.responses ? survey.responses.length : 0}</p>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                  <Link to={`/display-survey/${survey._id}`}>
                    <Button variant="outline">View Survey</Button>
                  </Link>
                  {user?.role === 'admin' && (
                    <div className="space-x-2">
                      <Link to={`/edit-survey/${survey._id}`}>
                        <Button variant="outline">Edit</Button>
                      </Link>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this survey?</DialogTitle>
                          </DialogHeader>
                          <DialogFooter className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setSurveyToDelete(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDeleteSurvey(survey._id)}>Delete</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      {user?.role === 'admin' && (
        <div className="mt-8">
          <Button onClick={() => navigate('/create-survey')} className="bg-purple-500 hover:bg-purple-600 text-white">
            <Plus className="mr-2 h-4 w-4" /> Create New Survey
          </Button>
        </div>
      )}
    </div>
  );
}