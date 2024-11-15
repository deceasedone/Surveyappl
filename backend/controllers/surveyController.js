const Survey = require('../models/surveyModel');
const User = require('../models/userModel');

const surveyController = {
  getSurveys: async (req, res) => {
    try {
      const surveys = await Survey.find().populate('userId', 'username');
      res.json(surveys);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching surveys', error: error.message });
    }
  },

  getSurveysByUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const surveys = await Survey.find({ userId }).populate('userId', 'username');
      res.json(surveys);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching surveys', error: error.message });
    }
  },

  getSurveyById: async (req, res) => {
    try {
      const survey = await Survey.findById(req.params.id).populate('userId', 'username');
      if (!survey) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      res.json(survey);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching survey', error: error.message });
    }
  },

  createSurvey: async (req, res) => {
    try {
      const { title, description, questions, userId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const newSurvey = new Survey({
        title,
        description,
        questions,
        userId
      });
      const savedSurvey = await newSurvey.save();
      res.status(201).json(savedSurvey);
    } catch (error) {
      res.status(500).json({ message: 'Error creating survey', error: error.message });
    }
  },

  updateSurvey: async (req, res) => {
    try {
      const { title, description, questions } = req.body;
      const updatedSurvey = await Survey.findByIdAndUpdate(
        req.params.id,
        { title, description, questions },
        { new: true }
      );
      if (!updatedSurvey) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      res.json(updatedSurvey);
    } catch (error) {
      res.status(500).json({ message: 'Error updating survey', error: error.message });
    }
  },

  deleteSurvey: async (req, res) => {
    try {
      const deletedSurvey = await Survey.findByIdAndDelete(req.params.id);
      if (!deletedSurvey) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      res.json({ message: 'Survey deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting survey', error: error.message });
    }
  },
  submitSurvey: async (req, res) => {
    try {
      const { responses } = req.body;
      const survey = await Survey.findById(req.params.id);
      if (!survey) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      
      // Validate responses
      if (!Array.isArray(responses)) {
        return res.status(400).json({ message: 'Invalid response format' });
      }

      // Add responses to the survey
      survey.responses.push(responses);
      
      await survey.save();
      res.status(201).json({ message: 'Responses saved successfully' });
    } catch (error) {
      console.error('Error in submitSurvey:', error);
      res.status(500).json({ message: 'Error saving responses', error: error.message });
    }
  }
};

module.exports = surveyController;
