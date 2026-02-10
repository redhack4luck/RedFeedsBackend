const User = require('../models/User');
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

const followUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: userId
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    const follow = new Follow({
      follower: currentUserId,
      following: userId
    });

    await follow.save();

    const notificationType = userToFollow.isPrivate ? 'follow_request' : 'follow';
    
    await Notification.create({
      recipient: userId,
      sender: currentUserId,
      type: notificationType,
      message: notificationType === 'follow' ? 'Someone started following you' : 'Someone requested to follow you'
    });

    res.status(201).json({
      message: userToFollow.isPrivate ? 'Follow request sent' : 'User followed successfully',
      status: follow.status
    });
  } catch (error) {
    next(error);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const follow = await Follow.findOneAndDelete({
      follower: currentUserId,
      following: userId
    });

    if (!follow) {
      return res.status(404).json({ message: 'Not following this user' });
    }

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    next(error);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const followers = await Follow.find({ following: userId, status: 'accepted' })
      .populate('follower', 'email avatar bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Follow.countDocuments({ following: userId, status: 'accepted' });

    res.json({
      followers: followers.map(f => f.follower),
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

const getFollowing = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const following = await Follow.find({ follower: userId, status: 'accepted' })
      .populate('following', 'email avatar bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Follow.countDocuments({ follower: userId, status: 'accepted' });

    res.json({
      following: following.map(f => f.following),
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

const acceptFollowRequest = async (req, res, next) => {
  try {
    const { followId } = req.params;

    const follow = await Follow.findById(followId);
    if (!follow) {
      return res.status(404).json({ message: 'Follow request not found' });
    }

    if (follow.following.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    follow.status = 'accepted';
    await follow.save();

    await Notification.create({
      recipient: follow.follower,
      sender: req.user.id,
      type: 'follow',
      message: 'Your follow request was accepted'
    });

    res.json({ message: 'Follow request accepted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  acceptFollowRequest
};
