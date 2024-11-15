const asyncHandler = require('express-async-handler');
const Question = require('../models/questionModel');
const Survey = require('../models/surveyModel');

const getQuestions = asyncHandler(async (req, res) => {
  const { surveyId } = req.params;
  const questions = await Question.find({ survey: surveyId });
  res.status(200).json(questions);
});

const createQuestion = asyncHandler(async (req, res) => {
  const { surveyId } = req.params;
  const { question, type, answer_choices } = req.body;

  const survey = await Survey.findById(surveyId);
  if (!survey) {
    return res.status(404).json({ error: 'Survey not found' });
  }

  const newQuestion = await Question.create({
    question,
    type,
    answer_choices,
    survey: surveyId,
    user: req.user.userId
  });

  survey.questions.push(newQuestion._id);
  await survey.save();

  res.status(201).json(newQuestion);
});

const updateQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { question, type, answer_choices } = req.body;

  const updatedQuestion = await Question.findOneAndUpdate(
    { _id: id, user: req.user.userId },
    { question, type, answer_choices },
    { new: true, runValidators: true }
  );

  if (!updatedQuestion) {
    return res.status(404).json({ error: 'Question not found or you do not have permission to update it' });
  }

  res.status(200).json(updatedQuestion);
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const question = await Question.findOneAndDelete({ _id: id, user: req.user.userId });
  if (!question) {
    return res.status(404).json({ error: 'Question not found or you do not have permission to delete it' });
  }

  // Remove question reference from the survey
  await Survey.updateOne({ questions: id }, { $pull: { questions: id } });

  res.status(200).json({ message: 'Question deleted successfully', id });
});

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
};