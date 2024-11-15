const express = require('express')
const router = express.Router()
const { 
  createSurvey, 
  getSurveys, 
  getSurveyById, 
  deleteSurvey, 
  updateSurvey,
  getSurveysByUser,
  submitSurvey
} = require('../controllers/surveyController')

const { authMiddleware } = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/', getSurveys)
router.get('/surveys-by-user/:userId', getSurveysByUser)
router.get('/:id', getSurveyById)
router.post('/', createSurvey)
router.delete('/:id', deleteSurvey)
router.patch('/:id', updateSurvey)
router.post('/submit/:id', submitSurvey)

module.exports = router