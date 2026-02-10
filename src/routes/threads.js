const express = require('express');
const { body } = require('express-validator');
const { createThread, getThreads, likeThread, addReply } = require('../controllers/threadController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

const createThreadValidation = [
  body('content').trim().isLength({ min: 1, max: 1000 })
];

const createReplyValidation = [
  body('content').trim().isLength({ min: 1, max: 1000 })
];

router.post('/', authenticate, createThreadValidation, createThread);
router.get('/', getThreads);
router.post('/:threadId/like', authenticate, likeThread);
router.post('/:threadId/replies', authenticate, createReplyValidation, addReply);

module.exports = router;
