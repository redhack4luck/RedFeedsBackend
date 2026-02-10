const Thread = require('../models/Thread');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

const createThread = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;

    const thread = new Thread({
      author: req.user.id,
      content
    });

    await thread.save();
    await thread.populate('author', 'email avatar');

    res.status(201).json({
      message: 'Thread created successfully',
      thread
    });
  } catch (error) {
    next(error);
  }
};

const addReply = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { threadId } = req.params;
    const { content } = req.body;

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const reply = {
      author: req.user.id,
      content,
    };

    thread.replies.push(reply);
    await thread.save();

    await thread.populate('author', 'email avatar');
    await thread.populate('replies.author', 'email avatar');

    const createdReply = thread.replies[thread.replies.length - 1];

    if (thread.author?._id?.toString() !== req.user.id) {
      await Notification.create({
        recipient: thread.author,
        sender: req.user.id,
        type: 'thread_reply',
        message: 'Someone replied to your thread',
        relatedThread: thread._id,
      });
    }

    res.status(201).json({
      message: 'Reply added successfully',
      reply: createdReply,
      repliesCount: thread.replies.length,
    });
  } catch (error) {
    next(error);
  }
};

const getThreads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const threads = await Thread.find()
      .populate('author', 'email avatar')
      .populate('replies.author', 'email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Thread.countDocuments();

    res.json({
      threads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const likeThread = async (req, res, next) => {
  try {
    const { threadId } = req.params;

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const userId = req.user.id;
    const isLiked = thread.likes.includes(userId);

    if (isLiked) {
      thread.likes.pull(userId);
    } else {
      thread.likes.push(userId);
      
      if (thread.author.toString() !== userId) {
        await Notification.create({
          recipient: thread.author,
          sender: userId,
          type: 'thread_like',
          message: 'Someone liked your thread',
          relatedThread: thread._id
        });
      }
    }

    await thread.save();

    res.json({
      message: isLiked ? 'Thread unliked' : 'Thread liked',
      likesCount: thread.likes.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createThread,
  getThreads,
  likeThread,
  addReply
};
