const express = require('express');
const router = express.Router();

const assignedReviewController = require('../controller/assignedreview_controller');

router.get('/pending-reviews-list' , assignedReviewController.pendingReviews);
router.get('/edit-feedback/:id' , assignedReviewController.editFeedback)
router.post('/add-feedback/:id' , assignedReviewController.addFeedback)

module.exports = router